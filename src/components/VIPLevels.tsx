import { Crown, Star, Award, Diamond, Zap, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

const vipLevels = [
  {
    level: "VIP 1",
    icon: Crown,
    commission: "5.0%",
    minOrders: "10",
    color: "from-blue-400 to-blue-600",
    bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
    iconColor: "text-blue-600",
  },
  {
    level: "VIP 2", 
    icon: Star,
    commission: "6.0%",
    minOrders: "50",
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
    iconColor: "text-purple-600",
  },
  {
    level: "VIP 3",
    icon: Award,
    commission: "7.0%",
    minOrders: "100",
    color: "from-indigo-400 to-indigo-600",
    bgColor: "bg-gradient-to-br from-indigo-50 to-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    level: "VIP 4",
    icon: Diamond,
    commission: "8.0%",
    minOrders: "200",
    color: "from-cyan-400 to-cyan-600",
    bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    level: "VIP 5",
    icon: Zap,
    commission: "9.0%",
    minOrders: "500",
    color: "from-teal-400 to-teal-600",
    bgColor: "bg-gradient-to-br from-teal-50 to-teal-100",
    iconColor: "text-teal-600",
  },
  {
    level: "VIP 6",
    icon: Gift,
    commission: "10.0%",
    minOrders: "1000",
    color: "from-emerald-400 to-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    iconColor: "text-emerald-600",
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
              className={`${vip.bgColor} rounded-xl p-4 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer border border-white/50`}
            >
              <div className="text-center space-y-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${vip.color} rounded-full flex items-center justify-center mx-auto shadow-glow`}>
                  <Icon className="w-6 h-6 text-white" />
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
                
                <Button variant="elegant" size="sm" className="w-full text-xs">
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