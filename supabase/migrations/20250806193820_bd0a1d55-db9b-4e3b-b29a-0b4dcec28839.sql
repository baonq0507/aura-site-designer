-- Create deposit transactions table for admin top-ups
CREATE TABLE public.deposit_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  admin_id UUID NOT NULL,
  amount NUMERIC NOT NULL CHECK (amount > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.deposit_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for deposit transactions
CREATE POLICY "Admins can view all deposit transactions" 
ON public.deposit_transactions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can create deposit transactions" 
ON public.deposit_transactions 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own deposit transactions" 
ON public.deposit_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_deposit_transactions_updated_at
BEFORE UPDATE ON public.deposit_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();