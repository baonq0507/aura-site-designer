import { Home, Clock, Headphones, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const navItems = [
  { icon: Home, label: "Trang đầu", active: true, path: "/" },
  { icon: Clock, label: "Lịch sử", active: false, path: "/history" },
  { type: "logo", label: "SOUTH COAST PLAZA", active: false, path: "/task-center" },
  { icon: Headphones, label: "CSKH", active: false, path: "/support" },
  { icon: User, label: "Của tôi", active: false, path: "/profile" },
];

const BottomNavigation = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-luxury backdrop-blur-sm">
      <div className="grid grid-cols-5 max-w-lg mx-auto">
        {navItems.map((item, index) => {
          // Handle logo differently
          if (item.type === "logo") {
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className="flex flex-col items-center justify-center py-2 px-2 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-1">
                  <span className="text-background text-[8px] font-bold text-center leading-tight">
                    SOUTH<br/>COAST<br/>PLAZA
                  </span>
                </div>
              </button>
            );
          }

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