import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  vip_level_id: number;
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onOrder?: (product: Product) => void;
}

const ProductModal = ({ product, isOpen, onClose, onOrder }: ProductModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!product) return null;

  const generateOrderNumber = () => {
    return "UB" + Date.now() + Math.floor(Math.random() * 10000);
  };

  const calculateCommission = (price: number) => {
    const commissionRate = 0.09; // 0.09%
    return price * commissionRate / 100;
  };

  const calculateGrandCommission = (price: number) => {
    const baseCommission = calculateCommission(price);
    return baseCommission * 77.2; // Based on the calculation shown in image
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onOrder?.(product);
    setIsSubmitting(false);
  };

  const orderNumber = generateOrderNumber();
  const commission = calculateCommission(product.price);
  const grandCommission = calculateGrandCommission(product.price);
  const availableBalance = 10209.77; // This should come from user data
  const completedOrders = "85/120"; // This should come from user data

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 bg-background">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-lg font-semibold">Pending Order</h2>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Order Number with Success Badge */}
          <div className="relative bg-white rounded-lg p-4 border">
            <div className="absolute top-2 right-2">
              <Badge className="bg-cyan-400 text-white rounded-full px-3 py-1 text-xs font-bold transform rotate-12">
                SUCCESS
              </Badge>
            </div>
            
            <div className="mb-3">
              <span className="text-sm font-medium">Number: </span>
              <span className="text-sm text-muted-foreground">{orderNumber}</span>
            </div>

            {/* Product Info */}
            <div className="flex gap-3 mb-4">
              <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-sm mb-1">{product.name}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">USD {product.price.toFixed(2)}</span>
                  <span className="text-lg font-bold">1</span>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Return Ratio(%)</span>
                <span className="font-medium">0.09 %</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Available Balance</span>
                <span className="font-medium">USD {availableBalance}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commission Calculation</span>
                <span className="font-medium">USD{product.price.toFixed(2)} x0.09% ={commission.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Commission</span>
                <span className="font-medium">USD {commission.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-muted-foreground">Grand Commission</span>
                <span className="font-medium">USD {grandCommission.toFixed(2)}</span>
              </div>
            </div>

            {/* Completed Orders */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Completed Orders</span>
                <span className="text-2xl font-bold text-orange-400">{completedOrders}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-12 bg-slate-700 hover:bg-slate-800 text-white rounded-full font-medium"
          >
            {isSubmitting ? "ĐANG XỬ LÝ..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;