import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, X, Trash2, Edit } from "lucide-react";
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
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
      // Using mock data since products table will be created later
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
        },
        {
          id: "4",
          name: "Wireless Earbuds",
          description: "True wireless earbuds with charging case",
          price: 149.99,
          category: "Electronics",
          stock: 75,
          created_at: new Date().toISOString()
        },
        {
          id: "5",
          name: "Gaming Mouse",
          description: "High-precision gaming mouse with RGB lighting",
          price: 79.99,
          category: "Electronics",
          stock: 40,
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

  const startEditing = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveProduct = async () => {
    if (!editingId || !editForm) return;

    try {
      const updatedProduct = { ...editForm } as Product;
      setProducts(prev => prev.map(p => p.id === editingId ? updatedProduct : p));
      setEditingId(null);
      setEditForm({});

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
        <div className="animate-pulse">
          <div className="h-10 bg-muted rounded mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    />
                  ) : (
                    <span className="font-medium">{product.name}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Textarea
                      value={editForm.description || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                      className="min-h-[60px]"
                    />
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      {product.description || "No description"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="number"
                      step="0.01"
                      value={editForm.price || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    />
                  ) : (
                    <span className="font-semibold">{formatCurrency(product.price)}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      value={editForm.category || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                    />
                  ) : (
                    <span className="text-sm">{product.category}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === product.id ? (
                    <Input
                      type="number"
                      value={editForm.stock || ""}
                      onChange={(e) => setEditForm(prev => ({ ...prev, stock: parseInt(e.target.value) }))}
                    />
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stock > 0 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {product.stock}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {editingId === product.id ? (
                      <>
                        <Button size="sm" onClick={saveProduct} variant="outline">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="sm" onClick={cancelEditing} variant="outline">
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => startEditing(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}