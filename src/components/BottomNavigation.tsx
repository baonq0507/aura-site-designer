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
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mb-1 relative">
                  {/* Central F logo */}
                  <span className="text-background text-xl font-bold">
                    F
                  </span>
                  
                  {/* Curved text around the circle */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 48 48">
                    <defs>
                      <path id="circle-path" d="M 24,24 m -18,0 a 18,18 0 1,1 36,0 a 18,18 0 1,1 -36,0" />
                    </defs>
                    <text className="fill-background text-[6px] font-bold">
                      <textPath href="#circle-path" startOffset="0%">
                        FARFETCH • FARFETCH • 
                      </textPath>
                    </text>
                  </svg>
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