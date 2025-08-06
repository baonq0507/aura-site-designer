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
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 2", 
    number: "2",
    commission: "4.0%",
    minOrders: "15",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 3",
    number: "3",
    commission: "5.0%",
    minOrders: "30",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 4",
    number: "4",
    commission: "6.0%",
    minOrders: "60",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 5",
    number: "5",
    commission: "7.0%",
    minOrders: "100",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 6",
    number: "6",
    commission: "8.0%",
    minOrders: "200",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 7",
    number: "7",
    commission: "9.0%",
    minOrders: "350",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 8",
    number: "8",
    commission: "10.0%",
    minOrders: "500",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 9",
    number: "9",
    commission: "12.0%",
    minOrders: "800",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
  {
    level: "VIP 10",
    number: "10",
    commission: "15.0%",
    minOrders: "1500",
    color: "from-amber-600 to-amber-700",
    bgColor: "bg-white dark:bg-card",
    iconColor: "text-amber-600",
  },
];

const VIPLevels = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentVipLevel, setCurrentVipLevel] = useState(1); // Default to VIP 1
  const [completedOrders, setCompletedOrders] = useState(0);

  useEffect(() => {
    // Get current user
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          // Fetch user's profile to get VIP level (default to 1 if not set)
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
          
          // Set VIP level to 1 by default (users start at VIP 1)
          setCurrentVipLevel(1);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Reset to default when no user
        setCurrentVipLevel(1);
        setCompletedOrders(0);
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setCurrentVipLevel(1);
        setCompletedOrders(0);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">VIP MEMBERSHIP LEVELS</h2>
        <p className="text-muted-foreground">Unlock exclusive benefits and higher commissions</p>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 md:gap-3">
        {vipLevels.map((vip, index) => {
          const vipLevelNumber = index + 1; // VIP levels start from 1
          const isCurrentLevel = user && vipLevelNumber === currentVipLevel;
          const isLocked = user && vipLevelNumber > currentVipLevel;
          const maxOrders = parseInt(vip.minOrders);
          
          return (
            <div
              key={index}
              className={`${vip.bgColor} aspect-square rounded-xl p-1 md:p-2 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer border border-amber-200 dark:border-amber-800/30 backdrop-blur-sm relative ${
                isCurrentLevel ? 'ring-2 ring-amber-600/50' : ''
              } ${isLocked ? 'opacity-60' : ''}`}
            >
              {/* Blur overlay for locked items */}
              {isLocked && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] rounded-xl flex items-center justify-center z-10">
                  <div className="bg-white/95 dark:bg-background/95 rounded-full p-3 border-2 border-amber-600/30 shadow-xl backdrop-blur-sm">
                    <Lock className="w-8 h-8 md:w-10 md:h-10 text-amber-600" />
                  </div>
                </div>
              )}
              
              <div className="flex flex-col items-center space-y-1 md:space-y-2">
                {/* Icon section */}
                <div className="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
                  <img 
                    src={vipBaseIcon} 
                    alt={vip.level} 
                    className={`w-full h-full object-contain rounded-full ${isLocked ? 'blur-sm' : ''}`}
                    loading="lazy"
                  />
                  {isCurrentLevel && !isLocked && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                
                {/* Content section */}
                <div className="text-center space-y-1">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-foreground text-sm md:text-base">{vip.level}</h3>
                    <p className={`font-semibold text-sm md:text-base ${vip.iconColor}`}>
                      {vip.commission}
                    </p>
                    <p className="text-[10px] md:text-xs text-gray-600 dark:text-muted-foreground">
                      Số dư tối thiểu
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-xs md:text-sm font-medium text-gray-900 dark:text-foreground">
                      Max Orders: {vip.minOrders}
                    </p>
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