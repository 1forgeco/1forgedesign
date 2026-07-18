import React, { useCallback, useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import ForgeLoader from './components/ForgeLoader'
import MediaSkeleton from './components/MediaSkeleton'
import { CommunityHub, DropVault, ForgePassport, MaterialCursor, ProductExperience, ProductFilmstrip, recordPassport } from './components/ProductExperience'
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

const originalVideoTemplates = new Set([
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '20', '21', '22', '24',
  '26', '27', '28', '29', '30', '31', '32', '33', '34',
  '35', '36', '37', '38', '39',
])

const originalGalleryOrder = [
  '02', '03', '09', '01', '06', '08', '21', '22', '24',
  '26', '27', '28', '29', '30', '31', '32', '33', '34',
  '35', '36', '37', '38', '39',
]
const galleryTemplates = originalGalleryOrder.map(number => templates.find(item => item[0] === number))

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
const templatePath = (item) => `/template/${item[0]}-${slugify(item[1])}`
const findTemplateFromPath = (pathname = window.location.pathname) => {
  const match = pathname.match(/^\/template\/(\d{2})(?:-|$)/)
  return match ? templates.find((item) => item[0] === match[1]) || null : null
}

const licenseOptions = [
  { id: 'single', name: 'Single template', price: '₹2,499', note: 'For one personal or client project', featured: false },
  { id: 'collection', name: 'Full collection', price: '₹9,999', note: 'Every launch template + lifetime pack updates', featured: true },
  { id: 'studio', name: 'Studio license', price: '₹24,999', note: 'For teams creating work across client projects', featured: false },
]

const checkoutUrls = {
  single: import.meta.env.VITE_CHECKOUT_SINGLE_URL,
  collection: import.meta.env.VITE_CHECKOUT_COLLECTION_URL,
  studio: import.meta.env.VITE_CHECKOUT_STUDIO_URL,
}

const productStories = {
  '01': ['Botanical restraint meets editorial rhythm.', 'A poised starting point for wellness, fashion and independent brands that need warmth without losing precision.'],
  '02': ['Luxury built from shadow, scale and restraint.', 'Designed for fashion, fragrance and premium launches that need a cinematic first impression.'],
  '03': ['A quiet interface with a memorable point of view.', 'For thoughtful products and stories that benefit from clarity, whitespace and strong typography.'],
}

const getProductStory = (item) => productStories[item[0]] || [
  `${item[3]} with a distinctly 1Forge point of view.`,
  'A launch-ready visual foundation designed to be reshaped around your brand, story and product.',
]

const getWeeklyDrop = () => {
  const fridayEpoch = new Date('2026-07-17T00:00:00')
  const now = new Date()
  const week = Math.max(0, Math.floor((now - fridayEpoch) / (7 * 24 * 60 * 60 * 1000)))
  const item = templates[week % templates.length]
  const nextDrop = new Date(fridayEpoch.getTime() + (week + 1) * 7 * 24 * 60 * 60 * 1000)
  return { item, nextDrop }
}

const primaryVideoUrl = (item) => originalVideoTemplates.has(item[0])
  ? `/videos/optimized/template-${item[0]}.mp4`
  : `/videos/template-${item[0]}.mp4`

const criticalVideoUrls = [
  '/videos/optimized/hero-showcase.mp4',
  ...templates.slice(0, 6).map(primaryVideoUrl),
]
const allVideoUrls = [...new Set([
  '/videos/optimized/hero-showcase.mp4',
  ...templates.map(primaryVideoUrl),
])]

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
const Bag = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 8h12l1 12H5L6 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg>
const Check = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg>

const getCommandShortcut = () => {
  const platform = navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || ''
  return /Mac|iPhone|iPad|iPod/i.test(platform) ? { label: '⌘ K', modifier: 'meta' } : { label: 'Ctrl K', modifier: 'ctrl' }
}

function useCommandShortcut() {
  const [shortcut, setShortcut] = useState({ label: 'Ctrl K', modifier: 'ctrl' })
  useEffect(() => setShortcut(getCommandShortcut()), [])
  return shortcut
}

function Brand() {
  return <a className="brand" href="/" aria-label="1Forge Designs home"><img src="/brand/1forge-logo.png" alt="1Forge"/></a>
}

function EcosystemSwitcher() {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const products = [
    ['S', 'Studio', 'Software, apps & AI', 'https://studio.1forge.in/', 'violet'],
    ['D', 'Designs', 'Premium UI/UX templates', '/', 'orange'],
    ['H', 'Hostin', 'Property operations', 'https://host-in-beta.vercel.app/', 'green'],
  ]

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && setOpen(false)
    const closeOutside = (event) => !rootRef.current?.contains(event.target) && setOpen(false)
    window.addEventListener('keydown', closeOnEscape)
    window.addEventListener('pointerdown', closeOutside)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      window.removeEventListener('pointerdown', closeOutside)
    }
  }, [])

  return <div ref={rootRef} className={`design-ecosystem ${open ? 'is-open' : ''}`}>
    <div className="design-ecosystem__panel" aria-hidden={!open} inert={!open}>
      <header><span>1FORGE ECOSYSTEM</span><small>One forge. Three products.</small></header>
      {products.map(([mark, name, label, href, tone]) => <a key={name} href={href} className={`is-${tone} ${name === 'Designs' ? 'is-current' : ''}`} onClick={() => setOpen(false)}>
        <i>{mark}</i><span><strong>{name}</strong><small>{label}</small></span><b>{name === 'Designs' ? 'CURRENT' : '↗'}</b>
      </a>)}
    </div>
    <button className="design-ecosystem__trigger" type="button" aria-expanded={open} aria-label="Open 1Forge product ecosystem" onClick={() => setOpen(!open)}>
      <span className="design-ecosystem__rings"><i/><i/><i/></span><span>1Forge</span><b>⌃</b>
    </button>
  </div>
}

function DesignCommandBar({ currentTemplate, goHome, openCart }) {
  const shortcut = useCommandShortcut()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const inputRef = useRef(null)

  const jumpHome = (selector) => {
    if (currentTemplate) goHome()
    window.setTimeout(() => document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' }), currentTemplate ? 80 : 0)
  }

  const commands = [
    ...(currentTemplate ? [{ title: `Explore ${currentTemplate[1]}`, detail: 'Return to the cinematic preview', action: () => window.scrollTo({ top: 0, behavior: 'smooth' }), tag: 'preview' }, { title: 'Choose a license', detail: 'Compare single, collection and studio access', action: () => document.querySelector('#product-pricing')?.scrollIntoView({ behavior: 'smooth' }), tag: 'pricing buy license' }] : []),
    { title: 'Browse all templates', detail: 'Open the complete 39-design collection', action: () => jumpHome('#collection'), tag: 'templates collection' },
    { title: 'Claim the Friday drop', detail: 'See this week’s free Figma release', action: () => jumpHome('#free-drop'), tag: 'free weekly friday' },
    { title: 'Open saved concepts', detail: 'Review your persistent launch list', action: openCart, tag: 'saved wishlist launch' },
    { title: 'Ask about licensing', detail: 'Email the 1Forge team directly', action: () => { window.location.href = 'mailto:hello@1forge.in?subject=1Forge Designs license question' }, tag: 'help contact email' },
    { title: 'Visit 1Forge Studio', detail: 'Websites, products, apps and AI systems', action: () => window.location.assign('https://studio.1forge.in/'), tag: 'studio services' },
    { title: 'Open Hostin', detail: 'Property and accommodation operations', action: () => window.location.assign('https://host-in-beta.vercel.app/'), tag: 'hostin property' },
  ]
  const filtered = commands.filter((command) => `${command.title} ${command.detail} ${command.tag}`.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => {
    const handleKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setOpen((current) => !current)
      }
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    setQuery('')
    setActiveIndex(0)
    window.setTimeout(() => inputRef.current?.focus(), 20)
    return () => { document.body.style.overflow = previousOverflow }
  }, [open])

  useEffect(() => setActiveIndex(0), [query])

  const run = (command) => {
    if (!command) return
    setOpen(false)
    window.setTimeout(command.action, 30)
  }

  return <>
    <button className="design-command-trigger" type="button" onClick={() => setOpen(true)} aria-haspopup="dialog"><span>?</span><b>Help</b><kbd>{shortcut.label}</kbd></button>
    {open && <div className="design-command-backdrop" role="presentation" onMouseDown={() => setOpen(false)}>
      <div className="design-command" role="dialog" aria-modal="true" aria-label="1Forge Designs help" onMouseDown={(event) => event.stopPropagation()}>
        <div className="design-command__search"><span>⌕</span><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search help, pages and actions…" aria-label="Search commands" onKeyDown={(event) => {
          if (event.key === 'ArrowDown') { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, filtered.length - 1)) }
          if (event.key === 'ArrowUp') { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)) }
          if (event.key === 'Enter') { event.preventDefault(); run(filtered[activeIndex]) }
        }}/><kbd>{shortcut.label}</kbd><button type="button" onClick={() => setOpen(false)} aria-label="Close help">×</button></div>
        <div className="design-command__heading"><span>QUICK DIRECTIONS</span><small>{filtered.length} available</small></div>
        <div className="design-command__options" role="listbox">
          {filtered.map((command, index) => <button type="button" role="option" aria-selected={index === activeIndex} className={index === activeIndex ? 'is-active' : ''} key={command.title} onMouseEnter={() => setActiveIndex(index)} onClick={() => run(command)}><i>{String(index + 1).padStart(2, '0')}</i><span><strong>{command.title}</strong><small>{command.detail}</small></span><b>↗</b></button>)}
          {!filtered.length && <p>No matching direction. Try “free”, “license” or “saved”.</p>}
        </div>
        <footer><span>Use ↑ ↓ to move · Enter to open · Esc to close</span><a href="mailto:hello@1forge.in">Talk to the studio ↗</a></footer>
      </div>
    </div>}
  </>
}

function TemplateMedia({ item, compact = false, active = true, cinematic = false }) {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const usesOriginalVideo = originalVideoTemplates.has(item[0])
  const videoFile = usesOriginalVideo
    ? `optimized/template-${item[0]}.mp4`
    : `template-${item[0]}.mp4`

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!active) {
      video.pause()
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { rootMargin: '0px', threshold: 0.45 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [active])

  return <div className={`template-media ${compact ? 'template-media--compact' : ''} ${cinematic ? 'template-media--cinematic' : ''} ${ready ? 'template-media--ready' : ''}`}>
    <video ref={videoRef} muted loop playsInline preload="none" poster={`/templates/${item[2]}`} aria-label={`${item[1]} animated preview`} onCanPlay={() => setReady(true)} onPlaying={() => setReady(true)} onError={() => setReady(true)}>
      {cinematic && <source src={`/videos/4k/template-${item[0]}.mp4`} type="video/mp4" media="(min-width: 760px)"/>}
      <source src={`/videos/${videoFile}`} type="video/mp4"/>
      {usesOriginalVideo && <source src={`/videos/original/template-${item[0]}.webm`} type="video/webm"/>}
    </video>
    <MediaSkeleton active={!ready} label={`${item[0]} / Loading preview`}/>
  </div>
}

function HeroMedia({ active = true }) {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!active) {
      video.pause()
      return
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {})
      else video.pause()
    }, { threshold: 0.08 })
    observer.observe(video)
    return () => observer.disconnect()
  }, [active])

  return <div className={`hero-media-shell ${ready ? 'hero-media-shell--ready' : ''}`}><video ref={videoRef} className="hero-media" muted loop playsInline preload="metadata" poster="/templates/hero-poster.webp" aria-label="1Forge template collection animated preview" onCanPlay={() => setReady(true)} onPlaying={() => setReady(true)} onError={() => setReady(true)}><source src="/videos/4k/hero-showcase.mp4" type="video/mp4" media="(min-width: 1200px)"/><source src="/videos/optimized/hero-showcase.mp4" type="video/mp4"/><source src="/videos/original/hero-showcase.webm" type="video/webm"/></video><MediaSkeleton active={!ready} label="Preparing flagship preview"/></div>
}

function Mockup({ variant, compact = false }) {
  return <div className={`mockup mockup--${variant} ${compact ? 'mockup--compact' : ''}`}>
    <div className="mock-nav"><i/><span/><span/><span/></div>
    <div className="mock-copy"><small>1FORGE / CONCEPT</small><b>{variant === 'noir' ? 'Objects of desire.' : variant === 'chrome' ? 'Build what’s next.' : variant === 'warm' ? 'Made to be felt.' : 'Design without limits.'}</b><em>Explore the collection →</em></div>
    <div className="mock-orb"/><div className="mock-grid"/>
  </div>
}

function SubscribeForm({ id, source, template, buttonLabel, compact = false, onSuccess }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source, template, website: '' }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
      setStatus('success')
      setMessage(data.message || 'You’re in. Watch your inbox for the next 1Forge drop.')
      setEmail('')
      onSuccess?.()
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Network error. Please try again.')
    }
  }

  return <form className={`subscribe-form ${compact ? 'subscribe-form--compact' : ''}`} onSubmit={submit}>
    <label htmlFor={id}>Your email</label>
    <div>
      <input id={id} type="email" required autoComplete="email" placeholder="you@studio.com" value={email} onChange={(event) => setEmail(event.target.value)} disabled={status === 'loading'}/>
      <button className="button button--primary" type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Joining…' : buttonLabel}<Arrow/></button>
    </div>
    {message && <p className={`form-message form-message--${status}`} role="status">{message}</p>}
  </form>
}

function WeeklyDrop({ openTemplate }) {
  const { item, nextDrop } = getWeeklyDrop()
  const releaseLabel = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long' }).format(nextDrop)

  return <section id="free-drop" className="section-shell section-pad free-drop">
    <div className="free-drop__card glass">
      <div className="free-drop__media"><TemplateMedia item={item}/><span className="free-drop__badge">FREE / THIS WEEK</span></div>
      <div className="free-drop__copy">
        <div className="eyebrow">THE FRIDAY DROP</div>
        <p className="free-drop__kicker">One complete 1Forge concept. Free every week.</p>
        <h2>{item[1]}<br/><em>is on us.</em></h2>
        <p>Get this week’s editable Figma release, then come back next Friday for an entirely new direction. No recycled freebies and no fake countdown.</p>
        <div className="drop-clock"><span>Current drop <strong>{item[0]}</strong></span><span>Next release <strong>{releaseLabel}</strong></span></div>
        <SubscribeForm id="free-drop-email" source="weekly-free" template={item[1]} buttonLabel="Unlock this week’s drop" onSuccess={() => recordPassport('weekly-drop', item[1])}/>
        <button className="text-link" onClick={() => openTemplate(item)}>Explore {item[1]} before you join <Arrow/></button>
      </div>
    </div>
  </section>
}

function ProductRating({ item }) {
  const storageKey = `1forge-rating-${item[0]}`
  const [rating, setRating] = useState(() => Number(localStorage.getItem(storageKey)) || 0)

  const rate = (value) => {
    localStorage.setItem(storageKey, String(value))
    setRating(value)
    recordPassport('rated', item[1])
  }

  return <div className="rating-panel">
    <div><span className="eyebrow-label">COMMUNITY RATING</span><strong>{rating ? `Your rating: ${rating}/5` : 'Pre-release · Be first to rate'}</strong></div>
    <div className="rating-stars" role="group" aria-label={`Rate ${item[1]}`}>
      {[1,2,3,4,5].map(value => <button className={value <= rating ? 'is-active' : ''} key={value} onClick={() => rate(value)} aria-label={`${value} star${value > 1 ? 's' : ''}`}>★</button>)}
    </div>
    <small>Saved on this device. Public averages will appear after verified purchases begin.</small>
  </div>
}

function ProductPage({ item, goHome, openTemplate, saveTemplate, saved }) {
  const [storyTitle, storyCopy] = getProductStory(item)
  const related = templates.filter((candidate) => candidate[0] !== item[0] && candidate[3].split(' / ')[0] === item[3].split(' / ')[0]).slice(0, 3)
  const fallbackRelated = related.length === 3 ? related : templates.filter((candidate) => candidate[0] !== item[0]).slice(0, 3)
  const checkoutReady = licenseOptions.every((option) => Boolean(checkoutUrls[option.id]))

  const chooseLicense = (option) => {
    const checkoutUrl = checkoutUrls[option.id]
    saveTemplate(item, option.name)
    if (checkoutUrl) {
      const target = new URL(checkoutUrl)
      target.searchParams.set('client_reference_id', `${item[0]}-${slugify(item[1])}`)
      window.location.assign(target.toString())
      return
    }
    window.setTimeout(() => document.querySelector('#product-access-email')?.focus(), 50)
  }

  useEffect(() => {
    document.title = `${item[1]} — ${item[3]} Figma Template | 1Forge Designs`
    window.scrollTo(0, 0)
  }, [item])

  return <div className="product-page">
    <header className="product-header">
      <Brand/>
      <button className="product-back" onClick={goHome}>← Back to collection</button>
      <button className="product-save" onClick={() => saveTemplate(item)}>{saved ? '★ Saved' : '☆ Save concept'}</button>
    </header>

    <main>
      <section className="product-hero">
        <div className="product-hero__media"><TemplateMedia item={item} cinematic/></div>
        <div className="product-hero__shade"/>
        <div className="product-hero__topline"><span>{item[0]} / 39</span><span>{item[3]}</span><span>FIGMA / LAUNCH EDITION</span></div>
        <div className="product-hero__content">
          <div className="eyebrow">1FORGE ORIGINAL</div>
          <h1>{item[1]}</h1>
          <p>{storyTitle}</p>
          <div className="product-hero__actions">
            <a className="button button--primary" href="#product-pricing">Choose your license <Arrow/></a>
            <button className="button button--cinema" onClick={() => saveTemplate(item)}>{saved ? 'Saved to launch list' : 'Save for launch'}</button>
          </div>
        </div>
        <div className="product-hero__scroll">SCROLL TO ENTER <i/></div>
      </section>

      <section className="product-story section-shell section-pad">
        <div><div className="eyebrow">THE DIRECTION</div><h2>{storyTitle}</h2></div>
        <div><p>{storyCopy}</p><p>The cinematic preview sets the mood. The editable file gives you the structure beneath it—ready for your typography, palette, imagery and product story.</p></div>
      </section>

      <ProductExperience item={item} saved={saved} saveTemplate={saveTemplate}/>

      <section className="product-showcase section-shell">
        <div className="product-showcase__frame glass"><TemplateMedia item={item} cinematic/><span>4K PRESENTATION / {item[1]}</span></div>
        <div className="product-showcase__notes">
          <article><span>01</span><h3>Designed as a system</h3><p>Reusable visual decisions keep the page feeling intentional as you adapt it.</p></article>
          <article><span>02</span><h3>Made to become yours</h3><p>Typography, color, imagery, copy and composition remain fully editable in Figma.</p></article>
          <article><span>03</span><h3>Ready for real work</h3><p>Commercial use is available for personal, client and multi-project studio workflows.</p></article>
        </div>
      </section>

      <section className="included section-shell section-pad">
        <div className="section-head"><div><div className="eyebrow">WHAT YOU RECEIVE</div><h2>Not a screenshot.<br/><em>A working foundation.</em></h2></div><p>The launch file is structured to help you move from inspiration to a credible first version without flattening the personality out of the design.</p></div>
        <div className="included-grid">
          {['Editable Figma source','Responsive composition guidance','Reusable component structure','Type + color direction','Quick-start customization notes','Commercial-use license'].map((label, index) => <div key={label}><span>{String(index + 1).padStart(2, '0')}</span><strong>{label}</strong><Check/></div>)}
        </div>
      </section>

      <section id="product-pricing" className="product-pricing section-shell section-pad">
        <div className="eyebrow">CHOOSE YOUR ACCESS</div>
        <h2>Start with one.<br/><em>Build beyond it.</em></h2>
        <div className="license-grid">
          {licenseOptions.map(option => <article className={option.featured ? 'license-card license-card--featured' : 'license-card'} key={option.id}>
            {option.featured && <span className="license-card__flag">BEST LAUNCH VALUE</span>}
            <span className="license-card__index">{option.id === 'single' ? '01' : option.id === 'collection' ? '02' : '03'}</span>
            <h3>{option.name}</h3><strong>{option.price}</strong><p>{option.note}</p>
            <button className={`button ${option.featured ? 'button--primary' : 'button--outline'}`} onClick={() => chooseLicense(option)}>{checkoutUrls[option.id] ? 'Buy' : 'Reserve'} {option.name.toLowerCase()} <Arrow/></button>
          </article>)}
        </div>
        <p className="pricing-note">Founding prices shown in INR. {checkoutReady ? 'Secure checkout opens through the selected purchase option.' : 'Payment opens with the first file release; reserving now does not charge you.'}</p>
      </section>

      <section className="product-trust section-shell section-pad">
        <ProductRating item={item}/>
        <div className="product-access glass">
          <div><div className="eyebrow">PRIVATE LAUNCH ACCESS</div><h2>Get {item[1]}<br/><em>before the public drop.</em></h2></div>
          <div><p>We’ll send the release, founding price and exact license terms to your inbox. No payment is taken today.</p><SubscribeForm id="product-access-email" source="product-access" template={item[1]} buttonLabel="Reserve launch access" compact/></div>
        </div>
      </section>

      <section className="related section-shell section-pad">
        <div className="section-head"><div><div className="eyebrow">KEEP EXPLORING</div><h2>More from<br/><em>the forge.</em></h2></div></div>
        <div className="related-grid">{fallbackRelated.map(candidate => <button type="button" data-cursor="OPEN" onClick={() => openTemplate(candidate)} key={candidate[0]}><TemplateMedia item={candidate} compact/><span>{candidate[0]} / {candidate[1]} <i>↗</i></span></button>)}</div>
      </section>
      <ProductFilmstrip item={item} openTemplate={openTemplate} catalog={templates}/>
    </main>

    <footer className="footer section-shell"><Brand/><div><button onClick={goHome}>FULL COLLECTION</button><a href="mailto:hello@1forge.in">EMAIL</a></div><span>© 2026 1FORGE DESIGNS. ALL RIGHTS RESERVED.</span></footer>
  </div>
}

function App() {
  const [appReady, setAppReady] = useState(false)
  const [menu, setMenu] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState(() => findTemplateFromPath())
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState(() => {
    try {
      const sharedIds = new URLSearchParams(window.location.search).get('board')?.split(',').filter(Boolean)
      const savedIds = sharedIds?.length ? sharedIds : JSON.parse(localStorage.getItem('1forge-launch-list') || '[]')
      return savedIds.map((id) => templates.find((item) => item[0] === id)).filter(Boolean)
    } catch { return [] }
  })
  const [notice, setNotice] = useState('')

  useEffect(() => {
    document.body.style.overflow = !appReady || cartOpen || menu ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [appReady, cartOpen, menu])

  useEffect(() => {
    const syncRoute = () => setCurrentTemplate(findTemplateFromPath())
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  useEffect(() => {
    localStorage.setItem('1forge-launch-list', JSON.stringify(cart.map((item) => item[0])))
  }, [cart])

  const finishLoader = useCallback(() => setAppReady(true), [])

  useEffect(() => {
    if (!appReady || currentTemplate) return
    const controller = new AbortController()
    const remaining = allVideoUrls.filter(url => !criticalVideoUrls.includes(url))
    let cursor = 0

    const worker = async () => {
      while (cursor < remaining.length && !controller.signal.aborted) {
        const url = remaining[cursor]
        cursor += 1
        try {
          const response = await fetch(url, { cache: 'force-cache', signal: controller.signal })
          if (response.ok) await response.blob()
        } catch (error) {
          if (error.name !== 'AbortError') console.warn(`Background preload failed: ${url}`)
        }
      }
    }

    const startTimer = window.setTimeout(() => Promise.all([worker(), worker()]), 700)
    return () => {
      window.clearTimeout(startTimer)
      controller.abort()
    }
  }, [appReady, currentTemplate])

  const saveTemplate = (item, plan) => {
    setCart((current) => current.some((x) => x[0] === item[0]) ? current : [...current, item])
    setNotice(plan ? `${plan} reserved for ${item[1]} — add your email below` : `${item[1]} saved to your launch list`)
    recordPassport('saved', item[1])
    setTimeout(() => setNotice(''), 2200)
  }

  const openTemplate = (item) => {
    const update = () => {
      window.history.pushState({}, '', templatePath(item))
      setCurrentTemplate(item)
      setMenu(false)
      window.scrollTo(0, 0)
    }
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(update)
    else update()
  }

  const goHome = () => {
    const update = () => {
      window.history.pushState({}, '', '/')
      setCurrentTemplate(null)
      document.title = '1Forge Designs — Premium Figma Templates'
      window.scrollTo(0, 0)
    }
    if (document.startViewTransition && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) document.startViewTransition(update)
    else update()
  }

  const joinLaunch = () => {
    setCartOpen(false)
    const fieldId = currentTemplate ? '#product-access-email' : '#launch-email'
    window.setTimeout(() => {
      document.querySelector(fieldId)?.focus()
      document.querySelector(fieldId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 50)
  }

  const shareBoard = async () => {
    if (!cart.length) {
      setNotice('Save at least one concept before sharing a board.')
      return
    }
    const url = new URL(window.location.origin)
    url.searchParams.set('board', cart.map((item) => item[0]).join(','))
    try {
      await navigator.clipboard.writeText(url.toString())
      recordPassport('shared', `${cart.length} concepts`)
      setNotice('Shareable launch-board link copied.')
    } catch {
      window.prompt('Copy your launch-board link:', url.toString())
    }
    window.setTimeout(() => setNotice(''), 2400)
  }

  const loaderAssets = currentTemplate
    ? [window.matchMedia('(min-width: 760px)').matches ? `/videos/4k/template-${currentTemplate[0]}.mp4` : primaryVideoUrl(currentTemplate)]
    : criticalVideoUrls

  return <>
    {!appReady && <ForgeLoader assets={loaderAssets} onComplete={finishLoader}/>}
    <div className="noise" aria-hidden="true"/>
    <MaterialCursor/>
    <DesignCommandBar currentTemplate={currentTemplate} goHome={goHome} openCart={() => setCartOpen(true)}/>
    <EcosystemSwitcher/>
    {currentTemplate ? <ProductPage item={currentTemplate} goHome={goHome} openTemplate={openTemplate} saveTemplate={saveTemplate} saved={cart.some((item) => item[0] === currentTemplate[0])}/> : <>
    <header className="header" id="top">
      <Brand/>
      <nav className={menu ? 'nav nav--open' : 'nav'} aria-label="Main navigation">
        <a href="#collection" onClick={() => setMenu(false)}>THE PACK</a>
        <a href="#gallery" onClick={() => setMenu(false)}>GALLERY</a>
        <a href="#free-drop" onClick={() => setMenu(false)}>FREE FRIDAY</a>
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
        <div className="hero-frame glass"><div className="live"><i/> LIVE PREVIEW</div><HeroMedia active={appReady}/></div>
        <div className="hero-actions"><a className="button button--primary" href="#collection">Explore the collection <Arrow/></a><a className="button button--ghost" href="#gallery">See the quality ↓</a></div>
      </section>

      <section id="collection" className="section-shell section-pad">
        <div className="section-head"><div><div className="eyebrow">WHAT’S INSIDE</div><h2>Designs that<br/><em>move work forward.</em></h2></div><p>Launch-ready concepts across landing pages, portfolios, SaaS, editorial, commerce and dashboards. Each file will be fully editable and built with reusable components.</p></div>
        <div className="availability"><span>39 launch concepts</span><span>New releases every week</span><span>Single templates + full pack</span></div>
        <div className="template-grid">
          {templates.map((item) => <article className="template-card glass" key={item[0]}>
            <button className="template-preview" data-cursor="EXPLORE" onClick={() => openTemplate(item)} aria-label={`Explore ${item[1]}`}><TemplateMedia item={item} compact active={!cartOpen}/></button>
            <div className="template-meta"><span>{item[0]}</span><div><b>{item[1]}</b><small>{item[3]}</small></div><button onClick={() => saveTemplate(item)} aria-label={`Save ${item[1]} to launch list`}><Bag/></button></div>
          </article>)}
        </div>
        <div className="center"><a className="button button--primary" href="#launch">Get launch access <Arrow/></a></div>
      </section>

      <section id="gallery" className="section-shell section-pad gallery-section">
        <div className="eyebrow">PREVIEW GALLERY</div><h2>See the <em>1Forge level.</em></h2>
        <div className="gallery-grid">
          {galleryTemplates.map((item, i) => <button className={`gallery-tile gallery-tile--${(i % 6) + 1}`} key={item[0]} onClick={() => openTemplate(item)} aria-label={`Open ${item[1]} product page`}><TemplateMedia item={item} active={!cartOpen}/><span>{item[0]} / {item[1]}</span></button>)}
        </div>
      </section>

      <WeeklyDrop openTemplate={openTemplate}/>
      <DropVault templates={templates} openTemplate={openTemplate}/>
      <ForgePassport/>
      <CommunityHub templates={templates}/>

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
          <SubscribeForm id="launch-email" source="main-launch" buttonLabel="Join the launch list" onSuccess={() => setNotice('You’re on the launch list — welcome to 1Forge Designs.')}/>
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
    </>}

    <div className={cartOpen ? 'drawer-backdrop drawer-backdrop--open' : 'drawer-backdrop'} onMouseDown={(e)=>e.target===e.currentTarget&&setCartOpen(false)}>
      <aside className="cart-drawer" aria-hidden={!cartOpen}><header><div><h2>Your launch board</h2><small>Saved on this device · shareable by link</small></div><button className="close" onClick={()=>setCartOpen(false)}>×</button></header>{cart.length ? <div className="cart-items">{cart.map(item=><div key={item[0]}><TemplateMedia item={item} compact/><span><b>{item[1]}</b><small>{item[3]}</small></span><button onClick={()=>setCart(cart.filter(x=>x[0]!==item[0]))}>Remove</button></div>)}</div> : <div className="empty"><Bag/><p>Your board is empty.</p><span>Save concepts to build a direction you can share.</span></div>}<button className="drawer-share" type="button" onClick={shareBoard}>Copy shareable board link ↗</button><button className="button button--primary drawer-cta" onClick={joinLaunch}>Join for launch access <Arrow/></button></aside>
    </div>
    {notice && <div className="toast" role="status">{notice}</div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)
