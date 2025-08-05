import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Grid3X3, Crown, Package, User } from "lucide-react";

const TopNavigation = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: Home, label: "Trang chủ", path: "/" },
    { icon: Grid3X3, label: "Danh mục", path: "/categories" },
    { icon: Crown, label: "VIP", path: "/vip" },
    { icon: Package, label: "Sản phẩm", path: "/products" },
    { icon: User, label: "Cá nhân", path: "/profile" }
  ];

  return (
    <nav className="hidden md:flex items-center space-x-6">
      {menuItems.map((item) => (
        <Button
          key={item.path}
          variant="ghost"
          onClick={() => navigate(item.path)}
          className="flex items-center space-x-2 text-black/80 hover:text-black hover:bg-black/10 transition-colors"
        >
          <item.icon className="w-4 h-4" />
          <span className="font-medium">{item.label}</span>
        </Button>
      ))}
    </nav>
  );
};

export default TopNavigation;