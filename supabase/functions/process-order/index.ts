import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderRequest {
  product_name: string;
  user_id: string;
}

// Xử lý lỗi 406 Not Acceptable: Trả về header 'Accept' hợp lệ và Content-Type đúng
Deno.serve(async (req) => {
  // Xử lý CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Kiểm tra header Accept, nếu không phải application/json thì trả về 406
  const acceptHeader = req.headers.get('accept');
  if (acceptHeader && !acceptHeader.includes('application/json') && acceptHeader !== '*/*') {
    return new Response(
      JSON.stringify({ error: 'Not Acceptable. Accept header must include application/json.' }),
      { status: 406, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { product_name, user_id } = await req.json() as OrderRequest;

    console.log('Processing order for user:', user_id, 'product:', product_name);

    // Lấy thông tin profile người dùng
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance, vip_level, bonus_order_count, bonus_amount, custom_commission_min, custom_commission_max, use_custom_commission')
      .eq('user_id', user_id)
      .maybeSingle();

    if (profileError || !profile) {
      console.error('Profile error:', profileError);
      return new Response(
        JSON.stringify({ error: 'Không tìm thấy thông tin người dùng' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Lấy thông tin sản phẩm bằng product_name
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('name', product_name)
      .maybeSingle();

    if (productError || !product) {
      console.error('Product error:', productError);
      return new Response(
        JSON.stringify({ error: 'Không tìm thấy sản phẩm' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Kiểm tra số dư
    if (profile.balance < product.price) {
      return new Response(
        JSON.stringify({ error: 'Số dư không đủ' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Tính hoa hồng dựa trên cài đặt tùy chỉnh hoặc VIP level
    let commission: number;
    
    if (profile.use_custom_commission && 
        profile.custom_commission_min !== null && 
        profile.custom_commission_max !== null &&
        profile.custom_commission_max >= profile.custom_commission_min) {
      
      // Sử dụng khoảng hoa hồng tùy chỉnh
      const randomFactor = Math.random(); // Random value between 0 and 1
      commission = profile.custom_commission_min + 
                  (profile.custom_commission_max - profile.custom_commission_min) * randomFactor;
      
      console.log('Sử dụng hoa hồng tùy chỉnh:', profile.custom_commission_min, '-', profile.custom_commission_max);
      console.log('Hoa hồng được chọn:', commission.toFixed(2));
    } else {
      // Sử dụng tỷ lệ hoa hồng VIP
      const { data: vipLevel } = await supabase
        .from('vip_levels')
        .select('commission_rate')
        .eq('id', profile.vip_level || 1)
        .maybeSingle();

      const commissionRate = vipLevel?.commission_rate || 0.06; // Mặc định 6%
      commission = product.price * commissionRate; // Hoa hồng = giá sản phẩm x tỷ lệ hoa hồng
      
      console.log('Sử dụng hoa hồng VIP level:', profile.vip_level, 'tỷ lệ:', commissionRate);
      console.log('Tính hoa hồng hàng ngày:', product.price, 'x', commissionRate, '=', commission);
    }
    
    console.log('Lưu ý: Hoa hồng được tính hàng ngày, không cộng dồn');

    // Cập nhật trạng thái đơn hàng sang completed
    const { error: orderUpdateError } = await supabase
      .from('orders')
      .update({ status: 'completed', updated_at: new Date().toISOString(), total_amount: product.price })
      .eq('user_id', user_id)
      .eq('product_name', product.name)
      .eq('status', 'pending');

    if (orderUpdateError) {
      // Trả về lỗi đúng như yêu cầu
      return new Response(
        JSON.stringify({ error: "Cập nhật đơn hàng thất bại" }),
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
      // Rollback trạng thái đơn hàng
      await supabase.from('orders').update({ status: 'pending' }).eq('user_id', user_id).eq('product_name', product.name);
      return new Response(
        JSON.stringify({ error: 'Cập nhật số dư thất bại' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Tự động cập nhật VIP level qua trigger DB
    console.log('VIP level sẽ được cập nhật tự động qua trigger database');

    return new Response(
      JSON.stringify({ 
        success: true, 
        commission: commission,
        newBalance: newBalance,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Xử lý lỗi trả về từ PostgREST khi có nhiều hơn 1 dòng (PGRST116)
    if (error && typeof error === 'object' && error.code === 'PGRST116') {
      return new Response(
        JSON.stringify({ error: 'Có nhiều hơn một bản ghi được trả về. Vui lòng kiểm tra dữ liệu trong bảng.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Lỗi máy chủ nội bộ' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});