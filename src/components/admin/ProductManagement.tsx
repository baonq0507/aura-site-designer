import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Save, X, Trash2, Edit, Upload, MoreVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AdminPagination } from "./AdminPagination";
import { usePagination } from "@/hooks/use-pagination";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  stock: number;
  vip_level_id: number;
  image_url: string | null;
  created_at: string;
  vip_levels?: {
    level_name: string;
  };
}

interface VipLevel {
  id: number;
  level_name: string;
}

export function ProductManagement() {
  const { t } = useLanguage();
  const [products, setProducts] = useState<Product[]>([]);
  const [vipLevels, setVipLevels] = useState<VipLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    vip_level_id: "1",
    image: null as File | null
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { toast } = useToast();

  // Pagination hook
  const pagination = usePagination({
    data: products,
    itemsPerPage
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch VIP levels
      const { data: vipData, error: vipError } = await supabase
        .from('vip_levels')
        .select('id, level_name')
        .order('id');

      if (vipError) throw vipError;
      setVipLevels(vipData || []);

      // Fetch products with VIP level info, sorted by newest first
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select(`
          *,
          vip_levels (
            level_name
          )
        `)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          vip_level_id: parseInt(newProduct.vip_level_id)
        }])
        .select(`
          *,
          vip_levels (
            level_name
          )
        `)
        .single();

      if (error) throw error;

      // Upload image if provided
      if (newProduct.image) {
        const fileExt = newProduct.image.name.split('.').pop();
        const fileName = `product-${data.id}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, newProduct.image);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        const { data: updatedProduct, error: updateError } = await supabase
          .from('products')
          .update({ image_url: publicUrl })
          .eq('id', data.id)
          .select(`
            *,
            vip_levels (
              level_name
            )
          `)
          .single();

        if (updateError) throw updateError;
        setProducts(prev => [updatedProduct, ...prev]);
      } else {
        setProducts(prev => [data, ...prev]);
      }

      setNewProduct({ name: "", price: "", vip_level_id: "1", image: null });
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
      const { data, error } = await supabase
        .from('products')
        .update({
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          category: editForm.category,
          stock: editForm.stock,
          vip_level_id: editForm.vip_level_id
        })
        .eq('id', editingId)
        .select(`
          *,
          vip_levels (
            level_name
          )
        `)
        .single();

      if (error) throw error;

      setProducts(prev => prev.map(p => p.id === editingId ? data : p));
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
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

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

  const handleImageUpload = async (file: File, productId: string) => {
    try {
      setUploadingProductId(productId);
      setUploading(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `product-${productId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      const { data, error: updateError } = await supabase
        .from('products')
        .update({ image_url: publicUrl })
        .eq('id', productId)
        .select(`
          *,
          vip_levels (
            level_name
          )
        `)
        .single();

      if (updateError) throw updateError;

      setProducts(prev => prev.map(p => p.id === productId ? data : p));

      toast({
        title: "Success",
        description: "Product image uploaded successfully"
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      setUploadingProductId(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">{t('admin.product.management')}</h2>
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
        <h2 className="text-2xl font-bold">{t('admin.product.management')}</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.add.product')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.create.new.product')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">{t('admin.product.name')}</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">{t('admin.price')}</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="vip_level">{t('admin.vip.level')}</Label>
                  <Select 
                    value={newProduct.vip_level_id} 
                    onValueChange={(value) => setNewProduct(prev => ({ ...prev, vip_level_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('admin.select.vip.level')} />
                    </SelectTrigger>
                    <SelectContent>
                      {vipLevels.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.level_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="product-image">{t('admin.product.image')}</Label>
                <div className="space-y-2">
                  <Input
                    id="product-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      setNewProduct(prev => ({ ...prev, image: file || null }));
                    }}
                  />
                  {newProduct.image && (
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Upload className="h-4 w-4" />
                      <span>{newProduct.image.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button onClick={handleCreateProduct} className="w-full">
                {t('admin.create.product')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.image')}</TableHead>
              <TableHead>{t('admin.name')}</TableHead>
              <TableHead>{t('admin.price')}</TableHead>
              <TableHead>{t('admin.vip.level')}</TableHead>
              <TableHead>{t('admin.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagination.paginatedData.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex flex-col items-center space-y-2">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">{t('admin.no.image')}</span>
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(file, product.id);
                          }
                        }}
                        className="hidden"
                        id={`upload-${product.id}`}
                      />
                      <label htmlFor={`upload-${product.id}`}>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          asChild
                          disabled={uploadingProductId === product.id}
                        >
                          <span className="cursor-pointer">
                            {uploadingProductId === product.id ? (
                              <div className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full" />
                            ) : (
                              <Upload className="h-3 w-3" />
                            )}
                          </span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </TableCell>
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
                    <Select 
                      value={editForm.vip_level_id?.toString() || ""} 
                      onValueChange={(value) => setEditForm(prev => ({ ...prev, vip_level_id: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {vipLevels.map((level) => (
                          <SelectItem key={level.id} value={level.id.toString()}>
                            {level.level_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.vip_level_id <= 3 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                        : product.vip_level_id <= 6
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : product.vip_level_id <= 8
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                        : 'bg-gold-100 text-gold-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {product.vip_levels?.level_name}
                    </span>
                  )}
                </TableCell>

                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 z-50 bg-background border border-border shadow-lg">
                      {editingId === product.id ? (
                        <>
                          <DropdownMenuItem onClick={saveProduct}>
                            <Save className="w-4 h-4 mr-2" />
                            {t('common.save')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={cancelEditing}>
                            <X className="w-4 h-4 mr-2" />
                            {t('admin.cancel')}
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <>
                          <DropdownMenuItem onClick={() => startEditing(product)}>
                            <Edit className="w-4 h-4 mr-2" />
                            {t('admin.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <AdminPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        itemsPerPage={itemsPerPage}
        onPageChange={pagination.goToPage}
        onItemsPerPageChange={setItemsPerPage}
        onPrevious={pagination.goToPrevious}
        onNext={pagination.goToNext}
        hasNext={pagination.hasNext}
        hasPrevious={pagination.hasPrevious}
        getPageNumbers={pagination.getPageNumbers}
      />
    </div>
  );
}