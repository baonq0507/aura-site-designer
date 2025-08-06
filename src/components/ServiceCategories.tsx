import { CreditCard, Wallet, FileText, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    icon: CreditCard,
    title: "Nạp tiền",
    description: "Top up Balance",
    color: "bg-gradient-copper",
    path: "/nap-tien",
  },
  {
    icon: Wallet,
    title: "Rút tiền",
    description: "Withdraw Funds",
    color: "bg-gradient-luxury",
    path: "/rut-tien",
  },
  {
    icon: FileText,
    title: "Quy tắc đặt hàng",
    description: "Order Rules",
    color: "bg-accent",
    path: "/quy-tac-dat-hang",
  },
  {
    icon: Info,
    title: "Giới thiệu nền tảng",
    description: "Platform Introduction",
    color: "bg-gradient-primary",
    path: "/gioi-thieu-nen-tang",
  },
];

const ServiceCategories = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-4 gap-1 md:gap-2">
      {services.map((service, index) => {
        const Icon = service.icon;
        return (
          <div
            key={index}
            onClick={() => navigate(service.path)}
            className="group bg-card rounded-none p-2 shadow-classic hover:shadow-classic-hover transition-all duration-300 cursor-pointer border border-border/30 hover:border-primary/30 aspect-square"
          >
            <div className="text-center space-y-1 flex flex-col justify-center h-full">
              <div className={`w-6 h-6 md:w-8 md:h-8 ${service.color} rounded-full flex items-center justify-center mx-auto group-hover:shadow-glow transition-all duration-300 border-2 border-white/20`}>
                <Icon className="w-3 h-3 md:w-4 md:h-4 text-white font-bold" />
              </div>
              <div className="space-y-1">
                <h3 className="font-playfair font-semibold text-foreground text-[10px] md:text-xs tracking-wide leading-tight">
                  {service.title}
                </h3>
                <div className="w-4 h-0.5 bg-primary/30 mx-auto"></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ServiceCategories;