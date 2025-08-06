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

    // Get user's current profile
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

    // Get product details
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

    // Check if user has enough balance
    if (profile.balance < product.price) {
      return new Response(
        JSON.stringify({ error: 'Insufficient balance' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if product has enough stock
    if (product.stock <= 0) {
      return new Response(
        JSON.stringify({ error: 'Product out of stock' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get VIP level commission rate
    const { data: vipLevel } = await supabase
      .from('vip_levels')
      .select('commission_rate')
      .eq('id', profile.vip_level || 1)
      .single();

    const commissionRate = vipLevel?.commission_rate || 0.06; // Default 6% for base level
    const commission = product.price * commissionRate;

    console.log('Commission calculation:', product.price, 'x', commissionRate, '=', commission);

    // Start transaction-like operations
    // 1. Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user_id,
        product_name: product.name,
        total_amount: product.price,
        quantity: 1,
        status: 'completed'
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Update product stock
    const { error: stockError } = await supabase
      .from('products')
      .update({ stock: product.stock - 1 })
      .eq('id', product_id);

    if (stockError) {
      console.error('Stock update error:', stockError);
      // Rollback order if stock update fails
      await supabase.from('orders').delete().eq('id', order.id);
      return new Response(
        JSON.stringify({ error: 'Failed to update stock' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Update user balance: return product price + add commission
    const newBalance = profile.balance + commission;
    
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: newBalance })
      .eq('user_id', user_id);

    if (balanceError) {
      console.error('Balance update error:', balanceError);
      // Rollback previous operations
      await supabase.from('orders').delete().eq('id', order.id);
      await supabase.from('products').update({ stock: product.stock }).eq('id', product_id);
      return new Response(
        JSON.stringify({ error: 'Failed to update balance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Trigger VIP level calculation
    const { error: vipError } = await supabase.rpc('calculate_user_vip_level', {
      user_id_param: user_id
    });

    if (vipError) {
      console.warn('VIP level calculation warning:', vipError);
      // Don't fail the whole operation for this
    }

    // 5. Check for bonus product eligibility
    let bonusProduct = null;
    if (profile.bonus_order_count && profile.bonus_amount && profile.bonus_order_count > 0) {
      // Get user's daily order count
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

      const { data: todayOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user_id)
        .gte('created_at', startOfDay.toISOString())
        .lt('created_at', endOfDay.toISOString());

      const dailyOrderCount = todayOrders?.length || 0;

      console.log('Daily order count:', dailyOrderCount, 'Target:', profile.bonus_order_count);

      // Check if user has reached bonus order target
      if (dailyOrderCount >= profile.bonus_order_count) {
        // Find product with price closest to bonus amount
        const { data: allProducts } = await supabase
          .from('products')
          .select('*')
          .gt('stock', 0);

        if (allProducts && allProducts.length > 0) {
          // Find product with closest price to bonus amount
          bonusProduct = allProducts.reduce((closest, current) => {
            const closestDiff = Math.abs(closest.price - profile.bonus_amount);
            const currentDiff = Math.abs(current.price - profile.bonus_amount);
            return currentDiff < closestDiff ? current : closest;
          });

          console.log('Found bonus product:', bonusProduct.name, 'Price:', bonusProduct.price, 'Target:', profile.bonus_amount);
        }
      }
    }

    console.log('Order processed successfully:', {
      orderId: order.id,
      commission: commission,
      newBalance: newBalance,
      bonusProduct: bonusProduct?.name || null
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        order: order,
        commission: commission,
        newBalance: newBalance,
        bonusProduct: bonusProduct
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