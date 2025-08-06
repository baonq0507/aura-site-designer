import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Crown, Shield, Truck, Users, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
const GioiThieuNenTang = () => {
  const navigate = useNavigate();
  const features = [{
    icon: Crown,
    title: "Thương hiệu cao cấp",
    description: "Tuyển chọn các thương hiệu thời trang hàng đầu thế giới"
  }, {
    icon: Shield,
    title: "Bảo mật tuyệt đối",
    description: "Công nghệ bảo mật hiện đại, bảo vệ thông tin khách hàng"
  }, {
    icon: Truck,
    title: "Giao hàng nhanh chóng",
    description: "Mạng lưới vận chuyển toàn cầu, giao hàng trong 24-48h"
  }, {
    icon: Users,
    title: "Dịch vụ cá nhân hóa",
    description: "Tư vấn thời trang chuyên nghiệp từ các chuyên gia"
  }, {
    icon: Award,
    title: "Chất lượng đảm bảo",
    description: "100% sản phẩm chính hãng, có chứng nhận xác thực"
  }, {
    icon: Globe,
    title: "Kết nối toàn cầu",
    description: "Liên kết với hơn 1000 nhà thiết kế và thương hiệu quốc tế"
  }];
  const stats = [{
    number: "10M+",
    label: "Khách hàng tin tưởng"
  }, {
    number: "1000+",
    label: "Thương hiệu đối tác"
  }, {
    number: "50+",
    label: "Quốc gia phục vụ"
  }, {
    number: "99.9%",
    label: "Tỷ lệ hài lòng"
  }];
  return <div className="min-h-screen bg-background font-crimson">
      {/* Header */}
      <div className="bg-secondary/30 p-4 border-b border-primary/20">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="font-playfair">
            <ArrowLeft className="w-4 h-4 mr-2" />
            QUAY LẠI
          </Button>
          <h1 className="text-2xl font-playfair font-bold text-foreground tracking-wide">
            GIỚI THIỆU NỀN TẢNG
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-foreground tracking-wide">
            FARFETCH
          </h2>
          <div className="w-32 h-0.5 bg-primary mx-auto"></div>
          <p className="text-xl font-crimson italic text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Nền tảng thời trang cao cấp hàng đầu, kết nối những thương hiệu danh tiếng nhất thế giới 
            với những khách hàng có gu thẩm mỹ tinh tế tại Việt Nam
          </p>
        </div>

        {/* About Section */}
        

        {/* Features Grid */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-playfair font-bold text-foreground tracking-wide">
              TẠI SAO CHỌN FARFETCH?
            </h3>
            <div className="w-24 h-0.5 bg-primary mx-auto mt-4"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
            const Icon = feature.icon;
            return <Card key={index} className="shadow-classic border border-border/30 hover:border-primary/30 transition-all duration-300 text-center">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-gradient-copper rounded-full flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <h4 className="text-lg font-playfair font-semibold tracking-wide">{feature.title}</h4>
                    <p className="font-crimson text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>;
          })}
          </div>
        </div>

        {/* Stats Section */}
        <Card className="shadow-classic border border-border/30 bg-gradient-elegant">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-playfair font-bold text-foreground tracking-wide">
                CON SỐ ẤN TƯỢNG
              </h3>
              <div className="w-24 h-0.5 bg-primary mx-auto mt-4"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-playfair font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="font-crimson text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>)}
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="shadow-classic border border-border/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-playfair tracking-wide">LIÊN HỆ VỚI CHÚNG TÔI</CardTitle>
            <CardDescription className="font-crimson italic">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-playfair font-semibold text-lg">Trụ sở chính</h4>
                <p className="font-crimson">
                  Tầng 25, Tòa nhà Landmark 81<br />
                  208 Nguyễn Hữu Cảnh, Bình Thạnh<br />
                  TP. Hồ Chí Minh, Việt Nam
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-playfair font-semibold text-lg">Thông tin liên hệ</h4>
                <div className="space-y-2">
                  <p className="font-crimson">Hotline: 1900-1234</p>
                  <p className="font-crimson">Email: hello@farfetch.vn</p>
                  <p className="font-crimson">Website: www.farfetch.vn</p>
                </div>
              </div>
            </div>
            
            <Button variant="copper" size="lg" className="font-playfair font-semibold tracking-wide shadow-classic-hover">
              BẮT ĐẦU MUA SẮM
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default GioiThieuNenTang;