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
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {vipLevels.map((vip, index) => {
          const vipLevelNumber = index + 1; // VIP levels start from 1
          const isCurrentLevel = user && vipLevelNumber === currentVipLevel;
          const isLocked = user && vipLevelNumber > currentVipLevel;
          const maxOrders = parseInt(vip.minOrders);
          
          return (
            <div
              key={index}
              className={`${vip.bgColor} aspect-square rounded-xl p-2 md:p-3 lg:p-2 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer border border-accent/20 backdrop-blur-sm ${
                isCurrentLevel ? 'ring-2 ring-primary/50' : ''
              } ${isLocked ? 'opacity-60' : ''}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {/* Icon section */}
                  <div className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0">
                    <img 
                      src={vipBaseIcon} 
                      alt={vip.level} 
                      className={`w-full h-full object-contain rounded-full ${isLocked ? 'opacity-50' : ''}`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      {isLocked ? (
                        <div className="bg-muted/90 rounded-full p-2 border border-border">
                          <Lock className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                        </div>
                      ) : (
                        <span className="text-black font-bold text-lg md:text-xl">{vip.number}</span>
                      )}
                    </div>
                    {isCurrentLevel && !isLocked && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                </div>
                
                {/* Content section */}
                <div className="text-center space-y-2">
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
                      Max Orders: {vip.minOrders}
                    </p>
                    {user && isCurrentLevel && (
                      <p className="text-xs text-muted-foreground">
                        Level hiện tại
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