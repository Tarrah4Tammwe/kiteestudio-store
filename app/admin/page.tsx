'use client';
import { useState, useEffect, useCallback } from 'react';

type Tab = 'dashboard' | 'products' | 'orders' | 'discounts' | 'settings';

interface Product {
  id: string; slug: string; name: string; tagline: string; description: string;
  price_gbp: number; sale_price_gbp?: number; status: string; product_type: string;
  category_label: string; category_slug: string; stripe_price_id: string;
  seo_title: string; seo_description: string; file_url: string; image_url: string;
  features: string[];
}
interface Order {
  id: string; customer_email: string; customer_name: string; product_name: string;
  amount_paid: number; amount: number; status: string; created_at: string;
  stripe_session_id: string; download_count: number;
}
interface DiscountCode {
  id: string; code: string; type: 'percent' | 'fixed'; value: number;
  max_uses?: number; uses_count: number; expires_at?: string; active: boolean; created_at: string;
}
interface Stats { totalRevenue: number; monthRevenue: number; totalOrders: number; liveProducts: number; totalProducts: number; }
interface Settings { [key: string]: string; }

const EMPTY_PRODUCT: Partial<Product> = {
  slug: '', name: '', tagline: '', description: '', price_gbp: 0, sale_price_gbp: undefined,
  status: 'draft', product_type: 'app', category_label: '', category_slug: '',
  stripe_price_id: '', seo_title: '', seo_description: '', file_url: '', image_url: '', features: [],
};
const EMPTY_CODE = { code: '', type: 'percent' as const, value: 10, max_uses: undefined as number | undefined, expires_at: '', active: true };

// ── SHARED STYLES ──────────────────────────────────
const S = {
  input: { background: 'var(--black-2)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '14px', padding: '10px 14px', width: '100%', outline: 'none', borderRadius: '2px' } as React.CSSProperties,
  textarea: { background: 'var(--black-2)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '14px', padding: '10px 14px', width: '100%', outline: 'none', borderRadius: '2px', minHeight: '80px', resize: 'vertical' as const } as React.CSSProperties,
  select: { background: 'var(--black-2)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: '11px', padding: '10px 14px', width: '100%', outline: 'none', borderRadius: '2px' } as React.CSSProperties,
  label: { fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: 'var(--cream-muted)', display: 'block', marginBottom: '6px' },
  field: { marginBottom: '20px' } as React.CSSProperties,
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } as React.CSSProperties,
  grid3: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' } as React.CSSProperties,
  btnGold: { background: 'var(--gold-pure)', color: 'var(--black)', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' as const, padding: '10px 20px', cursor: 'pointer', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  btnOutline: { background: 'none', border: '1px solid var(--border)', color: 'var(--cream-dim)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  btnRed: { background: 'rgba(220,50,50,0.12)', border: '1px solid rgba(220,50,50,0.25)', color: '#e57373', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  btnGreen: { background: 'rgba(127,176,131,0.12)', border: '1px solid rgba(127,176,131,0.25)', color: '#7FB083', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, padding: '8px 16px', cursor: 'pointer', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  th: { fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--cream-muted)', padding: '10px 14px', textAlign: 'left' as const, borderBottom: '1px solid var(--border)' },
  td: { padding: '14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--cream-dim)', verticalAlign: 'middle' as const },
  table: { width: '100%', borderCollapse: 'collapse' as const },
  sectionLabel: { fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--gold)', borderBottom: '1px solid var(--border)', paddingBottom: '10px', marginBottom: '20px', marginTop: '8px' },
};

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    live:          ['rgba(127,176,131,0.15)', '#7FB083'],
    draft:         ['rgba(100,100,100,0.12)', 'var(--cream-muted)'],
    'coming-soon': ['rgba(212,175,55,0.1)',   'var(--gold)'],
    complete:      ['rgba(127,176,131,0.15)', '#7FB083'],
    completed:     ['rgba(127,176,131,0.15)', '#7FB083'],
    pending:       ['rgba(212,175,55,0.1)',   'var(--gold)'],
    refunded:      ['rgba(220,50,50,0.1)',    '#e57373'],
    failed:        ['rgba(220,50,50,0.1)',    '#e57373'],
  };
  const [bg, color] = map[status] || ['rgba(100,100,100,0.1)', 'var(--cream-muted)'];
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', background: bg, color, border: `1px solid ${color}33`, padding: '3px 9px' }}>{status}</span>;
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 1000, padding: '40px 20px', overflowY: 'auto' }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: 'var(--black-2)', border: '1px solid var(--border)', width: '100%', maxWidth: wide ? '800px' : '680px', padding: '40px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--gold)' }}>{title}</div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--cream-muted)', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [authError, setAuthError] = useState('');
  const [tab, setTab] = useState<Tab>('dashboard');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Data
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [codes, setCodes] = useState<DiscountCode[]>([]);
  const [settings, setSettings] = useState<Settings>({});

  // Modals
  const [productModal, setProductModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product>>(EMPTY_PRODUCT);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [codeModal, setCodeModal] = useState(false);
  const [newCode, setNewCode] = useState({ ...EMPTY_CODE });
  const [savingCode, setSavingCode] = useState(false);
  const [shareModal, setShareModal] = useState<Product | null>(null);

  // Order filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  const [resendingEmail, setResendingEmail] = useState<string | null>(null);

  // Settings save
  const [savingSettings, setSavingSettings] = useState(false);
  const [localSettings, setLocalSettings] = useState<Settings>({});

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast(msg); setToastType(type);
    setTimeout(() => setToast(''), 3500);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (res.ok) { sessionStorage.setItem('ks_admin', '1'); setAuthed(true); }
    else setAuthError('Incorrect password.');
  }

  useEffect(() => { if (sessionStorage.getItem('ks_admin')) setAuthed(true); }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/dashboard');
    const data = await res.json();
    setStats(data.stats); setRecentOrders(data.recentOrders || []);
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
    if (orderStatus) params.set('status', orderStatus);
    const res = await fetch(`/api/admin/orders?${params}`);
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }, [orderSearch, orderStatus]);

  const loadCodes = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/discounts');
    const data = await res.json();
    setCodes(data.codes || []);
    setLoading(false);
  }, []);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/settings');
    const data = await res.json();
    setSettings(data.settings || {}); setLocalSettings(data.settings || {});
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authed) return;
    if (tab === 'dashboard') loadDashboard();
    if (tab === 'products') loadProducts();
    if (tab === 'orders') loadOrders();
    if (tab === 'discounts') loadCodes();
    if (tab === 'settings') loadSettings();
  }, [authed, tab]);

  async function saveProduct() {
    setSavingProduct(true);
    try {
      const method = isNewProduct ? 'POST' : 'PATCH';
      const body = isNewProduct ? editProduct : { productId: editProduct.id, ...editProduct };
      const res = await fetch('/api/admin/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      showToast(isNewProduct ? 'Product created ✓' : 'Product saved ✓');
      setProductModal(false); loadProducts();
    } catch (err: any) { showToast(err.message, 'error'); }
    setSavingProduct(false);
  }

  async function deleteProduct() {
    if (!deleteConfirm) return;
    const res = await fetch(`/api/admin/products?id=${deleteConfirm.id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.error) { showToast(data.error, 'error'); return; }
    showToast('Product deleted'); setDeleteConfirm(null); loadProducts();
  }

  async function updateOrderStatus(orderId: string, status: string) {
    await fetch('/api/admin/orders', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId, status }) });
    showToast('Order updated ✓'); loadOrders();
  }

  async function resendDownload(orderId: string) {
    setResendingEmail(orderId);
    const res = await fetch('/api/resend-download', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId }) });
    const data = await res.json();
    if (data.error) showToast(data.error, 'error');
    else showToast('Download email resent ✓');
    setResendingEmail(null);
  }

  async function saveCode() {
    setSavingCode(true);
    const body = { ...newCode, code: newCode.code.toUpperCase(), max_uses: newCode.max_uses || null, expires_at: newCode.expires_at || null };
    const res = await fetch('/api/admin/discounts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const data = await res.json();
    if (data.error) { showToast(data.error, 'error'); setSavingCode(false); return; }
    showToast('Discount code created ✓'); setCodeModal(false); setNewCode({ ...EMPTY_CODE }); loadCodes();
    setSavingCode(false);
  }

  async function toggleCode(id: string, active: boolean) {
    await fetch('/api/admin/discounts', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, active }) });
    showToast(active ? 'Code enabled' : 'Code disabled'); loadCodes();
  }

  async function deleteCode(id: string) {
    await fetch(`/api/admin/discounts?id=${id}`, { method: 'DELETE' });
    showToast('Code deleted'); loadCodes();
  }

  async function saveSettings() {
    setSavingSettings(true);
    const res = await fetch('/api/admin/settings', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ updates: localSettings }) });
    const data = await res.json();
    if (data.error) showToast(data.error, 'error');
    else { showToast('Settings saved ✓'); setSettings({ ...localSettings }); }
    setSavingSettings(false);
  }

  function fmtMoney(pence: number) { return `£${((pence || 0) / 100).toFixed(2)}`; }
  function fmtDate(d: string) { return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }); }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: 'none', border: 'none', cursor: 'pointer',
    fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '0.14em',
    textTransform: 'uppercase', color: active ? 'var(--gold)' : 'var(--cream-dim)',
    padding: '16px 20px', borderBottom: active ? '2px solid var(--gold-pure)' : '2px solid transparent',
    transition: 'all 0.2s', whiteSpace: 'nowrap',
  });

  // ── LOGIN ───────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 600, color: 'var(--gold)', textAlign: 'center', marginBottom: '6px' }}>KiTee Studio</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--cream-muted)', textAlign: 'center', marginBottom: '40px' }}>Admin</div>
        <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} style={S.input} autoFocus />
          {authError && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#e57373', textAlign: 'center' }}>{authError}</p>}
          <button type="submit" style={{ ...S.btnGold, padding: '14px', fontSize: '10px', width: '100%' }}>Sign In</button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingTop: 'var(--nav-h)' }}>
      {/* Header */}
      <div style={{ background: 'var(--black-3)', borderBottom: '1px solid var(--border)', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--gold)' }}>Admin Panel</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-muted)', marginTop: '2px' }}>KiTee Studio</div>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-muted)' }}>View Site ↗</a>
          <button onClick={() => { sessionStorage.removeItem('ks_admin'); setAuthed(false); }} style={S.btnOutline}>Sign Out</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 48px', background: 'var(--black-2)', overflowX: 'auto' }}>
        {(['dashboard', 'products', 'orders', 'discounts', 'settings'] as Tab[]).map(t => (
          <button key={t} style={tabStyle(tab === t)} onClick={() => setTab(t)}>
            {t === 'dashboard' ? '📊 Dashboard' : t === 'products' ? '📦 Products' : t === 'orders' ? '🛒 Orders' : t === 'discounts' ? '🏷️ Discounts' : '⚙️ Settings'}
          </button>
        ))}
      </div>

      {/* Body */}
      <div style={{ padding: '40px 48px', maxWidth: '1280px' }}>
        {loading ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cream-muted)', padding: '48px 0' }}>Loading...</p>
        ) : (
          <>
            {/* ── DASHBOARD ── */}
            {tab === 'dashboard' && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--cream)', marginBottom: '28px' }}>Overview</h2>
                {stats && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
                    {[
                      { label: 'Total Revenue', value: fmtMoney(stats.totalRevenue) },
                      { label: 'This Month', value: fmtMoney(stats.monthRevenue) },
                      { label: 'Total Orders', value: String(stats.totalOrders) },
                      { label: 'Live Products', value: `${stats.liveProducts} / ${stats.totalProducts}` },
                    ].map(s => (
                      <div key={s.label} style={{ background: 'var(--black-3)', border: '1px solid var(--border)', padding: '24px 28px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-muted)', marginBottom: '10px' }}>{s.label}</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 600, color: 'var(--gold)', lineHeight: 1 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>
                )}
                <h3 style={S.sectionLabel}>Recent Orders</h3>
                {recentOrders.length === 0 ? <p style={{ color: 'var(--cream-muted)', fontSize: '13px' }}>No orders yet.</p> : (
                  <table style={S.table}><thead><tr>{['Date', 'Customer', 'Product', 'Amount', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>{recentOrders.map(o => (
                      <tr key={o.id}>
                        <td style={S.td}>{fmtDate(o.created_at)}</td>
                        <td style={S.td}>{o.customer_email || '—'}</td>
                        <td style={S.td}>{o.product_name || '—'}</td>
                        <td style={S.td}>{fmtMoney(o.amount_paid || o.amount)}</td>
                        <td style={S.td}><StatusBadge status={o.status} /></td>
                      </tr>
                    ))}</tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── PRODUCTS ── */}
            {tab === 'products' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>Products</h2>
                    <p style={{ fontSize: '13px', color: 'var(--cream-muted)' }}>{products.length} product{products.length !== 1 ? 's' : ''}</p>
                  </div>
                  <button style={S.btnGold} onClick={() => { setEditProduct({ ...EMPTY_PRODUCT }); setIsNewProduct(true); setProductModal(true); }}>+ Add Product</button>
                </div>
                <table style={S.table}>
                  <thead><tr>{['Product', 'Type', 'Price', 'Sale', 'File', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p.id}>
                        <td style={S.td}>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--cream)' }}>{p.name}</div>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cream-muted)', marginTop: '2px' }}>{p.slug}</div>
                        </td>
                        <td style={S.td}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{p.product_type}</span></td>
                        <td style={S.td}>£{p.price_gbp ?? 0}</td>
                        <td style={S.td}>{p.sale_price_gbp ? <span style={{ color: '#7FB083' }}>£{p.sale_price_gbp}</span> : <span style={{ opacity: 0.3 }}>—</span>}</td>
                        <td style={S.td}>
                          {p.file_url
                            ? <a href={p.file_url} target="_blank" rel="noreferrer" style={{ color: '#7FB083', fontFamily: 'var(--font-mono)', fontSize: '9px' }}>✓ Attached</a>
                            : <span style={{ color: '#e57373', fontFamily: 'var(--font-mono)', fontSize: '9px' }}>⚠ No file</span>}
                        </td>
                        <td style={S.td}><StatusBadge status={p.status} /></td>
                        <td style={S.td}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button style={S.btnOutline} onClick={() => { setEditProduct({ ...p }); setIsNewProduct(false); setProductModal(true); }}>Edit</button>
                            <button style={S.btnOutline} onClick={() => setShareModal(p)}>Share</button>
                            <button style={S.btnRed} onClick={() => setDeleteConfirm({ id: p.id, name: p.name })}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* ── ORDERS ── */}
            {tab === 'orders' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>Orders</h2>
                    <p style={{ fontSize: '13px', color: 'var(--cream-muted)' }}>{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input placeholder="Search by email..." value={orderSearch} onChange={e => setOrderSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && loadOrders()} style={{ ...S.input, width: '220px' }} />
                    <select value={orderStatus} onChange={e => { setOrderStatus(e.target.value); }} style={{ ...S.select, width: '140px' }}>
                      <option value="">All statuses</option>
                      <option value="complete">Complete</option>
                      <option value="pending">Pending</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                    <button style={S.btnOutline} onClick={loadOrders}>Search</button>
                  </div>
                </div>
                {orders.length === 0 ? <p style={{ color: 'var(--cream-muted)', fontSize: '13px' }}>No orders found.</p> : (
                  <table style={S.table}>
                    <thead><tr>{['Date', 'Customer', 'Product', 'Amount', 'Downloads', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {orders.map(o => (
                        <tr key={o.id}>
                          <td style={S.td}>{fmtDate(o.created_at)}</td>
                          <td style={S.td}>
                            <div style={{ fontSize: '13px' }}>{o.customer_email || '—'}</div>
                            {o.customer_name && <div style={{ fontSize: '11px', color: 'var(--cream-muted)', marginTop: '2px' }}>{o.customer_name}</div>}
                          </td>
                          <td style={S.td}>{o.product_name || '—'}</td>
                          <td style={S.td}>{fmtMoney(o.amount_paid || o.amount)}</td>
                          <td style={S.td}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{o.download_count ?? 0}</span></td>
                          <td style={S.td}><StatusBadge status={o.status} /></td>
                          <td style={S.td}>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                              <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)} style={{ ...S.select, width: '110px', fontSize: '9px' }}>
                                <option value="pending">Pending</option>
                                <option value="complete">Complete</option>
                                <option value="refunded">Refunded</option>
                                <option value="failed">Failed</option>
                              </select>
                              <button style={{ ...S.btnGreen, opacity: resendingEmail === o.id ? 0.5 : 1 }} onClick={() => resendDownload(o.id)} disabled={resendingEmail === o.id}>
                                {resendingEmail === o.id ? '...' : '↻ Email'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── DISCOUNTS ── */}
            {tab === 'discounts' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--cream)', marginBottom: '4px' }}>Discount Codes</h2>
                    <p style={{ fontSize: '13px', color: 'var(--cream-muted)' }}>Create promo codes for sales and marketing</p>
                  </div>
                  <button style={S.btnGold} onClick={() => { setNewCode({ ...EMPTY_CODE }); setCodeModal(true); }}>+ Create Code</button>
                </div>
                {codes.length === 0 ? <p style={{ color: 'var(--cream-muted)', fontSize: '13px' }}>No discount codes yet.</p> : (
                  <table style={S.table}>
                    <thead><tr>{['Code', 'Discount', 'Uses', 'Expires', 'Status', 'Actions'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                    <tbody>
                      {codes.map(c => (
                        <tr key={c.id}>
                          <td style={S.td}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--gold)', letterSpacing: '0.1em' }}>{c.code}</span></td>
                          <td style={S.td}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{c.type === 'percent' ? `${c.value}% off` : `£${c.value} off`}</span></td>
                          <td style={S.td}><span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}>{c.uses_count}{c.max_uses ? ` / ${c.max_uses}` : ''}</span></td>
                          <td style={S.td}>{c.expires_at ? fmtDate(c.expires_at) : <span style={{ opacity: 0.4 }}>Never</span>}</td>
                          <td style={S.td}><StatusBadge status={c.active ? 'live' : 'draft'} /></td>
                          <td style={S.td}>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button style={c.active ? S.btnOutline : S.btnGreen} onClick={() => toggleCode(c.id, !c.active)}>{c.active ? 'Disable' : 'Enable'}</button>
                              <button style={S.btnRed} onClick={() => deleteCode(c.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── SETTINGS ── */}
            {tab === 'settings' && (
              <div style={{ maxWidth: '720px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 300, color: 'var(--cream)' }}>Site Settings</h2>
                  <button style={{ ...S.btnGold, opacity: savingSettings ? 0.6 : 1 }} onClick={saveSettings} disabled={savingSettings}>{savingSettings ? 'Saving…' : 'Save All Changes'}</button>
                </div>

                <div style={S.sectionLabel}>Homepage Copy</div>
                <div style={S.field}>
                  <label style={S.label}>Hero Headline</label>
                  <input style={S.input} value={localSettings['hero_headline'] || ''} onChange={e => setLocalSettings(s => ({ ...s, hero_headline: e.target.value }))} />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Hero Sub-line</label>
                  <textarea style={S.textarea} value={localSettings['hero_subline'] || ''} onChange={e => setLocalSettings(s => ({ ...s, hero_subline: e.target.value }))} />
                </div>
                <div style={S.field}>
                  <label style={S.label}>About / Studio Description</label>
                  <textarea style={{ ...S.textarea, minHeight: '100px' }} value={localSettings['about_body'] || ''} onChange={e => setLocalSettings(s => ({ ...s, about_body: e.target.value }))} />
                </div>
                <div style={S.field}>
                  <label style={S.label}>Footer Tagline</label>
                  <input style={S.input} value={localSettings['footer_tagline'] || ''} onChange={e => setLocalSettings(s => ({ ...s, footer_tagline: e.target.value }))} />
                </div>

                <div style={{ ...S.sectionLabel, marginTop: '32px' }}>Social Links</div>
                {[
                  { key: 'social_instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/kiteestudio' },
                  { key: 'social_tiktok', label: 'TikTok URL', placeholder: 'https://tiktok.com/@kiteestudio' },
                  { key: 'social_linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' },
                  { key: 'social_substack', label: 'Substack URL', placeholder: 'https://yourname.substack.com' },
                  { key: 'social_youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@kiteestudio' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key} style={S.field}>
                    <label style={S.label}>{label}</label>
                    <input style={S.input} value={localSettings[key] || ''} onChange={e => setLocalSettings(s => ({ ...s, [key]: e.target.value }))} placeholder={placeholder} />
                  </div>
                ))}

                <div style={{ ...S.sectionLabel, marginTop: '32px' }}>Google Drive</div>
                <div style={S.field}>
                  <label style={S.label}>Product Downloads Folder ID</label>
                  <input style={S.input} value={localSettings['gdrive_folder_id'] || ''} onChange={e => setLocalSettings(s => ({ ...s, gdrive_folder_id: e.target.value }))} />
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cream-muted)', marginTop: '6px' }}>
                    Current folder: <a href={`https://drive.google.com/drive/folders/${localSettings['gdrive_folder_id']}`} target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>KiTee Studio — Product Downloads ↗</a>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── PRODUCT MODAL ── */}
      {productModal && (
        <Modal title={isNewProduct ? 'Add Product' : 'Edit Product'} onClose={() => setProductModal(false)} wide>
          <div style={S.grid2}>
            <div style={S.field}><label style={S.label}>Product Name *</label><input style={S.input} value={editProduct.name || ''} onChange={e => setEditProduct(p => ({ ...p, name: e.target.value }))} /></div>
            <div style={S.field}><label style={S.label}>Slug *</label><input style={S.input} value={editProduct.slug || ''} onChange={e => setEditProduct(p => ({ ...p, slug: e.target.value }))} placeholder="e.g. burnout-recovery-blueprint" /></div>
          </div>
          <div style={S.field}><label style={S.label}>Tagline</label><input style={S.input} value={editProduct.tagline || ''} onChange={e => setEditProduct(p => ({ ...p, tagline: e.target.value }))} placeholder="One-line description for the product card" /></div>
          <div style={S.field}><label style={S.label}>Description</label><textarea style={S.textarea} value={editProduct.description || ''} onChange={e => setEditProduct(p => ({ ...p, description: e.target.value }))} /></div>

          <div style={S.grid3}>
            <div style={S.field}><label style={S.label}>Type</label>
              <select style={S.select} value={editProduct.product_type || 'app'} onChange={e => setEditProduct(p => ({ ...p, product_type: e.target.value }))}>
                <option value="app">App</option><option value="template">Template</option>
              </select>
            </div>
            <div style={S.field}><label style={S.label}>Status</label>
              <select style={S.select} value={editProduct.status || 'draft'} onChange={e => setEditProduct(p => ({ ...p, status: e.target.value }))}>
                <option value="live">Live</option><option value="draft">Draft</option><option value="coming-soon">Coming Soon</option>
              </select>
            </div>
            <div style={S.field}><label style={S.label}>Category</label><input style={S.input} value={editProduct.category_label || ''} onChange={e => setEditProduct(p => ({ ...p, category_label: e.target.value }))} placeholder="e.g. AuDHD & Neurodivergent" /></div>
          </div>

          <div style={S.grid3}>
            <div style={S.field}><label style={S.label}>Price GBP £</label><input style={S.input} type="number" min="0" step="1" value={editProduct.price_gbp ?? 0} onChange={e => setEditProduct(p => ({ ...p, price_gbp: parseFloat(e.target.value) }))} /></div>
            <div style={S.field}><label style={S.label}>Sale Price £ (optional)</label><input style={S.input} type="number" min="0" step="1" value={editProduct.sale_price_gbp ?? ''} onChange={e => setEditProduct(p => ({ ...p, sale_price_gbp: e.target.value ? parseFloat(e.target.value) : undefined }))} placeholder="Leave blank = no sale" /></div>
            <div style={S.field}><label style={S.label}>Stripe Price ID</label><input style={S.input} value={editProduct.stripe_price_id || ''} onChange={e => setEditProduct(p => ({ ...p, stripe_price_id: e.target.value }))} placeholder="price_..." /></div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '4px' }}>
            <div style={S.sectionLabel}>Delivery</div>
            <div style={S.field}>
              <label style={S.label}>Download File URL (Google Drive share link)</label>
              <input style={S.input} value={editProduct.file_url || ''} onChange={e => setEditProduct(p => ({ ...p, file_url: e.target.value }))} placeholder="https://drive.google.com/file/d/..." />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cream-muted)', marginTop: '6px', lineHeight: 1.6 }}>
                Upload your ZIP to <a href="https://drive.google.com/drive/folders/1jxxnuHgl8wcru_EHgmG_RvZ7duJ7bzGe" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>KiTee Studio — Product Downloads ↗</a>, right-click → Share → Anyone with link → Copy link, paste here.
              </div>
            </div>
            <div style={S.field}><label style={S.label}>Product Image URL</label><input style={S.input} value={editProduct.image_url || ''} onChange={e => setEditProduct(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." /></div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '4px' }}>
            <div style={S.sectionLabel}>SEO</div>
            <div style={S.field}><label style={S.label}>SEO Title</label><input style={S.input} value={editProduct.seo_title || ''} onChange={e => setEditProduct(p => ({ ...p, seo_title: e.target.value }))} /></div>
            <div style={S.field}><label style={S.label}>SEO Description</label><textarea style={{ ...S.textarea, minHeight: '60px' }} value={editProduct.seo_description || ''} onChange={e => setEditProduct(p => ({ ...p, seo_description: e.target.value }))} placeholder="Max 160 chars" /></div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', paddingTop: '8px' }}>
            <button style={S.btnOutline} onClick={() => setProductModal(false)}>Cancel</button>
            <button style={{ ...S.btnGold, opacity: savingProduct ? 0.6 : 1 }} onClick={saveProduct} disabled={savingProduct}>{savingProduct ? 'Saving…' : isNewProduct ? 'Create Product' : 'Save Changes'}</button>
          </div>
        </Modal>
      )}

      {/* ── DELETE CONFIRM ── */}
      {deleteConfirm && (
        <Modal title="Delete product?" onClose={() => setDeleteConfirm(null)}>
          <p style={{ fontSize: '14px', color: 'var(--cream-muted)', marginBottom: '28px' }}>You're about to permanently delete <strong style={{ color: 'var(--cream)' }}>{deleteConfirm.name}</strong>. This cannot be undone.</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button style={S.btnOutline} onClick={() => setDeleteConfirm(null)}>Cancel</button>
            <button style={S.btnRed} onClick={deleteProduct}>Delete Forever</button>
          </div>
        </Modal>
      )}

      {/* ── DISCOUNT CODE MODAL ── */}
      {codeModal && (
        <Modal title="Create Discount Code" onClose={() => setCodeModal(false)}>
          <div style={S.grid2}>
            <div style={S.field}><label style={S.label}>Code *</label><input style={{ ...S.input, textTransform: 'uppercase', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em' }} value={newCode.code} onChange={e => setNewCode(c => ({ ...c, code: e.target.value.toUpperCase() }))} placeholder="e.g. LAUNCH20" /></div>
            <div style={S.field}><label style={S.label}>Type</label>
              <select style={S.select} value={newCode.type} onChange={e => setNewCode(c => ({ ...c, type: e.target.value as 'percent' | 'fixed' }))}>
                <option value="percent">Percentage off</option><option value="fixed">Fixed amount off (£)</option>
              </select>
            </div>
          </div>
          <div style={S.grid3}>
            <div style={S.field}><label style={S.label}>{newCode.type === 'percent' ? 'Percentage off' : 'Amount off (£)'}</label><input style={S.input} type="number" min="1" value={newCode.value} onChange={e => setNewCode(c => ({ ...c, value: parseFloat(e.target.value) }))} /></div>
            <div style={S.field}><label style={S.label}>Max uses (blank = unlimited)</label><input style={S.input} type="number" min="1" value={newCode.max_uses ?? ''} onChange={e => setNewCode(c => ({ ...c, max_uses: e.target.value ? parseInt(e.target.value) : undefined }))} /></div>
            <div style={S.field}><label style={S.label}>Expiry date (blank = never)</label><input style={S.input} type="date" value={newCode.expires_at} onChange={e => setNewCode(c => ({ ...c, expires_at: e.target.value }))} /></div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button style={S.btnOutline} onClick={() => setCodeModal(false)}>Cancel</button>
            <button style={{ ...S.btnGold, opacity: savingCode ? 0.6 : 1 }} onClick={saveCode} disabled={savingCode}>{savingCode ? 'Creating…' : 'Create Code'}</button>
          </div>
        </Modal>
      )}

      {/* ── SOCIAL SHARE MODAL ── */}
      {shareModal && (
        <Modal title="Share Product" onClose={() => setShareModal(null)}>
          <p style={{ fontSize: '14px', color: 'var(--cream-muted)', marginBottom: '24px' }}>Ready-to-post copy for <strong style={{ color: 'var(--cream)' }}>{shareModal.name}</strong>.</p>
          {[
            { platform: 'Instagram / TikTok Caption', text: `✦ ${shareModal.name}\n\n${shareModal.tagline}\n\nNo subscription. No monthly fee. Download once, own it forever.\n\n🔗 kiteestudio.com\n\n#kiteestudio #digitalproducts #${shareModal.product_type === 'app' ? 'audhd #neurodivergent #digitaltools' : 'websitetemplate #smallbusiness #nocode'}` },
            { platform: 'Twitter / X', text: `Just dropped: ${shareModal.name} ✦\n\n${shareModal.tagline}\n\nBuy once. Own forever. No subscription.\n\n→ kiteestudio.com` },
            { platform: 'LinkedIn', text: `New from KiTee Studio: ${shareModal.name}\n\n${shareModal.tagline}\n\nBuilt for people who are done paying monthly fees for tools they should just own.\n\nDownload once → use forever.\n\nkiteestudio.com` },
          ].map(({ platform, text }) => (
            <div key={platform} style={{ marginBottom: '24px' }}>
              <div style={S.sectionLabel}>{platform}</div>
              <div style={{ background: 'var(--black-3)', border: '1px solid var(--border)', padding: '16px', fontFamily: 'var(--font-body)', fontSize: '13px', color: 'var(--cream-dim)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: '8px' }}>{text}</div>
              <button style={S.btnOutline} onClick={() => { navigator.clipboard.writeText(text); showToast(`${platform} copy copied ✓`); }}>Copy</button>
            </div>
          ))}
        </Modal>
      )}

      {/* ── TOAST ── */}
      <div style={{ position: 'fixed', bottom: '32px', right: '32px', background: toastType === 'error' ? 'rgba(180,30,30,0.97)' : 'var(--black-3)', border: `1px solid ${toastType === 'error' ? 'rgba(220,80,80,0.4)' : 'var(--border-mid)'}`, color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: '12px', letterSpacing: '0.06em', padding: '14px 22px', zIndex: 9999, opacity: toast ? 1 : 0, transform: toast ? 'translateY(0)' : 'translateY(12px)', transition: 'all 0.25s', pointerEvents: 'none' }}>
        {toast}
      </div>
    </div>
  );
}
