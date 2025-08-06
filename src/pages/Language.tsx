import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Check, Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const Language = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedLanguage, setSelectedLanguage] = useState("vi");

  const languages: Language[] = [
    { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
    { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
    { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
    { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
    { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
    { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" }
  ];

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    
    // In a real app, you would implement i18n here
    // For now, just show a toast message
    const language = languages.find(lang => lang.code === languageCode);
    
    toast({
      title: "Thay đổi ngôn ngữ thành công",
      description: `Đã chuyển sang ${language?.nativeName}`
    });

    // Store language preference
    localStorage.setItem('preferred-language', languageCode);
  };

  const getCurrentLanguage = () => {
    return languages.find(lang => lang.code === selectedLanguage);
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
          <h1 className="text-lg font-semibold">Ngôn ngữ</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Current Language */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5" />
              <span>Ngôn ngữ hiện tại</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg">
              <span className="text-2xl">{getCurrentLanguage()?.flag}</span>
              <div>
                <div className="font-semibold">{getCurrentLanguage()?.nativeName}</div>
                <div className="text-sm text-muted-foreground">{getCurrentLanguage()?.name}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Chọn ngôn ngữ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedLanguage === language.code
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
                  {selectedLanguage === language.code && (
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
            <CardTitle>Thông tin</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-1">Lưu ý về ngôn ngữ</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• Thay đổi ngôn ngữ sẽ áp dụng cho toàn bộ ứng dụng</li>
                  <li>• Một số nội dung có thể chưa được dịch hoàn toàn</li>
                  <li>• Cài đặt sẽ được lưu tự động</li>
                </ul>
              </div>
              
              <div className="p-3 bg-amber-50 rounded-lg">
                <h4 className="font-semibold text-amber-800 mb-1">Hỗ trợ đa ngôn ngữ</h4>
                <p className="text-amber-700">
                  Chúng tôi đang liên tục cập nhật và cải thiện việc hỗ trợ các ngôn ngữ. 
                  Nếu bạn phát hiện lỗi dịch, vui lòng liên hệ bộ phận hỗ trợ.
                </p>
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
              onClick={() => handleLanguageChange("vi")}
            >
              Đặt lại về tiếng Việt
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Language;