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

const PageLayout = ({ children, title, showBackButton = true }: PageLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  // Don't render layout on homepage
  if (isHomepage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with back button */}
      {showBackButton && (
        <header className="bg-background border-b border-border sticky top-0 z-40 backdrop-blur-sm">
          <div className="flex items-center px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-3 p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            {title && (
              <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            )}
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
};

export default PageLayout;