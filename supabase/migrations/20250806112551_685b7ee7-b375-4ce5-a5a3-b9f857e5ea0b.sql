-- Create products table with VIP level association
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  category text,
  stock integer NOT NULL DEFAULT 0,
  vip_level_id integer NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_products_vip_level 
    FOREIGN KEY (vip_level_id) 
    REFERENCES public.vip_levels(id) 
    ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products" 
ON public.products 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products" 
ON public.products 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add update trigger
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample products for different VIP levels
INSERT INTO public.products (name, description, price, category, stock, vip_level_id) VALUES
-- VIP Level 0 (Base) Products
('Basic Headphones', 'Entry-level wired headphones', 29.99, 'Electronics', 100, 0),
('Simple T-Shirt', 'Basic cotton t-shirt', 15.99, 'Clothing', 200, 0),
('Coffee Mug', 'Standard ceramic coffee mug', 8.99, 'Home & Garden', 150, 0),
('Notebook', 'Basic spiral notebook', 3.99, 'Office Supplies', 300, 0),
('USB Cable', 'Standard USB charging cable', 12.99, 'Electronics', 250, 0),

-- VIP Level 1 Products
('Wireless Earbuds', 'Basic wireless earbuds', 59.99, 'Electronics', 80, 1),
('Premium T-Shirt', 'Organic cotton premium t-shirt', 29.99, 'Clothing', 120, 1),
('Insulated Tumbler', 'Stainless steel insulated tumbler', 24.99, 'Home & Garden', 100, 1),
('Leather Notebook', 'Genuine leather bound notebook', 19.99, 'Office Supplies', 80, 1),
('Fast Charging Cable', 'Quick charge USB-C cable', 19.99, 'Electronics', 150, 1),

-- VIP Level 2 Products
('Noise-Canceling Headphones', 'Active noise cancellation headphones', 149.99, 'Electronics', 60, 2),
('Designer Polo Shirt', 'Premium polo shirt', 49.99, 'Clothing', 80, 2),
('Smart Coffee Maker', 'Programmable coffee maker', 89.99, 'Home & Garden', 40, 2),
('Executive Pen Set', 'Premium pen set with case', 39.99, 'Office Supplies', 50, 2),
('Wireless Charger', 'Fast wireless charging pad', 34.99, 'Electronics', 70, 2),

-- VIP Level 3 Products
('Gaming Headset', 'Professional gaming headset with RGB', 199.99, 'Electronics', 40, 3),
('Cashmere Sweater', 'Luxury cashmere sweater', 129.99, 'Clothing', 30, 3),
('Espresso Machine', 'Semi-automatic espresso machine', 299.99, 'Home & Garden', 20, 3),
('Fountain Pen', 'Premium fountain pen', 89.99, 'Office Supplies', 25, 3),
('Power Bank', 'High-capacity portable charger', 59.99, 'Electronics', 60, 3),

-- VIP Level 4 Products
('Studio Monitor Headphones', 'Professional studio headphones', 299.99, 'Electronics', 25, 4),
('Silk Dress Shirt', 'Premium silk dress shirt', 199.99, 'Clothing', 20, 4),
('Smart Home Hub', 'Central smart home control system', 199.99, 'Electronics', 30, 4),
('Ergonomic Office Chair', 'Premium ergonomic chair', 399.99, 'Furniture', 15, 4),
('Tablet Stand', 'Adjustable aluminum tablet stand', 79.99, 'Electronics', 40, 4),

-- VIP Level 5 Products
('High-End DAC/Amp', 'Audiophile DAC and amplifier', 599.99, 'Electronics', 15, 5),
('Designer Jacket', 'Limited edition designer jacket', 399.99, 'Clothing', 10, 5),
('Smart Refrigerator', 'IoT enabled smart refrigerator', 1299.99, 'Appliances', 5, 5),
('Executive Desk', 'Handcrafted executive desk', 899.99, 'Furniture', 8, 5),
('Professional Camera', 'DSLR camera with lens kit', 799.99, 'Electronics', 12, 5);