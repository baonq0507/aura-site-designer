import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本", flag: "🇯🇵" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "vi", name: "Vietnamese", nativeName: "Việt Nam", flag: "🇻🇳" },
  { code: "th", name: "Thai", nativeName: "ภาษาไทย", flag: "🇹🇭" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" }
];

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (languageCode: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation keys and their values for each language
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.profile': 'Profile',
    'nav.vip': 'VIP Info',
    'nav.language': 'Language',
    'nav.back': 'Back',
    'nav.categories': 'Categories',
    'nav.products': 'Products',
    'nav.personal': 'Personal',
    'nav.admin': 'Admin',
    'nav.first.page': 'Home',
    'nav.history': 'History',
    'nav.support': 'Support',
    'nav.my.page': 'My Page',
    
    // Common actions
    'common.loading': 'Loading...',
    'common.withdraw': 'Withdraw',
    'common.topup': 'Top-up',
    'common.logout': 'Sign Out',
    'common.logout.success': 'Signed out successfully',
    'common.logout.message': 'See you again!',
    'common.error': 'Error',
    'common.logout.error': 'Could not sign out',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
     'common.delete': 'Delete',
     'common.confirm': 'Confirm',
     'common.user': 'User',
    
    // Profile page
    'profile.grand.commission': 'Grand commission',
    'profile.available.assets': 'Available Assets',
    'profile.invitation.code': 'Invitation Code',
    'profile.delivery.info': 'Delivery information',
    'profile.bank.linking': 'Bank linking',
    'profile.deposit.history': 'Deposit history',
    'profile.withdraw.history': 'Withdraw history',
    'profile.vip.levels': 'VIP Levels',
    'profile.group.report': 'Group report',
    'profile.about.us': 'About us',
    
    // Language page
    'language.title': 'Language',
    'language.current': 'Current Language',
    'language.select': 'Select Language',
    'language.info': 'Information',
    'language.reset': 'Reset to English',
    'language.note.title': 'Language Note',
    'language.note.content': 'Language changes will apply to the entire application',
    'language.support.title': 'Multi-language Support',
    'language.support.content': 'We are continuously updating and improving language support. If you find translation errors, please contact support.',
    'language.changed': 'Language changed successfully',
    'language.changed.desc': 'Switched to',
    
    // VIP Info
    'vip.title': 'VIP Information',
    'vip.current.level': 'Current Level',
    'vip.benefits.current': 'Current Benefits',
    'vip.progress': 'Progress to VIP',
    'vip.all.levels': 'All VIP Levels',
    'vip.orders.completed': 'Orders completed',
    'vip.total.spent': 'Total spent',
    'vip.orders.needed': 'more orders',
    'vip.spending.needed': 'more spending',
    'vip.commission': 'Commission',
    'vip.support': 'Customer support',
    'vip.priority.support': 'Priority support',
    'vip.premium.gifts': 'Premium gifts',
    'vip.dedicated.manager': 'Dedicated manager',
    'vip.premium.service': 'Premium service',
    'vip.current.badge': 'Current',
     'vip.achieved.badge': 'Achieved',
     'vip.per.day': 'orders per day',
     'vip.min.balance': 'minimum balance',
     'vip.max.orders': 'Max Orders',
    
    // Hero section
    'hero.welcome': 'WELCOME TO LUXURY MARKETPLACE - THE PREMIER DESTINATION FOR DISTINGUISHED SHOPPING',
    'hero.exclusive': 'EXCLUSIVE PRIVILEGES FOR VIP MEMBERS',
    'hero.shipping': 'COMPLIMENTARY NATIONWIDE SHIPPING',
    'hero.authentic': 'AUTHENTIC PRODUCTS GUARANTEED 100%',
    
    // Purchase History
    'history.login.required': 'Please login to view purchase history',
    'history.load.error': 'Could not load purchase history',
    'history.status.completed': 'Completed',
    'history.status.pending': 'Processing',
    'history.status.cancelled': 'Cancelled',
    'history.total.orders': 'Total Orders',
    'history.total.spent': 'Total Spent',
    'history.total.profit': 'Total Profit',
    'history.no.orders': 'No orders yet',
    'history.quantity': 'Quantity',
    'history.price': 'Price',
    'history.profit': 'Profit',
     'language.global.applied': 'Applied globally to entire website',
     
     // Services
     'services.topup': 'Top Up',
     'services.topup.desc': 'Top up Balance',
     'services.withdraw': 'Withdraw',
     'services.withdraw.desc': 'Withdraw Funds',
     'services.order.rules': 'Order Rules',
     'services.order.rules.desc': 'Order Rules',
     'services.platform.intro': 'Platform Introduction',
     'services.platform.intro.desc': 'Platform Introduction',
     
     // Products
     'products.recommended.title': 'RECOMMENDED PRODUCTS',
     'products.recommended.subtitle': 'Curated premium collection for discerning customers',
     'products.add.cart': 'Add to Cart',
     'products.view': 'VIEW',
     
     // VIP Levels component
     'vip.membership.levels': 'VIP MEMBERSHIP LEVELS',
     'vip.unlock.benefits': 'Unlock exclusive benefits and higher commissions',
     
     // VIP Levels Page
     'vip.page.subtitle': 'Explore VIP levels and special offers',
     'vip.benefits.title': 'VIP BENEFITS',
     'vip.benefits.high.commission': 'High Commission',
     'vip.benefits.high.commission.desc': 'Receive higher commission rates when upgrading VIP',
     'vip.benefits.priority.support': 'Priority Support',
     'vip.benefits.priority.support.desc': 'Get priority support from customer service team',
      'vip.benefits.exclusive.products': 'Exclusive Products',
      'vip.benefits.exclusive.products.desc': 'Access products and services exclusively for VIP',
      
      // Group Report
      'group.report.title': 'Group Report',
      'group.report.total.members': 'Total Members',
      'group.report.direct.members': 'Direct Members',
      'group.report.total.commission': 'Total Commission',
      'group.report.monthly.commission': 'This Month',
      'group.report.team.list': 'Team List',
      'group.report.direct': 'Direct',
      'group.report.total': 'Total',
      'group.report.no.invites': 'No invited users yet',
      'group.report.no.invites.desc': 'Share your invitation code to start building your team',
      'group.report.join.date': 'Joined',
      'group.report.orders': 'orders',
      'group.report.invitation.info': 'Invitation Information',
      'group.report.commission.structure': 'Commission Structure',
      'group.report.commission.level1': 'Level 1 (direct): 20% commission',
      'group.report.commission.level2': 'Level 2: 10% commission',
      'group.report.commission.level3': 'Level 3: 5% commission',
      'group.report.team.tips': 'Team Building Tips',
      'group.report.tip1': 'Share invitation code on social media',
      'group.report.tip2': 'Guide new members to use the platform',
      'group.report.tip3': 'Stay active to increase credibility',
      
      // Page titles
      'page.title.auth': 'Login',
      'page.title.profile': 'Profile',
      'page.title.topup': 'Top Up',
      'page.title.withdraw': 'Withdraw',
      'page.title.order.rules': 'Order Rules',
      'page.title.platform.intro': 'Platform Introduction',
      'page.title.about.us': 'About Us',
      'page.title.delivery.info': 'Delivery Information',
      'page.title.bank.linking': 'Bank Linking',
      'page.title.task.center': 'Task Center',
      'page.title.vip.info': 'VIP Information',
      'page.title.group.report': 'Group Report',
      'page.title.language': 'Language',
      'page.title.purchase.history': 'Purchase History',
      'page.title.vip.levels': 'VIP Levels',
      'page.title.withdrawal.history': 'Withdrawal History',
      'page.title.not.found': 'Not Found',
      'deposit_history': 'Deposit History',
      
      // Auth page
      'auth.title': 'Luxury Marketplace',
      'auth.description': 'Premium shopping experience',
      'auth.back.to.homepage': 'Back to homepage',
      'auth.signin': 'Sign In',
      'auth.signup': 'Sign Up',
      'auth.email': 'Email',
      'auth.email.placeholder': 'your@email.com',
      'auth.password': 'Password',
      'auth.username': 'Username',
      'auth.username.placeholder': 'username',
      'auth.phone.number': 'Phone Number',
      'auth.phone.placeholder': '+84901234567',
      'auth.login.password': 'Login Password',
      'auth.fund.password': 'Fund Password',
      'auth.password.min.length': 'Password must be at least 6 characters',
      'auth.invitation.code.optional': 'Invitation Code (optional)',
      'auth.invitation.code.placeholder': 'Enter invitation code',
      'auth.agree.with': 'I agree with',
      'auth.terms.of.service': 'Terms of Service',
      'auth.signin.failed': 'Sign in failed',
      'auth.signin.invalid.credentials': 'Email or password is incorrect',
      'auth.signin.success': 'Sign in successful',
      'auth.signin.welcome.back': 'Welcome back!',
      'auth.signin.error': 'An error occurred during sign in',
      'auth.signup.failed': 'Sign up failed',
      'auth.signup.fill.all.fields': 'Please fill in all required fields',
      'auth.signup.email.already.registered': 'This email is already registered. Please sign in.',
      'auth.signup.success': 'Sign up successful',
      'auth.signup.check.email': 'Please check your email to verify your account.',
      'auth.signup.error': 'An error occurred during sign up',
      
      // Admin
      'admin.dashboard.title': 'Admin Dashboard',
      'admin.welcome.back': 'Welcome back,',
      
      // Task Center
      'task.error.load.user.info': 'Unable to load user information',
      'task.error.login.required': 'Please log in',
      'task.error.no.products': 'No products found',
      'task.error.no.suitable.products': 'No VIP products suitable for your current balance',
      'task.error.find.vip.product': 'Unable to find VIP product',
      'task.error.login.to.order': 'Please log in to place an order',
      'task.error.create.order': 'Unable to create order',
      'task.success.title': 'Success',
      'task.success.order.received': 'Order received',
      'task.stats.available.balance': 'Available Balance',
      'task.stats.profit.received': 'Profit Received',
      'task.stats.current.vip.orders': 'Current VIP Orders',
      'task.stats.orders.today': 'Orders Today',
      'task.commission.rate': 'COMMISSION RATE',
      'task.button.finding.product': 'FINDING PRODUCT...',
      'task.button.take.order': 'Take Order'
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.profile': '个人资料',
    'nav.vip': 'VIP信息',
    'nav.language': '语言',
    'nav.back': '返回',
    'nav.categories': '分类',
    'nav.products': '产品',
    'nav.personal': '个人',
    'nav.admin': '管理员',
    'nav.first.page': '首页',
    'nav.history': '历史',
    'nav.support': '客服',
    'nav.my.page': '我的',
    
    // Common actions
    'common.loading': '加载中...',
    'common.withdraw': '提取',
    'common.topup': '充值',
    'common.logout': '登出',
    'common.logout.success': '成功登出',
    'common.logout.message': '再见！',
    'common.error': '错误',
    'common.logout.error': '无法登出',
    
    // Profile page
    'profile.grand.commission': '总佣金',
    'profile.available.assets': '可用资产',
    'profile.invitation.code': '邀请码',
    'profile.delivery.info': '收货信息',
    'profile.bank.linking': '银行绑定',
    'profile.deposit.history': '充值历史',
    'profile.withdraw.history': '提取历史',
    'profile.vip.levels': 'VIP等级',
    'profile.group.report': '群组报告',
    'profile.about.us': '关于我们',
    
    // Language page
    'language.title': '语言',
    'language.current': '当前语言',
    'language.select': '选择语言',
    'language.info': '信息',
    'language.reset': '重置为简体中文',
    'language.note.title': '语言说明',
    'language.note.content': '语言更改将应用于整个应用程序',
    'language.support.title': '多语言支持',
    'language.support.content': '我们正在不断更新和改进语言支持。如果您发现翻译错误，请联系客服。',
    'language.changed': '语言更改成功',
    'language.changed.desc': '已切换到',
    
    // VIP Info
    'vip.title': 'VIP信息',
    'vip.current.level': '当前等级',
    'vip.benefits.current': '当前权益',
    'vip.progress': '升级进度到VIP',
    'vip.all.levels': '所有VIP等级',
    'vip.orders.completed': '已完成订单',
    'vip.total.spent': '总消费',
    'vip.orders.needed': '更多订单',
    'vip.spending.needed': '更多消费',
    'vip.commission': '佣金',
    'vip.support': '客户支持',
    'vip.priority.support': '优先支持',
    'vip.premium.gifts': '高级礼品',
    'vip.dedicated.manager': '专属经理',
    'vip.premium.service': '高级服务',
    'vip.current.badge': '当前',
    'vip.achieved.badge': '已达成',
     'vip.per.day': '每日订单',
     'vip.min.balance': '最低余额',
     'vip.max.orders': '最大订单数',
    
    // Hero section
    'hero.welcome': '欢迎来到奢华购物中心 - 高端购物的首选目的地',
    'hero.exclusive': 'VIP会员专享特权',
    'hero.shipping': '全国免费配送',
    'hero.authentic': '100%正品保证',
    
    // Purchase History
    'history.login.required': '请登录查看购买历史',
    'history.load.error': '无法加载购买历史',
    'history.status.completed': '已完成',
    'history.status.pending': '处理中',
    'history.status.cancelled': '已取消',
    'history.total.orders': '总订单',
    'history.total.spent': '总消费',
    'history.total.profit': '总利润',
    'history.no.orders': '还没有订单',
    'history.quantity': '数量',
    'history.price': '价格',
    'history.profit': '利润',
     'language.global.applied': '已全局应用到整个网站',
     
     // Services
     'services.topup': '充值',
     'services.topup.desc': '充值余额',
     'services.withdraw': '提取',
     'services.withdraw.desc': '提取资金',
     'services.order.rules': '订单规则',
     'services.order.rules.desc': '订单规则',
     'services.platform.intro': '平台介绍',
     'services.platform.intro.desc': '平台介绍',
     
     // Products
     'products.recommended.title': '推荐产品',
     'products.recommended.subtitle': '为挑剔客户精选的优质商品',
     'products.add.cart': '加入购物车',
     'products.view': '查看',
     
     // VIP Levels component
     'vip.membership.levels': 'VIP 会员等级',
     'vip.unlock.benefits': '解锁专享权益和更高佣金',
     
     // VIP Levels Page
     'vip.page.subtitle': '探索VIP等级和特别优惠',
     'vip.benefits.title': 'VIP优惠',
     'vip.benefits.high.commission': '高佣金',
     'vip.benefits.high.commission.desc': '升级VIP时获得更高的佣金率',
     'vip.benefits.priority.support': '优先支持',
     'vip.benefits.priority.support.desc': '获得客服团队的优先支持',
     'vip.benefits.exclusive.products': '独家产品',
     'vip.benefits.exclusive.products.desc': '访问VIP专属产品和服务',
     
     // Group Report
     'group.report.title': '群组报告',
     'group.report.total.members': '总成员',
     'group.report.direct.members': '直接成员',
     'group.report.total.commission': '总佣金',
     'group.report.monthly.commission': '本月',
     'group.report.team.list': '团队列表',
     'group.report.direct': '直接',
     'group.report.total': '总计',
     'group.report.no.invites': '还没有邀请用户',
     'group.report.no.invites.desc': '分享您的邀请码开始建立团队',
     'group.report.join.date': '加入',
     'group.report.orders': '订单',
     'group.report.invitation.info': '邀请信息',
     'group.report.commission.structure': '佣金结构',
     'group.report.commission.level1': '1级（直接）：20%佣金',
     'group.report.commission.level2': '2级：10%佣金',
     'group.report.commission.level3': '3级：5%佣金',
     'group.report.team.tips': '团队建设技巧',
     'group.report.tip1': '在社交媒体上分享邀请码',
     'group.report.tip2': '指导新成员使用平台',
     'group.report.tip3': '保持活跃以增加信誉',
     
     // Page titles
     'page.title.auth': '登录',
     'page.title.profile': '个人资料',
     'page.title.topup': '充值',
     'page.title.withdraw': '提取',
     'page.title.order.rules': '订单规则',
     'page.title.platform.intro': '平台介绍',
     'page.title.about.us': '关于我们',
     'page.title.delivery.info': '配送信息',
     'page.title.bank.linking': '银行绑定',
     'page.title.task.center': '任务中心',
     'page.title.vip.info': 'VIP信息',
     'page.title.group.report': '群组报告',
     'page.title.language': '语言',
      'page.title.purchase.history': '购买历史',
      'page.title.vip.levels': 'VIP等级',
      'page.title.withdrawal.history': '提取历史',
      'page.title.not.found': '未找到',
      'deposit_history': '充值历史',
      
      // Auth page
      'auth.title': '奢华购物中心',
      'auth.description': '高端购物体验',
      'auth.back.to.homepage': '返回首页',
      'auth.signin': '登录',
      'auth.signup': '注册',
      'auth.email': '邮箱',
      'auth.email.placeholder': 'your@email.com',
      'auth.password': '密码',
      'auth.username': '用户名',
      'auth.username.placeholder': '用户名',
      'auth.phone.number': '手机号',
      'auth.phone.placeholder': '+86138000000000',
      'auth.login.password': '登录密码',
      'auth.fund.password': '资金密码',
      'auth.password.min.length': '密码至少需要6个字符',
      'auth.invitation.code.optional': '邀请码（可选）',
      'auth.invitation.code.placeholder': '输入邀请码',
      'auth.agree.with': '我同意',
      'auth.terms.of.service': '服务条款',
      'auth.signin.failed': '登录失败',
      'auth.signin.invalid.credentials': '邮箱或密码错误',
      'auth.signin.success': '登录成功',
      'auth.signin.welcome.back': '欢迎回来！',
      'auth.signin.error': '登录时发生错误',
      'auth.signup.failed': '注册失败',
      'auth.signup.fill.all.fields': '请填写所有必填字段',
      'auth.signup.email.already.registered': '此邮箱已注册，请登录。',
      'auth.signup.success': '注册成功',
      'auth.signup.check.email': '请检查您的邮箱以验证账户。',
      'auth.signup.error': '注册时发生错误',
      
      // Admin
      'admin.dashboard.title': '管理仪表板',
      'admin.welcome.back': '欢迎回来，',
      
      // Task Center
      'task.error.load.user.info': '无法加载用户信息',
      'task.error.login.required': '请登录',
      'task.error.no.products': '找不到产品',
      'task.error.no.suitable.products': '没有适合您当前余额的VIP产品',
      'task.error.find.vip.product': '无法找到VIP产品',
      'task.error.login.to.order': '请登录以下订单',
      'task.error.create.order': '无法创建订单',
      'task.success.title': '成功',
      'task.success.order.received': '订单已接收',
      'task.stats.available.balance': '可用余额',
      'task.stats.profit.received': '已收到利润',
      'task.stats.current.vip.orders': '当前VIP订单',
      'task.stats.orders.today': '今日订单',
      'task.commission.rate': '佣金率',
      'task.button.finding.product': '正在查找产品...',
      'task.button.take.order': '接受订单'
  },
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.profile': 'プロフィール',
    'nav.vip': 'VIP情報',
    'nav.language': '言語',
    'nav.back': '戻る',
    'nav.categories': 'カテゴリー',
    'nav.products': '商品',
    'nav.personal': '個人',
    'nav.admin': '管理者',
    'nav.first.page': 'ホーム',
    'nav.history': '履歴',
    'nav.support': 'サポート',
    'nav.my.page': 'マイページ',
    
    // Common actions
    'common.loading': '読み込み中...',
    'common.withdraw': '出金',
    'common.topup': 'チャージ',
    'common.logout': 'ログアウト',
    'common.logout.success': 'ログアウトしました',
    'common.logout.message': 'またお会いしましょう！',
    'common.error': 'エラー',
    'common.logout.error': 'ログアウトできませんでした',
    
    // Profile page
    'profile.grand.commission': '総コミッション',
    'profile.available.assets': '利用可能資産',
    'profile.invitation.code': '招待コード',
    'profile.delivery.info': '配送情報',
    'profile.bank.linking': '銀行連携',
    'profile.deposit.history': '入金履歴',
    'profile.withdraw.history': '出金履歴',
    'profile.vip.levels': 'VIPレベル',
    'profile.group.report': 'グループレポート',
    'profile.about.us': '会社概要',
    
    // Language page
    'language.title': '言語',
    'language.current': '現在の言語',
    'language.select': '言語を選択',
    'language.info': '情報',
    'language.reset': '日本語にリセット',
    'language.note.title': '言語について',
    'language.note.content': '言語の変更はアプリケーション全体に適用されます',
    'language.support.title': '多言語サポート',
    'language.support.content': '言語サポートを継続的に更新・改善しています。翻訳エラーを見つけた場合は、サポートにお問い合わせください。',
    'language.changed': '言語変更に成功しました',
    'language.changed.desc': '切り替えました',
    
    // VIP Info
    'vip.title': 'VIP情報',
    'vip.current.level': '現在のレベル',
    'vip.benefits.current': '現在の特典',
    'vip.progress': 'VIPへの進捗',
    'vip.all.levels': 'すべてのVIPレベル',
    'vip.orders.completed': '完了した注文',
    'vip.total.spent': '総支出',
    'vip.orders.needed': 'さらに注文',
    'vip.spending.needed': 'さらに支出',
    'vip.commission': 'コミッション',
    'vip.support': 'カスタマーサポート',
    'vip.priority.support': '優先サポート',
    'vip.premium.gifts': 'プレミアムギフト',
    'vip.dedicated.manager': '専属マネージャー',
    'vip.premium.service': 'プレミアムサービス',
    'vip.current.badge': '現在',
    'vip.achieved.badge': '達成済み',
     'vip.per.day': '1日の注文',
     'vip.min.balance': '最小残高',
     'vip.max.orders': '最大注文数',
    
    // Hero section
    'hero.welcome': 'ラグジュアリーマーケットプレイスへようこそ - 上質なショッピングの最高の目的地',
    'hero.exclusive': 'VIP会員限定特典',
    'hero.shipping': '全国送料無料',
    'hero.authentic': '100%正規品保証',
    
    // Purchase History
    'history.login.required': '購入履歴を表示するにはログインしてください',
    'history.load.error': '購入履歴を読み込めませんでした',
    'history.status.completed': '完了',
    'history.status.pending': '処理中',
    'history.status.cancelled': 'キャンセル',
    'history.total.orders': '総注文数',
    'history.total.spent': '総支出',
    'history.total.profit': '総利益',
    'history.no.orders': 'まだ注文がありません',
    'history.quantity': '数量',
    'history.price': '価格',
    'history.profit': '利益',
     'language.global.applied': 'ウェブサイト全体にグローバルに適用されました',
     
     // Services
     'services.topup': 'チャージ',
     'services.topup.desc': '残高チャージ',
     'services.withdraw': '出金',
     'services.withdraw.desc': '資金の出金',
     'services.order.rules': '注文ルール',
     'services.order.rules.desc': '注文ルール',
     'services.platform.intro': 'プラットフォーム紹介',
     'services.platform.intro.desc': 'プラットフォーム紹介',
     
     // Products
     'products.recommended.title': '推奨商品',
     'products.recommended.subtitle': '厳選されたプレミアムコレクション',
     'products.add.cart': 'カートに追加',
     'products.view': '表示',
     
     // VIP Levels component
     'vip.membership.levels': 'VIP メンバーシップレベル',
     'vip.unlock.benefits': '限定特典と高いコミッションをアンロック',
     
     // VIP Levels Page
     'vip.page.subtitle': 'VIPレベルと特別オファーを探索',
     'vip.benefits.title': 'VIP特典',
     'vip.benefits.high.commission': '高コミッション',
     'vip.benefits.high.commission.desc': 'VIPアップグレード時により高いコミッション率を受け取る',
     'vip.benefits.priority.support': '優先サポート',
     'vip.benefits.priority.support.desc': 'カスタマーサービスチームから優先サポートを受ける',
      'vip.benefits.exclusive.products': '独占商品',
      'vip.benefits.exclusive.products.desc': 'VIP専用の商品とサービスにアクセス',
      
      // Group Report
      'group.report.title': 'グループレポート',
      'group.report.total.members': '総メンバー',
      'group.report.direct.members': '直接メンバー',
      'group.report.total.commission': '総コミッション',
      'group.report.monthly.commission': '今月',
      'group.report.team.list': 'チームリスト',
      'group.report.direct': '直接',
      'group.report.total': '総計',
      'group.report.no.invites': 'まだ招待ユーザーがいません',
      'group.report.no.invites.desc': '招待コードを共有してチーム構築を始めましょう',
      'group.report.join.date': '参加',
      'group.report.orders': '注文',
      'group.report.invitation.info': '招待情報',
      'group.report.commission.structure': 'コミッション構造',
      'group.report.commission.level1': 'レベル1（直接）：20%コミッション',
      'group.report.commission.level2': 'レベル2：10%コミッション',
      'group.report.commission.level3': 'レベル3：5%コミッション',
      'group.report.team.tips': 'チーム構築のコツ',
      'group.report.tip1': 'ソーシャルメディアで招待コードを共有',
      'group.report.tip2': '新メンバーにプラットフォームの使い方を案内',
      'group.report.tip3': '信頼性を高めるためにアクティブを維持',
      
      // Page titles
      'page.title.auth': 'ログイン',
      'page.title.profile': 'プロフィール',
      'page.title.topup': 'チャージ',
      'page.title.withdraw': '出金',
      'page.title.order.rules': '注文ルール',
      'page.title.platform.intro': 'プラットフォーム紹介',
      'page.title.about.us': '会社概要',
      'page.title.delivery.info': '配送情報',
      'page.title.bank.linking': '銀行連携',
      'page.title.task.center': 'タスクセンター',
      'page.title.vip.info': 'VIP情報',
      'page.title.group.report': 'グループレポート',
      'page.title.language': '言語',
      'page.title.purchase.history': '購入履歴',
      'page.title.vip.levels': 'VIPレベル',
      'page.title.withdrawal.history': '出金履歴',
      'page.title.not.found': '見つかりません'
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.profile': 'Perfil',
    'nav.vip': 'Informações VIP',
    'nav.language': 'Idioma',
    'nav.back': 'Voltar',
    'nav.categories': 'Categorias',
    'nav.products': 'Produtos',
    'nav.personal': 'Pessoal',
    'nav.admin': 'Admin',
    'nav.first.page': 'Início',
    'nav.history': 'Histórico',
    'nav.support': 'Suporte',
    'nav.my.page': 'Minha Página',
    
    // Common actions
    'common.loading': 'Carregando...',
    'common.withdraw': 'Sacar',
    'common.topup': 'Recarregar',
    'common.logout': 'Sair',
    'common.logout.success': 'Saiu com sucesso',
    'common.logout.message': 'Até a próxima!',
    'common.error': 'Erro',
    'common.logout.error': 'Não foi possível sair',
    'common.save': 'Salvar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Excluir',
    'common.confirm': 'Confirmar',
    
    // Profile page
    'profile.grand.commission': 'Comissão total',
    'profile.available.assets': 'Ativos Disponíveis',
    'profile.invitation.code': 'Código de Convite',
    'profile.delivery.info': 'Informações de entrega',
    'profile.bank.linking': 'Vinculação bancária',
    'profile.deposit.history': 'Histórico de depósitos',
    'profile.withdraw.history': 'Histórico de saques',
    'profile.vip.levels': 'Níveis VIP',
    'profile.group.report': 'Relatório do grupo',
    'profile.about.us': 'Sobre nós',
    
    // Language page
    'language.title': 'Idioma',
    'language.current': 'Idioma Atual',
    'language.select': 'Selecionar Idioma',
    'language.info': 'Informações',
    'language.reset': 'Redefinir para Português',
    'language.note.title': 'Nota sobre Idioma',
    'language.note.content': 'As mudanças de idioma se aplicarão a todo o aplicativo',
    'language.support.title': 'Suporte Multi-idioma',
    'language.support.content': 'Estamos atualizando e melhorando continuamente o suporte a idiomas. Se encontrar erros de tradução, entre em contato com o suporte.',
    'language.changed': 'Idioma alterado com sucesso',
    'language.changed.desc': 'Mudou para',
    
    // VIP Info
    'vip.title': 'Informações VIP',
    'vip.current.level': 'Nível Atual',
    'vip.benefits.current': 'Benefícios Atuais',
    'vip.progress': 'Progresso para VIP',
    'vip.all.levels': 'Todos os Níveis VIP',
    'vip.orders.completed': 'Pedidos concluídos',
    'vip.total.spent': 'Total gasto',
    'vip.orders.needed': 'mais pedidos',
    'vip.spending.needed': 'mais gastos',
    'vip.commission': 'Comissão',
    'vip.support': 'Suporte ao cliente',
    'vip.priority.support': 'Suporte prioritário',
    'vip.premium.gifts': 'Presentes premium',
    'vip.dedicated.manager': 'Gerente dedicado',
    'vip.premium.service': 'Serviço premium',
    'vip.current.badge': 'Atual',
    'vip.achieved.badge': 'Alcançado',
     'vip.per.day': 'pedidos por dia',
     'vip.min.balance': 'saldo mínimo',
     'vip.max.orders': 'Máx Pedidos',
    
    // Hero section
    'hero.welcome': 'BEM-VINDOS AO MARKETPLACE DE LUXO - O DESTINO PRINCIPAL PARA COMPRAS DISTINTAS',
    'hero.exclusive': 'PRIVILÉGIOS EXCLUSIVOS PARA MEMBROS VIP',
    'hero.shipping': 'FRETE GRÁTIS NACIONALMENTE',
    'hero.authentic': 'PRODUTOS AUTÊNTICOS GARANTIDOS 100%',
    
    // Purchase History
    'history.login.required': 'Por favor, faça login para ver o histórico de compras',
    'history.load.error': 'Não foi possível carregar o histórico de compras',
    'history.status.completed': 'Concluído',
    'history.status.pending': 'Processando',
    'history.status.cancelled': 'Cancelado',
    'history.total.orders': 'Total de Pedidos',
    'history.total.spent': 'Total Gasto',
    'history.total.profit': 'Lucro Total',
    'history.no.orders': 'Ainda não há pedidos',
    'history.quantity': 'Quantidade',
    'history.price': 'Preço',
    'history.profit': 'Lucro',
    'language.global.applied': 'Aplicado globalmente a todo o site',
    
    // Services
    'services.topup': 'Recarregar',
    'services.topup.desc': 'Recarregar Saldo',
    'services.withdraw': 'Sacar',
    'services.withdraw.desc': 'Sacar Fundos',
    'services.order.rules': 'Regras de Pedido',
    'services.order.rules.desc': 'Regras de Pedido',
    'services.platform.intro': 'Introdução da Plataforma',
    'services.platform.intro.desc': 'Introdução da Plataforma',
    
    // Products
    'products.recommended.title': 'PRODUTOS RECOMENDADOS',
    'products.recommended.subtitle': 'Coleção premium selecionada para clientes exigentes',
    'products.add.cart': 'Adicionar ao Carrinho',
    'products.view': 'VISUALIZAR',
    
    // VIP Levels component
    'vip.membership.levels': 'NÍVEIS DE ASSOCIAÇÃO VIP',
    'vip.unlock.benefits': 'Desbloqueie benefícios exclusivos e comissões mais altas',
    
    // VIP Levels Page
    'vip.page.subtitle': 'Explore os níveis VIP e ofertas especiais',
    'vip.benefits.title': 'BENEFÍCIOS VIP',
    'vip.benefits.high.commission': 'Alta Comissão',
    'vip.benefits.high.commission.desc': 'Receba taxas de comissão mais altas ao fazer upgrade VIP',
    'vip.benefits.priority.support': 'Suporte Prioritário',
    'vip.benefits.priority.support.desc': 'Obtenha suporte prioritário da equipe de atendimento ao cliente',
     'vip.benefits.exclusive.products': 'Produtos Exclusivos',
     'vip.benefits.exclusive.products.desc': 'Acesse produtos e serviços exclusivos para VIP',
     
     // Group Report
     'group.report.title': 'Relatório do Grupo',
     'group.report.total.members': 'Total de Membros',
     'group.report.direct.members': 'Membros Diretos',
     'group.report.total.commission': 'Comissão Total',
     'group.report.monthly.commission': 'Este Mês',
     'group.report.team.list': 'Lista da Equipe',
     'group.report.direct': 'Direto',
     'group.report.total': 'Total',
     'group.report.no.invites': 'Ainda não há usuários convidados',
     'group.report.no.invites.desc': 'Compartilhe seu código de convite para começar a construir sua equipe',
     'group.report.join.date': 'Ingressou',
     'group.report.orders': 'pedidos',
     'group.report.invitation.info': 'Informações do Convite',
     'group.report.commission.structure': 'Estrutura de Comissão',
     'group.report.commission.level1': 'Nível 1 (direto): 20% de comissão',
     'group.report.commission.level2': 'Nível 2: 10% de comissão',
     'group.report.commission.level3': 'Nível 3: 5% de comissão',
     'group.report.team.tips': 'Dicas para Construção de Equipe',
     'group.report.tip1': 'Compartilhe o código de convite nas redes sociais',
     'group.report.tip2': 'Oriente novos membros a usar a plataforma',
     'group.report.tip3': 'Mantenha-se ativo para aumentar a credibilidade',
     
     // Page titles
     'page.title.auth': 'Login',
     'page.title.profile': 'Perfil',
     'page.title.topup': 'Recarregar',
     'page.title.withdraw': 'Sacar',
     'page.title.order.rules': 'Regras de Pedido',
     'page.title.platform.intro': 'Introdução da Plataforma',
     'page.title.about.us': 'Sobre Nós',
     'page.title.delivery.info': 'Informações de Entrega',
     'page.title.bank.linking': 'Vinculação Bancária',
     'page.title.task.center': 'Centro de Tarefas',
     'page.title.vip.info': 'Informações VIP',
     'page.title.group.report': 'Relatório do Grupo',
     'page.title.language': 'Idioma',
     'page.title.purchase.history': 'Histórico de Compras',
     'page.title.vip.levels': 'Níveis VIP',
     'page.title.withdrawal.history': 'Histórico de Saques',
     'page.title.not.found': 'Não Encontrado'
  },
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.profile': 'Hồ sơ',
    'nav.vip': 'Thông tin VIP',
    'nav.language': 'Ngôn ngữ',
    'nav.back': 'Quay lại',
    'nav.categories': 'Danh mục',
    'nav.products': 'Sản phẩm',
    'nav.personal': 'Cá nhân',
    'nav.admin': 'Quản trị',
    'nav.first.page': 'Trang chủ',
    'nav.history': 'Lịch sử',
    'nav.support': 'Hỗ trợ',
    'nav.my.page': 'Trang của tôi',
    
    // Common actions
    'common.loading': 'Đang tải...',
    'common.withdraw': 'Rút tiền',
    'common.topup': 'Nạp tiền',
    'common.logout': 'Đăng xuất',
    'common.logout.success': 'Đăng xuất thành công',
    'common.logout.message': 'Hẹn gặp lại!',
    'common.error': 'Lỗi',
    'common.logout.error': 'Không thể đăng xuất',
    'common.save': 'Lưu',
    'common.cancel': 'Hủy',
    'common.edit': 'Chỉnh sửa',
     'common.delete': 'Xóa',
     'common.confirm': 'Xác nhận',
     'common.user': 'Người dùng',
    
    // Profile page
    'profile.grand.commission': 'Tổng hoa hồng',
    'profile.available.assets': 'Tài sản có sẵn',
    'profile.invitation.code': 'Mã mời',
    'profile.delivery.info': 'Thông tin giao hàng',
    'profile.bank.linking': 'Liên kết ngân hàng',
    'profile.deposit.history': 'Lịch sử nạp tiền',
    'profile.withdraw.history': 'Lịch sử rút tiền',
    'profile.vip.levels': 'Cấp độ VIP',
    'profile.group.report': 'Báo cáo nhóm',
    'profile.about.us': 'Về chúng tôi',
    
    // Language page
    'language.title': 'Ngôn ngữ',
    'language.current': 'Ngôn ngữ hiện tại',
    'language.select': 'Chọn ngôn ngữ',
    'language.info': 'Thông tin',
    'language.reset': 'Đặt lại về Tiếng Việt',
    'language.note.title': 'Lưu ý về ngôn ngữ',
    'language.note.content': 'Thay đổi ngôn ngữ sẽ áp dụng cho toàn bộ ứng dụng',
    'language.support.title': 'Hỗ trợ đa ngôn ngữ',
    'language.support.content': 'Chúng tôi đang liên tục cập nhật và cải thiện việc hỗ trợ các ngôn ngữ. Nếu bạn phát hiện lỗi dịch, vui lòng liên hệ bộ phận hỗ trợ.',
    'language.changed': 'Thay đổi ngôn ngữ thành công',
    'language.changed.desc': 'Đã chuyển sang',
    
    // VIP Info
    'vip.title': 'Thông tin VIP',
    'vip.current.level': 'Cấp độ hiện tại',
    'vip.benefits.current': 'Quyền lợi hiện tại',
    'vip.progress': 'Tiến độ lên VIP',
    'vip.all.levels': 'Tất cả cấp độ VIP',
    'vip.orders.completed': 'Đơn hàng hoàn thành',
    'vip.total.spent': 'Tổng chi tiêu',
    'vip.orders.needed': 'đơn hàng nữa',
    'vip.spending.needed': 'chi tiêu nữa',
    'vip.commission': 'Hoa hồng',
    'vip.support': 'Hỗ trợ khách hàng',
    'vip.priority.support': 'Ưu tiên hỗ trợ',
    'vip.premium.gifts': 'Quà tặng cao cấp',
    'vip.dedicated.manager': 'Chuyên viên riêng',
    'vip.premium.service': 'Dịch vụ premium',
    'vip.current.badge': 'Hiện tại',
    'vip.achieved.badge': 'Đã đạt',
     'vip.per.day': 'đơn trong ngày',
     'vip.min.balance': 'số dư tối thiểu',
     'vip.max.orders': 'Đơn tối đa',
    
    // Hero section
    'hero.welcome': 'CHÀO MỪNG ĐÉN LUXURY MARKETPLACE - ĐIỂM ĐẾN HÀNG ĐẦU CHO MUA SẮM ĐẲNG CẤP',
    'hero.exclusive': 'ĐẶC QUYỀN DÀNH RIÊNG CHO THÀNH VIÊN VIP',
    'hero.shipping': 'MIỄN PHÍ VẬN CHUYỂN TOÀN QUỐC',
    'hero.authentic': 'CAM KẾT 100% HÀNG CHÍNH HÃNG',
    
    // Purchase History
    'history.login.required': 'Vui lòng đăng nhập để xem lịch sử mua hàng',
    'history.load.error': 'Không thể tải lịch sử mua hàng',
    'history.status.completed': 'Hoàn thành',
    'history.status.pending': 'Đang xử lý',
    'history.status.cancelled': 'Đã hủy',
    'history.total.orders': 'Tổng đơn hàng',
    'history.total.spent': 'Tổng chi tiêu',
    'history.total.profit': 'Tổng lợi nhuận',
    'history.no.orders': 'Chưa có đơn hàng nào',
    'history.quantity': 'Số lượng',
    'history.price': 'Giá',
    'history.profit': 'Lợi nhuận',
    'language.global.applied': 'Đã áp dụng toàn cầu cho toàn bộ trang web',
    
    // Services
    'services.topup': 'Nạp tiền',
    'services.topup.desc': 'Nạp tiền vào tài khoản',
    'services.withdraw': 'Rút tiền',
    'services.withdraw.desc': 'Rút tiền từ tài khoản',
    'services.order.rules': 'Quy tắc đặt hàng',
    'services.order.rules.desc': 'Quy tắc đặt hàng',
    'services.platform.intro': 'Giới thiệu nền tảng',
    'services.platform.intro.desc': 'Giới thiệu nền tảng',
    
    // Products
    'products.recommended.title': 'SẢN PHẨM ĐƯỢC ĐỀ XUẤT',
    'products.recommended.subtitle': 'Bộ sưu tập cao cấp được tuyển chọn cho khách hàng khó tính',
    'products.add.cart': 'Thêm vào giỏ',
    'products.view': 'XEM',
    
    // VIP Levels component
    'vip.membership.levels': 'CẤP ĐỘ THÀNH VIÊN VIP',
    'vip.unlock.benefits': 'Mở khóa quyền lợi độc quyền và hoa hồng cao hơn',
    
    // VIP Levels Page
    'vip.page.subtitle': 'Khám phá các cấp độ VIP và ưu đãi đặc biệt',
    'vip.benefits.title': 'ƯU ĐÃI VIP',
    'vip.benefits.high.commission': 'Hoa hồng cao',
    'vip.benefits.high.commission.desc': 'Nhận tỷ lệ hoa hồng cao hơn khi nâng cấp VIP',
    'vip.benefits.priority.support': 'Ưu tiên hỗ trợ',
    'vip.benefits.priority.support.desc': 'Được ưu tiên hỗ trợ từ đội ngũ chăm sóc khách hàng',
     'vip.benefits.exclusive.products': 'Sản phẩm độc quyền',
     'vip.benefits.exclusive.products.desc': 'Tiếp cận sản phẩm và dịch vụ dành riêng cho VIP',
     
     // Group Report
     'group.report.title': 'Báo cáo nhóm',
     'group.report.total.members': 'Tổng thành viên',
     'group.report.direct.members': 'Thành viên trực tiếp',
     'group.report.total.commission': 'Tổng hoa hồng',
     'group.report.monthly.commission': 'Tháng này',
     'group.report.team.list': 'Danh sách đội nhóm',
     'group.report.direct': 'Trực tiếp',
     'group.report.total': 'Tổng',
     'group.report.no.invites': 'Chưa có người được mời',
     'group.report.no.invites.desc': 'Chia sẻ mã mời của bạn để bắt đầu xây dựng đội nhóm',
     'group.report.join.date': 'Tham gia',
     'group.report.orders': 'đơn hàng',
     'group.report.invitation.info': 'Thông tin mời bạn bè',
     'group.report.commission.structure': 'Hoa hồng giới thiệu',
     'group.report.commission.level1': 'Cấp 1 (trực tiếp): 20% hoa hồng',
     'group.report.commission.level2': 'Cấp 2: 10% hoa hồng',
     'group.report.commission.level3': 'Cấp 3: 5% hoa hồng',
     'group.report.team.tips': 'Mẹo xây dựng đội nhóm',
     'group.report.tip1': 'Chia sẻ mã mời trên mạng xã hội',
     'group.report.tip2': 'Hướng dẫn thành viên mới sử dụng nền tảng',
     'group.report.tip3': 'Duy trì hoạt động để tăng uy tín',
     
     // Page titles
     'page.title.auth': 'Đăng nhập',
     'page.title.profile': 'Hồ sơ cá nhân',
     'page.title.topup': 'Nạp tiền',
     'page.title.withdraw': 'Rút tiền',
     'page.title.order.rules': 'Quy tắc đặt hàng',
     'page.title.platform.intro': 'Giới thiệu nền tảng',
     'page.title.about.us': 'Về chúng tôi',
     'page.title.delivery.info': 'Thông tin giao hàng',
     'page.title.bank.linking': 'Liên kết ngân hàng',
     'page.title.task.center': 'Trung tâm nhiệm vụ',
     'page.title.vip.info': 'Thông tin VIP',
     'page.title.group.report': 'Báo cáo nhóm',
     'page.title.language': 'Ngôn ngữ',
     'page.title.purchase.history': 'Lịch sử mua hàng',
     'page.title.vip.levels': 'Cấp độ VIP',
      'page.title.withdrawal.history': 'Lịch sử rút tiền',
      'page.title.not.found': 'Không tìm thấy',
      'deposit_history': 'Lịch sử nạp tiền',
      
      // Auth page
      'auth.title': 'Luxury Marketplace',
      'auth.description': 'Trải nghiệm mua sắm cao cấp',
      'auth.back.to.homepage': 'Quay lại trang chủ',
      'auth.signin': 'Đăng nhập',
      'auth.signup': 'Đăng ký',
      'auth.email': 'Email',
      'auth.email.placeholder': 'your@email.com',
      'auth.password': 'Mật khẩu',
      'auth.username': 'Tên người dùng',
      'auth.username.placeholder': 'username',
      'auth.phone.number': 'Số điện thoại',
      'auth.phone.placeholder': '+84901234567',
      'auth.login.password': 'Mật khẩu đăng nhập',
      'auth.fund.password': 'Mật khẩu quỹ',
      'auth.password.min.length': 'Mật khẩu phải có ít nhất 6 ký tự',
      'auth.invitation.code.optional': 'Mã mời (tùy chọn)',
      'auth.invitation.code.placeholder': 'Nhập mã mời',
      'auth.agree.with': 'Tôi đồng ý với',
      'auth.terms.of.service': 'Điều khoản dịch vụ',
      'auth.signin.failed': 'Đăng nhập thất bại',
      'auth.signin.invalid.credentials': 'Email hoặc mật khẩu không đúng',
      'auth.signin.success': 'Đăng nhập thành công',
      'auth.signin.welcome.back': 'Chào mừng bạn trở lại!',
      'auth.signin.error': 'Có lỗi xảy ra khi đăng nhập',
      'auth.signup.failed': 'Đăng ký thất bại',
      'auth.signup.fill.all.fields': 'Vui lòng điền đầy đủ thông tin',
      'auth.signup.email.already.registered': 'Email này đã được đăng ký. Vui lòng đăng nhập.',
      'auth.signup.success': 'Đăng ký thành công',
      'auth.signup.check.email': 'Vui lòng kiểm tra email để xác nhận tài khoản.',
      'auth.signup.error': 'Có lỗi xảy ra khi đăng ký',
      
       // Admin
       'admin.dashboard.title': 'Bảng điều khiển quản trị',
       'admin.welcome.back': 'Chào mừng trở lại,',
       
       // Task Center
       'task.error.load.user.info': 'Không thể tải thông tin người dùng',
       'task.error.login.required': 'Vui lòng đăng nhập',
       'task.error.no.products': 'Không tìm thấy sản phẩm',
       'task.error.no.suitable.products': 'Không có sản phẩm VIP phù hợp với số dư hiện tại của bạn',
       'task.error.find.vip.product': 'Không thể tìm sản phẩm VIP',
       'task.error.login.to.order': 'Vui lòng đăng nhập để đặt hàng',
       'task.error.create.order': 'Không thể tạo đơn hàng',
       'task.success.title': 'Thành công',
       'task.success.order.received': 'Đã nhận đơn hàng',
       'task.stats.available.balance': 'Số dự khả dụng',
       'task.stats.profit.received': 'Lợi nhuận đã nhận',
       'task.stats.current.vip.orders': 'Order VIP hiện tại',
       'task.stats.orders.today': 'Đơn hàng hôm nay',
       'task.commission.rate': 'TỶ LỆ HOA HỒNG',
       'task.button.finding.product': 'ĐANG TÌM SẢN PHẨM...',
       'task.button.take.order': 'Take Order'
   },
  th: {
    // Navigation
    'nav.home': 'หน้าแรก',
    'nav.profile': 'โปรไฟล์',
    'nav.vip': 'ข้อมูล VIP',
    'nav.language': 'ภาษา',
    'nav.back': 'กลับ',
    'nav.categories': 'หมวดหมู่',
    'nav.products': 'สินค้า',
    'nav.personal': 'ส่วนตัว',
    'nav.admin': 'ผู้ดูแลระบบ',
    'nav.first.page': 'หน้าแรก',
    'nav.history': 'ประวัติ',
    'nav.support': 'ฝ่ายสนับสนุน',
    'nav.my.page': 'หน้าของฉัน',
    
    // Common actions
    'common.loading': 'กำลังโหลด...',
    'common.withdraw': 'ถอนเงิน',
    'common.topup': 'เติมเงิน',
    'common.logout': 'ออกจากระบบ',
    'common.logout.success': 'ออกจากระบบเรียบร้อยแล้ว',
    'common.logout.message': 'พบกันใหม่!',
    'common.error': 'เกิดข้อผิดพลาด',
    'common.logout.error': 'ไม่สามารถออกจากระบบได้',
    'common.save': 'บันทึก',
    'common.cancel': 'ยกเลิก',
    'common.edit': 'แก้ไข',
    'common.delete': 'ลบ',
    'common.confirm': 'ยืนยัน',
    
    // Profile page
    'profile.grand.commission': 'คอมมิชชันรวม',
    'profile.available.assets': 'สินทรัพย์ที่ใช้ได้',
    'profile.invitation.code': 'รหัสเชิญ',
    'profile.delivery.info': 'ข้อมูลการจัดส่ง',
    'profile.bank.linking': 'เชื่อมต่อธนาคาร',
    'profile.deposit.history': 'ประวัติการฝากเงิน',
    'profile.withdraw.history': 'ประวัติการถอนเงิน',
    'profile.vip.levels': 'ระดับ VIP',
    'profile.group.report': 'รายงานกลุ่ม',
    'profile.about.us': 'เกี่ยวกับเรา',
    
    // Language page
    'language.title': 'ภาษา',
    'language.current': 'ภาษาปัจจุบัน',
    'language.select': 'เลือกภาษา',
    'language.info': 'ข้อมูล',
    'language.reset': 'รีเซ็ตเป็นภาษาไทย',
    'language.note.title': 'หมายเหตุเกี่ยวกับภาษา',
    'language.note.content': 'การเปลี่ยนภาษาจะใช้กับแอปพลิเคชันทั้งหมด',
    'language.support.title': 'การสนับสนุนหลายภาษา',
    'language.support.content': 'เรากำลังอัปเดตและปรับปรุงการสนับสนุนภาษาอย่างต่อเนื่อง หากคุณพบข้อผิดพลาดในการแปล โปรดติดต่อฝ่ายสนับสนุน',
    'language.changed': 'เปลี่ยนภาษาเรียบร้อยแล้ว',
    'language.changed.desc': 'เปลี่ยนเป็น',
    
    // VIP Info
    'vip.title': 'ข้อมูล VIP',
    'vip.current.level': 'ระดับปัจจุบัน',
    'vip.benefits.current': 'สิทธิประโยชน์ปัจจุบัน',
    'vip.progress': 'ความคืบหน้าสู่ VIP',
    'vip.all.levels': 'ระดับ VIP ทั้งหมด',
    'vip.orders.completed': 'คำสั่งซื้อที่เสร็จสิ้น',
    'vip.total.spent': 'ใช้จ่ายทั้งหมด',
    'vip.orders.needed': 'คำสั่งซื้อเพิ่มเติม',
    'vip.spending.needed': 'การใช้จ่ายเพิ่มเติม',
    'vip.commission': 'คอมมิชชัน',
    'vip.support': 'การสนับสนุนลูกค้า',
    'vip.priority.support': 'การสนับสนุนลำดับความสำคัญ',
    'vip.premium.gifts': 'ของขวัญพรีเมียม',
    'vip.dedicated.manager': 'ผู้จัดการเฉพาะ',
    'vip.premium.service': 'บริการพรีเมียม',
    'vip.current.badge': 'ปัจจุบัน',
    'vip.achieved.badge': 'บรรลุแล้ว',
     'vip.per.day': 'คำสั่งซื้อต่อวัน',
     'vip.min.balance': 'ยอดเงินขั้นต่ำ',
     'vip.max.orders': 'คำสั่งซื้อสูงสุด',
    
    // Hero section
    'hero.welcome': 'ยินดีต้อนรับสู่ LUXURY MARKETPLACE - จุดหมายปลายทางอันดับหนึ่งสำหรับการช้อปปิ้งระดับไฮเอนด์',
    'hero.exclusive': 'สิทธิพิเศษเฉพาะสำหรับสมาชิก VIP',
    'hero.shipping': 'จัดส่งฟรีทั่วประเทศ',
    'hero.authentic': 'รับประกันสินค้าแท้ 100%',
    
    // Purchase History
    'history.login.required': 'กรุณาเข้าสู่ระบบเพื่อดูประวัติการซื้อ',
    'history.load.error': 'ไม่สามารถโหลดประวัติการซื้อได้',
    'history.status.completed': 'เสร็จสิ้น',
    'history.status.pending': 'กำลังดำเนินการ',
    'history.status.cancelled': 'ยกเลิกแล้ว',
    'history.total.orders': 'คำสั่งซื้อทั้งหมด',
    'history.total.spent': 'ใช้จ่ายทั้งหมด',
    'history.total.profit': 'กำไรรวม',
    'history.no.orders': 'ยังไม่มีคำสั่งซื้อ',
    'history.quantity': 'จำนวน',
    'history.price': 'ราคา',
    'history.profit': 'กำไร',
    'language.global.applied': 'นำไปใช้ทั่วทั้งเว็บไซต์แล้ว',
    
    // Services
    'services.topup': 'เติมเงิน',
    'services.topup.desc': 'เติมเงินเข้าบัญชี',
    'services.withdraw': 'ถอนเงิน',
    'services.withdraw.desc': 'ถอนเงินจากบัญชี',
    'services.order.rules': 'กฎการสั่งซื้อ',
    'services.order.rules.desc': 'กฎการสั่งซื้อ',
    'services.platform.intro': 'แนะนำแพลตฟอร์ม',
    'services.platform.intro.desc': 'แนะนำแพลตฟอร์ม',
    
    // Products
    'products.recommended.title': 'สินค้าแนะนำ',
    'products.recommended.subtitle': 'คอลเลกชันพรีเมียมที่คัดสรรสำหรับลูกค้าที่จำเพาะ',
    'products.add.cart': 'เพิ่มในตะกร้า',
    'products.view': 'ดู',
    
    // VIP Levels component
    'vip.membership.levels': 'ระดับสมาชิก VIP',
    'vip.unlock.benefits': 'ปลดล็อคสิทธิประโยชน์พิเศษและคอมมิชชันที่สูงขึ้น',
    
    // VIP Levels Page
    'vip.page.subtitle': 'สำรวจระดับ VIP และข้อเสนอพิเศษ',
    'vip.benefits.title': 'สิทธิประโยชน์ VIP',
    'vip.benefits.high.commission': 'คอมมิชชันสูง',
    'vip.benefits.high.commission.desc': 'รับอัตราคอมมิชชันที่สูงขึ้นเมื่ออัปเกรด VIP',
    'vip.benefits.priority.support': 'การสนับสนุนลำดับความสำคัญ',
    'vip.benefits.priority.support.desc': 'รับการสนับสนุนลำดับความสำคัญจากทีมบริการลูกค้า',
    'vip.benefits.exclusive.products': 'สินค้าเฉพาะ',
    'vip.benefits.exclusive.products.desc': 'เข้าถึงสินค้าและบริการเฉพาะสำหรับ VIP',
    
    // Group Report
    'group.report.title': 'รายงานกลุ่ม',
    'group.report.total.members': 'สมาชิกทั้งหมด',
    'group.report.direct.members': 'สมาชิกโดยตรง',
    'group.report.total.commission': 'คอมมิชชันรวม',
    'group.report.monthly.commission': 'เดือนนี้',
    'group.report.team.list': 'รายชื่อทีม',
    'group.report.direct': 'โดยตรง',
    'group.report.total': 'รวม',
    'group.report.no.invites': 'ยังไม่มีผู้ใช้ที่เชิญ',
    'group.report.no.invites.desc': 'แชร์รหัสเชิญของคุณเพื่อเริ่มสร้างทีม',
    'group.report.join.date': 'เข้าร่วม',
    'group.report.orders': 'คำสั่งซื้อ',
    'group.report.invitation.info': 'ข้อมูลการเชิญ',
    'group.report.commission.structure': 'โครงสร้างคอมมิชชัน',
    'group.report.commission.level1': 'ระดับ 1 (โดยตรง): คอมมิชชัน 20%',
    'group.report.commission.level2': 'ระดับ 2: คอมมิชชัน 10%',
    'group.report.commission.level3': 'ระดับ 3: คอมมิชชัน 5%',
    'group.report.team.tips': 'เคล็ดลับการสร้างทีม',
    'group.report.tip1': 'แชร์รหัสเชิญบนโซเชียลมีเดีย',
    'group.report.tip2': 'แนะนำสมาชิกใหม่ให้ใช้แพลตฟอร์ม',
    'group.report.tip3': 'รักษาความกระตือรือร้นเพื่อเพิ่มความน่าเชื่อถือ',
    
    // Page titles
    'page.title.auth': 'เข้าสู่ระบบ',
    'page.title.profile': 'โปรไฟล์',
    'page.title.topup': 'เติมเงิน',
    'page.title.withdraw': 'ถอน',
    'page.title.order.rules': 'กฎการสั่งซื้อ',
    'page.title.platform.intro': 'แนะนำแพลตฟอร์ม',
    'page.title.about.us': 'เกี่ยวกับเรา',
    'page.title.delivery.info': 'ข้อมูลการจัดส่ง',
    'page.title.bank.linking': 'การเชื่อมโยงธนาคาร',
    'page.title.task.center': 'ศูนย์งาน',
    'page.title.vip.info': 'ข้อมูล VIP',
    'page.title.group.report': 'รายงานกลุ่ม',
    'page.title.language': 'ภาษา',
    'page.title.purchase.history': 'ประวัติการซื้อ',
    'page.title.vip.levels': 'ระดับ VIP',
    'page.title.withdrawal.history': 'ประวัติการถอน',
    'page.title.not.found': 'ไม่พบ'
  },
  ko: {
    // Navigation
    'nav.home': '홈',
    'nav.profile': '프로필',
    'nav.vip': 'VIP 정보',
    'nav.language': '언어',
    'nav.back': '뒤로',
    'nav.categories': '카테고리',
    'nav.products': '상품',
    'nav.personal': '개인',
    'nav.admin': '관리자',
    'nav.first.page': '홈',
    'nav.history': '이력',
    'nav.support': '지원',
    'nav.my.page': '내 페이지',
    
    // Common actions
    'common.loading': '로딩 중...',
    'common.withdraw': '출금',
    'common.topup': '충전',
    'common.logout': '로그아웃',
    'common.logout.success': '로그아웃되었습니다',
    'common.logout.message': '다시 만나요!',
    'common.error': '오류',
    'common.logout.error': '로그아웃할 수 없습니다',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.edit': '편집',
    'common.delete': '삭제',
    'common.confirm': '확인',
    
    // Profile page
    'profile.grand.commission': '총 수수료',
    'profile.available.assets': '사용 가능한 자산',
    'profile.invitation.code': '초대 코드',
    'profile.delivery.info': '배송 정보',
    'profile.bank.linking': '은행 연결',
    'profile.deposit.history': '입금 내역',
    'profile.withdraw.history': '출금 내역',
    'profile.vip.levels': 'VIP 레벨',
    'profile.group.report': '그룹 보고서',
    'profile.about.us': '회사 소개',
    
    // Language page
    'language.title': '언어',
    'language.current': '현재 언어',
    'language.select': '언어 선택',
    'language.info': '정보',
    'language.reset': '한국어로 재설정',
    'language.note.title': '언어 참고사항',
    'language.note.content': '언어 변경은 전체 애플리케이션에 적용됩니다',
    'language.support.title': '다국어 지원',
    'language.support.content': '언어 지원을 지속적으로 업데이트하고 개선하고 있습니다. 번역 오류를 발견하시면 고객지원팀에 문의해 주세요.',
    'language.changed': '언어 변경 성공',
    'language.changed.desc': '다음으로 전환됨',
    
    // VIP Info
    'vip.title': 'VIP 정보',
    'vip.current.level': '현재 레벨',
    'vip.benefits.current': '현재 혜택',
    'vip.progress': 'VIP 진행률',
    'vip.all.levels': '모든 VIP 레벨',
    'vip.orders.completed': '완료된 주문',
    'vip.total.spent': '총 지출',
    'vip.orders.needed': '더 많은 주문',
    'vip.spending.needed': '더 많은 지출',
    'vip.commission': '수수료',
    'vip.support': '고객 지원',
    'vip.priority.support': '우선 지원',
    'vip.premium.gifts': '프리미엄 선물',
    'vip.dedicated.manager': '전담 매니저',
    'vip.premium.service': '프리미엄 서비스',
    'vip.current.badge': '현재',
    'vip.achieved.badge': '달성',
     'vip.per.day': '일일 주문',
     'vip.min.balance': '최소 잔액',
     'vip.max.orders': '최대 주문',
    
    // Hero section
    'hero.welcome': '럭셔리 마켓플레이스에 오신 것을 환영합니다 - 고급 쇼핑의 최고 목적지',
    'hero.exclusive': 'VIP 회원을 위한 독점 특권',
    'hero.shipping': '전국 무료 배송',
    'hero.authentic': '100% 정품 보장',
    
    // Purchase History
    'history.login.required': '구매 내역을 보려면 로그인하세요',
    'history.load.error': '구매 내역을 불러올 수 없습니다',
    'history.status.completed': '완료',
    'history.status.pending': '처리 중',
    'history.status.cancelled': '취소됨',
    'history.total.orders': '총 주문',
    'history.total.spent': '총 지출',
    'history.total.profit': '총 이익',
    'history.no.orders': '아직 주문이 없습니다',
    'history.quantity': '수량',
    'history.price': '가격',
    'history.profit': '이익',
    'language.global.applied': '전체 웹사이트에 전역으로 적용됨',
    
    // Services
    'services.topup': '충전',
    'services.topup.desc': '잔액 충전',
    'services.withdraw': '출금',
    'services.withdraw.desc': '자금 출금',
    'services.order.rules': '주문 규칙',
    'services.order.rules.desc': '주문 규칙',
    'services.platform.intro': '플랫폼 소개',
    'services.platform.intro.desc': '플랫폼 소개',
    
    // Products
    'products.recommended.title': '추천 상품',
    'products.recommended.subtitle': '까다로운 고객을 위한 엄선된 프리미엄 컬렉션',
    'products.add.cart': '장바구니에 추가',
    'products.view': '보기',
    
    // VIP Levels component
    'vip.membership.levels': 'VIP 멤버십 레벨',
    'vip.unlock.benefits': '독점 혜택과 더 높은 수수료를 잠금 해제',
    
    // VIP Levels Page
    'vip.page.subtitle': 'VIP 레벨과 특별 혜택 탐색',
    'vip.benefits.title': 'VIP 혜택',
    'vip.benefits.high.commission': '높은 수수료',
    'vip.benefits.high.commission.desc': 'VIP 업그레이드 시 더 높은 수수료율 받기',
    'vip.benefits.priority.support': '우선 지원',
    'vip.benefits.priority.support.desc': '고객 서비스 팀으로부터 우선 지원 받기',
    'vip.benefits.exclusive.products': '독점 상품',
    'vip.benefits.exclusive.products.desc': 'VIP 전용 상품 및 서비스 이용',
    
    // Group Report
    'group.report.title': '그룹 보고서',
    'group.report.total.members': '총 회원',
    'group.report.direct.members': '직접 회원',
    'group.report.total.commission': '총 수수료',
    'group.report.monthly.commission': '이번 달',
    'group.report.team.list': '팀 목록',
    'group.report.direct': '직접',
    'group.report.total': '총계',
    'group.report.no.invites': '아직 초대된 사용자가 없습니다',
    'group.report.no.invites.desc': '초대 코드를 공유하여 팀 구축을 시작하세요',
    'group.report.join.date': '가입',
    'group.report.orders': '주문',
    'group.report.invitation.info': '초대 정보',
    'group.report.commission.structure': '수수료 구조',
    'group.report.commission.level1': '레벨 1 (직접): 20% 수수료',
    'group.report.commission.level2': '레벨 2: 10% 수수료',
    'group.report.commission.level3': '레벨 3: 5% 수수료',
    'group.report.team.tips': '팀 구축 팁',
    'group.report.tip1': '소셜 미디어에서 초대 코드 공유',
    'group.report.tip2': '새 회원에게 플랫폼 사용법 안내',
    'group.report.tip3': '신뢰도를 높이기 위해 활발히 활동',
    
    // Page titles
    'page.title.auth': '로그인',
    'page.title.profile': '프로필',
    'page.title.topup': '충전',
    'page.title.withdraw': '출금',
    'page.title.order.rules': '주문 규칙',
    'page.title.platform.intro': '플랫폼 소개',
    'page.title.about.us': '회사 소개',
    'page.title.delivery.info': '배송 정보',
    'page.title.bank.linking': '은행 연결',
    'page.title.task.center': '작업 센터',
    'page.title.vip.info': 'VIP 정보',
    'page.title.group.report': '그룹 보고서',
    'page.title.language': '언어',
    'page.title.purchase.history': '구매 내역',
    'page.title.vip.levels': 'VIP 레벨',
    'page.title.withdrawal.history': '출금 내역',
    'page.title.not.found': '찾을 수 없음'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to English
    const savedLanguage = localStorage.getItem('preferred-language');
    return languages.find(lang => lang.code === savedLanguage) || languages[0]; // English is first
  });
  
  // Force re-render key to ensure all components update
  const [renderKey, setRenderKey] = useState(0);

  const setLanguage = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('preferred-language', languageCode);
      // Force re-render of all components
      setRenderKey(prev => prev + 1);
      
      // Dispatch custom event for global language change
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language, code: languageCode } 
      }));
    }
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  useEffect(() => {
    // Update document language attribute
    document.documentElement.lang = currentLanguage.code;
  }, [currentLanguage]);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }} key={renderKey}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    // Instead of throwing an error immediately, provide a fallback
    console.warn('useLanguage must be used within a LanguageProvider. Using fallback values.');
    return {
      currentLanguage: languages[0], // Default to English
      setLanguage: () => {}, // No-op function
      t: (key: string) => key // Return the key as fallback
    };
  }
  return context;
}