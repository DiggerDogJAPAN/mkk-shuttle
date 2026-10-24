import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'

function load(source, globals = {}, imports = {}) {
  const exports = {}
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  vm.runInNewContext(code, { exports, ...globals, require(name) {
    assert.ok(Object.hasOwn(imports, name), `Unmocked import blocked: ${name}`)
    return imports[name]
  } })
  return exports
}
const booking = load(readFileSync('src/lib/utils/booking.ts', 'utf8'))
const { buildBookingCsv, formatBirthDate, escapeCsvCell, fetchBookingsForCsv } = load(
  readFileSync('src/lib/utils/booking-csv.ts', 'utf8'), {}, { './booking': booking },
)
const defaults = { statusFilter: 'all', searchTerm: '', sortBy: 'travel_date' }
const fixture = (id, extra = {}) => ({
  id: String(id).padStart(8, '0') + '-local', first_name: 'Test', last_name: 'Customer',
  date_of_birth: '1990-01-15', travel_date: '2027-01-15', created_at: '2026-10-24T12:00:00Z',
  status: 'paid', passengers: 3, email: 'local@example.invalid', price: 24000, ...extra,
})

// This mock implements Supabase's fluent read surface only. No SDK or network.
function database(input, options = {}) {
  const calls = []
  return { calls, from(table) {
    const call = { table, orders: [], predicates: [] }
    calls.push(call)
    const chain = {
      select(columns, config) { call.columns = columns; call.config = config; return chain },
      eq(column, value) { call.predicates.push([column, value]); return chain },
      or(expression) { call.search = expression; return chain },
      order(column, config) { call.orders.push([column, config]); return chain },
      async range(from, to) {
        call.range = [from, to]
        if (options.throwAt === calls.length) throw new Error('Network unavailable')
        if (options.failAt === calls.length) return { data: null, error: { message: 'Mocked batch failure' }, count: null }
        let rows = input.filter(row => call.predicates.every(([k, v]) => row[k] === v))
        if (call.search) {
          const term = call.search.match(/first_name\.ilike\.%([^%]*)%/)[1].toLowerCase()
          rows = rows.filter(row => ['first_name', 'last_name', 'email'].some(k => row[k]?.toLowerCase().includes(term)))
        }
        rows = [...rows].sort((a, b) => {
          for (const [column, { ascending }] of call.orders) {
            const comparison = String(a[column]).localeCompare(String(b[column]))
            if (comparison) return ascending ? comparison : -comparison
          }
          return 0
        })
        const count = options.noCount ? null : rows.length + (options.countChange && calls.length > 1 ? 1 : 0)
        let data = rows.slice(from, Math.min(to + 1, from + (options.cap ?? 1000)))
        if (options.emptyAt === calls.length) data = []
        if (options.duplicateAt === calls.length) data = [rows[0], ...data.slice(1)]
        return { data, error: null, count }
      },
    }
    return chain
  } }
}

test('CSV inserts DOB after Customer Name, preserves all original columns and one row per booking', () => {
  const [headers, row] = buildBookingCsv([fixture(1)]).split('\n').map(line => line.split(','))
  assert.deepEqual(headers, [
    'Reference', 'Status', 'Customer Name', 'Date of Birth', 'Email', 'Route',
    'Travel Date', 'Departure Time', 'Passengers', 'Pickup', 'Drop-off',
    'First name', 'Last name', 'Phone', 'Country', 'Passport', 'Hotel',
    'Flight Number', 'Shuttle ticket request', 'Payment status', 'Total Price',
    'Created Date', 'Refunded Date', 'Refund Amount', 'Cancellation Fee', 'Cancellation Reason',
  ])
  assert.equal(row.length, headers.length)
  assert.equal(row[2], 'Test Customer')
  assert.equal(row[3], '1990-01-15')
  assert.equal(row[8], '3')
  assert.equal(buildBookingCsv([fixture(1), fixture(2)]).split('\n').length, 3)
})
for (const value of [null, undefined, '']) {
  test(`missing historical DOB ${String(value)} exports a blank cell`, () => {
    assert.equal(buildBookingCsv([fixture(1, { date_of_birth: value })]).split('\n')[1].split(',')[3], '')
  })
}
test('DOB stays an exact calendar date regardless of timezone', () => {
  const before = process.env.TZ
  try {
    for (const timezone of ['Asia/Tokyo', 'America/Los_Angeles', 'Pacific/Kiritimati']) {
      process.env.TZ = timezone
      assert.equal(formatBirthDate('2000-02-29'), '2000-02-29')
    }
  } finally {
    if (before === undefined) delete process.env.TZ
    else process.env.TZ = before
  }
})
for (const value of ['1990-02-30', '1900-02-29', '2020-13-01', '2020-01-00', '0000-01-01', '1/2/1990', '1990-01-15T00:00:00+09:00', '=TODAY()']) {
  test(`invalid DOB rejects the whole export: ${value}`, () => {
    assert.throws(() => buildBookingCsv([fixture(1, { date_of_birth: value })]), /invalid date of birth/)
  })
}
test('CSV escaping preserves commas, quotes, newlines, carriage returns and blank values', () => {
  assert.equal(escapeCsvCell('hotel, "room"\nsecond\rthird'), '"hotel, ""room""\nsecond\rthird"')
  assert.equal(escapeCsvCell(null), '')
  assert.equal(escapeCsvCell(undefined), '')
  assert.equal(escapeCsvCell(0), '0')
  assert.equal(escapeCsvCell('ordinary text'), 'ordinary text')
})
for (const value of ['=1+1', '+SUM(A1:A2)', '-1+2', '@SUM(A1)', '  =1', '\t=1', '\r=1', '\n=1', '\u0000=1', '\uFEFF=1']) {
  test(`spreadsheet formula is neutralized: ${JSON.stringify(value)}`, () => {
    const cell = escapeCsvCell(value)
    assert.ok(cell.startsWith("'") || cell.startsWith('"\''))
  })
}
test('formula protection applies to all mapped booking strings including names and notes', () => {
  const csv = buildBookingCsv([fixture(1, {
    first_name: '=1', last_name: '+2', email: '@3', phone: '+123', country: '-4',
    passport_number: '=5', hotel_name: '=6', flight_number: '=7', cancellation_reason: '=8',
    route: { from_location: '=9', to_location: 'destination' }, pickup: { name: '=10' }, dropoff: { name: '=11' },
  })])
  const row = csv.split('\n')[1].split(',')
  for (const index of [2, 4, 5, 9, 10, 11, 12, 13, 14, 15, 16, 17, 25]) assert.ok(row[index].startsWith("'"), `column ${index}`)
})
for (const size of [0, 1, 999, 1000, 1001, 2005]) {
  test(`pagination exports ${size} bookings exactly once in batches <=1000`, async () => {
    const rows = Array.from({ length: size }, (_, i) => fixture(size - i))
    const db = database(rows)
    const result = await fetchBookingsForCsv(db, defaults)
    assert.equal(result.length, size)
    assert.equal(new Set(result.map(row => row.id)).size, size)
    assert.deepEqual(Array.from(result, row => row.id), rows.map(row => row.id).sort())
    assert.equal(db.calls.length, Math.max(1, Math.ceil(size / 1000)))
    for (const call of db.calls) {
      assert.equal(call.table, 'bookings')
      assert.ok(call.range[1] - call.range[0] + 1 <= 1000)
      assert.equal(call.config.count, 'exact')
      assert.ok(call.columns.startsWith('*, route:routes'))
      assert.deepEqual(JSON.parse(JSON.stringify(call.orders)), [
        ['travel_date', { ascending: true }], ['id', { ascending: true }],
      ])
    }
  })
}
test('pagination advances by actual rows when server cap is below 1000', async () => {
  const db = database(Array.from({ length: 1100 }, (_, i) => fixture(i)), { cap: 400 })
  assert.equal((await fetchBookingsForCsv(db, defaults)).length, 1100)
  assert.deepEqual(db.calls.map(call => call.range), [[0, 999], [400, 1399], [800, 1799]])
})
test('status/search filters and descending created-date sort are applied to every batch', async () => {
  const rows = Array.from({ length: 1010 }, (_, i) => fixture(i, { created_at: i < 505 ? '2026-10-23' : '2026-10-24' }))
  rows.push(fixture(1011, { status: 'cancelled' }), fixture(1012, { first_name: 'Other', last_name: 'Other', email: 'other@example.invalid' }))
  const db = database(rows)
  const result = await fetchBookingsForCsv(db, { statusFilter: 'paid', searchTerm: 'test', sortBy: 'created_at' })
  assert.equal(result.length, 1010)
  assert.equal(result[0].id, fixture(505).id)
  assert.equal(result[505].id, fixture(0).id)
  for (const call of db.calls) {
    assert.deepEqual(JSON.parse(JSON.stringify(call.predicates)), [['status', 'paid']])
    assert.equal(call.search, 'first_name.ilike.%test%,last_name.ilike.%test%,email.ilike.%test%')
    assert.deepEqual(JSON.parse(JSON.stringify(call.orders)), [['created_at', { ascending: false }], ['id', { ascending: true }]])
  }
})
for (const [name, options, message] of [
  ['batch error', { failAt: 2 }, /batch failed/],
  ['network exception', { throwAt: 2 }, /Network unavailable/],
  ['count changed', { countChange: true }, /changed during export/],
  ['premature empty batch', { emptyAt: 2 }, /incomplete/],
  ['duplicate row', { duplicateAt: 2 }, /Duplicate/],
  ['missing count', { noCount: true }, /Could not verify/],
]) {
  test(`export rejects incomplete data on ${name}`, async () => {
    const db = database(Array.from({ length: 1001 }, (_, i) => fixture(i)), options)
    await assert.rejects(fetchBookingsForCsv(db, defaults), message)
  })
}
test('admin handler does not create a download when a later batch fails', async () => {
  const source = readFileSync('src/app/admin/bookings/page.tsx', 'utf8')
  const ast = ts.createSourceFile('page.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  let handler
  function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === 'handleExportCSV') handler = node.initializer.getText(ast)
    ts.forEachChild(node, visit)
  }
  visit(ast)
  assert.ok(handler)
  const alerts = [], states = []
  const fail = () => { throw new Error('Download must not be created') }
  const db = database(Array.from({ length: 1001 }, (_, i) => fixture(i)), { failAt: 2 })
  const { run } = load(`export const run = ${handler}`, {
    isExporting: false, setIsExporting: value => states.push(value), supabase: db,
    statusFilter: 'all', debouncedSearchTerm: '', sortBy: 'travel_date',
    fetchBookingsForCsv, buildBookingCsv, Blob: fail, URL: { createObjectURL: fail },
    document: { createElement: fail }, alert: message => alerts.push(message), console: { error() {} },
  })
  await run()
  assert.deepEqual(states, [true, false])
  assert.equal(alerts.length, 1)
  assert.match(alerts[0], /No file was downloaded/)
})
