import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import BottomNavigation from "./BottomNavigation";
interface PageLayoutProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
}
const PageLayout = ({
  children,
  title,
  showBackButton = true
}: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  // Don't render layout on homepage
  if (isHomepage) {
    return <>{children}</>;
  }
  return <div className="min-h-screen bg-background">
      {/* Header with back button */}
      {showBackButton && <header className="bg-background border-b border-border sticky top-0 z-40 backdrop-blur-sm">
          
        </header>}

      {/* Main content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>;
};
export default PageLayout;