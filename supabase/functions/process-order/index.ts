import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderRequest {
  product_id: string;
  user_id: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { product_id, user_id } = await req.json() as OrderRequest;

    console.log('Processing order for user:', user_id, 'product:', product_id);

    // Lấy thông tin profile người dùng
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance, vip_level, bonus_order_count, bonus_amount')
      .eq('user_id', user_id)
      .single();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Lấy thông tin sản phẩm
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', product_id)
      .single();

    if (productError || !product) {
      console.error('Product error:', productError);
      return new Response(
        JSON.stringify({ error: 'Product not found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Kiểm tra số dư
    if (profile.balance < product.price) {
      return new Response(
        JSON.stringify({ error: 'Insufficient balance' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Lấy tỷ lệ hoa hồng VIP
    const { data: vipLevel } = await supabase
      .from('vip_levels')
      .select('commission_rate')
      .eq('id', profile.vip_level || 1)
      .single();

    const commissionRate = vipLevel?.commission_rate || 0.06; // Mặc định 6%
    const commission = product.price * commissionRate;
    const profit = product.price * commissionRate / 100;

    console.log('Daily Commission calculation:', product.price, 'x', commissionRate, '=', commission);
    console.log('Note: Commission is calculated daily, not cumulative');

    // Cập nhật trạng thái sản phẩm sang completed
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({ status: 'completed', updated_at: new Date().toISOString(), profit: profit, total_amount: product.price })
      .eq('user_id', user_id)
      .eq('product_name', product.name)
      .eq('status', 'pending');

    if (orderUpdateError) {
      // Trả về lỗi đúng như yêu cầu
      return new Response(
        JSON.stringify({ error: "Failed to update product" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Cập nhật số dư người dùng: cộng hoa hồng
    const newBalance = profile.balance + commission;
    
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('user_id', user_id);

    if (balanceError) {
      console.error('Balance update error:', balanceError);
      // Rollback trạng thái sản phẩm
      await supabase.from('products').update({ status: 'pending' }).eq('id', product_id);
      return new Response(
        JSON.stringify({ error: 'Failed to update balance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Tự động cập nhật VIP level qua trigger DB
    console.log('VIP level will be updated automatically by database trigger');

    return new Response(
      JSON.stringify({ 
        success: true, 
        commission: commission,
        newBalance: newBalance,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});