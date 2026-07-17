export const queryKeys = {
  user: ['user'],
  wallet: ['wallet'],
  dedicatedAccount: ['dedicatedAccount'],

  crypto: {
    balances: ['crypto', 'balances'],
    addresses: ['crypto', 'addresses'],
    config: ['crypto', 'config'],
    deposits: ['crypto', 'deposits'],
  },

  market: {
    rates: ['market', 'rates'],
    overview: (symbol) => ['market', 'overview', symbol],
    chart: (symbol, days) => ['market', 'chart', symbol, days],
  },

  transactions: {
    recent: ['transactions', 'recent'],
    byReference: (reference) => ['transactions', 'byReference', reference],
    electricityByReference: (reference) => ['transactions', 'electricityByReference', reference],
    vtuByReference: (reference) => ['transactions', 'vtuByReference', reference],
    cableTvByReference: (reference) => ['transactions', 'cableTvByReference', reference],
    conversionByReference: (reference) => ['transactions', 'conversionByReference', reference],
    giftcardTradeByReference: (reference) => ['transactions', 'giftcardTradeByReference', reference],
  },

  giftcards: {
    brands: ['giftcards', 'brands'],
    publicBrands: ['giftcards', 'publicBrands'],
    recent: ['giftcards', 'recent'],
  },

  blog: {
    posts: ['blog', 'posts'],
  },

  news: {
    blockchain: ['news', 'blockchain'],
    article: (url) => ['news', 'article', url],
  },

  savings: {
    products: (type) => ['savings', 'products', type],
    plans: ['savings', 'plans'],
    account: (id) => ['savings', 'account', id],
    ledger: (id) => ['savings', 'ledger', id],
    userLedger: (type) => ['savings', 'userLedger', type],
    withdrawals: (status) => ['savings', 'withdrawals', status],
  },

  rewards: {
    rules: ['rewards', 'rules'],
    transactions: ['rewards', 'transactions'],
  },

  withdraw: {
    banks: ['withdraw', 'banks'],
  },

  airtime: {
    recent: ['airtime', 'recent'],
  },

  data: {
    recent: ['data', 'recent'],
    variations: (network) => ['data', 'variations', network],
  },

  cable: {
    variations: (serviceID) => ['cable', 'variations', serviceID],
  },

  internet: {
    variations: (serviceID) => ['internet', 'variations', serviceID],
  },

  referrals: ['referrals'],

  settings: {
    web: ['settings', 'web'],
  },

  beneficiaries: ['beneficiaries'],

  notifications: {
    list: ['notifications', 'list'],
    unreadCount: ['notifications', 'unreadCount'],
  },
}
