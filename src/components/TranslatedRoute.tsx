import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import PageLayout from "./PageLayout";

interface TranslatedRouteProps {
  children: ReactNode;
  titleKey: string;
  showBackButton?: boolean;
}

const TranslatedRoute = ({ children, titleKey, showBackButton = true }: TranslatedRouteProps) => {
  const { t } = useLanguage();
  
  return (
    <PageLayout title={t(titleKey)} showBackButton={showBackButton}>
      {children}
    </PageLayout>
  );
};

export default TranslatedRoute;