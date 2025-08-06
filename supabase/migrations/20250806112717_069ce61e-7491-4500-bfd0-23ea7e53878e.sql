-- Create products table with VIP level association
CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  price numeric NOT NULL DEFAULT 0,
  category text,
  stock integer NOT NULL DEFAULT 0,
  vip_level_id integer NOT NULL DEFAULT 1,
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
-- VIP Level 1 Products
('Basic Headphones', 'Entry-level wired headphones', 29.99, 'Electronics', 100, 1),
('Simple T-Shirt', 'Basic cotton t-shirt', 15.99, 'Clothing', 200, 1),
('Coffee Mug', 'Standard ceramic coffee mug', 8.99, 'Home & Garden', 150, 1),
('Notebook', 'Basic spiral notebook', 3.99, 'Office Supplies', 300, 1),
('USB Cable', 'Standard USB charging cable', 12.99, 'Electronics', 250, 1),

-- VIP Level 2 Products
('Wireless Earbuds', 'Basic wireless earbuds', 59.99, 'Electronics', 80, 2),
('Premium T-Shirt', 'Organic cotton premium t-shirt', 29.99, 'Clothing', 120, 2),
('Insulated Tumbler', 'Stainless steel insulated tumbler', 24.99, 'Home & Garden', 100, 2),
('Leather Notebook', 'Genuine leather bound notebook', 19.99, 'Office Supplies', 80, 2),
('Fast Charging Cable', 'Quick charge USB-C cable', 19.99, 'Electronics', 150, 2),

-- VIP Level 3 Products
('Noise-Canceling Headphones', 'Active noise cancellation headphones', 149.99, 'Electronics', 60, 3),
('Designer Polo Shirt', 'Premium polo shirt', 49.99, 'Clothing', 80, 3),
('Smart Coffee Maker', 'Programmable coffee maker', 89.99, 'Home & Garden', 40, 3),
('Executive Pen Set', 'Premium pen set with case', 39.99, 'Office Supplies', 50, 3),
('Wireless Charger', 'Fast wireless charging pad', 34.99, 'Electronics', 70, 3),

-- VIP Level 4 Products
('Gaming Headset', 'Professional gaming headset with RGB', 199.99, 'Electronics', 40, 4),
('Cashmere Sweater', 'Luxury cashmere sweater', 129.99, 'Clothing', 30, 4),
('Espresso Machine', 'Semi-automatic espresso machine', 299.99, 'Home & Garden', 20, 4),
('Fountain Pen', 'Premium fountain pen', 89.99, 'Office Supplies', 25, 4),
('Power Bank', 'High-capacity portable charger', 59.99, 'Electronics', 60, 4),

-- VIP Level 5 Products
('Studio Monitor Headphones', 'Professional studio headphones', 299.99, 'Electronics', 25, 5),
('Silk Dress Shirt', 'Premium silk dress shirt', 199.99, 'Clothing', 20, 5),
('Smart Home Hub', 'Central smart home control system', 199.99, 'Electronics', 30, 5),
('Ergonomic Office Chair', 'Premium ergonomic chair', 399.99, 'Furniture', 15, 5),
('Tablet Stand', 'Adjustable aluminum tablet stand', 79.99, 'Electronics', 40, 5),

-- VIP Level 6 Products
('High-End DAC/Amp', 'Audiophile DAC and amplifier', 599.99, 'Electronics', 15, 6),
('Designer Jacket', 'Limited edition designer jacket', 399.99, 'Clothing', 10, 6),
('Smart Refrigerator', 'IoT enabled smart refrigerator', 1299.99, 'Appliances', 5, 6),
('Executive Desk', 'Handcrafted executive desk', 899.99, 'Furniture', 8, 6),
('Professional Camera', 'DSLR camera with lens kit', 799.99, 'Electronics', 12, 6),

-- VIP Level 7 Products
('Luxury Watch', 'Swiss luxury timepiece', 2999.99, 'Accessories', 3, 7),
('Diamond Earrings', 'Premium diamond jewelry', 1899.99, 'Jewelry', 5, 7),
('Home Theater System', 'Professional home theater setup', 4999.99, 'Electronics', 2, 7),
('Leather Sofa Set', 'Italian leather furniture set', 3499.99, 'Furniture', 4, 7),
('Wine Collection', 'Vintage wine collection', 1299.99, 'Collectibles', 6, 7),

-- VIP Level 8 Products
('Vintage Guitar', 'Collectible vintage electric guitar', 8999.99, 'Musical Instruments', 2, 8),
('Art Sculpture', 'Limited edition art piece', 15999.99, 'Art', 1, 8),
('Racing Simulator', 'Professional racing simulation setup', 12999.99, 'Gaming', 2, 8),
('Custom Motorcycle', 'Custom built luxury motorcycle', 25999.99, 'Vehicles', 1, 8),
('Precious Metals Set', 'Investment grade metals collection', 19999.99, 'Investment', 3, 8),

-- VIP Level 9 Products
('Private Jet Share', 'Fractional private jet ownership', 99999.99, 'Travel', 1, 9),
('Yacht Charter', 'Luxury yacht charter package', 149999.99, 'Travel', 1, 9),
('Real Estate Portfolio', 'Premium property investment', 999999.99, 'Investment', 1, 9),
('Art Collection', 'Museum quality art collection', 299999.99, 'Art', 1, 9),
('Exotic Car', 'Limited edition supercar', 499999.99, 'Vehicles', 1, 9),

-- VIP Level 10 Products
('Private Island', 'Exclusive private island ownership', 9999999.99, 'Real Estate', 1, 10),
('Space Tourism', 'Commercial space flight experience', 2999999.99, 'Travel', 1, 10),
('Billionaire Experience', 'Ultimate luxury lifestyle package', 19999999.99, 'Experiences', 1, 10),
('Historical Artifact', 'Rare historical collectible', 4999999.99, 'Collectibles', 1, 10),
('Custom Mansion', 'Architect designed luxury mansion', 14999999.99, 'Real Estate', 1, 10);