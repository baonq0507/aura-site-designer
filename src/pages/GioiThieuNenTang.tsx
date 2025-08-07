import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Crown, Shield, Truck, Users, Award, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

const GioiThieuNenTang = () => {
  const navigate = useNavigate();

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
                <h3 className="text-xl font-playfair font-bold">GIỚI THIỆU VỀ FARFETCH LIMITED</h3>
                <div className="w-24 h-0.5 bg-primary mx-auto"></div>
              </div>
              
              <div className="space-y-4 font-crimson text-sm leading-relaxed">
                <p>
                  Farfetch Limited là nền tảng thương mại điện tử toàn cầu chuyên về thời trang xa xỉ, được thành lập vào năm 2007 bởi doanh nhân người Bồ Đào Nha José Neves tại London, Anh. Nền tảng chính thức đi vào hoạt động từ năm 2008, với sứ mệnh kết nối các boutique thời trang độc lập với khách hàng toàn cầu thông qua một nền tảng số hiện đại, cá nhân hóa và tiện lợi.
                </p>
                
                <p>
                  Tính đến nay, Farfetch đã có mặt tại hơn 190 quốc gia và vùng lãnh thổ, hợp tác với khoảng 1.300–1.400 thương hiệu, boutique và các cửa hàng bách hóa cao cấp tại hơn 50 quốc gia. Nền tảng này cung cấp hàng nghìn sản phẩm thời trang xa xỉ, đồng thời mang đến trải nghiệm mua sắm hiện đại, tích hợp công nghệ tiên tiến và khả năng tùy biến dựa trên hành vi người dùng.
                </p>
                
                <p>
                  Farfetch hoạt động theo mô hình marketplace (chợ điện tử), cho phép người mua tiếp cận đa dạng nguồn cung mà không cần sở hữu kho hàng. Tuy nhiên, chi phí vận hành cao và những biến động tài chính trong thời gian gần đây đã tạo áp lực lớn lên doanh nghiệp. Đến cuối năm 2023, Farfetch nhận được khoản đầu tư cứu trợ từ Coupang – tập đoàn thương mại điện tử lớn nhất Hàn Quốc – nhằm duy trì hoạt động và tái cấu trúc hệ thống.
                </p>
                
                <p>
                  Để phát triển bền vững, Farfetch còn tạo điều kiện cho các nhân viên lâu năm và thành viên (membership) có cơ hội đầu tư, phân phối đơn hàng và nhận lợi nhuận trên các gian hàng của mình. Hệ thống phân chia gian hàng được thiết kế theo từng cấp độ VIP, từ nhỏ đến lớn, nhằm tạo điều kiện thuận lợi cho các nhà đầu tư với quy mô đa dạng có thể tham gia và phát triển cùng hệ thống.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* US Offices */}
        <Card className="shadow-classic border border-border/30">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-playfair font-bold">VĂN PHÒNG FARFETCH TẠI HOA KỲ</h3>
                <div className="w-24 h-0.5 bg-primary mx-auto"></div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-playfair font-semibold text-primary">Los Angeles</h4>
                  <div className="space-y-2 font-crimson text-sm">
                    <p className="font-medium">Văn phòng West Coast / U.S. West Coast HQ</p>
                    <p><span className="font-medium">Tên công ty pháp lý:</span> Farfetch.com US LLC</p>
                    <p><span className="font-medium">Địa chỉ:</span> 700 South Flower Street, Suite 3000, Los Angeles, CA 90017, USA</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-playfair font-semibold text-primary">New York City</h4>
                  <div className="space-y-2 font-crimson text-sm">
                    <p><span className="font-medium">Vị trí văn phòng:</span> Tầng 6, tòa nhà 30 West 21st Street, New York, NY 10010, Hoa Kỳ</p>
                    <p className="text-xs text-muted-foreground">Gần Bryant Park và Grand Central Terminal</p>
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