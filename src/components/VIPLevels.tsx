import { Button } from "@/components/ui/button";
import vip1Icon from "@/assets/vip1-icon.png";
import vip2Icon from "@/assets/vip2-icon.png";
import vip3Icon from "@/assets/vip3-icon.png";
import vip4Icon from "@/assets/vip4-icon.png";
import vip5Icon from "@/assets/vip5-icon.png";
import vip6Icon from "@/assets/vip6-icon.png";
import vip7Icon from "@/assets/vip7-icon.png";
import vip8Icon from "@/assets/vip8-icon.png";
import vip9Icon from "@/assets/vip9-icon.png";
import vip10Icon from "@/assets/vip10-icon.png";

const vipLevels = [
  {
    level: "VIP 1",
    icon: vip1Icon,
    commission: "3.0%",
    minOrders: "5",
    color: "from-yellow-600 to-yellow-800",
    bgColor: "bg-gradient-to-br from-yellow-900/20 to-yellow-950/30",
    iconColor: "text-yellow-400",
  },
  {
    level: "VIP 2", 
    icon: vip2Icon,
    commission: "4.0%",
    minOrders: "15",
    color: "from-orange-600 to-orange-800",
    bgColor: "bg-gradient-to-br from-orange-900/20 to-orange-950/30",
    iconColor: "text-orange-400",
  },
  {
    level: "VIP 3",
    icon: vip3Icon,
    commission: "5.0%",
    minOrders: "30",
    color: "from-amber-600 to-amber-800",
    bgColor: "bg-gradient-to-br from-amber-900/20 to-amber-950/30",
    iconColor: "text-amber-400",
  },
  {
    level: "VIP 4",
    icon: vip4Icon,
    commission: "6.0%",
    minOrders: "60",
    color: "from-yellow-500 to-yellow-700",
    bgColor: "bg-gradient-to-br from-yellow-900/30 to-yellow-950/40",
    iconColor: "text-yellow-300",
  },
  {
    level: "VIP 5",
    icon: vip5Icon,
    commission: "7.0%",
    minOrders: "100",
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-gradient-to-br from-orange-900/30 to-orange-950/40",
    iconColor: "text-orange-300",
  },
  {
    level: "VIP 6",
    icon: vip6Icon,
    commission: "8.0%",
    minOrders: "200",
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-gradient-to-br from-amber-900/30 to-amber-950/40",
    iconColor: "text-amber-300",
  },
  {
    level: "VIP 7",
    icon: vip7Icon,
    commission: "9.0%",
    minOrders: "350",
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-900/40 to-yellow-950/50",
    iconColor: "text-yellow-200",
  },
  {
    level: "VIP 8",
    icon: vip8Icon,
    commission: "10.0%",
    minOrders: "500",
    color: "from-orange-400 to-orange-600",
    bgColor: "bg-gradient-to-br from-orange-900/40 to-orange-950/50",
    iconColor: "text-orange-200",
  },
  {
    level: "VIP 9",
    icon: vip9Icon,
    commission: "12.0%",
    minOrders: "800",
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-gradient-to-br from-amber-900/40 to-amber-950/50",
    iconColor: "text-amber-200",
  },
  {
    level: "VIP 10",
    icon: vip10Icon,
    commission: "15.0%",
    minOrders: "1500",
    color: "from-yellow-300 to-yellow-500",
    bgColor: "bg-gradient-to-br from-yellow-900/50 to-yellow-950/60",
    iconColor: "text-yellow-100",
  },
];

const VIPLevels = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">VIP MEMBERSHIP LEVELS</h2>
        <p className="text-muted-foreground">Unlock exclusive benefits and higher commissions</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {vipLevels.map((vip, index) => {
          return (
            <div
              key={index}
              className={`${vip.bgColor} rounded-xl p-3 md:p-4 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer border border-accent/20 backdrop-blur-sm`}
            >
              <div className="text-center space-y-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${vip.color} rounded-full flex items-center justify-center mx-auto shadow-glow`}>
                  <img src={vip.icon} alt={vip.level} className="w-5 h-5 md:w-6 md:h-6 object-contain" />
                </div>
                
                <div>
                  <h3 className="font-bold text-foreground text-lg">{vip.level}</h3>
                  <p className={`font-semibold text-lg ${vip.iconColor}`}>
                    {vip.commission}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Commission Rate
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Min. Orders: {vip.minOrders}
                  </p>
                </div>
                
                <Button variant="copper" size="sm" className="w-full text-xs">
                  Learn More
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VIPLevels;