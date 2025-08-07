import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Crown, Shield, Truck, Users, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const GioiThieuNenTang = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: Crown,
      title: "Thương hiệu cao cấp",
      description: "Tuyển chọn các thương hiệu thời trang hàng đầu thế giới"
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description: "Công nghệ bảo mật hiện đại, bảo vệ thông tin khách hàng"
    },
    {
      icon: Truck,
      title: "Giao hàng nhanh chóng",
      description: "Mạng lưới vận chuyển toàn cầu, giao hàng trong 24-48h"
    },
    {
      icon: Users,
      title: "Dịch vụ cá nhân hóa",
      description: "Tư vấn thời trang chuyên nghiệp từ các chuyên gia"
    },
    {
      icon: Award,
      title: "Chất lượng đảm bảo",
      description: "100% sản phẩm chính hãng, có chứng nhận xác thực"
    },
    {
      icon: Globe,
      title: "Kết nối toàn cầu",
      description: "Liên kết với hơn 1000 nhà thiết kế và thương hiệu quốc tế"
    }
  ];

  const stats = [
    { number: "10M+", label: "Khách hàng tin tưởng" },
    { number: "1000+", label: "Thương hiệu đối tác" },
    { number: "50+", label: "Quốc gia phục vụ" },
    { number: "99.9%", label: "Tỷ lệ hài lòng" }
  ];

  return (
    <div className="min-h-screen bg-background font-crimson">
      {/* Header */}
      <div className="bg-secondary/30 p-4 border-b border-primary/20">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/")}
            className="font-playfair"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            QUAY LẠI
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-2 py-6 space-y-8">
        {/* Mall Header Section */}
        <div className="w-full">
          <div className="relative w-full overflow-hidden">
            <img 
              src="/lovable-uploads/a75c1119-cde0-4fd2-ae50-79911797cef0.png" 
              alt="Farfetch at New York Stock Exchange"
              className="w-full h-64 md:h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </div>

        {/* Platform Introduction */}
        <Card className="shadow-classic border border-border/30">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-playfair font-bold">{t('platform.intro.title').toUpperCase()}</h3>
                <div className="w-24 h-0.5 bg-primary mx-auto"></div>
              </div>
              
              <div className="space-y-4 font-crimson text-sm leading-relaxed">
                <p>{t('platform.intro.paragraph1')}</p>
                <p>{t('platform.intro.paragraph2')}</p>
                <p>{t('platform.intro.paragraph3')}</p>
                <p>{t('platform.intro.paragraph4')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* US Offices */}
        <Card className="shadow-classic border border-border/30">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-playfair font-bold">{t('platform.intro.us.offices.title').toUpperCase()}</h3>
                <div className="w-24 h-0.5 bg-primary mx-auto"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-playfair font-semibold text-primary">{t('platform.intro.los.angeles')}</h4>
                  <div className="space-y-2 font-crimson text-sm">
                    <p className="font-medium">{t('platform.intro.los.angeles.subtitle')}</p>
                    <p><span className="font-medium">{t('platform.intro.legal.entity')}:</span> Farfetch.com US LLC</p>
                    <p><span className="font-medium">{t('platform.intro.address')}:</span> 700 South Flower Street, Suite 3000, Los Angeles, CA 90017, USA</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-playfair font-semibold text-primary">{t('platform.intro.new.york')}</h4>
                  <div className="space-y-2 font-crimson text-sm">
                    <p><span className="font-medium">{t('platform.intro.office.location')}:</span> Tầng 6, tòa nhà 30 West 21st Street, New York, NY 10010, Hoa Kỳ</p>
                    <p className="text-xs text-muted-foreground">{t('platform.intro.near.landmarks')}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>



      </div>
    </div>
  );
};

export default GioiThieuNenTang;