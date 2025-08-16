import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Phone, User } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuthContext } from "@/contexts/AuthContext";

interface DeliveryAddress {
  id: string;
  recipientName: string;
  phoneNumber: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
}

const DeliveryInfo = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuthContext();
  const [deliveryAddresses, setDeliveryAddresses] = useState<DeliveryAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<DeliveryAddress | null>(null);
  const [formData, setFormData] = useState({
    recipientName: "",
    phoneNumber: "",
    address: "",
    city: "",
    district: "",
    ward: "",
    isDefault: false
  });

  useEffect(() => {
    if (user) {
      fetchDeliveryAddresses();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchDeliveryAddresses = async () => {
    try {
      // Load from localStorage for now
      const savedData = localStorage.getItem(`delivery-addresses-${user.id}`);
      if (savedData) {
        setDeliveryAddresses(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading delivery addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save to localStorage for now
      localStorage.setItem(`delivery-info-${user.id}`, JSON.stringify(formData));

      toast({
        title: t('delivery.success'),
        description: t('delivery.success.message')
      });
    } catch (error) {
      console.error('Error saving delivery info:', error);
      toast({
        title: t('delivery.error'),
        description: t('delivery.error.message'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/profile")}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">{t('delivery.page.title')}</h1>
        </div>
      </div>

      <div className="p-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>{t('delivery.address.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipientName">{t('delivery.full.name')}</Label>
              <Input
                id="recipientName"
                value={formData.recipientName}
                onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                placeholder={t('delivery.full.name.placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">{t('delivery.phone.number')}</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder={t('delivery.phone.number.placeholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">{t('delivery.city')}</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                  placeholder={t('delivery.city.placeholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">{t('delivery.district')}</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) => setFormData(prev => ({ ...prev, district: e.target.value }))}
                  placeholder={t('delivery.district.placeholder')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ward">{t('delivery.ward')}</Label>
              <Input
                id="ward"
                value={formData.ward}
                onChange={(e) => setFormData(prev => ({ ...prev, ward: e.target.value }))}
                placeholder={t('delivery.ward.placeholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{t('delivery.address')}</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder={t('delivery.address.placeholder')}
              />
            </div>

            <Button 
              onClick={handleSave} 
              className="w-full"
              disabled={loading}
            >
              {loading ? t('delivery.saving') : t('delivery.save')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryInfo;