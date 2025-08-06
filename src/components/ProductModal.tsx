import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, X } from "lucide-react";

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
  if (!product) return null;

  const handleOrder = () => {
    onOrder?.(product);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết sản phẩm VIP</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Product Image */}
          <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder.svg';
              }}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <Badge variant="secondary" className="bg-gradient-luxury text-white">
                VIP {product.vip_level_id}
              </Badge>
            </div>

            <p className="text-muted-foreground text-sm">
              {product.description || "Sản phẩm VIP cao cấp"}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Danh mục:</span>
              <span className="text-sm font-medium">{product.category}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold">Giá:</span>
              <span className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button
            onClick={handleOrder}
            className="w-full h-12 bg-blue hover:bg-blue/90 text-blue-foreground font-semibold"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            NHẬN ĐƠN HÀNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;