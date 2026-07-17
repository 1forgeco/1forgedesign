import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const templates = [
  ['01','Bloom Editorial','hero-organico-editorial-3.webp','Hero / Editorial'],
  ['02','Midnight Couture','hero-dark-luxury-2.webp','Hero / Luxury'],
  ['03','Enchanted Diary','hero-minimal-bold-2.webp','Hero / Minimal'],
  ['04','AR Mirror','hero-split-screen-1.webp','Hero / Split screen'],
  ['05','Frosted Vault','cards-produto-glassmorphism-2.webp','Cards / Commerce'],
  ['06','Folio Suite','cards-servico-editorial-1.webp','Cards / Editorial'],
  ['07','Neural SNX','navigation-bar-premium-1.webp','Navigation / Premium'],
  ['08','Whisper Nav','navigation-bar-minimal-3.webp','Navigation / Minimal'],
  ['09','Dulce Flask','hero-stats-flutuantes-3.webp','Hero / Product'],
  ['10','Aero Sync','hero-mockup-3d-4.webp','Hero / 3D'],
  ['11','Coda Noir','footer-editorial-dark-1.webp','Footer / Editorial'],
  ['12','Bluebird','footer-minimal-clean-1.webp','Footer / Minimal'],
  ['13','V0 Gravity','features-grid-2.webp','Features / Grid'],
  ['14','Praise Wall','depoimentos-2.webp','Social proof'],
  ['15','Lineage Hot','sobre-dark-1.webp','About / Dark'],
  ['16','Last Light','cta-section-premium-1.webp','CTA / Premium'],
  ['17','Price Vault','preco-planos-cards-cover.webp','Pricing / Cards'],
  ['18','Showcase Hero','blog-post-hero-1.webp','Blog / Editorial'],
  ['19','Hallmark','portfolio-hero-cover.webp','Portfolio / Hero'],
  ['20','Rainbow Noir','landing-page-full-2.webp','Landing / Full page'],
  ['21','Aqua Veil','hero-aqua-glass-1.webp','Hero / Glass'],
  ['22','Halo Ring','hero-smart-product-3d-1.webp','Hero / Product'],
  ['23','Silver Order','hero-editorial-medieval-1.webp','Hero / Editorial'],
  ['24','Pierce the Emperor','hero-museum-imperial-1.webp','Hero / Museum'],
  ['25','Silent Shogun','hero-samurai-purple-1.webp','Hero / Cinematic'],
  ['26','Ferrari 296 GTB','hero-ferrari-296-1.webp','Hero / Automotive'],
  ['27','Paradise','hero-paradise-caribe-1.webp','Hero / Travel'],
  ['28','Crystal Lotus','hero-crystal-lotus-1.webp','Hero / Wellness'],
  ['29','Zephyr','hero-cycle-zephyr-1.webp','Hero / Sports'],
  ['30','Iris Vision','hero-iris-vision-1.webp','Hero / Technology'],
  ['31','Aurora Heart','hero-aurora-heart-1.webp','Hero / Fashion'],
  ['32','Glacius','hero-glacius-frost-1.webp','Hero / Product'],
  ['33','Crystal Sphere','hero-crystal-sphere-1.webp','Hero / Abstract'],
  ['34','Smart Key','hero-smart-key-1.webp','Hero / Product'],
  ['35','Noir Lux','hero-noir-lux-1.webp','Hero / Luxury'],
  ['36','Techwear','hero-techwear-1.webp','Hero / Fashion'],
  ['37','Solace','hero-solace-1.webp','Hero / Editorial'],
  ['38','Amethyst','hero-amethyst-1.webp','Hero / Beauty'],
  ['39','Primal','hero-primal-1.webp','Hero / Experimental'],
]

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
const Bag = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>

function Brand() {
  return <a className="brand" href="#top" aria-label="1Forge Designs home"><img src="/1forge-logo.svg" alt="1Forge"/><span>DESIGNS</span></a>
}

function TemplateMedia({ item, compact = false }) {
  return <div className={`template-media ${compact ? 'template-media--compact' : ''}`}><img src={`/templates/${item[2]}`} alt={item[1]} loading="lazy"/></div>
}

function Mockup({ variant, compact = false }) {
  return <div className={`mockup mockup--${variant} ${compact ? 'mockup--compact' : ''}`}>
    <div className="mock-nav"><i/><span/><span/><span/></div>
    <div className="mock-copy"><small>1FORGE / CONCEPT</small><b>{variant === 'noir' ? 'Objects of desire.' : variant === 'chrome' ? 'Build what’s next.' : variant === 'warm' ? 'Made to be felt.' : 'Design without limits.'}</b><em>Explore the collection →</em></div>
    <div className="mock-orb"/><div className="mock-grid"/>
  </div>
}

function App() {
  const [menu, setMenu] = useState(false)
  const [selected, setSelected] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [notice, setNotice] = useState('')

  useEffect(() => {
    document.body.style.overflow = selected || cartOpen || menu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selected, cartOpen, menu])

  const addToCart = (item) => {
    setCart((current) => current.some((x) => x[0] === item[0]) ? current : [...current, item])
    setNotice(`${item[1]} added to your launch list`)
    setTimeout(() => setNotice(''), 2200)
  }

  const joinLaunch = () => {
    setCartOpen(false)
    document.querySelector('#launch-email')?.focus()
    document.querySelector('#launch')?.scrollIntoView({ behavior: 'smooth' })
  }

  return <>
    <div className="noise" aria-hidden="true"/>
    <header className="header" id="top">
      <Brand/>
      <nav className={menu ? 'nav nav--open' : 'nav'} aria-label="Main navigation">
        <a href="#collection" onClick={() => setMenu(false)}>THE PACK</a>
        <a href="#gallery" onClick={() => setMenu(false)}>GALLERY</a>
        <a href="#for-you" onClick={() => setMenu(false)}>WHO IT’S FOR</a>
        <a href="#launch" onClick={() => setMenu(false)}>GET IT</a>
      </nav>
      <button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label={`Open launch list, ${cart.length} items`}><Bag/><span>{cart.length || 'LIST'}</span></button>
      <button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle menu"><i/><i/></button>
    </header>

    <main>
      <section className="hero section-shell">
        <div className="eyebrow">FIGMA TEMPLATE COLLECTION</div>
        <h1>Premium templates.<br/><em>Built to perform.</em></h1>
        <p className="hero__lede">The design systems and polished sections we use at 1Forge—ready to adapt, learn from, and launch faster.</p>
        <div className="promises"><span><Check/>Works on the <strong>free Figma plan</strong></span><span><Check/><strong>Lifetime access</strong> to every pack update</span></div>
        <div className="hero-frame glass"><div className="live"><i/> LIVE PREVIEW</div><img className="hero-media" src="/templates/hero-poster.webp" alt="1Forge template collection preview"/></div>
        <div className="hero-actions"><a className="button button--primary" href="#collection">Explore the collection <Arrow/></a><a className="button button--ghost" href="#gallery">See the quality ↓</a></div>
      </section>

      <section id="collection" className="section-shell section-pad">
        <div className="section-head"><div><div className="eyebrow">WHAT’S INSIDE</div><h2>Designs that<br/><em>move work forward.</em></h2></div><p>Launch-ready concepts across landing pages, portfolios, SaaS, editorial, commerce and dashboards. Each file will be fully editable and built with reusable components.</p></div>
        <div className="availability"><span>39 launch concepts</span><span>New releases every week</span><span>Single templates + full pack</span></div>
        <div className="template-grid">
          {templates.map((item) => <article className="template-card glass" key={item[0]}>
            <button className="template-preview" onClick={() => setSelected(item)} aria-label={`Preview ${item[1]}`}><TemplateMedia item={item} compact/></button>
            <div className="template-meta"><span>{item[0]}</span><div><b>{item[1]}</b><small>{item[3]}</small></div><button onClick={() => addToCart(item)} aria-label={`Add ${item[1]} to launch list`}><Bag/></button></div>
          </article>)}
        </div>
        <div className="center"><a className="button button--primary" href="#launch">Get launch access <Arrow/></a></div>
      </section>

      <section id="gallery" className="section-shell section-pad gallery-section">
        <div className="eyebrow">PREVIEW GALLERY</div><h2>See the <em>1Forge level.</em></h2>
        <div className="gallery-grid">
          {[templates[1],templates[2],templates[8],templates[20],templates[25],templates[27]].map((item, i) => <button className={`gallery-tile gallery-tile--${i+1}`} key={item[0]} onClick={() => setSelected(item)} aria-label={`Open ${item[1]} preview`}><TemplateMedia item={item}/><span>{item[0]} / {item[1]}</span></button>)}
        </div>
      </section>

      <section id="for-you" className="section-shell section-pad audience">
        <div className="section-head"><div><div className="eyebrow">WHO IT’S FOR</div><h2>Made for people<br/><em>who care about craft.</em></h2></div></div>
        <div className="audience-grid">
          {[['01','Designers','Raise the bar without rebuilding every section from zero.'],['02','Freelancers','Move faster and show clients a more premium visual direction.'],['03','Studios & teams','Create consistent high-end work from a shared foundation.'],['04','Founders','Ship a credible product presence without a full design team.']].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}
        </div>
      </section>

      <section className="section-shell section-pad process">
        <div className="eyebrow">THIS SIMPLE</div><h2>From file to<br/><em>finished website.</em></h2>
        <div className="steps">
          {[['1','Choose your design','Pick a single template or unlock the full collection.'],['2','Duplicate in Figma','The editable file lands in your inbox with a quick-start guide.'],['3','Make it yours','Change type, color, imagery and content—then take it live.']].map(x=><article key={x[0]}><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></article>)}
        </div>
      </section>

      <section id="launch" className="section-shell section-pad pricing-wrap">
        <div className="pricing glass">
          <div className="pricing__glow"/><div className="eyebrow eyebrow--pill">★ FOUNDING DROP</div>
          <h2>Launch<br/><em>access.</em></h2>
          <p>Be first to see the full collection, receive founding pricing, and get notified the moment the files go live.</p>
          <div className="perks"><span><Check/>Free Figma plan</span><span><Check/>100% editable</span><span><Check/>Lifetime updates</span><span><Check/>Commercial use</span></div>
          <form className="launch-form" onSubmit={(e)=>{e.preventDefault();setNotice('You’re on the launch list — welcome to 1Forge Designs.')}}><label htmlFor="launch-email">Your email</label><div><input id="launch-email" type="email" required placeholder="you@studio.com"/><button className="button button--primary" type="submit">Join the launch list <Arrow/></button></div></form>
          <small>No spam. Just the launch, new drops, and genuinely useful design notes.</small>
        </div>
      </section>

      <section className="section-shell section-pad faq">
        <div className="eyebrow">QUESTIONS</div><h2>Frequently <em>asked.</em></h2>
        <div className="faq-list">{[
          ['Do I need a paid Figma plan?','No. Every template will work with Figma’s free plan. Duplicate the file to your drafts and start editing.'],
          ['When will the first templates be available?','The first collection is being crafted now. Join the launch list and you’ll get the release date before the public announcement.'],
          ['Can I use a template for client work?','Yes. Launch files will include a clear commercial-use license for your own and client projects.'],
          ['Will I get future updates?','Full-pack customers will receive improvements and newly included files according to the plan shown at launch.'],
          ['Are the files fully editable?','Yes—type, color, layout, components, images and copy will all be editable in Figma.']
        ].map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</div>
      </section>
    </main>

    <footer className="footer section-shell"><Brand/><div><a href="https://studio.1forge.in/">1FORGE STUDIO</a><a href="mailto:hello@1forge.in">EMAIL</a></div><span>© 2026 1FORGE DESIGNS. ALL RIGHTS RESERVED.</span></footer>

    {selected && <div className="modal-backdrop" role="presentation" onMouseDown={(e)=>e.target===e.currentTarget&&setSelected(null)}><div className="preview-modal glass" role="dialog" aria-modal="true" aria-label={`${selected[1]} preview`}><button className="close" onClick={()=>setSelected(null)}>×</button><TemplateMedia item={selected}/><div><span>{selected[0]} / CONCEPT PREVIEW</span><h3>{selected[1]}</h3><p>{selected[3]} · Launch collection</p><button className="button button--primary" onClick={()=>{addToCart(selected);setSelected(null)}}>Add to launch list <Arrow/></button></div></div></div>}

    <div className={cartOpen ? 'drawer-backdrop drawer-backdrop--open' : 'drawer-backdrop'} onMouseDown={(e)=>e.target===e.currentTarget&&setCartOpen(false)}>
      <aside className="cart-drawer" aria-hidden={!cartOpen}><header><h2>Your launch list</h2><button className="close" onClick={()=>setCartOpen(false)}>×</button></header>{cart.length ? <div className="cart-items">{cart.map(item=><div key={item[0]}><TemplateMedia item={item} compact/><span><b>{item[1]}</b><small>{item[3]}</small></span><button onClick={()=>setCart(cart.filter(x=>x[0]!==item[0]))}>Remove</button></div>)}</div> : <div className="empty"><Bag/><p>Your list is empty.</p><span>Save the concepts you want to hear about first.</span></div>}<button className="button button--primary drawer-cta" onClick={joinLaunch}>Join for launch access <Arrow/></button></aside>
    </div>
    {notice && <div className="toast" role="status">{notice}</div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)
