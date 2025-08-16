import { AlertCircle, Phone, User, Key, Gift, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorDisplayProps {
  errorType: string;
  title: string;
  message: string;
  className?: string;
}

const ErrorDisplay = ({ errorType, title, message, className }: ErrorDisplayProps) => {
  const getIcon = () => {
    switch (errorType) {
      case 'phone_exists':
        return <Phone className="h-5 w-5" />;
      case 'username_exists':
        return <User className="h-5 w-5" />;
      case 'weak_password':
        return <Shield className="h-5 w-5" />;
      case 'invalid_invitation':
        return <Gift className="h-5 w-5" />;
      case 'invalid_phone':
        return <Phone className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getBackgroundColor = () => {
    switch (errorType) {
      case 'phone_exists':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'username_exists':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'weak_password':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'invalid_invitation':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'invalid_phone':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className={cn(
      "flex items-start space-x-3 p-4 rounded-lg border",
      getBackgroundColor(),
      className
    )}>
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium mb-1">
          {title}
        </h4>
        <p className="text-sm opacity-90">
          {message}
        </p>
      </div>
    </div>
  );
};

export default ErrorDisplay;
