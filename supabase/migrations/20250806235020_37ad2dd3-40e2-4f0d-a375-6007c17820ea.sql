-- Add admin DELETE policy for profiles table
CREATE POLICY "Admins can delete all profiles" 
ON profiles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add admin DELETE policy for user_roles table  
CREATE POLICY "Admins can delete all user_roles" 
ON user_roles 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));