import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Clock, CreditCard, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
const QuyTacDatHang = () => {
  const navigate = useNavigate();
  const rules = [{
    icon: FileText,
    title: "Quy định đặt hàng",
    content: ["Khách hàng phải đăng ký tài khoản và xác thực thông tin trước khi đặt hàng", "Mỗi đơn hàng phải có giá trị tối thiểu 100,000 VNĐ", "Thông tin đặt hàng phải chính xác và đầy đủ", "Không được đặt hàng các sản phẩm bị cấm hoặc hạn chế"]
  }, {
    icon: CreditCard,
    title: "Thanh toán",
    content: ["Hỗ trợ thanh toán qua thẻ tín dụng, ví điện tử và chuyển khoản", "Thanh toán phải được thực hiện trong vòng 24 giờ sau khi đặt hàng", "Đơn hàng sẽ bị hủy tự động nếu không thanh toán đúng hạn", "Hoàn tiền sẽ được xử lý trong 3-7 ngày làm việc"]
  }, {
    icon: Clock,
    title: "Thời gian xử lý",
    content: ["Đơn hàng sẽ được xác nhận trong vòng 2 giờ làm việc", "Thời gian chuẩn bị hàng: 1-3 ngày làm việc", "Thời gian giao hàng: 2-5 ngày làm việc tùy theo khu vực", "Khách hàng sẽ nhận được thông báo qua email và SMS"]
  }, {
    icon: Truck,
    title: "Giao hàng & Đổi trả",
    content: ["Miễn phí giao hàng cho đơn hàng trên 500,000 VNĐ", "Hỗ trợ đổi trả trong vòng 7 ngày kể từ khi nhận hàng", "Sản phẩm đổi trả phải còn nguyên vẹn, chưa sử dụng", "Chi phí giao hàng đổi trả sẽ do khách hàng chịu"]
  }];
  return <div className="min-h-screen bg-background font-crimson">
      {/* Header */}
      <div className="bg-secondary/30 p-4 border-b border-primary/20">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")} className="font-playfair">
            <ArrowLeft className="w-4 h-4 mr-2" />
            QUAY LẠI
          </Button>
          
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-playfair font-bold text-foreground tracking-wide">ĐIỀU KHOẢN & QUY ĐỊNH</h2>
          <div className="w-32 h-0.5 bg-primary mx-auto"></div>
          <p className="text-muted-foreground font-crimson italic text-lg max-w-3xl mx-auto">
            Vui lòng đọc kỹ các quy tắc và điều khoản dưới đây trước khi thực hiện đặt hàng tại Farfetch
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
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-playfair tracking-wide">LIÊN HỆ HỖ TRỢ</CardTitle>
            <CardDescription className="font-crimson italic">
              Nếu bạn có thắc mắc về quy tắc đặt hàng, vui lòng liên hệ với chúng tôi
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-playfair font-semibold">Hotline</h4>
                <p className="font-crimson text-primary">1900-1234</p>
              </div>
              <div>
                <h4 className="font-playfair font-semibold">Email</h4>
                <p className="font-crimson text-primary">support@farfetch.vn</p>
              </div>
              <div>
                <h4 className="font-playfair font-semibold">Giờ làm việc</h4>
                <p className="font-crimson text-primary">8:00 - 22:00 hàng ngày</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};
export default QuyTacDatHang;