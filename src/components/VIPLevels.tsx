import { Crown, Star, Award, Diamond, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const vipLevels = [
  {
    level: "VIP 1",
    icon: Crown,
    commission: "5.0%",
    minOrders: "10",
    color: "from-amber-600 to-amber-800",
    bgColor: "bg-gradient-to-br from-amber-900/20 to-amber-950/30",
    iconColor: "text-amber-400",
  },
  {
    level: "VIP 2", 
    icon: Star,
    commission: "6.0%",
    minOrders: "50",
    color: "from-orange-600 to-orange-800",
    bgColor: "bg-gradient-to-br from-orange-900/20 to-orange-950/30",
    iconColor: "text-orange-400",
  },
  {
    level: "VIP 3",
    icon: Award,
    commission: "7.0%",
    minOrders: "100",
    color: "from-yellow-600 to-yellow-800",
    bgColor: "bg-gradient-to-br from-yellow-900/20 to-yellow-950/30",
    iconColor: "text-yellow-400",
  },
  {
    level: "VIP 4",
    icon: Diamond,
    commission: "8.0%",
    minOrders: "200",
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-gradient-to-br from-amber-900/30 to-amber-950/40",
    iconColor: "text-amber-300",
  },
  {
    level: "VIP 5",
    icon: Zap,
    commission: "9.0%",
    minOrders: "500",
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-gradient-to-br from-orange-900/30 to-orange-950/40",
    iconColor: "text-orange-300",
  },
  {
    level: "VIP 6",
    icon: Gift,
    commission: "10.0%",
    minOrders: "1000",
    color: "from-yellow-500 to-yellow-700",
    bgColor: "bg-gradient-to-br from-yellow-900/30 to-yellow-950/40",
    iconColor: "text-yellow-300",
  },
];

const VIPLevels = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">VIP MEMBERSHIP LEVELS</h2>
        <p className="text-muted-foreground">Unlock exclusive benefits and higher commissions</p>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4">
        {vipLevels.map((vip, index) => {
          const Icon = vip.icon;
          return (
            <div
              key={index}
              className={`${vip.bgColor} rounded-xl p-3 md:p-4 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer border border-accent/20 backdrop-blur-sm`}
            >
              <div className="text-center space-y-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${vip.color} rounded-full flex items-center justify-center mx-auto shadow-glow`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-black font-bold" />
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