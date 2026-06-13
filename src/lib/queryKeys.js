export const queryKeys = {
  user: ['user'],
  wallet: ['wallet'],
  dedicatedAccount: ['dedicatedAccount'],

  transactions: {
    recent: ['transactions', 'recent'],
  },

  giftcards: {
    brands: ['giftcards', 'brands'],
    recent: ['giftcards', 'recent'],
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
}
