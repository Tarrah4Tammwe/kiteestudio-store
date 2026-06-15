'use client';
import { useState, useEffect, useCallback } from 'react';

type Tab = 'dashboard' | 'products' | 'orders';

interface Product {
  id: string; slug: string; name: string; tagline: string; description: string;
  price_gbp: number; status: string; product_type: string; category_label: string;
  category_slug: string; stripe_price_id: string; seo_title: string; seo_description: string;
}
interface Order {
  id: string; customer_email: string; customer_name: string; product_name: string;
  amount_paid: number; amount: number; status: string; created_at: string;
  stripe_session_id: string; download_count: number;
}
interface Stats {
  totalRevenue: number; monthRevenue: number; totalOrders: number;
  liveProducts: number; totalProducts: number;
}

const EMPTY_PRODUCT: Partial<Product> = {
  slug: '', name: '', tagline: '', description: '', price_gbp: 0,
  status: 'draft', product_type: 'app', category_label: '', category_slug: '',
  stripe_price_id: '', seo_title: '', seo_description: '',
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success'|'error'>('success');

  // Product modal state
  const [productModal, setProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>(EMPTY_PRODUCT);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Order search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('');

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  function showToast(msg: string, type: 'success'|'error' = 'success') {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(''), 3500);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) { sessionStorage.setItem('ks_admin', '1'); setAuthed(true); }
    else setAuthError('Incorrect password.');
  }

  useEffect(() => { if (sessionStorage.getItem('ks_admin')) setAuthed(true); }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/dashboard');
    const data = await res.json();
    setStats(data.stats);
    setRecentOrders(data.recentOrders || []);
    setLoading(false);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/products');
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }, []);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (orderSearch) params.set('search', orderSearch);
    if (orderStatusFilter) params.set('status', orderStatusFilter);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, [orderSearch, orderStatusFilter]);

  useEffect(() => {
    if (!authed) return;
    if (tab === 'dashboard') loadDashboard();
    if (tab === 'products') loadProducts();
    if (tab === 'orders') loadOrders();
  }, [authed, tab, loadDashboard, loadProducts, loadOrders]);

  function openNewProduct() {
    setEditingProduct({ ...EMPTY_PRODUCT });
    setIsNewProduct(true);
    setProductModal(true);
  }

  function openEditProduct(p: Product) {
    setEditingProduct({ ...p });
    setIsNewProduct(false);
    setProductModal(true);
  }

  async function saveProduct() {
    setSavingProduct(true);
    try {
      if (isNewProduct) {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        showToast('Product created ✓');
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId: editingProduct.id, ...editingProduct }),
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        showToast('Product saved ✓');
      }
      setProductModal(false);
      loadProducts();
    } catch (err: any) {
      showToast(err.message || 'Save failed', 'error');
    }
    setSavingProduct(false);
  }

  async function deleteProduct(id: string) {
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.error) { showToast(data.error, 'error'); return; }
    showToast('Product deleted');
    setDeleteConfirm(null);
    loadProducts();
  }

  async function updateOrderStatus(orderId: string, status: string) {
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId, status }),
    });
    const data = await res.json();
    if (data.error) { showToast(data.error, 'error'); return; }
    showToast('Order updated ✓');
    loadOrders();
  }

  function fmt(pence: number) {
    return `£${((pence || 0) / 100).toFixed(2)}`;
  }

  // ── STYLES ──
  const c = {
    page: { minHeight: '100vh', background: 'var(--black)', paddingTop: 'var(--nav-h)' } as React.CSSProperties,
    header: { background: 'var(--black-3)', borderBottom: '1px solid var(--border)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: '16px' },
    tabBar: { display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 48px', background: 'var(--black-2)' },
    body: { padding: '40px 48px', maxWidth: '1200px' },
    tabBtn: (active: boolean): React.CSSProperties => ({
      background: 'none', border: 'none', cursor: 'pointer',
      fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em',
      textTransform: 'uppercase' as const,
      color: active ? 'var(--gold)' : 'var(--cream-dim)',
      padding: '16px 20px',
      borderBottom: active ? '2px solid var(--gold-pure)' : '2px solid transparent',
      transition: 'all 0.2s',
    }),
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--cream-muted)', padding: '10px 14px', textAlign: 'left' as const, borderBottom: '1px solid var(--border)' },
    td: { padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--cream-dim)', verticalAlign: 'middle' as const },
    input: { background: 'var(--black-2)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '14px', padding: '10px 14px', width: '100%', outline: 'none', borderRadius: '2px' } as React.CSSProperties,
    textarea: { background: 'var(--black-2)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '14px', padding: '10px 14px', width: '100%', outline: 'none', borderRadius: '2px', minHeight: '80px', resize: 'vertical' as const } as React.CSSProperties,
    select: { background: 'var(--black-2)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '10px 14px', width: '100%', outline: 'none', borderRadius: '2px' } as React.CSSProperties,
    label: { fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--cream-muted)', display: 'block', marginBottom: '6px' } as React.CSSProperties,
    fieldRow: { marginBottom: '20px' } as React.CSSProperties,
    grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } as React.CSSProperties,
    btnGold: { background: 'var(--gold-pure)', color: 'var(--black)', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '10px 20px', cursor: 'pointer' } as React.CSSProperties,
    btnOutline: { background: 'none', border: '1px solid var(--border)', color: 'var(--cream-dim)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '8px 16px', cursor: 'pointer' } as React.CSSProperties,
    btnRed: { background: 'rgba(220,50,50,0.15)', border: '1px solid rgba(220,50,50,0.3)', color: '#e57373', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '8px 16px', cursor: 'pointer' } as React.CSSProperties,
    modal: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '40px 20px', overflowY: 'auto' as const },
    modalBox: { background: 'var(--black-2)', border: '1px solid var(--border)', width: '100%', maxWidth: '680px', padding: '40px', position: 'relative' as const },
    statCard: { background: 'var(--black-3)', border: '1px solid var(--border)', padding: '28px 32px' } as React.CSSProperties,
  };

  function statusBadge(status: string) {
    const map: Record<string, { bg: string; color: string }> = {
      live:         { bg: 'rgba(127,176,131,0.15)', color: '#7FB083' },
      draft:        { bg: 'rgba(100,100,100,0.15)', color: 'var(--cream-muted)' },
      'coming-soon':{ bg: 'rgba(212,175,55,0.1)',   color: 'var(--gold)' },
      complete:     { bg: 'rgba(127,176,131,0.15)', color: '#7FB083' },
      completed:    { bg: 'rgba(127,176,131,0.15)', color: '#7FB083' },
      pending:      { bg: 'rgba(212,175,55,0.1)',   color: 'var(--gold)' },
      refunded:     { bg: 'rgba(220,50,50,0.1)',    color: '#e57373' },
      failed:       { bg: 'rgba(220,50,50,0.1)',    color: '#e57373' },
    };
    const s = map[status] || { bg: 'rgba(100,100,100,0.1)', color: 'var(--cream-muted)' };
    return (
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', background: s.bg, color: s.color, border: `1px solid ${s.color}33`, padding: '3px 9px' }}>
        {status}
      </span>
    );
  }

  // ── LOGIN ──
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 600, color: 'var(--gold)', textAlign: 'center', marginBottom: '6px' }}>KiTee Studio</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--cream-muted)', textAlign: 'center', marginBottom: '40px' }}>Admin</div>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} style={c.input} autoFocus />
            {authError && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#e57373', textAlign: 'center' }}>{authError}</p>}
            <button type="submit" style={{ ...c.btnGold, padding: '14px', fontSize: '10px' }}>Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // ── DASHBOARD TAB ──
  const DashboardTab = () => (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>Dashboard</h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--cream-muted)', letterSpacing: '0.1em' }}>KiTee Studio — Store Overview</p>
      </div>

      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}>
          {[
            { label: 'Total Revenue', value: fmt(stats.totalRevenue) },
            { label: 'This Month', value: fmt(stats.monthRevenue) },
            { label: 'Total Orders', value: String(stats.totalOrders) },
            { label: 'Live Products', value: `${stats.liveProducts} / ${stats.totalProducts}` },
          ].map(s => (
            <div key={s.label} style={c.statCard}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-muted)', marginBottom: '10px' }}>{s.label}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 600, color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>
      )}

      <div>
        <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-muted)', marginBottom: '16px' }}>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cream-muted)', padding: '32px 0' }}>No orders yet.</p>
        ) : (
          <table style={c.table}>
            <thead><tr>
              {['Date', 'Customer', 'Product', 'Amount', 'Status'].map(h => <th key={h} style={c.th}>{h}</th>)}
            </tr></thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td style={c.td}>{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                  <td style={c.td}>{o.customer_email || '—'}</td>
                  <td style={c.td}>{o.product_name || '—'}</td>
                  <td style={c.td}>{fmt(o.amount_paid || o.amount)}</td>
                  <td style={c.td}>{statusBadge(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

  // ── PRODUCTS TAB ──
  const ProductsTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>Products</h2>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted)' }}>{products.length} product{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button style={c.btnGold} onClick={openNewProduct}>+ Add Product</button>
      </div>

      <table style={c.table}>
        <thead><tr>
          {['Product', 'Type', 'Category', 'Price', 'Stripe ID', 'Status', 'Actions'].map(h => <th key={h} style={c.th}>{h}</th>)}
        </tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td style={c.td}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--cream)' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cream-muted)', marginTop: '2px' }}>{p.slug}</div>
              </td>
              <td style={c.td}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.product_type}</span></td>
              <td style={c.td}>{p.category_label || '—'}</td>
              <td style={c.td} >£{p.price_gbp ?? 0}</td>
              <td style={c.td}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cream-muted)' }}>
                  {p.stripe_price_id ? p.stripe_price_id.slice(0, 20) + '…' : <span style={{ opacity: 0.4 }}>not set</span>}
                </span>
              </td>
              <td style={c.td}>{statusBadge(p.status)}</td>
              <td style={c.td}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={c.btnOutline} onClick={() => openEditProduct(p)}>Edit</button>
                  <button style={c.btnRed} onClick={() => setDeleteConfirm(p.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // ── ORDERS TAB ──
  const OrdersTab = () => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>Orders</h2>
          <p style={{ fontSize: '13px', color: 'var(--cream-muted)' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <input
            placeholder="Search by email..."
            value={orderSearch}
            onChange={e => setOrderSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && loadOrders()}
            style={{ ...c.input, width: '240px' }}
          />
          <select value={orderStatusFilter} onChange={e => { setOrderStatusFilter(e.target.value); }} style={{ ...c.select, width: '140px' }}>
            <option value="">All statuses</option>
            <option value="complete">Complete</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
            <option value="failed">Failed</option>
          </select>
          <button style={c.btnOutline} onClick={loadOrders}>Search</button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cream-muted)', padding: '48px 0' }}>No orders found.</p>
      ) : (
        <table style={c.table}>
          <thead><tr>
            {['Date', 'Customer', 'Product', 'Amount', 'Downloads', 'Status', 'Actions'].map(h => <th key={h} style={c.th}>{h}</th>)}
          </tr></thead>
          <tbody>
            {orders.map(o => (
              <tr key={o.id}>
                <td style={c.td}>{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                <td style={c.td}>
                  <div>{o.customer_email || '—'}</div>
                  {o.customer_name && <div style={{ fontSize: '11px', color: 'var(--cream-muted)', marginTop: '2px' }}>{o.customer_name}</div>}
                </td>
                <td style={c.td}>{o.product_name || '—'}</td>
                <td style={c.td}>{fmt(o.amount_paid || o.amount)}</td>
                <td style={c.td}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{o.download_count ?? 0}</span></td>
                <td style={c.td}>{statusBadge(o.status)}</td>
                <td style={c.td}>
                  <select
                    value={o.status}
                    onChange={e => updateOrderStatus(o.id, e.target.value)}
                    style={{ ...c.select, width: '120px', fontSize: '9px' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div style={c.page}>
      {/* Header */}
      <div style={c.header}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--gold)' }}>Admin Panel</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-muted)', marginTop: '4px' }}>KiTee Studio</div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-muted)' }}>View Site ↗</a>
          <button onClick={() => { sessionStorage.removeItem('ks_admin'); setAuthed(false); }} style={c.btnOutline}>Sign Out</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={c.tabBar}>
        {(['dashboard', 'products', 'orders'] as Tab[]).map(t => (
          <button key={t} style={c.tabBtn(tab === t)} onClick={() => setTab(t)}>
            {t === 'dashboard' ? 'Dashboard' : t === 'products' ? 'Products' : 'Orders'}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={c.body}>
        {loading ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cream-muted)', padding: '48px 0' }}>Loading...</p>
        ) : (
          <>
            {tab === 'dashboard' && <DashboardTab />}
            {tab === 'products' && <ProductsTab />}
            {tab === 'orders' && <OrdersTab />}
          </>
        )}
      </div>

      {/* Product Modal */}
      {productModal && (
        <div style={c.modal} onClick={e => { if (e.target === e.currentTarget) setProductModal(false); }}>
          <div style={c.modalBox}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--gold)' }}>
                  {isNewProduct ? 'Add Product' : 'Edit Product'}
                </div>
              </div>
              <button onClick={() => setProductModal(false)} style={{ background: 'none', border: 'none', color: 'var(--cream-muted)', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
            </div>

            <div style={c.grid2}>
              <div style={c.fieldRow}>
                <label style={c.label}>Product Name *</label>
                <input style={c.input} value={editingProduct.name || ''} onChange={e => setEditingProduct(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Burnout Recovery Blueprint" />
              </div>
              <div style={c.fieldRow}>
                <label style={c.label}>Slug *</label>
                <input style={c.input} value={editingProduct.slug || ''} onChange={e => setEditingProduct(p => ({ ...p, slug: e.target.value }))} placeholder="e.g. burnout-recovery-blueprint" />
              </div>
            </div>

            <div style={c.fieldRow}>
              <label style={c.label}>Tagline *</label>
              <input style={c.input} value={editingProduct.tagline || ''} onChange={e => setEditingProduct(p => ({ ...p, tagline: e.target.value }))} placeholder="One-line description shown on product card" />
            </div>

            <div style={c.fieldRow}>
              <label style={c.label}>Description</label>
              <textarea style={c.textarea} value={editingProduct.description || ''} onChange={e => setEditingProduct(p => ({ ...p, description: e.target.value }))} placeholder="Full product description for the product page" />
            </div>

            <div style={c.grid2}>
              <div style={c.fieldRow}>
                <label style={c.label}>Type</label>
                <select style={c.select} value={editingProduct.product_type || 'app'} onChange={e => setEditingProduct(p => ({ ...p, product_type: e.target.value }))}>
                  <option value="app">App</option>
                  <option value="template">Template</option>
                </select>
              </div>
              <div style={c.fieldRow}>
                <label style={c.label}>Status</label>
                <select style={c.select} value={editingProduct.status || 'draft'} onChange={e => setEditingProduct(p => ({ ...p, status: e.target.value }))}>
                  <option value="live">Live</option>
                  <option value="draft">Draft</option>
                  <option value="coming-soon">Coming Soon</option>
                </select>
              </div>
            </div>

            <div style={c.grid2}>
              <div style={c.fieldRow}>
                <label style={c.label}>Category Label</label>
                <input style={c.input} value={editingProduct.category_label || ''} onChange={e => setEditingProduct(p => ({ ...p, category_label: e.target.value }))} placeholder="e.g. AuDHD & Neurodivergent" />
              </div>
              <div style={c.fieldRow}>
                <label style={c.label}>Category Slug</label>
                <input style={c.input} value={editingProduct.category_slug || ''} onChange={e => setEditingProduct(p => ({ ...p, category_slug: e.target.value }))} placeholder="e.g. audhd" />
              </div>
            </div>

            <div style={c.grid2}>
              <div style={c.fieldRow}>
                <label style={c.label}>Price (GBP £)</label>
                <input style={c.input} type="number" min="0" step="1" value={editingProduct.price_gbp ?? 0} onChange={e => setEditingProduct(p => ({ ...p, price_gbp: parseFloat(e.target.value) }))} />
              </div>
              <div style={c.fieldRow}>
                <label style={c.label}>Stripe Price ID</label>
                <input style={c.input} value={editingProduct.stripe_price_id || ''} onChange={e => setEditingProduct(p => ({ ...p, stripe_price_id: e.target.value }))} placeholder="price_..." />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '4px', marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '16px' }}>SEO</div>
              <div style={c.fieldRow}>
                <label style={c.label}>SEO Title</label>
                <input style={c.input} value={editingProduct.seo_title || ''} onChange={e => setEditingProduct(p => ({ ...p, seo_title: e.target.value }))} placeholder="Page title for search engines" />
              </div>
              <div style={c.fieldRow}>
                <label style={c.label}>SEO Description</label>
                <textarea style={{ ...c.textarea, minHeight: '60px' }} value={editingProduct.seo_description || ''} onChange={e => setEditingProduct(p => ({ ...p, seo_description: e.target.value }))} placeholder="Meta description (max 160 chars)" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button style={c.btnOutline} onClick={() => setProductModal(false)}>Cancel</button>
              <button style={{ ...c.btnGold, opacity: savingProduct ? 0.6 : 1 }} onClick={saveProduct} disabled={savingProduct}>
                {savingProduct ? 'Saving…' : isNewProduct ? 'Create Product' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={c.modal} onClick={e => { if (e.target === e.currentTarget) setDeleteConfirm(null); }}>
          <div style={{ ...c.modalBox, maxWidth: '420px', marginTop: '120px' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--cream)', marginBottom: '12px' }}>Delete product?</div>
            <p style={{ fontSize: '14px', color: 'var(--cream-muted)', marginBottom: '28px' }}>This cannot be undone. The product will be permanently removed from the database.</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button style={c.btnOutline} onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button style={c.btnRed} onClick={() => deleteProduct(deleteConfirm)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div style={{
        position: 'fixed', bottom: '32px', right: '32px',
        background: toastType === 'error' ? 'rgba(220,50,50,0.95)' : 'var(--black-3)',
        border: `1px solid ${toastType === 'error' ? 'rgba(220,50,50,0.5)' : 'var(--border-mid)'}`,
        color: toastType === 'error' ? '#fff' : 'var(--cream)',
        fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em',
        padding: '14px 22px', zIndex: 9999,
        opacity: toast ? 1 : 0, transform: toast ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.25s', pointerEvents: 'none',
      }}>
        {toast}
      </div>
    </div>
  );
}
