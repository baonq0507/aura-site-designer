import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { useLanguage, languages } from "@/contexts/LanguageContext";

const Language = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentLanguage, setLanguage, t } = useLanguage();

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
    
    const language = languages.find(lang => lang.code === languageCode);
    
    // Show success message with emphasis on global change
    toast({
      title: t('language.changed'),
      description: `${t('language.changed.desc')} ${language?.nativeName}. ${t('language.global.applied')}`,
      duration: 3000,
    });
    
    // Small delay to ensure all components have updated
    setTimeout(() => {
      // Force a complete page refresh if needed (as backup)
      if (document.readyState === 'complete') {
        console.log('Language changed globally to:', language?.nativeName);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">{t('language.title')}</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>{t('language.current')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
              <span className="text-2xl">{currentLanguage.flag}</span>
              <div>
                <div className="font-semibold">{currentLanguage.nativeName}</div>
                <div className="text-sm text-muted-foreground">{currentLanguage.name}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle>{t('language.select')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    currentLanguage.code === language.code
                      ? 'border-primary bg-primary/5'
                      : 'border-muted hover:bg-muted/50'
                  }`}
                  onClick={() => handleLanguageChange(language.code)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <div className="font-medium">{language.nativeName}</div>
                      <div className="text-sm text-muted-foreground">{language.name}</div>
                    </div>
                  </div>
                  {currentLanguage.code === language.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language Info */}
        <Card>
          <CardHeader>
            <CardTitle>{t('language.info')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-1">{t('language.note.title')}</h4>
                <p className="text-blue-700">{t('language.note.content')}</p>
              </div>
              
              <div className="p-3 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-1">{t('language.support.title')}</h4>
                <p className="text-amber-700">{t('language.support.content')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset to Default */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => handleLanguageChange("en")}
            >
              {t('language.reset')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Language;