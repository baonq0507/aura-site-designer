-- Create withdrawal transactions table
CREATE TABLE public.withdrawal_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, completed
  withdrawal_password TEXT NOT NULL,
  notes TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.withdrawal_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for withdrawal transactions
CREATE POLICY "Users can view their own withdrawal transactions" 
ON public.withdrawal_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own withdrawal transactions" 
ON public.withdrawal_transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all withdrawal transactions" 
ON public.withdrawal_transactions 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update withdrawal transactions" 
ON public.withdrawal_transactions 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_withdrawal_transactions_updated_at
BEFORE UPDATE ON public.withdrawal_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to process withdrawal
CREATE OR REPLACE FUNCTION public.process_withdrawal_request(
  user_id_param UUID,
  amount_param NUMERIC,
  password_param TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_balance NUMERIC;
  user_fund_password TEXT;
  withdrawal_id UUID;
  result JSON;
BEGIN
  -- Get user's current balance and fund password
  SELECT balance, fund_password
  INTO current_balance, user_fund_password
  FROM public.profiles
  WHERE user_id = user_id_param;
  
  -- Check if user exists
  IF NOT FOUND THEN
    RETURN json_build_object(
      'success', false,
      'error', 'User not found'
    );
  END IF;
  
  -- Validate withdrawal password
  IF user_fund_password IS NULL OR user_fund_password != password_param THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid withdrawal password'
    );
  END IF;
  
  -- Check if amount is valid
  IF amount_param <= 0 THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Invalid withdrawal amount'
    );
  END IF;
  
  -- Check if user has sufficient balance
  IF current_balance < amount_param THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Insufficient balance'
    );
  END IF;
  
  -- Create withdrawal transaction record
  INSERT INTO public.withdrawal_transactions (
    user_id,
    amount,
    withdrawal_password,
    status
  ) VALUES (
    user_id_param,
    amount_param,
    password_param,
    'pending'
  ) RETURNING id INTO withdrawal_id;
  
  -- Update user balance (deduct the withdrawal amount)
  UPDATE public.profiles
  SET 
    balance = balance - amount_param,
    updated_at = now()
  WHERE user_id = user_id_param;
  
  RETURN json_build_object(
    'success', true,
    'withdrawal_id', withdrawal_id,
    'message', 'Withdrawal request submitted successfully'
  );
  
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', 'An error occurred while processing the withdrawal'
  );
END;
$$;