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
          <h1 className="text-2xl font-playfair font-bold text-foreground tracking-wide">
            GIỚI THIỆU NỀN TẢNG
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Mall Header Section */}
        <div className="text-center space-y-4">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-lg">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white tracking-wider">
              FASHION PLAZA
            </h2>
            <p className="text-xl font-crimson text-white/90 mt-2">
              Trung tâm mua sắm thời trang cao cấp
            </p>
          </div>
        </div>

        {/* Mall Description */}
        <Card className="shadow-classic border border-border/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-playfair font-bold">LỊCH SỬ TẬP ĐOÀN CÔNG TY</h3>
              <div className="w-24 h-0.5 bg-primary mx-auto"></div>
              <p className="font-crimson text-lg leading-relaxed max-w-4xl mx-auto">
                Trung tâm mua sắm thời trang & đi tích lịch sự Fashion Plaza là trung tâm mua sắm hàng hóa sang trọng cao cấp ở 
                Costa Mesa, California. Trung tâm mua sắm lớn nhất ở Bờ Tây 
                Hoa Kỳ, với hơn 1.5 triệu feet vuông và là cao nhất ở Costa Mesa 
                250 nhà bán lẻ của nó điền cho nơi tập trung bán lẻ 
                thời trang thiết kế cao nhất ở Hoa Kỳ, với doanh số bán hàng 
                cao nhất ở 1.5 tỷ đô la mỗi năm và chú trọng lưng Westfield ở San Jose-Santa Clara, tại, Mức trung bình quốc gia là 
                trom đã mở một trung tâm mua sắm tên là "Fashion Plaza" 
                tại một trong những cảnh đăng đầu lima của gia đình ở Quy 
                an Cam đăng trở lại thành Wiltern doanh trong để giai 
                đoạn đầu của cửa hàng thời bình thuận cho năm 1996 và Sears, giai 
                đoạn đầu của trung tâm thời gian khi có bởi Victor Gruen. Nó đã 
                gộp xây dựng cùng năm với Đảo Thời trang lận lần đầu của Công ty 
                Irvine ở Bãi biển Newport.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shopping Areas - Mall Layout */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-3xl font-playfair font-bold text-foreground tracking-wide">
              KHU VỰC MUA SẮM
            </h3>
            <div className="w-24 h-0.5 bg-primary mx-auto mt-4"></div>
          </div>
          
          {/* Main Shopping Floors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ground Floor */}
            <Card className="shadow-classic border border-border/30">
              <CardHeader className="bg-gradient-elegant">
                <CardTitle className="text-xl font-playfair text-center">TẦNG TRỆT</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/20 rounded">
                    <Crown className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-crimson text-sm font-semibold">Thời trang nam</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded">
                    <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-crimson text-sm font-semibold">Phụ kiện</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded">
                    <Shield className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-crimson text-sm font-semibold">Giày dép</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded">
                    <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-crimson text-sm font-semibold">Túi xách</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* First Floor */}
            <Card className="shadow-classic border border-border/30">
              <CardHeader className="bg-gradient-elegant">
                <CardTitle className="text-xl font-playfair text-center">TẦNG 1</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-secondary/20 rounded">
                    <Globe className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-crimson text-sm font-semibold">Thời trang nữ</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded">
                    <Truck className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-crimson text-sm font-semibold">Mỹ phẩm</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded">
                    <Crown className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-crimson text-sm font-semibold">Trang sức</p>
                  </div>
                  <div className="text-center p-3 bg-secondary/20 rounded">
                    <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                    <p className="font-crimson text-sm font-semibold">Đồng hồ</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Premium Brands Section */}
          <Card className="shadow-classic border border-border/30 bg-gradient-elegant">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-playfair tracking-wide">THƯƠNG HIỆU CAO CẤP</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2">
                  <div className="text-2xl font-playfair font-bold text-primary">LOUIS VUITTON</div>
                  <p className="font-crimson text-sm text-muted-foreground">Tầng 1, Khu A</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-playfair font-bold text-primary">GUCCI</div>
                  <p className="font-crimson text-sm text-muted-foreground">Tầng 1, Khu B</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-playfair font-bold text-primary">CHANEL</div>
                  <p className="font-crimson text-sm text-muted-foreground">Tầng Trệt, Khu C</p>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-playfair font-bold text-primary">HERMÈS</div>
                  <p className="font-crimson text-sm text-muted-foreground">Tầng 1, Khu D</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-classic border border-border/30">
            <CardContent className="p-6 text-center space-y-4">
              <Truck className="w-12 h-12 mx-auto text-primary" />
              <h4 className="text-lg font-playfair font-semibold">Dịch vụ giao hàng</h4>
              <p className="font-crimson text-sm text-muted-foreground">
                Giao hàng miễn phí trong nội thành cho đơn hàng trên 2 triệu đồng
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-classic border border-border/30">
            <CardContent className="p-6 text-center space-y-4">
              <Shield className="w-12 h-12 mx-auto text-primary" />
              <h4 className="text-lg font-playfair font-semibold">Bảo hành chính hãng</h4>
              <p className="font-crimson text-sm text-muted-foreground">
                Đảm bảo 100% sản phẩm chính hãng với chế độ bảo hành toàn cầu
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-classic border border-border/30">
            <CardContent className="p-6 text-center space-y-4">
              <Users className="w-12 h-12 mx-auto text-primary" />
              <h4 className="text-lg font-playfair font-semibold">Tư vấn cá nhân</h4>
              <p className="font-crimson text-sm text-muted-foreground">
                Dịch vụ tư vấn thời trang cá nhân từ các chuyên gia giàu kinh nghiệm
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Visit */}
        <Card className="shadow-classic border border-border/30">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-playfair tracking-wide">THÔNG TIN LIÊN HỆ & THĂM QUAN</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-playfair font-semibold text-lg">Địa chỉ trung tâm</h4>
                <p className="font-crimson">
                  Fashion Plaza Shopping Center<br/>
                  123 Nguyễn Huệ, Quận 1<br/>
                  TP. Hồ Chí Minh, Việt Nam
                </p>
                <p className="font-crimson text-sm text-muted-foreground">
                  Giờ hoạt động: 10:00 - 22:00 (Thứ 2 - Chủ nhật)
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-playfair font-semibold text-lg">Liên hệ</h4>
                <div className="space-y-2">
                  <p className="font-crimson">Hotline: 1900-PLAZA (75292)</p>
                  <p className="font-crimson">Email: info@fashionplaza.vn</p>
                  <p className="font-crimson">Website: www.fashionplaza.vn</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="copper" 
              size="lg" 
              className="font-playfair font-semibold tracking-wide shadow-classic-hover"
              onClick={() => navigate("/")}
            >
              KHÁM PHÁ NGAY
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GioiThieuNenTang;