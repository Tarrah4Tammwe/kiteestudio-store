'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'products' | 'orders';

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/admin/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (res.ok) {
      sessionStorage.setItem('ks_admin', '1');
      setAuthed(true);
    } else {
      setError('Incorrect password.');
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('ks_admin')) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    Promise.all([
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/orders').then(r => r.json()),
    ]).then(([p, o]) => {
      setProducts(p.products || []);
      setOrders(o.orders || []);
      setLoading(false);
    });
  }, [authed]);

  async function updatePrice(productId: string, price: number) {
    setSaving(productId);
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, price }),
    });
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, price_gbp: price } : p));
      showToast('Price updated ✓');
    } else {
      showToast('Error saving price');
    }
    setSaving(null);
  }

  async function toggleStatus(productId: string, current: string) {
    const newStatus = current === 'live' ? 'draft' : 'live';
    setSaving(productId + '_status');
    const res = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, status: newStatus }),
    });
    if (res.ok) {
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, status: newStatus } : p));
      showToast(`Product ${newStatus === 'live' ? 'published' : 'drafted'} ✓`);
    }
    setSaving(null);
  }

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '360px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '28px', fontWeight: 600, color: 'var(--gold)', marginBottom: '8px', textAlign: 'center' }}>KiTee Studio</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--cream-muted)', textAlign: 'center', marginBottom: '40px' }}>Admin Panel</div>
          <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              placeholder="Password"
              value={pw}
              onChange={e => setPw(e.target.value)}
              style={{ background: 'var(--black-3)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '15px', padding: '14px 16px', outline: 'none', width: '100%' }}
            />
            {error && <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#e57373', textAlign: 'center' }}>{error}</p>}
            <button type="submit" className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: '11px', cursor: 'pointer', border: 'none' }}>
              Sign In
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  const sBase: Record<string, React.CSSProperties> = {
    wrap: { minHeight: '100vh', background: 'var(--black)', paddingTop: 'var(--nav-h)' },
    header: { background: 'var(--black-3)', borderBottom: '1px solid var(--border)', padding: '28px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' },
    tabs: { display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 48px', background: 'var(--black-2)' },
    body: { padding: '40px 48px', maxWidth: '1100px' },
    table: { width: '100%', borderCollapse: 'collapse' as const },
    th: { fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase' as const, color: 'var(--cream-muted)', padding: '10px 14px', textAlign: 'left' as const, borderBottom: '1px solid var(--border)' },
    td: { padding: '14px 14px', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--cream-dim)', verticalAlign: 'middle' as const },
  };

  const tabStyle = (active: boolean): React.CSSProperties => ({
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
    color: active ? 'var(--gold)' : 'var(--cream-dim)',
    padding: '16px 18px',
    borderBottom: active ? '2px solid var(--gold-pure)' : '2px solid transparent',
    transition: 'all 0.2s',
  });

  return (
    <div style={sBase.wrap}>
      {/* Header */}
      <div style={sBase.header}>
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600, color: 'var(--gold)' }}>Admin Panel</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--cream-muted)', marginTop: '4px' }}>KiTee Studio</div>
        </div>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <a href="/" target="_blank" style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--cream-muted)' }}>View Site ↗</a>
          <button onClick={() => { sessionStorage.removeItem('ks_admin'); setAuthed(false); }} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--cream-dim)', fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', padding: '8px 14px', cursor: 'pointer' }}>Sign Out</button>
        </div>
      </div>

      {/* Tabs */}
      <div style={sBase.tabs}>
        {(['products', 'orders'] as Tab[]).map(t => (
          <button key={t} style={tabStyle(tab === t)} onClick={() => setTab(t)}>
            {t === 'products' ? 'Products' : 'Orders'}
          </button>
        ))}
      </div>

      <div style={sBase.body}>
        {loading ? (
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cream-muted)', padding: '48px 0' }}>Loading...</p>
        ) : tab === 'products' ? (

          // ── PRODUCTS TABLE ──
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--cream)', marginBottom: '6px' }}>Products</h2>
              <p style={{ fontSize: '13px', color: 'var(--cream-muted)' }}>Set prices in GBP. Prices display in the visitor&apos;s local currency on the storefront.</p>
            </div>
            <table style={sBase.table}>
              <thead>
                <tr>
                  {['Product', 'Type', 'Category', 'Price (GBP)', 'Status', 'Actions'].map(h => (
                    <th key={h} style={sBase.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.map((p: any) => (
                  <AdminProductRow key={p.id} p={p} saving={saving} onPrice={updatePrice} onToggle={toggleStatus} td={sBase.td} />
                ))}
              </tbody>
            </table>
          </div>

        ) : (

          // ── ORDERS TABLE ──
          <div>
            <div style={{ marginBottom: '28px' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 300, color: 'var(--cream)', marginBottom: '6px' }}>Orders</h2>
              <p style={{ fontSize: '13px', color: 'var(--cream-muted)' }}>{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
            </div>
            {orders.length === 0 ? (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--cream-muted)', padding: '40px 0' }}>No orders yet.</p>
            ) : (
              <table style={sBase.table}>
                <thead>
                  <tr>
                    {['Date', 'Customer', 'Product', 'Amount', 'Status'].map(h => (
                      <th key={h} style={sBase.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id}>
                      <td style={sBase.td}>{new Date(o.created_at).toLocaleDateString('en-GB')}</td>
                      <td style={sBase.td}>{o.customer_email || '—'}</td>
                      <td style={sBase.td}>{o.product_name || '—'}</td>
                      <td style={sBase.td}>£{(o.amount_total / 100).toFixed(2)}</td>
                      <td style={sBase.td}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', background: o.status === 'complete' ? 'rgba(212,175,55,0.1)' : 'rgba(60,10,40,0.4)', color: o.status === 'complete' ? 'var(--gold)' : 'var(--cream-muted)', border: `1px solid ${o.status === 'complete' ? 'var(--border-mid)' : 'var(--border)'}`, padding: '3px 8px' }}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      <div className={`toast${toast ? ' show' : ''}`}>{toast}</div>
    </div>
  );
}

function AdminProductRow({ p, saving, onPrice, onToggle, td }: any) {
  const [localPrice, setLocalPrice] = useState<string>(p.price_gbp?.toString() ?? '');

  return (
    <tr>
      <td style={td}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '15px', fontWeight: 600, color: 'var(--cream)' }}>{p.name}</div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--cream-muted)', marginTop: '2px' }}>{p.slug}</div>
      </td>
      <td style={td}>{p.product_type === 'app' ? 'App' : 'Template'}</td>
      <td style={td}>{p.category_label}</td>
      <td style={td}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--cream-muted)', fontSize: '13px' }}>£</span>
          <input
            type="number"
            min="0"
            step="1"
            value={localPrice}
            onChange={e => setLocalPrice(e.target.value)}
            style={{ background: 'var(--black-2)', border: '1px solid var(--border)', color: 'var(--cream)', fontFamily: 'var(--font-mono)', fontSize: '13px', padding: '6px 10px', width: '80px', outline: 'none' }}
          />
          <button
            onClick={() => onPrice(p.id, parseFloat(localPrice))}
            disabled={saving === p.id}
            style={{ background: 'var(--gold-pure)', color: 'var(--black)', border: 'none', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '7px 12px', cursor: 'pointer', opacity: saving === p.id ? 0.5 : 1 }}
          >
            {saving === p.id ? '...' : 'Save'}
          </button>
        </div>
      </td>
      <td style={td}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', background: p.status === 'live' ? 'rgba(212,175,55,0.1)' : 'rgba(60,10,40,0.4)', color: p.status === 'live' ? 'var(--gold)' : 'var(--cream-muted)', border: `1px solid ${p.status === 'live' ? 'var(--border-mid)' : 'var(--border)'}`, padding: '3px 8px' }}>
          {p.status}
        </span>
      </td>
      <td style={td}>
        <button
          onClick={() => onToggle(p.id, p.status)}
          disabled={saving === p.id + '_status'}
          style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--cream-dim)', fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '6px 12px', cursor: 'pointer' }}
        >
          {p.status === 'live' ? 'Draft' : 'Publish'}
        </button>
      </td>
    </tr>
  );
}
