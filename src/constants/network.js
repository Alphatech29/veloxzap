export const NETWORK_LABELS = {
  'mtn-data':      'MTN',
  'airtel-data':   'Airtel',
  'glo-data':      'Glo',
  'etisalat-data': 'T2mobile',
  mtn:             'MTN',
  airtel:          'Airtel',
  glo:             'Glo',
  etisalat:        'T2mobile',
  'smile-direct':  'Smile',
  spectranet:      'Spectranet',
}

export function formatNetwork(serviceId) {
  if (!serviceId) return null
  return NETWORK_LABELS[serviceId] || serviceId
}
