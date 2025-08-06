-- Add admin policies for profiles table to allow admins to manage users
CREATE POLICY "Admins can view all profiles" 
ON profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all profiles" 
ON profiles 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin policy for orders table to allow admins to view all orders
CREATE POLICY "Admins can view all orders" 
ON orders 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update all orders" 
ON orders 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));