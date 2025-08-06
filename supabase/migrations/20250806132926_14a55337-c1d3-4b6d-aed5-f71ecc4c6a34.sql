-- Clear existing products and add Farfetch-branded fashion items
DELETE FROM products;

-- Insert Farfetch-branded clothing and bags with images
INSERT INTO products (name, description, price, category, stock, vip_level_id, image_url) VALUES
-- VIP Level 1 Products (Basic Fashion)
('Farfetch Essentials Cotton T-Shirt', 'Premium cotton basic tee from Farfetch collection', 89.99, 'Clothing', 120, 1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'),
('Farfetch Canvas Tote Bag', 'Durable canvas tote with Farfetch branding', 129.99, 'Bags', 80, 1, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'),
('Farfetch Casual Jeans', 'Comfort fit denim jeans in classic blue', 149.99, 'Clothing', 90, 1, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop'),
('Farfetch Crossbody Bag', 'Compact crossbody bag for everyday use', 199.99, 'Bags', 60, 1, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop'),

-- VIP Level 2 Products (Mid-tier Fashion)
('Farfetch Merino Wool Sweater', 'Luxurious merino wool pullover sweater', 299.99, 'Clothing', 70, 2, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop'),
('Farfetch Leather Handbag', 'Genuine leather handbag with gold hardware', 449.99, 'Bags', 45, 2, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'),
('Farfetch Silk Blouse', 'Elegant silk blouse for professional wear', 259.99, 'Clothing', 55, 2, 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=400&fit=crop'),
('Farfetch Designer Backpack', 'Premium designer backpack with laptop compartment', 389.99, 'Bags', 40, 2, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'),

-- VIP Level 3 Products (Premium Fashion)
('Farfetch Cashmere Coat', 'Luxurious cashmere wool winter coat', 799.99, 'Clothing', 35, 3, 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop'),
('Farfetch Italian Leather Clutch', 'Handcrafted Italian leather evening clutch', 349.99, 'Bags', 30, 3, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop'),
('Farfetch Designer Dress', 'Elegant cocktail dress from luxury collection', 599.99, 'Clothing', 25, 3, 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop'),
('Farfetch Luxury Tote', 'Premium leather structured tote bag', 699.99, 'Bags', 20, 3, 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop'),

-- VIP Level 4 Products (High-end Fashion)
('Farfetch Couture Blazer', 'Tailored couture blazer from designer collection', 1299.99, 'Clothing', 20, 4, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'),
('Farfetch Limited Edition Bag', 'Exclusive limited edition designer handbag', 1899.99, 'Bags', 15, 4, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'),
('Farfetch Luxury Trench Coat', 'Classic luxury trench coat in premium fabric', 1599.99, 'Clothing', 18, 4, 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5a?w=400&h=400&fit=crop'),
('Farfetch Designer Briefcase', 'Professional leather briefcase with premium finish', 899.99, 'Bags', 25, 4, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop'),

-- VIP Level 5 Products (Ultra-luxury Fashion)
('Farfetch Haute Couture Gown', 'Exclusive haute couture evening gown', 3999.99, 'Clothing', 8, 5, 'https://images.unsplash.com/photo-1566479179817-c4eace2daaab?w=400&h=400&fit=crop'),
('Farfetch Diamond Collection Bag', 'Ultra-luxury bag with diamond accents', 5999.99, 'Bags', 5, 5, 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=400&fit=crop'),
('Farfetch Bespoke Suit', 'Custom tailored bespoke suit', 2999.99, 'Clothing', 10, 5, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop'),
('Farfetch Platinum Collection Clutch', 'Exclusive platinum collection evening clutch', 2299.99, 'Bags', 6, 5, 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=400&fit=crop');