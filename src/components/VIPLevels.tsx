import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Lock } from "lucide-react";
import vipBaseIcon from "@/assets/vip-base-icon.png";

const vipLevels = [
  {
    level: "VIP 1",
    number: "1",
    commission: "3.0%",
    minOrders: "5",
    color: "from-yellow-600 to-yellow-800",
    bgColor: "bg-gradient-to-br from-yellow-900/20 to-yellow-950/30",
    iconColor: "text-yellow-400",
  },
  {
    level: "VIP 2", 
    number: "2",
    commission: "4.0%",
    minOrders: "15",
    color: "from-orange-600 to-orange-800",
    bgColor: "bg-gradient-to-br from-orange-900/20 to-orange-950/30",
    iconColor: "text-orange-400",
  },
  {
    level: "VIP 3",
    number: "3",
    commission: "5.0%",
    minOrders: "30",
    color: "from-amber-600 to-amber-800",
    bgColor: "bg-gradient-to-br from-amber-900/20 to-amber-950/30",
    iconColor: "text-amber-400",
  },
  {
    level: "VIP 4",
    number: "4",
    commission: "6.0%",
    minOrders: "60",
    color: "from-yellow-500 to-yellow-700",
    bgColor: "bg-gradient-to-br from-yellow-900/30 to-yellow-950/40",
    iconColor: "text-yellow-300",
  },
  {
    level: "VIP 5",
    number: "5",
    commission: "7.0%",
    minOrders: "100",
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-gradient-to-br from-orange-900/30 to-orange-950/40",
    iconColor: "text-orange-300",
  },
  {
    level: "VIP 6",
    number: "6",
    commission: "8.0%",
    minOrders: "200",
    color: "from-amber-500 to-amber-700",
    bgColor: "bg-gradient-to-br from-amber-900/30 to-amber-950/40",
    iconColor: "text-amber-300",
  },
  {
    level: "VIP 7",
    number: "7",
    commission: "9.0%",
    minOrders: "350",
    color: "from-yellow-400 to-yellow-600",
    bgColor: "bg-gradient-to-br from-yellow-900/40 to-yellow-950/50",
    iconColor: "text-yellow-200",
  },
  {
    level: "VIP 8",
    number: "8",
    commission: "10.0%",
    minOrders: "500",
    color: "from-orange-400 to-orange-600",
    bgColor: "bg-gradient-to-br from-orange-900/40 to-orange-950/50",
    iconColor: "text-orange-200",
  },
  {
    level: "VIP 9",
    number: "9",
    commission: "12.0%",
    minOrders: "800",
    color: "from-amber-400 to-amber-600",
    bgColor: "bg-gradient-to-br from-amber-900/40 to-amber-950/50",
    iconColor: "text-amber-200",
  },
  {
    level: "VIP 10",
    number: "10",
    commission: "15.0%",
    minOrders: "1500",
    color: "from-yellow-300 to-yellow-500",
    bgColor: "bg-gradient-to-br from-yellow-900/50 to-yellow-950/60",
    iconColor: "text-yellow-100",
  },
];

const VIPLevels = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentVipLevel, setCurrentVipLevel] = useState(0);
  const [completedOrders, setCompletedOrders] = useState(0);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          // Fetch user's profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          // Fetch completed orders count
          const { data: orders, count } = await supabase
            .from('orders')
            .select('*', { count: 'exact' })
            .eq('user_id', session.user.id)
            .eq('status', 'completed');
            
          setCompletedOrders(count || 0);
          
          // Calculate current VIP level based on orders
          const currentLevel = vipLevels.findIndex(level => {
            const minOrders = parseInt(level.minOrders);
            return (count || 0) < minOrders;
          });
          
          setCurrentVipLevel(currentLevel === -1 ? vipLevels.length : currentLevel);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">VIP MEMBERSHIP LEVELS</h2>
        <p className="text-muted-foreground">Unlock exclusive benefits and higher commissions</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {vipLevels.map((vip, index) => {
          const isLocked = user && index >= currentVipLevel;
          const isActive = user && index < currentVipLevel;
          const requiredOrders = parseInt(vip.minOrders);
          const remainingOrders = Math.max(0, requiredOrders - completedOrders);
          
          return (
            <div
              key={index}
              className={`${vip.bgColor} rounded-xl p-3 md:p-4 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer border border-accent/20 backdrop-blur-sm ${
                isLocked ? 'opacity-60 relative' : ''
              } ${isActive ? 'ring-2 ring-primary/50' : ''}`}
            >
              {isLocked && (
                <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center z-10">
                  <div className="text-center text-white">
                    <Lock className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs font-medium">
                      Cần {remainingOrders} đơn nữa
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-4">
                {/* Icon section - Left */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                  <img 
                    src={vipBaseIcon} 
                    alt={vip.level} 
                    className="w-full h-full object-contain rounded-full" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-black font-bold text-lg md:text-xl">{vip.number}</span>
                  </div>
                  {isActive && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                
                {/* Content section - Right */}
                <div className="flex-1 space-y-2">
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
                    {user && (
                      <p className="text-xs text-muted-foreground">
                        Bạn có: {completedOrders} đơn
                      </p>
                    )}
                  </div>
                  
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VIPLevels;