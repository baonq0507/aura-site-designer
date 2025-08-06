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
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-1 relative hover:scale-110 transition-all duration-300 shadow-glow hover:shadow-luxury group border-2 border-gray-200">
                  {/* Central Farfetch logo */}
                  <img 
                    src="/lovable-uploads/ed1ba5fb-c28d-49b1-aa4b-8c1427525790.png" 
                    alt="Farfetch logo"
                    className="w-6 h-6 object-contain transition-all duration-300"
                  />
                  
                  {/* Curved text around the circle with rotation animation */}
                  <svg className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] group-hover:animate-[spin_2s_linear_infinite]" viewBox="0 0 48 48">
                    <defs>
                      <path id="circle-path" d="M 24,24 m -18,0 a 18,18 0 1,1 36,0 a 18,18 0 1,1 -36,0" />
                    </defs>
                    <text className="fill-white text-[8px] font-bold transition-colors duration-300" stroke="black" strokeWidth="0.5">
                      <textPath href="#circle-path" startOffset="0%">
                        FARFETCH • FARFETCH • 
                      </textPath>
                    </text>
                  </svg>
                  
                  {/* Glow ring effect */}
                  <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
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