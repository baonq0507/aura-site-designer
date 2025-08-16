import { ReactNode, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { Loading } from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, session, loading, isLocked, isAuthenticated } = useAuthContext();
  const [showTimeoutMessage, setShowTimeoutMessage] = useState(false);

  useEffect(() => {
    // Hiển thị thông báo timeout sau 20 giây
    const timeoutId = setTimeout(() => {
      if (loading) {
        setShowTimeoutMessage(true);
      }
    }, 20000);

    return () => clearTimeout(timeoutId);
  }, [loading]);

  if (loading) {
    return (
      <Loading 
        size="xl"
        text={showTimeoutMessage ? "Đang kiểm tra đăng nhập... (Có thể mất vài phút)" : "Đang kiểm tra đăng nhập..."}
        fullScreen
        showTimeoutWarning={showTimeoutMessage}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;