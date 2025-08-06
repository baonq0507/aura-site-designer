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
     
     // VIP Levels component
     'vip.membership.levels': 'VIP MEMBERSHIP LEVELS',
     'vip.unlock.benefits': 'Unlock exclusive benefits and higher commissions'
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
     
     // VIP Levels component
     'vip.membership.levels': 'VIP 会员等级',
     'vip.unlock.benefits': '解锁专享权益和更高佣金'
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
     
     // VIP Levels component
     'vip.membership.levels': 'VIP メンバーシップレベル',
     'vip.unlock.benefits': '限定特典と高いコミッションをアンロック'
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
    
    // VIP Levels component
    'vip.membership.levels': 'NÍVEIS DE ASSOCIAÇÃO VIP',
    'vip.unlock.benefits': 'Desbloqueie benefícios exclusivos e comissões mais altas'
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
    
    // VIP Levels component
    'vip.membership.levels': 'CẤP ĐỘ THÀNH VIÊN VIP',
    'vip.unlock.benefits': 'Mở khóa quyền lợi độc quyền và hoa hồng cao hơn'
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
    
    // VIP Levels component
    'vip.membership.levels': 'ระดับสมาชิก VIP',
    'vip.unlock.benefits': 'ปลดล็อคสิทธิประโยชน์พิเศษและคอมมิชชันที่สูงขึ้น'
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
    
    // VIP Levels component
    'vip.membership.levels': 'VIP 멤버십 레벨',
    'vip.unlock.benefits': '독점 혜택과 더 높은 수수료를 잠금 해제'
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
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}