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
  { code: "hi", name: "Hindi", nativeName: "हिंदी", flag: "🇮🇳" },
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
    'vip.min.balance': 'minimum balance'
  },
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.profile': '个人资料',
    'nav.vip': 'VIP信息',
    'nav.language': '语言',
    'nav.back': '返回',
    
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
    'vip.min.balance': '最低余额'
  },
  hi: {
    // Navigation
    'nav.home': 'होम',
    'nav.profile': 'प्रोफाइल',
    'nav.vip': 'VIP जानकारी',
    'nav.language': 'भाषा',
    'nav.back': 'वापस',
    
    // Language page
    'language.title': 'भाषा',
    'language.current': 'वर्तमान भाषा',
    'language.select': 'भाषा चुनें',
    'language.info': 'जानकारी',
    'language.reset': 'हिंदी में रीसेट करें',
    'language.note.title': 'भाषा नोट',
    'language.note.content': 'भाषा परिवर्तन पूरे एप्लिकेशन पर लागू होगा',
    'language.support.title': 'बहुभाषी समर्थन',
    'language.support.content': 'हम निरंतर भाषा समर्थन को अपडेट और सुधार रहे हैं। यदि आप अनुवाद त्रुटियां पाते हैं, तो कृपया सहायता से संपर्क करें।',
    'language.changed': 'भाषा सफलतापूर्वक बदली गई',
    'language.changed.desc': 'स्विच किया गया',
    
    // VIP Info
    'vip.title': 'VIP जानकारी',
    'vip.current.level': 'वर्तमान स्तर',
    'vip.benefits.current': 'वर्तमान लाभ',
    'vip.progress': 'VIP तक प्रगति',
    'vip.all.levels': 'सभी VIP स्तर',
    'vip.orders.completed': 'पूर्ण आदेश',
    'vip.total.spent': 'कुल खर्च',
    'vip.orders.needed': 'और आदेश',
    'vip.spending.needed': 'और खर्च',
    'vip.commission': 'कमीशन',
    'vip.support': 'ग्राहक सहायता',
    'vip.priority.support': 'प्राथमिकता सहायता',
    'vip.premium.gifts': 'प्रीमियम उपहार',
    'vip.dedicated.manager': 'समर्पित प्रबंधक',
    'vip.premium.service': 'प्रीमियम सेवा',
    'vip.current.badge': 'वर्तमान',
    'vip.achieved.badge': 'प्राप्त',
    'vip.per.day': 'प्रति दिन आदेश',
    'vip.min.balance': 'न्यूनतम शेष'
  },
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.profile': 'プロフィール',
    'nav.vip': 'VIP情報',
    'nav.language': '言語',
    'nav.back': '戻る',
    
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
    'vip.min.balance': '最小残高'
  },
  pt: {
    // Navigation
    'nav.home': 'Início',
    'nav.profile': 'Perfil',
    'nav.vip': 'Informações VIP',
    'nav.language': 'Idioma',
    'nav.back': 'Voltar',
    
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
    'vip.min.balance': 'saldo mínimo'
  },
  vi: {
    // Navigation
    'nav.home': 'Trang chủ',
    'nav.profile': 'Hồ sơ',
    'nav.vip': 'Thông tin VIP',
    'nav.language': 'Ngôn ngữ',
    'nav.back': 'Quay lại',
    
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
    'vip.min.balance': 'số dư tối thiểu'
  },
  th: {
    // Navigation
    'nav.home': 'หน้าแรก',
    'nav.profile': 'โปรไฟล์',
    'nav.vip': 'ข้อมูล VIP',
    'nav.language': 'ภาษา',
    'nav.back': 'กลับ',
    
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
    'vip.min.balance': 'ยอดเงินขั้นต่ำ'
  },
  ko: {
    // Navigation
    'nav.home': '홈',
    'nav.profile': '프로필',
    'nav.vip': 'VIP 정보',
    'nav.language': '언어',
    'nav.back': '뒤로',
    
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
    'vip.min.balance': '최소 잔액'
  }
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(() => {
    // Get saved language from localStorage or default to English
    const savedLanguage = localStorage.getItem('preferred-language');
    return languages.find(lang => lang.code === savedLanguage) || languages[0]; // English is first
  });

  const setLanguage = (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);
    if (language) {
      setCurrentLanguage(language);
      localStorage.setItem('preferred-language', languageCode);
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
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, t }}>
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