import VIPLevels from "@/components/VIPLevels";
import { useLanguage } from "@/contexts/LanguageContext";

const VipLevelsPage = () => {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-secondary/30 p-4 border-b border-primary/20">
        <div className="max-w-6xl mx-auto">
           <h1 className="text-2xl font-playfair font-bold text-foreground tracking-wide text-center">
             {t('vip.membership.levels')}
           </h1>
           <p className="text-center text-muted-foreground mt-2">
             {t('vip.page.subtitle')}
           </p>
         </div>
       </div>

       {/* Main Content */}
       <div className="max-w-6xl mx-auto px-4 py-6">
         <VIPLevels />
         
         {/* Additional VIP Benefits Section */}
         <div className="mt-8 space-y-6">
           <div className="text-center">
             <h2 className="text-xl font-playfair font-bold text-foreground mb-4">
               {t('vip.benefits.title')}
             </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             <div className="bg-white dark:bg-card rounded-lg p-4 shadow-elegant border border-border">
               <h3 className="font-semibold text-foreground mb-2">{t('vip.benefits.high.commission')}</h3>
               <p className="text-sm text-muted-foreground">
                 {t('vip.benefits.high.commission.desc')}
               </p>
             </div>
             
             <div className="bg-white dark:bg-card rounded-lg p-4 shadow-elegant border border-border">
               <h3 className="font-semibold text-foreground mb-2">{t('vip.benefits.priority.support')}</h3>
               <p className="text-sm text-muted-foreground">
                 {t('vip.benefits.priority.support.desc')}
               </p>
             </div>
             
             <div className="bg-white dark:bg-card rounded-lg p-4 shadow-elegant border border-border">
               <h3 className="font-semibold text-foreground mb-2">{t('vip.benefits.exclusive.products')}</h3>
               <p className="text-sm text-muted-foreground">
                 {t('vip.benefits.exclusive.products.desc')}
               </p>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default VipLevelsPage;