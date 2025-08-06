import { Home, Search, ShoppingBag, User, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Home", active: true, path: "/" },
  { icon: Search, label: "Search", active: false, path: "/search" },
  { icon: ShoppingBag, label: "Shop", active: false, path: "/shop" },
  { icon: Heart, label: "Wishlist", active: false, path: "/wishlist" },
  { icon: User, label: "Profile", active: false, path: "/profile" },
];

const BottomNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-luxury backdrop-blur-sm">
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center py-3 px-2 transition-all duration-300 ${
                item.active
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <div className={`p-1 rounded-lg transition-all duration-300 ${
                item.active ? "bg-gradient-primary shadow-glow" : ""
              }`}>
                <Icon className={`w-5 h-5 ${item.active ? "text-white" : ""}`} />
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;