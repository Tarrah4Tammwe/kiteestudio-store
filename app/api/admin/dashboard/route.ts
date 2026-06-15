import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const [
    { data: orders },
    { data: products },
    { count: totalOrders },
  ] = await Promise.all([
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('products').select('id, name, status, product_type').order('name'),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
  ]);

  const allOrders = await supabase.from('orders').select('amount, amount_paid, status');
  const completed = (allOrders.data || []).filter((o: any) => o.status === 'complete' || o.status === 'completed');
  const revenue = completed.reduce((sum: number, o: any) => sum + (o.amount_paid || o.amount || 0), 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthOrders = await supabase.from('orders')
    .select('amount, amount_paid, status')
    .gte('created_at', startOfMonth);
  const monthCompleted = (monthOrders.data || []).filter((o: any) => o.status === 'complete' || o.status === 'completed');
  const monthRevenue = monthCompleted.reduce((sum: number, o: any) => sum + (o.amount_paid || o.amount || 0), 0);

  return NextResponse.json({
    stats: {
      totalRevenue: revenue,
      monthRevenue,
      totalOrders: totalOrders || 0,
      liveProducts: (products || []).filter((p: any) => p.status === 'live').length,
      totalProducts: (products || []).length,
    },
    recentOrders: orders || [],
    products: products || [],
  });
}
