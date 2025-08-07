import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Lock } from "lucide-react";
import vipBaseIcon from "@/assets/vip-base-icon.png";
interface VipLevel {
  id: number;
  level_name: string;
  commission_rate: number;
  min_spent: number;
  min_orders: number;
  image_url: string | null;
}
const VIPLevels = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentVipLevel, setCurrentVipLevel] = useState(1); // Default to VIP 1
  const [completedOrders, setCompletedOrders] = useState(0);
  const [vipLevels, setVipLevels] = useState<VipLevel[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Fetch VIP levels from database
    const fetchVipLevels = async () => {
      try {
        const {
          data: vipData,
          error
        } = await supabase.from('vip_levels').select('*').order('id', {
          ascending: true
        });
        if (error) {
          console.error('Error fetching VIP levels:', error);
          return;
        }
        setVipLevels(vipData || []);
      } catch (error) {
        console.error('Error fetching VIP levels:', error);
      }
    };

    // Get current user
    const getCurrentUser = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      if (session?.user) {
        try {
          // Fetch user's profile to get VIP level (default to 1 if not set)
          const {
            data: profile
          } = await supabase.from('profiles').select('*').eq('user_id', session.user.id).maybeSingle();

          // Fetch completed orders count
          const {
            data: orders,
            count
          } = await supabase.from('orders').select('*', {
            count: 'exact'
          }).eq('user_id', session.user.id).eq('status', 'completed');
          setCompletedOrders(count || 0);

          // Set VIP level from profile or default to 1
          setCurrentVipLevel(profile?.vip_level || 1);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        // Reset to default when no user
        setCurrentVipLevel(1);
        setCompletedOrders(0);
      }
      setLoading(false);
    };
    const initializeData = async () => {
      await fetchVipLevels();
      await getCurrentUser();
    };
    initializeData();

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        setCurrentVipLevel(1);
        setCompletedOrders(0);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  return <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl lg:text-xl font-bold text-foreground mb-1">VIP MEMBERSHIP LEVELS</h2>
        
      </div>
      
      <div className="grid grid-cols-2 gap-2">
      {loading ? <div className="text-center">
          <div className="animate-pulse text-lg">Đang tải...</div>
        </div> : vipLevels.map((vip, index) => {
        const vipLevelNumber = vip.id; // Use the actual VIP level ID
        const isCurrentLevel = user && vipLevelNumber === currentVipLevel;
        const isLocked = user && vipLevelNumber > currentVipLevel;
        const formatCurrency = (amount: number) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(amount);
        };
        return <div key={vip.id} className={`${isLocked ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-card'} aspect-[2/1] rounded-xl py-3 px-2 shadow-elegant hover:shadow-luxury transition-all duration-300 hover:scale-105 cursor-pointer border border-black dark:border-black backdrop-blur-sm relative`}>
              <div className="flex items-center space-x-3 h-full">
                {/* Icon section */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <img src={vip.image_url || vipBaseIcon} alt={vip.level_name} className={`w-full h-full object-contain rounded-full`} loading="lazy" />
                  {isCurrentLevel && !isLocked && <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>}
                </div>
                
                {/* Content section */}
                <div className="flex-1 space-y-2">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-foreground text-lg">{vip.level_name}</h3>
                    <p className="font-semibold text-lg text-amber-600">
                      {vip.commission_rate}%
                    </p>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground">
                      {formatCurrency(vip.min_spent)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-foreground">
                      Max Orders: {vip.min_orders}
                    </p>
                  </div>
                  
                </div>
              </div>
            </div>;
      })}
      </div>
    </div>;
};
export default VIPLevels;