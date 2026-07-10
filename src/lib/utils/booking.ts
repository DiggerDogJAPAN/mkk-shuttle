export function getBookingReference(id: string) {
  return id.slice(0, 8).toUpperCase()
}

export const getStatusBadgeStyles = (status: string) => {
  switch (status) {
    case 'paid':
    case 'confirmed':
      return 'bg-green-50 text-green-700 border-green-100'
    case 'cancelled':
      return 'bg-red-50 text-red-700 border-red-100'
    case 'refunded':
      return 'bg-blue-50 text-blue-700 border-blue-100'
    default:
      return 'bg-amber-50 text-amber-700 border-amber-100'
  }
}

export const formatBookingStatus = (status: string) => {
  if (status === 'pending') return 'Pending Payment'
  return status.charAt(0).toUpperCase() + status.slice(1)
}
