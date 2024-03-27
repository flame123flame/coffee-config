export default [
  {
    icon: 'face',
    path: 'player-management',
    id: 'playerManagement',
    title: 'Player Management',
    children: [
      {
        path: 'player-management/player-list',
        id: 'playerList',
        title: 'Player List',
      },
      {
        path: 'player-management/new-registrant',
        id: 'newRegistrant',
        title: 'New Registrant',
      },
      {
        path: 'player-management/failed-login',
        id: 'failedLogin',
        title: 'Failed Login',
      },
      {
        path: 'player-management/failed-registration',
        id: 'failedRegistration',
        title: 'Failed Registration',
      },
      {
        path: 'player-management/group-level',
        id: 'groupLavel',
        title: 'Group Lavel',
      },
      {
        path: 'player-management/tag-management',
        id: 'tagManagement',
        title: 'Tag Management',
      },
      {
        path: 'player-management/bank-verify',
        id: 'bankVerify',
        title: 'Bank Verify',
      },
      {
        path: 'player-management/contact-us',
        id: 'contactUs',
        title: 'Contact Us',
      },
    ],
  },
  {
    icon: 'table_view',
    path: 'finance-management',
    id: 'financeManagement',
    title: 'Finance Management',
    children: [
      {
        path: 'finance-management/all-transaction',
        id: 'allTransaction',
        title: 'All Transaction',
      },
      {
        path: 'finance-management/deposit-list',
        id: 'depositList',
        title: 'Deposit List',
      },
      {
        path: 'finance-management/withdrawal-list',
        id: 'withdrawalList',
        title: 'Withdrawal List',
      },
      {
        path: 'finance-management/withdrawal-condition',
        id: 'withdrawalConditionList',
        title: 'Withdrawal Condition List',
      },
      {
        path: 'finance-management/wallet-tranfer',
        id: 'walletTransferLogs',
        title: 'Wallet Transfer Logs',
      },
      {
        path: 'finance-management/bank-list',
        id: 'bankList',
        title: 'Bank List',
      },
      {
        path: 'finance-management/company-account',
        id: 'companyAccount',
        title: 'Company Account',
      },
      {
        path: 'finance-management/manual-adjustment',
        id: 'manualAdjustment',
        title: 'Manual Adjustment',
      },
    ],
  },
  {
    icon: 'card_giftcard',
    path: 'promotion-management',
    id: 'promotionManagement',
    title: 'Promotion Management',
    children: [
      {
        path: 'promotion-management/promotion-rule',
        id: 'promoRuleSettings',
        title: 'Promo Rule Settings',
      },
      {
        path: 'promotion-management/promotion-request',
        id: 'promotionRequest',
        title: 'Promotion Request',
      },
    ],
  },
  {
    icon: 'screen_share',
    path: 'frontend-management',
    id: 'frontendManagement',
    title: 'Frontend Management',
    children: [
      {
        path: 'frontend-management/inbox-message',
        id: 'inboxMessage',
        title: 'Inbox Message',
      },
      {
        path: 'frontend-management/landing-setting',
        id: 'landingSetting',
        title: 'Landing Setting',
      },
      {
        path: 'frontend-management/deposit-setting',
        id: 'depositSetting',
        title: 'Deposit Setting',
      },
    ],
  },
  {
    icon: 'dns',
    path: 'rebate-management',
    id: 'rebateMamagement',
    title: 'Rebate Mamagement',
    children: [
      {
        path: 'rebate-management/rebate-setting-new',
        id: 'rebateSetting',
        title: 'Rebate Setting',
      },
      {
        path: 'rebate-management/rebate-pending-new',
        id: 'pendingRebate',
        title: 'Pending Rebate',
      },
      {
        path: 'rebate-management/rebate-history-new',
        id: 'rebateHistory',
        title: 'Rebate History',
      },
      {
        path: 'rebate-management/rebate-start-new',
        id: 'rebateStats',
        title: 'Rebate Stats',
      },
    ],
  },
  {
    icon: 'dns',
    path: 'cashback-management',
    id: 'cashbackManagement',
    title: 'Cashback Management',
    children: [
      {
        path: 'cashback-management/cashback-setting-new',
        id: 'cashbackSetting',
        title: 'Cashback Setting',
      },
      {
        path: 'cashback-management/cashback-pending-new',
        id: 'pendingCashback',
        title: 'Pending Cashback',
      },
      {
        path: 'cashback-management/cashback-history-new',
        id: 'cashbackHistory',
        title: 'Cashback History',
      },
      {
        path: 'cashback-management/cashback-start-new',
        id: 'cashbackStats',
        title: 'Cashback Stats',
      },
    ],
  },
  {
    icon: 'analytics',
    path: 'report',
    id: 'report',
    title: 'Report',
    children: [
      {
        path: 'report/overall-report',
        id: 'overallReport',
        title: 'Overall Report',
      },
      {
        path: 'report/player-valid-bets',
        id: 'playerValidBets',
        title: 'Player Valid Bets',
      },
      {
        path: 'report/betting-hostries',
        id: 'bettingHistories',
        title: 'Betting Histories',
      },
      {
        path: 'report/player-report',
        id: 'playerReport',
        title: 'Player Report',
      },
      {
        path: 'report/game-report',
        id: 'gameReport',
        title: 'Game Report',
      },
      {
        path: 'report/promotion-report',
        id: 'promotionReport',
        title: 'Promotion Report',
      },
      {
        path: 'report/profit-or-loss-report',
        id: 'profitLossReport',
        title: 'Profit/Loss Report',
      },
    ],
  },
  {
    icon: 'timeline',
    path: 'affiliate',
    id: 'affiliate',
    title: 'Affiliate',
    children: [
      {
        path: 'affiliate/affiliate-list',
        id: 'affiliateList',
        title: 'Affiliate List',
      },
      {
        path: 'affiliate/affiliate-group',
        id: 'affiliateGroup',
        title: 'Affiliate Group',
      },
    ],
  },
  {
    icon: 'casino',
    path: 'casino-settings',
    id: 'casinoSettings',
    title: 'Casino Settings',
    children: [
      {
        path: 'casino-settings/product-type-list',
        id: 'productTypeList',
        title: 'Product Type List',
      },
      {
        path: 'casino-settings/game-group-list',
        id: 'gameGroupList',
        title: 'Game Group List',
      },
      {
        path: 'casino-settings/provider-list',
        id: 'providerList',
        title: 'Provider List',
      },
      {
        path: 'casino-settings/game-list',
        id: 'gameList',
        title: 'Game List',
      },
      {
        path: 'casino-settings/product-maintenance',
        id: 'productMaintenance',
        title: 'Product Maintenance',
      },
      {
        path: 'casino-settings/game-tag-setting',
        id: 'gameTagSetting',
        title: 'Game Tag Setting',
      },
      {
        path: 'casino-settings/sports-valid-bets',
        id: 'sportsValidBets',
        title: 'Sports Valid Bets',
      },
    ],
  },

  {
    icon: 'casino',
    path: 'lotto-settings',
    id: 'lottoSettings',
    title: 'Lotto-settings',
    children: [
      {
        path: 'lotto-settings/lotto-dashboard',
        id: 'lottoDashboard',
        title: 'Lotto Dashboard',
      },
      {
        path: 'lotto-settings/lotto-government',
        id: 'lottoGovernment',
        title: 'Lotto Government',
      },
      {
        path: 'lotto-settings/lotto-stock',
        id: 'lottoStock',
        title: 'Lotto Stock',
      },
      {
        path: 'lotto-settings/lotto-yeekee',
        id: 'lottoYiki',
        title: 'Lotto Yeekee',
      },
      {
        path: 'lotto-settings/lotto-yeekee-approved',
        id: 'lottoYiki',
        title: 'Lotto Yeekee Approved',
      },
      {
        path: 'lotto-settings/lotto-group-list',
        id: 'lottoGroupList',
        title: 'Lotto Group List',
      },
      {
        path: 'lotto-settings/lotto-history',
        id: 'lottoHistory',
        title: 'Lotto History',
      },
      {
        path: 'lotto-settings/lotto-group',
        id: 'lottoNumberGroup',
        title: 'Lotto Number Group',
      },
      {
        path: 'lotto-settings/lotto-approved',
        id: 'lottoApproved',
        title: 'Lotto Approved',
      },
      {
        path: 'lotto-settings/lotto-cancel',
        id: 'lottoCancel', //poo id name
        title: 'Lotto Cancel',
      },

      {
        path: 'lotto-settings/confirm-transaction',
        id: 'confirmTransaction',
        title: 'Confirm Transaction',
      },

      {
        path: 'lotto-settings/lotto-report',
        id: 'lottoReport',
        title: 'Lotto Report',
      },
    ],
  },
  {
    icon: 'sports_cricket',
    path: 'risk-management',
    id: 'riskManagement',
    title: 'Risk Management',
    children: [
      {
        path: 'risk-management/ip-rule',
        id: 'ipRules',
        title: 'IP Rules',
      },
      {
        path: 'risk-management/ipfp-rule',
        id: 'ipFpCheck',
        title: 'IP/FP check',
      },
    ],
  },
  {
    icon: 'supervisor_account',
    path: 'admin-management',
    id: 'adminManagement',
    title: 'Admin Management',
    children: [
      {
        path: 'admin-management/admin-list',
        id: 'adminList',
        title: 'Admin List',
      },
      {
        path: 'admin-management/role-premission',
        id: 'rolePermission',
        title: 'Role Permission',
      },
      {
        path: 'admin-management/admin-logs',
        id: 'adminLogs',
        title: 'Admin Logs',
      },
    ],
  },
];
