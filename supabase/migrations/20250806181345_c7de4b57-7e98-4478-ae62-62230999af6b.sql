-- Add referral tracking to profiles table
ALTER TABLE public.profiles 
ADD COLUMN invited_by_code TEXT;

-- Create index for better performance when querying invited users
CREATE INDEX idx_profiles_invited_by_code ON public.profiles(invited_by_code);

-- Add comment to explain the column
COMMENT ON COLUMN public.profiles.invited_by_code IS 'The invitation code that was used when this user signed up';