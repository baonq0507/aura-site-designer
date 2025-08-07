import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { username, phoneNumber, password, fundPassword, invitationCode } = await req.json();

    if (!username || !phoneNumber || !password || !fundPassword) {
      throw new Error('Username, phone number, password, and fund password are required');
    }

    console.log('Creating user with username:', username, 'and phone:', phoneNumber);

    // Check if username or phone number already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('username, phone_number')
      .or(`username.eq.${username},phone_number.eq.${phoneNumber}`)
      .single();

    if (existingProfile) {
      const duplicateField = existingProfile.username === username ? 'Username' : 'Phone number';
      return new Response(
        JSON.stringify({ error: `${duplicateField} already exists` }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Generate a unique email for auth.users table (required by Supabase)
    const { data: generatedEmail, error: emailError } = await supabase.rpc('generate_unique_email', {
      username_input: username
    });

    if (emailError || !generatedEmail) {
      console.error('Error generating email:', emailError);
      throw new Error('Failed to generate internal email');
    }

    console.log('Generated email for auth:', generatedEmail);

    // Create user in auth.users with generated email
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: generatedEmail,
      password: password,
      user_metadata: {
        username: username,
        phone_number: phoneNumber,
        fund_password: fundPassword,
        invitation_code: invitationCode
      }
    });

    if (authError) {
      console.error('Auth creation error:', authError);
      throw authError;
    }

    console.log('User created successfully:', authData.user?.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        user_id: authData.user?.id,
        message: 'User created successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in signup-without-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});