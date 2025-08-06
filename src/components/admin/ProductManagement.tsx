import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Package, Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock: number;
  created_at: string;
}

export function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: ""
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Since we don't have a products table yet, we'll show mock data
      // In a real implementation, you'd query your products table
      const mockProducts: Product[] = [
        {
          id: "1",
          name: "Premium Headphones",
          description: "High-quality wireless headphones with noise cancellation",
          price: 299.99,
          category: "Electronics",
          stock: 50,
          created_at: new Date().toISOString()
        },
        {
          id: "2", 
          name: "Smart Watch",
          description: "Fitness tracking smartwatch with heart rate monitor",
          price: 199.99,
          category: "Electronics",
          stock: 30,
          created_at: new Date().toISOString()
        },
        {
          id: "3",
          name: "Coffee Maker",
          description: "Automatic drip coffee maker with programmable timer",
          price: 89.99,
          category: "Appliances",
          stock: 25,
          created_at: new Date().toISOString()
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      // In a real implementation, you'd insert into your products table
      const product: Product = {
        id: Date.now().toString(),
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        category: newProduct.category,
        stock: parseInt(newProduct.stock),
        created_at: new Date().toISOString()
      };

      setProducts(prev => [...prev, product]);
      setNewProduct({ name: "", description: "", price: "", category: "", stock: "" });
      setIsDialogOpen(false);

      toast({
        title: "Success",
        description: "Product created successfully"
      });
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive"
      });
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      // In a real implementation, you'd update the product in your database
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
      setEditingProduct(null);

      toast({
        title: "Success", 
        description: "Product updated successfully"
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // In a real implementation, you'd delete from your database
      setProducts(prev => prev.filter(p => p.id !== productId));

      toast({
        title: "Success",
        description: "Product deleted successfully"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <Button onClick={handleCreateProduct} className="w-full">
                Create Product
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>{product.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                    Stock: {product.stock}
                  </Badge>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-bold">{formatCurrency(product.price)}</span>
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}