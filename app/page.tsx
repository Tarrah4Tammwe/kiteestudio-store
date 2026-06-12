import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS } from '@/lib/products';
import ProductCard from '@/components/ProductCard';

const marquee = ['Coach','✦','Author','✦','Freelancer','✦','Podcast','✦','Personal Trainer','✦','Shop','✦','Coach','✦','Author','✦','Freelancer','✦','Podcast','✦','Personal Trainer','✦','Shop','✦'];

export default function HomePage() {
  const featured = PRODUCTS.slice(0, 3);

  return (
    <>
      {/* ── HERO — deep plum, brand statement ── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, var(--plum-deep) 0%, var(--purple) 60%, var(--black-2) 100%)',
        paddingTop: 'var(--nav-h)',
        display: 'flex', alignItems: 'center',
        position: 'relative', overflow: 'hidden',
        borderBottom: '1px solid var(--border)',
      }}>
        {/* Blob shapes */}
        <svg style={{ position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none' }} viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="950" cy="180" rx="380" ry="300" fill="#6B1A4A" opacity="0.18"/>
          <ellipse cx="150" cy="650" rx="260" ry="220" fill="#3D1554" opacity="0.22"/>
          <ellipse cx="550" cy="800" rx="220" ry="160" fill="#1E0B2C" opacity="0.3"/>
        </svg>
        {/* Gold glow top-right */}
        <div style={{ position:'absolute',top:'-80px',right:'-80px',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(212,175,55,0.08) 0%,transparent 70%)',pointerEvents:'none' }}/>

        <div className="container" style={{ position:'relative',zIndex:2,padding:'80px 48px' }}>
          <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'80px',alignItems:'center' }} className="hero-grid">
            <div>
              <div className="eyebrow">Premium Website Templates</div>
              <h1 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(56px,7vw,108px)',fontWeight:300,lineHeight:0.95,letterSpacing:'0.01em',color:'var(--cream)',marginBottom:'6px' }}>
                Your site,
              </h1>
              <h1 style={{ fontFamily:'var(--font-display)',fontStyle:'italic',fontSize:'clamp(56px,7vw,108px)',fontWeight:400,lineHeight:1,color:'var(--gold-pure)',marginBottom:'36px',textShadow:'0 0 60px rgba(212,175,55,0.25)' }}>
                done right.
              </h1>
              <p style={{ fontSize:'17px',color:'var(--cream-dim)',lineHeight:1.8,maxWidth:'420px',marginBottom:'44px' }}>
                Premium one-page websites built with the SiteFill™ editor. Open the file, fill in your details, download your finished site. No code. No subscriptions.
              </p>
              <div style={{ display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap' }}>
                <Link href="/shop" className="btn-gold">Browse Templates</Link>
                <Link href="/about" className="btn-ghost">How it works →</Link>
              </div>
              <div style={{ marginTop:'48px',paddingTop:'32px',borderTop:'1px solid var(--border)',display:'flex',gap:'36px',flexWrap:'wrap' }}>
                {[['8+','Templates'],['No code','Required'],['1 click','Download']].map(([v,l]) => (
                  <div key={v}>
                    <div style={{ fontFamily:'var(--font-display)',fontSize:'28px',fontWeight:600,color:'var(--gold-pure)',lineHeight:1,marginBottom:'3px' }}>{v}</div>
                    <div style={{ fontFamily:'var(--font-mono)',fontSize:'9px',letterSpacing:'0.2em',textTransform:'uppercase',color:'var(--cream-muted)' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display:'flex',flexDirection:'column',alignItems:'center',gap:'28px' }} className="hero-right">
              <div style={{ position:'relative' }}>
                <div style={{ position:'absolute',inset:'-16px',borderRadius:'50%',background:'radial-gradient(circle,rgba(212,175,55,0.12) 0%,transparent 70%)',pointerEvents:'none' }}/>
                <Image src="/images/cover_photo.jpg" alt="KiTee Studio" width={320} height={320} style={{ borderRadius:'50%',border:'1px solid var(--border-mid)',position:'relative',zIndex:1 }}/>
              </div>
              <div style={{ fontFamily:'var(--font-mono)',fontSize:'10px',letterSpacing:'0.22em',textTransform:'uppercase',color:'var(--gold-dim)',textAlign:'center' }}>
                One purchase. Own it forever. No subscription.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MARQUEE — pure gold bar ── */}
      <div className="marquee-bar">
        <div className="marquee-track">
          {[...marquee,...marquee].map((item,i) => <span key={i} className={item==='✦'?'sep':''}>{item}</span>)}
        </div>
      </div>

      {/* ── FEATURED — near-black base ── */}
      <section style={{ padding:'96px 0',background:'var(--black)' }}>
        <div className="container">
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-end',marginBottom:'52px',flexWrap:'wrap',gap:'16px' }}>
            <div>
              <div className="eyebrow">Featured</div>
              <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(36px,4vw,56px)',fontWeight:300,color:'var(--cream)',lineHeight:1 }}>
                Popular <em style={{ fontStyle:'italic',color:'var(--gold-pure)' }}>templates</em>
              </h2>
            </div>
            <Link href="/shop" className="btn-outline">View all →</Link>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'20px' }} className="grid-3">
            {featured.map(p => <ProductCard key={p.slug} product={p}/>)}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS — cold midnight section ── */}
      <section style={{ padding:'96px 0',background:'linear-gradient(180deg, var(--cold-deep) 0%, var(--cold) 100%)',borderTop:'1px solid var(--border-cold)',borderBottom:'1px solid var(--border-cold)',position:'relative',overflow:'hidden' }}>
        {/* Cold glow */}
        <div style={{ position:'absolute',top:'-60px',left:'50%',transform:'translateX(-50%)',width:'600px',height:'300px',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(30,58,110,0.4) 0%,transparent 70%)',pointerEvents:'none' }}/>
        <div className="container" style={{ position:'relative',zIndex:2 }}>
          <div style={{ textAlign:'center',marginBottom:'64px' }}>
            <div className="eyebrow" style={{ justifyContent:'center' }}>How it works</div>
            <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(36px,4vw,56px)',fontWeight:300,color:'var(--cream)' }}>
              Three steps to <em style={{ fontStyle:'italic',color:'var(--gold-pure)' }}>live</em>
            </h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'48px' }} className="grid-3">
            {[
              {n:'01',title:'Choose your template',body:'Browse the collection and pick the template built for your niche. Each one is designed for a specific type of creator.'},
              {n:'02',title:'Fill it in — live',body:'Open the SiteFill™ editor built right into the file. Type your name, add your photo, update the copy. Watch it update live.'},
              {n:'03',title:'Publish anywhere',body:'Download your finished site as a single HTML file. Host it on Netlify, GitHub Pages, or anywhere you like. No subscriptions.'},
            ].map(({n,title,body}) => (
              <div key={n} style={{ borderTop:'1px solid var(--border-cold)',paddingTop:'28px' }}>
                <div style={{ fontFamily:'var(--font-mono)',fontSize:'10px',letterSpacing:'0.2em',color:'var(--gold)',marginBottom:'20px',display:'flex',alignItems:'center',gap:'12px' }}>
                  {n}<span style={{ flex:1,height:'1px',background:'var(--border-cold)',maxWidth:'36px',display:'block' }}/>
                </div>
                <h3 style={{ fontFamily:'var(--font-display)',fontSize:'24px',fontWeight:600,color:'var(--cream)',marginBottom:'12px',lineHeight:1.2 }}>{title}</h3>
                <p style={{ fontSize:'14px',color:'var(--cream-dim)',lineHeight:1.85 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FULL COLLECTION — dark purple ── */}
      <section style={{ padding:'96px 0',background:'var(--purple-deep)' }}>
        <div className="container">
          <div style={{ marginBottom:'52px' }}>
            <div className="eyebrow">The collection</div>
            <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(36px,4vw,56px)',fontWeight:300,color:'var(--cream)' }}>All templates</h2>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'18px' }} className="grid-4">
            {PRODUCTS.map(p => <ProductCard key={p.slug} product={p}/>)}
          </div>
        </div>
      </section>

      {/* ── CTA — rich plum with gold glow ── */}
      <section style={{ background:'linear-gradient(160deg,var(--plum) 0%,var(--purple-mid) 100%)',borderTop:'1px solid var(--border)',padding:'96px 0',textAlign:'center',position:'relative',overflow:'hidden' }}>
        <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'700px',height:'400px',borderRadius:'50%',background:'radial-gradient(ellipse,rgba(212,175,55,0.1) 0%,transparent 70%)',pointerEvents:'none' }}/>
        <div className="container" style={{ position:'relative',zIndex:2 }}>
          <div className="eyebrow" style={{ justifyContent:'center' }}>Ready?</div>
          <h2 style={{ fontFamily:'var(--font-display)',fontSize:'clamp(40px,5vw,72px)',fontWeight:300,color:'var(--cream)',marginBottom:'18px' }}>
            Pick your template
          </h2>
          <p style={{ fontSize:'15px',color:'var(--cream-dim)',marginBottom:'40px',maxWidth:'440px',margin:'0 auto 40px',lineHeight:1.8 }}>
            Every template includes the SiteFill™ editor. No subscriptions. Yours to keep forever.
          </p>
          <Link href="/shop" className="btn-gold">Browse All Templates</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-right { display: none !important; }
          .grid-3 { grid-template-columns: 1fr !important; }
          .grid-4 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) { .grid-4 { grid-template-columns: 1fr !important; } }
      `}</style>
    </>
  );
}
