import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Clock, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
const QuyTacDatHang = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();
  const rules = [{
    icon: FileText,
    title: t('order.rules.order.title'),
    content: [t('order.rules.order.1'), t('order.rules.order.2'), t('order.rules.order.3'), t('order.rules.order.4')]
  }, {
    icon: CreditCard,
    title: t('order.rules.payment.title'),
    content: [t('order.rules.payment.1'), t('order.rules.payment.2'), t('order.rules.payment.3'), t('order.rules.payment.4')]
  }, {
    icon: Clock,
    title: t('order.rules.processing.title'),
    content: [t('order.rules.processing.1'), t('order.rules.processing.2'), t('order.rules.processing.3'), t('order.rules.processing.4')]
  }, {
    icon: Truck,
    title: t('order.rules.delivery.title'),
    content: [t('order.rules.delivery.1'), t('order.rules.delivery.2'), t('order.rules.delivery.3'), t('order.rules.delivery.4')]
  }];
  return <div className="min-h-screen bg-background font-crimson">
      {/* Header */}
      <div className="bg-secondary/30 p-4 border-b border-primary/20">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="font-playfair">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('order.rules.back')}
          </Button>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="font-playfair font-bold text-foreground tracking-wide text-xl">{t('order.rules.title')}</h2>
          <div className="w-32 h-0.5 bg-primary mx-auto"></div>
          <p className="text-muted-foreground font-crimson italic text-lg max-w-3xl mx-auto">
            {t('order.rules.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rules.map((rule, index) => {
          const Icon = rule.icon;
          return <Card key={index} className="shadow-classic border border-border/30 hover:border-primary/30 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gradient-copper rounded-full flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-playfair tracking-wide">{rule.title}</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3">
                    {rule.content.map((item, itemIndex) => <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <span className="font-crimson text-sm leading-relaxed">{item}</span>
                      </li>)}
                  </ul>
                </CardContent>
              </Card>;
        })}
        </div>

        {/* Contact Information */}
        <Card className="shadow-classic border border-border/30 bg-gradient-elegant">
          
          
          
        </Card>
      </div>
    </div>;
};
export default QuyTacDatHang;