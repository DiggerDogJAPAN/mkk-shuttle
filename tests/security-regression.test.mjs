import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { test } from 'node:test'
import vm from 'node:vm'
import ts from 'typescript'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const require = createRequire(import.meta.url)
const quiet = { log() {}, warn() {}, error() {} }
const env = {
  NEXT_PUBLIC_SUPABASE_URL: 'http://127.0.0.1:9',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'local-anon-placeholder',
  SUPABASE_SERVICE_ROLE_KEY: 'local-service-placeholder',
  STRIPE_WEBHOOK_SECRET: 'whsec_local_regression',
  NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
}

// Execute the real application modules, but only permit explicitly supplied
// imports. No production environment, database, network or email transport is
// accessible inside this harness. TypeScript remains checked separately by tsc.
function load(file, imports = {}) {
  const output = ts.transpileModule(readFileSync(resolve(file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.React },
    fileName: file,
  }).outputText
  const exports = {}
  const context = vm.createContext({
    exports, process: { env: { ...env } }, console: quiet,
    require(name) {
      if (Object.hasOwn(imports, name)) return imports[name]
      throw new Error(`Unmocked import blocked: ${name}`)
    },
  })
  vm.runInContext(output, context, { filename: file, timeout: 2000 })
  return exports
}

function database(respond) {
  const calls = []
  return {
    calls,
    from(table) {
      const call = { table, operations: [] }
      calls.push(call)
      const chain = new Proxy({}, {
        get(_target, method) {
          if (method === 'then') return (yes, no) => Promise.resolve(respond(call)).then(yes, no)
          return (...args) => { call.operations.push([method, ...args]); return chain }
        },
      })
      return chain
    },
  }
}

const pricing = load('src/lib/utils/pricing.ts')
for (const [name, override, standard, expected] of [
  ['schedule override takes precedence', 7200, 8000, 7200],
  ['standard fare fallback', null, 8000, 8000],
  ['zero override is preserved for caller validation', 0, 8000, 0],
  ['missing fare', null, null, null],
]) {
  test(`pricing: ${name}`, async () => {
    const db = database(c => ({ data: (c.table === 'schedule_price_overrides' ? override : standard) == null
      ? null : { price: c.table === 'schedule_price_overrides' ? override : standard } }))
    const result = await pricing.resolveJourneyPrice({ supabase: db, scheduleId: 'schedule', fromStopId: 'from', toStopId: 'to' })
    assert.equal(result?.pricePerPassenger ?? null, expected)
    assert.equal(db.calls.length, override == null ? 2 : 1)
  })
}
test('pricing: incomplete stops never query Supabase', async () => {
  const db = database(() => { throw new Error('Unexpected query') })
  assert.equal(await pricing.resolveJourneyPrice({ supabase: db, fromStopId: 'from' }), null)
  assert.equal(db.calls.length, 0)
})

function checkout(options = {}) {
  const stripeCalls = []
  const db = database(c => {
    if (c.table === 'routes') return { data: { id: 'route' } }
    if (c.table === 'route_schedules') return { data: options.invalidSchedule ? null : { id: 'schedule', route_id: 'route' } }
    if (c.table === 'schedule_stops') return { data: [
      { stop_id: 'from', stop: { stop_order: 1 } },
      { stop_id: 'to', stop: { stop_order: options.reversed ? 0 : 2 } },
    ] }
    if (c.table === 'availability') return { data: options.blocked ?? [] }
    if (c.table === 'schedule_price_overrides') return { data: options.override ? { price: options.override } : null }
    if (c.table === 'prices') return { data: options.noPrice ? null : { price: 8000 } }
    if (c.table === 'bookings') {
      const insert = c.operations.find(o => o[0] === 'insert')
      return { data: insert ? { ...insert[1], id: 'booking-local' } : null }
    }
    throw new Error(`Unexpected table: ${c.table}`)
  })
  const stripe = { checkout: { sessions: { async create(payload) {
    stripeCalls.push(payload)
    if (options.stripeFailure) throw new Error('Simulated Stripe error')
    return { id: 'cs_local', url: 'https://checkout.stripe.test/local' }
  } } } }
  const client = { auth: { async getUser() {
    return { data: { user: options.unauthorized ? null : { id: 'trusted-user', email: 'local@example.invalid' } } }
  } } }
  const route = load('src/app/api/stripe/create-checkout-session/route.ts', {
    'next/server': require('next/server'), '@/lib/stripe': { stripe },
    '@supabase/supabase-js': { createClient: (_url, key) => key === env.SUPABASE_SERVICE_ROLE_KEY ? db : client },
    '@/lib/utils/pricing': pricing,
  })
  const payload = {
    from_stop_id: 'from', to_stop_id: 'to', schedule_id: 'schedule', route_id: 'route',
    travel_date: '2027-01-15', passengers: 2, price: 1, user_id: 'forged-user', email: 'forged@example.invalid',
    ...options.payload,
  }
  async function request() {
    return route.POST(new Request('http://localhost/api/stripe/create-checkout-session', {
      method: 'POST', headers: { 'content-type': 'application/json', origin: 'http://localhost:3000',
        ...(options.noAuth ? {} : { authorization: 'Bearer local-test' }) },
      body: JSON.stringify({ bookingPayload: options.missingPayload ? null : payload }),
    }))
  }
  return { request, db, stripeCalls }
}

for (const [name, options, status] of [
  ['missing booking payload', { missingPayload: true }, 400],
  ['missing authentication', { noAuth: true }, 401],
  ['invalid authentication', { unauthorized: true }, 401],
  ['before booking season', { payload: { travel_date: '2026-12-14' } }, 400],
  ['after booking season', { payload: { travel_date: '2027-03-14' } }, 400],
  ['invalid schedule', { invalidSchedule: true }, 400],
  ['reversed stop order', { reversed: true }, 400],
  ['route blackout', { blocked: [{ route_id: 'route', schedule_id: null }] }, 400],
  ['schedule blackout', { blocked: [{ schedule_id: 'schedule' }] }, 400],
  ['missing price', { noPrice: true }, 400],
  ...[0, -1, 16, 1.5, '2'].map(passengers => [`invalid passenger count ${JSON.stringify(passengers)}`, { payload: { passengers } }, 400]),
]) {
  test(`checkout rejects ${name} without writes or payment calls`, async () => {
    const h = checkout(options)
    assert.equal((await h.request()).status, status)
    assert.equal(h.stripeCalls.length, 0)
    assert.equal(h.db.calls.some(c => c.operations.some(o => ['insert', 'update', 'delete'].includes(o[0]))), false)
  })
}
for (const passengers of [1, 15]) {
  test(`checkout accepts ${passengers} passengers and replaces forged price and identity`, async () => {
    const h = checkout({ payload: { passengers } })
    const res = await h.request()
    assert.equal(res.status, 200)
    const insert = h.db.calls.flatMap(c => c.operations).find(o => o[0] === 'insert')[1]
    assert.equal(insert.price, passengers * 8000)
    assert.equal(insert.user_id, 'trusted-user')
    assert.equal(insert.email, 'local@example.invalid')
    assert.equal(insert.status, 'pending')
    assert.equal(h.stripeCalls[0].line_items[0].price_data.currency, 'jpy')
    assert.equal(h.stripeCalls[0].line_items[0].price_data.unit_amount, passengers * 8000)
    assert.equal(h.stripeCalls[0].metadata.booking_id, 'booking-local')
    assert.equal((await res.json()).sessionId, 'cs_local')
  })
}
test('checkout uses schedule fare and ignores unrelated blackouts', async () => {
  const h = checkout({ override: 7200, blocked: [{ route_id: 'different', schedule_id: null }] })
  assert.equal((await h.request()).status, 200)
  assert.equal(h.stripeCalls[0].line_items[0].price_data.unit_amount, 14400)
  assert.equal(h.stripeCalls[0].metadata.pricing_type, 'schedule_override')
})
test('checkout rolls back its mocked pending booking if Stripe fails', async () => {
  const h = checkout({ stripeFailure: true })
  assert.equal((await h.request()).status, 500)
  assert.ok(h.db.calls.some(c => c.table === 'bookings' && c.operations.some(o => o[0] === 'delete')))
})

const stripeSdk = new Stripe('sk_test_local_placeholder')
function webhook(options = {}) {
  let emails = 0
  const db = database(c => {
    if (c.operations.some(o => o[0] === 'update')) return { error: null }
    if (c.operations.some(o => o[0] === 'select' && o[1] === 'status')) return { data: { status: options.alreadyPaid ? 'paid' : 'pending' } }
    return { data: { id: 'booking-local', email: 'local@example.invalid' } }
  })
  const route = load('src/app/api/stripe/webhook/route.ts', {
    'next/server': require('next/server'), '@/lib/stripe': { stripe: stripeSdk },
    '@supabase/supabase-js': { createClient: () => db },
    '@/lib/email/sendBookingConfirmation': { sendBookingConfirmation: async () => { emails++ } },
    '@/lib/email/sendAdminBookingNotification': { sendAdminBookingNotification: async () => { emails++ } },
  })
  const body = JSON.stringify({ id: 'evt_local', type: options.type ?? 'checkout.session.completed',
    data: { object: { id: 'cs_local', metadata: options.noBooking ? {} : { booking_id: 'booking-local' },
      payment_status: options.unpaid ? 'unpaid' : 'paid', payment_intent: 'pi_local' } } })
  const signature = stripeSdk.webhooks.generateTestHeaderString({ payload: body, secret: env.STRIPE_WEBHOOK_SECRET })
  async function request() {
    return route.POST(new Request('http://localhost/api/stripe/webhook', { method: 'POST',
      body: options.tampered ? body + ' ' : body,
      headers: options.noSignature ? {} : { 'stripe-signature': options.invalidSignature ? 'invalid' : signature } }))
  }
  return { request, db, get emails() { return emails } }
}
for (const [name, options, status] of [
  ['missing signature', { noSignature: true }, 400],
  ['invalid signature', { invalidSignature: true }, 400],
  ['tampered raw body', { tampered: true }, 400],
  ['unpaid session', { unpaid: true }, 200],
  ['irrelevant event', { type: 'payment_intent.created' }, 200],
  ['missing booking metadata', { noBooking: true }, 400],
]) {
  test(`webhook: ${name} cannot mutate bookings or send email`, async () => {
    const h = webhook(options)
    assert.equal((await h.request()).status, status)
    assert.equal(h.db.calls.length, 0)
    assert.equal(h.emails, 0)
  })
}
test('webhook verifies real Stripe HMAC before mocked paid update and notification', async () => {
  const h = webhook()
  assert.equal((await h.request()).status, 200)
  const update = h.db.calls.flatMap(c => c.operations).find(o => o[0] === 'update')[1]
  assert.equal(update.status, 'paid')
  assert.equal(update.stripe_payment_intent_id, 'pi_local')
  assert.equal(h.emails, 2)
})
test('webhook duplicate paid event skips update and notifications', async () => {
  const h = webhook({ alreadyPaid: true })
  assert.equal((await h.request()).status, 200)
  assert.equal(h.db.calls.length, 1)
  assert.equal(h.emails, 0)
})

test('confirmation email renders fare and reference into mocked Resend transport', async () => {
  const messages = []
  const emailModule = load('src/lib/email/sendBookingConfirmation.ts', {
    '@/lib/resend': { resend: { emails: { send: async message => messages.push(message) } } },
  })
  await emailModule.sendBookingConfirmation({ id: 'abcd1234-test', email: 'local@example.invalid', first_name: 'Test',
    price: 16000, passengers: 2, travel_date: '2027-01-15', departure_time: '10:30:00' })
  assert.equal(messages.length, 1)
  assert.equal(messages[0].to, 'local@example.invalid')
  assert.match(messages[0].html, /ABCD1234/)
  assert.match(messages[0].html, /16,000/)
  assert.match(messages[0].html, /10:30/)
})

test('installed Supabase SDK builds the expected price queries using an in-memory fetch', async () => {
  const requests = []
  const supabase = createClient('http://127.0.0.1:9', 'local-anon-placeholder', {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: async (input, init) => {
      const url = new URL(String(input))
      requests.push({ url, headers: new Headers(init.headers) })
      return new Response(JSON.stringify(url.pathname.endsWith('/schedule_price_overrides') ? null : { price: 8000 }), {
        status: 200, headers: { 'content-type': 'application/json' },
      })
    } },
  })
  const result = await pricing.resolveJourneyPrice({ supabase, scheduleId: 'schedule', fromStopId: 'from', toStopId: 'to' })
  assert.equal(result.pricePerPassenger, 8000)
  assert.equal(requests.length, 2)
  assert.equal(requests[0].url.searchParams.get('schedule_id'), 'eq.schedule')
  assert.equal(requests[1].url.searchParams.get('from_stop_id'), 'eq.from')
  assert.equal(requests[1].url.searchParams.get('to_stop_id'), 'eq.to')
  assert.equal(requests[1].headers.get('apikey'), 'local-anon-placeholder')
})

test('installed Stripe SDK serializes JPY checkout into an in-memory transport', async () => {
  const requests = []
  const stripe = new Stripe('sk_test_local_placeholder', {
    httpClient: Stripe.createFetchHttpClient(async (url, init) => {
      requests.push({ url, init })
      return new Response(JSON.stringify({ id: 'cs_local', url: 'https://checkout.stripe.test/local' }), {
        status: 200, headers: { 'content-type': 'application/json' },
      })
    }),
  })
  const session = await stripe.checkout.sessions.create({ mode: 'payment',
    line_items: [{ quantity: 1, price_data: { currency: 'jpy', unit_amount: 16000, product_data: { name: 'Local test' } } }],
    success_url: 'http://localhost/success', cancel_url: 'http://localhost/cancel', metadata: { booking_id: 'booking-local' } })
  assert.equal(session.id, 'cs_local')
  assert.equal(requests.length, 1)
  const body = new URLSearchParams(requests[0].init.body)
  assert.equal(body.get('line_items[0][price_data][unit_amount]'), '16000')
  assert.equal(body.get('line_items[0][price_data][currency]'), 'jpy')
  assert.equal(body.get('metadata[booking_id]'), 'booking-local')
})

test('installed Resend SDK serializes confirmation into an in-memory fetch', async t => {
  const requests = []
  const mockedFetch = t.mock.method(globalThis, 'fetch', async (url, init) => {
    requests.push({ url, init })
    return new Response(JSON.stringify({ id: 'email_local' }), { status: 200, headers: { 'content-type': 'application/json' } })
  })
  try {
    const emailModule = load('src/lib/email/sendBookingConfirmation.ts', { '@/lib/resend': { resend: new Resend('re_local_placeholder') } })
    await emailModule.sendBookingConfirmation({ id: 'abcd1234-test', email: 'local@example.invalid', price: 16000 })
    assert.equal(requests.length, 1)
    assert.equal(new URL(requests[0].url).pathname, '/emails')
    const body = JSON.parse(requests[0].init.body)
    assert.ok([body.to].flat().includes('local@example.invalid'))
    assert.match(body.html, /16,000/)
  } finally {
    mockedFetch.mock.restore()
  }
})

for (const [name, user, role, redirect] of [
  ['anonymous', null, null, '/login'],
  ['non-admin', { id: 'local' }, 'customer', '/'],
  ['admin', { id: 'local' }, 'admin', null],
]) {
  test(`admin guard: ${name}`, async () => {
    const state = [], effects = [], redirects = []
    let cursor = 0
    const React = {
      createElement: (type, props, ...children) => ({ type, props, children }),
      useState(initial) { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], value => { state[index] = value }] },
      useEffect(effect) { effects.push(effect) },
    }
    const db = database(() => ({ data: { role } }))
    const guardModule = load('src/components/auth/admin-guard.tsx', {
      react: React, 'next/navigation': { useRouter: () => ({ push: path => redirects.push(path) }) },
      '@/lib/supabaseClient': { supabase: { ...db, auth: { getSession: async () => ({ data: { session: user ? { user } : null } }) } } },
      'lucide-react': { Loader2: 'loader' },
    })
    guardModule.AdminGuard({ children: 'protected' })
    effects[0]()
    // Flush the session and role promise continuations.
    await new Promise(resolve => setImmediate(resolve))
    cursor = 0
    const rendered = guardModule.AdminGuard({ children: 'protected' })
    assert.deepEqual(redirects, redirect ? [redirect] : [])
    assert.equal(state[1], false)
    assert.equal(state[0], role === 'admin')
    if (redirect) assert.equal(rendered, null)
  })
}
