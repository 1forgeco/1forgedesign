import React, { useEffect, useMemo, useRef, useState } from 'react'

const Arrow = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>

export const recordPassport = (action, detail = '') => {
  try {
    const current = JSON.parse(localStorage.getItem('1forge-passport') || '[]')
    if (!current.some((entry) => entry.action === action)) {
      localStorage.setItem('1forge-passport', JSON.stringify([...current, { action, detail, at: new Date().toISOString() }]))
      window.dispatchEvent(new CustomEvent('forge:passport'))
    }
  } catch { /* device storage can be unavailable in privacy mode */ }
}

const readDeviceState = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback } catch { return fallback }
}

function QualityFilm({ item }) {
  const videoRef = useRef(null)
  const shellRef = useRef(null)
  const [quality, setQuality] = useState(() => localStorage.getItem('1forge-film-quality') || 'auto')
  const [playing, setPlaying] = useState(true)
  const [chapter, setChapter] = useState(0)
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
  const chapters = [
    ['Opening', 0, 'The first impression and visual promise.'],
    ['Rhythm', 4, 'How type, spacing and imagery hold attention.'],
    ['System', 8, 'The reusable decisions beneath the cinematic surface.'],
  ]
  const source = quality === '4k' ? `/videos/4k/template-${item[0]}.mp4` : quality === 'hd' ? `/videos/optimized/template-${item[0]}.mp4` : (innerWidth >= 1200 ? `/videos/4k/template-${item[0]}.mp4` : `/videos/optimized/template-${item[0]}.mp4`)

  useEffect(() => {
    localStorage.setItem('1forge-film-quality', quality)
  }, [quality])

  const seek = (index) => {
    setChapter(index)
    if (videoRef.current) {
      videoRef.current.currentTime = chapters[index][1]
      videoRef.current.play().catch(() => {})
      setPlaying(true)
    }
  }

  const togglePlayback = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) { videoRef.current.play().catch(() => {}); setPlaying(true) }
    else { videoRef.current.pause(); setPlaying(false) }
  }

  return <section id="design-film" className="experience-film section-shell section-pad">
    <div className="experience-heading"><div><span className="eyebrow">DESIGN FILM</span><h2>A closer look,<br/><em>at your pace.</em></h2></div><p>Choose the stream quality, pause motion, or enter fullscreen. Audio remains off by default.</p></div>
    <div ref={shellRef} className="experience-film__stage">
      <video key={source} ref={videoRef} src={source} poster={`/templates/${item[2]}`} muted loop playsInline autoPlay={!reduced} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}/>
      <div className="experience-film__wash"/>
      <div className="experience-film__caption"><small>0{chapter + 1} / 03</small><strong>{chapters[chapter][0]}</strong><p>{chapters[chapter][2]}</p></div>
      <div className="experience-film__controls">
        <button type="button" onClick={togglePlayback}>{playing ? 'Ⅱ Pause' : '▶ Play'}</button>
        <label>Quality <select value={quality} onChange={(event) => setQuality(event.target.value)}><option value="auto">Auto</option><option value="hd">HD</option><option value="4k">4K</option></select></label>
        <button type="button" className={reduced ? 'is-active' : ''} onClick={() => { setReduced(!reduced); if (!reduced) videoRef.current?.pause() }}>Reduce motion</button>
        <button type="button" onClick={() => shellRef.current?.requestFullscreen?.()}>⛶ Fullscreen</button>
      </div>
    </div>
    <div className="experience-film__chapters">{chapters.map(([name,, copy], index) => <button type="button" className={chapter === index ? 'is-active' : ''} onClick={() => seek(index)} key={name}><span>0{index + 1}</span><strong>{name}</strong><small>{copy}</small></button>)}</div>
  </section>
}

function DesignLab({ item }) {
  const storageKey = `1forge-lab-${item[0]}`
  const initial = readDeviceState(storageKey, { accent: '#f06a2a', surface: '#141416', mode: 'dark', font: 'editorial', headline: item[1], radius: 24, spacing: 58, viewport: 'desktop' })
  const [config, setConfig] = useState(initial)
  const [message, setMessage] = useState('')
  const update = (key, value) => setConfig((current) => ({ ...current, [key]: value }))
  const palette = [config.accent, config.surface, config.mode === 'dark' ? '#f3efe8' : '#141416', '#88827a']

  const save = () => {
    localStorage.setItem(storageKey, JSON.stringify(config))
    recordPassport('customized', item[1])
    setMessage('Direction saved on this device.')
  }
  const exportConfig = () => {
    const blob = new Blob([JSON.stringify({ template: item[1], ...config }, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${item[0]}-${item[1].toLowerCase().replaceAll(' ', '-')}-direction.json`
    link.click()
    URL.revokeObjectURL(link.href)
    recordPassport('exported', item[1])
    setMessage('Creative direction exported.')
  }

  return <section id="design-lab" className="design-lab section-shell section-pad">
    <div className="experience-heading"><div><span className="eyebrow">LIVE DESIGN LAB</span><h2>Make it feel<br/><em>like your brand.</em></h2></div><p>This is a working direction tool—not a screenshot. Tune the visual system, preview responsive states, save it locally, and export the brief.</p></div>
    <div className="design-lab__shell">
      <aside className="design-lab__controls">
        <div><label htmlFor="lab-headline">Headline</label><input id="lab-headline" value={config.headline} maxLength="42" onChange={(event) => update('headline', event.target.value)}/></div>
        <div className="design-lab__split"><label>Accent<input type="color" value={config.accent} onChange={(event) => update('accent', event.target.value)}/></label><label>Surface<input type="color" value={config.surface} onChange={(event) => update('surface', event.target.value)}/></label></div>
        <div><span className="lab-label">Type direction</span><div className="lab-segments">{['editorial','modern','mono'].map(value => <button type="button" className={config.font === value ? 'is-active' : ''} onClick={() => update('font', value)} key={value}>{value}</button>)}</div></div>
        <div><span className="lab-label">Theme</span><div className="lab-segments">{['dark','light'].map(value => <button type="button" className={config.mode === value ? 'is-active' : ''} onClick={() => update('mode', value)} key={value}>{value}</button>)}</div></div>
        <label>Corner character <output>{config.radius}px</output><input type="range" min="0" max="48" value={config.radius} onChange={(event) => update('radius', Number(event.target.value))}/></label>
        <label>Composition spacing <output>{config.spacing}px</output><input type="range" min="28" max="92" value={config.spacing} onChange={(event) => update('spacing', Number(event.target.value))}/></label>
        <div className="design-lab__actions"><button type="button" onClick={save}>Save direction</button><button type="button" onClick={exportConfig}>Export JSON</button></div>
        {message && <small className="lab-message" role="status">{message}</small>}
      </aside>
      <div className="design-lab__workspace">
        <div className="responsive-tabs" aria-label="Preview width">{[['mobile','Mobile'],['tablet','Tablet'],['desktop','Desktop']].map(([value,label]) => <button type="button" className={config.viewport === value ? 'is-active' : ''} onClick={() => update('viewport', value)} key={value}>{label}</button>)}</div>
        <div className={`lab-device lab-device--${config.viewport}`}>
          <article className={`lab-canvas is-${config.mode} is-${config.font}`} style={{ '--lab-accent': config.accent, '--lab-surface': config.surface, '--lab-radius': `${config.radius}px`, '--lab-space': `${config.spacing}px` }}>
            <nav><b>1F / {item[0]}</b><span>Index &nbsp; About &nbsp; Contact</span></nav>
            <div className="lab-canvas__copy"><small>{item[3]}</small><h3>{config.headline || item[1]}</h3><p>A premium digital direction forged for clarity, character and momentum.</p><button type="button">Enter the experience <Arrow/></button></div>
            <div className="lab-canvas__art"><img src={`/templates/${item[2]}`} alt=""/></div>
          </article>
        </div>
        <details className="specimen-drawer"><summary>Typography specimen <span>Open Aa</span></summary><div className={`is-${config.font}`}><strong>Aa Bb Cc 0123</strong><p>Display / 88 — The quick brown fox shapes a launch.</p><small>Body / 16 — Built for clear reading across every responsive state.</small></div></details>
        <div className="palette-strip"><span>EXTRACTED PALETTE</span>{palette.map((color) => <button type="button" key={color} style={{ background: color }} title={`Copy ${color}`} aria-label={`Copy color ${color}`} onClick={() => { navigator.clipboard?.writeText(color); setMessage(`${color} copied.`) }}><i>{color}</i></button>)}</div>
      </div>
    </div>
  </section>
}

function AnatomyInspector({ item }) {
  const parts = [
    { name: 'Navigation', at: ['15%','12%'], copy: 'A low-noise navigation layer keeps the first frame cinematic and usable.' },
    { name: 'Type scale', at: ['25%','58%'], copy: 'A decisive display scale creates hierarchy before decoration is added.' },
    { name: 'Focal media', at: ['72%','38%'], copy: 'The media position gives the composition its visual counterweight.' },
    { name: 'Primary action', at: ['34%','78%'], copy: 'The action is placed at the point where reading momentum resolves.' },
  ]
  const [active, setActive] = useState(0)
  return <div className="anatomy-panel" id="anatomy-inspector">
    <div className="anatomy-panel__visual"><img src={`/templates/${item[2]}`} alt={`${item[1]} anatomy preview`}/>{parts.map((part,index) => <button type="button" className={active === index ? 'is-active' : ''} style={{ left: part.at[0], top: part.at[1] }} onClick={() => setActive(index)} aria-label={`Inspect ${part.name}`} key={part.name}>{index + 1}</button>)}</div>
    <aside><span>COMPONENT ANATOMY</span><strong>{parts[active].name}</strong><p>{parts[active].copy}</p><small>Select a hotspot to inspect the system.</small></aside>
  </div>
}

function BeforeAfter({ item }) {
  const [position, setPosition] = useState(58)
  return <div className="before-after">
    <div className="before-after__image is-before"><img src={`/templates/${item[2]}`} alt="Unstyled wireframe direction"/></div>
    <div className="before-after__image is-after" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><img src={`/templates/${item[2]}`} alt={`${item[1]} finished visual direction`}/></div>
    <div className="before-after__line" style={{ left: `${position}%` }}><span>↔</span></div>
    <input type="range" min="5" max="95" value={position} onChange={(event) => setPosition(event.target.value)} aria-label="Compare foundation and finished direction"/>
    <span className="before-after__label is-left">FOUNDATION</span><span className="before-after__label is-right">1FORGE DIRECTION</span>
  </div>
}

function FileExplorer() {
  const files = [
    ['00','Start here','Usage, fonts and setup notes'],
    ['01','Foundations','Color, type, grids and effects'],
    ['02','Components','Navigation, buttons, fields and cards'],
    ['03','Desktop','Complete 1440px launch composition'],
    ['04','Tablet','Responsive 834px composition guidance'],
    ['05','Mobile','Complete 390px launch composition'],
  ]
  const [active, setActive] = useState(0)
  return <div className="file-explorer"><div className="file-explorer__bar"><i/><i/><i/><span>FIGMA SOURCE / LAUNCH EDITION</span></div><div className="file-explorer__body"><nav>{files.map(([index,name],i) => <button type="button" className={active === i ? 'is-active' : ''} onClick={() => setActive(i)} key={name}><span>{index}</span>{name}</button>)}</nav><article><small>PAGE {files[active][0]}</small><h3>{files[active][1]}</h3><p>{files[active][2]}</p><div className="file-explorer__layers">{['Hero / Main','Navigation / Default','CTA / Primary','Media / Ratio','Footer / Desktop'].map((name,i) => <span key={name}><i>{i % 2 ? '◇' : '▣'}</i>{name}<b>{i % 2 ? 'COMPONENT' : 'FRAME'}</b></span>)}</div></article></div></div>
}

function DesignDNA({ item }) {
  const seed = Number(item[0])
  const traits = [['Editorial', 58 + seed % 34],['Motion', 62 + seed % 29],['Utility', 52 + seed % 35],['Expression', 66 + seed % 27],['Density', 38 + seed % 39]]
  return <div className="design-dna"><div><span>DESIGN DNA</span><strong>{item[1]}</strong><p>A readable fingerprint of this direction—not a quality score.</p></div><div className="design-dna__traits">{traits.map(([name,value]) => <div key={name}><span>{name}</span><i><b style={{ width: `${value}%` }}/></i><output>{value}</output></div>)}</div></div>
}

function ProductToolkit({ item }) {
  const [view, setView] = useState('anatomy')
  return <section id="product-toolkit" className="product-toolkit section-shell section-pad">
    <div className="experience-heading"><div><span className="eyebrow">UNDER THE SURFACE</span><h2>Inspect the<br/><em>working system.</em></h2></div><p>Move between the anatomy, transformation, file structure and design fingerprint to understand exactly what you are buying.</p></div>
    <div className="toolkit-tabs">{[['anatomy','Anatomy'],['compare','Before / after'],['files','File explorer'],['dna','Design DNA']].map(([id,label]) => <button type="button" className={view === id ? 'is-active' : ''} onClick={() => setView(id)} key={id}>{label}</button>)}</div>
    {view === 'anatomy' && <AnatomyInspector item={item}/>} {view === 'compare' && <BeforeAfter item={item}/>} {view === 'files' && <FileExplorer/>} {view === 'dna' && <DesignDNA item={item}/>} 
  </section>
}

function ProductDock({ saved, saveTemplate, item, openConfidence }) {
  const jump = (id) => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  return <nav className="product-dock" aria-label="Product tools"><button type="button" onClick={() => jump('#design-film')}>Film</button><button type="button" onClick={() => jump('#design-lab')}>Customize</button><button type="button" onClick={() => jump('#product-toolkit')}>Inspect</button><button type="button" onClick={openConfidence}>What’s included</button><button type="button" className={saved ? 'is-saved' : ''} onClick={() => saveTemplate(item)}>{saved ? '★ Saved' : '☆ Save'}</button><button type="button" className="is-primary" onClick={() => jump('#product-pricing')}>Get it</button></nav>
}

function ConfidenceDrawer({ open, close }) {
  useEffect(() => {
    const escape = (event) => event.key === 'Escape' && close()
    window.addEventListener('keydown', escape)
    return () => window.removeEventListener('keydown', escape)
  }, [close])
  if (!open) return null
  return <div className="confidence-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}><aside className="confidence-drawer" role="dialog" aria-modal="true" aria-label="Purchase details"><header><div><span>BUY WITH CLARITY</span><h2>Exactly what happens next.</h2></div><button type="button" onClick={close} aria-label="Close">×</button></header><div className="confidence-list">{[
    ['01','Delivery','The editable Figma file and quick-start notes are sent to the purchase email.'],
    ['02','Compatibility','Everything works in the free Figma plan; no plugin is required to edit the source.'],
    ['03','License','Use it for the number of personal or client projects covered by your selected license.'],
    ['04','Updates','Full-collection access includes the pack updates described on the purchase option.'],
    ['05','Support','Questions go directly to hello@1forge.in, with your template and license in the subject.'],
  ].map(([number,title,copy]) => <article key={title}><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div></article>)}</div><a className="button button--primary" href="mailto:hello@1forge.in?subject=1Forge%20Designs%20purchase%20question">Ask before you buy <Arrow/></a><small>No fake timer. No hidden recurring charge. Checkout only opens when a purchase URL is configured.</small></aside></div>
}

export function ProductExperience({ item, saved, saveTemplate }) {
  const [confidence, setConfidence] = useState(false)
  return <><ProductDock item={item} saved={saved} saveTemplate={saveTemplate} openConfidence={() => setConfidence(true)}/><QualityFilm item={item}/><DesignLab item={item}/><ProductToolkit item={item}/><ConfidenceDrawer open={confidence} close={() => setConfidence(false)}/></>
}

export function ProductFilmstrip({ item, openTemplate, catalog }) {
  const index = Math.max(0, catalog.findIndex((candidate) => candidate[0] === item[0]))
  const options = [-1,0,1].map((offset) => catalog[(index + offset + catalog.length) % catalog.length])
  return <section className="product-filmstrip section-shell section-pad"><div className="experience-heading"><div><span className="eyebrow">NEXT DIRECTIONS</span><h2>Stay in the<br/><em>creative flow.</em></h2></div></div><div>{options.map((candidate,i) => <button type="button" className={i === 1 ? 'is-current' : ''} onClick={() => openTemplate(candidate)} key={candidate[0]}><img src={`/templates/${candidate[2]}`} alt=""/><span>{candidate[0]} / {candidate[1]}</span></button>)}</div></section>
}

export function ForgePassport() {
  const [entries, setEntries] = useState(() => readDeviceState('1forge-passport', []))
  useEffect(() => {
    const sync = () => setEntries(readDeviceState('1forge-passport', []))
    window.addEventListener('forge:passport', sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener('forge:passport', sync); window.removeEventListener('storage', sync) }
  }, [])
  const stamps = [['saved','Collector'],['customized','Art director'],['rated','Critic'],['weekly-drop','Friday regular'],['voted','Co-creator'],['shared','Curator']]
  return <section className="passport section-shell section-pad"><div className="experience-heading"><div><span className="eyebrow">FORGE PASSPORT</span><h2>Your creative<br/><em>trail.</em></h2></div><p>A small, private record of how you use the forge. Progress is stored only on this device.</p></div><div className="passport__book"><div className="passport__identity"><span>1FORGE / VISITOR</span><strong>{String(entries.length).padStart(2,'0')}</strong><small>STAMPS EARNED</small></div><div className="passport__stamps">{stamps.map(([action,label],index) => { const earned = entries.some((entry) => entry.action === action); return <article className={earned ? 'is-earned' : ''} key={action}><i>{earned ? '✓' : index + 1}</i><strong>{label}</strong><small>{earned ? 'Stamped' : 'Not yet'}</small></article> })}</div></div></section>
}

export function DropVault({ templates, openTemplate }) {
  const drops = useMemo(() => templates.slice(0, 6), [templates])
  const week = Math.max(0, Math.floor((Date.now() - new Date('2026-07-17T00:00:00').getTime()) / 604800000))
  return <section className="drop-vault section-shell section-pad"><div className="experience-heading"><div><span className="eyebrow">DROP VAULT</span><h2>Every Friday,<br/><em>a new door opens.</em></h2></div><p>The archive shows the release rhythm honestly. Only the current week can be claimed free; past doors remain available as previews.</p></div><div className="drop-vault__rail">{drops.map((item,index) => { const current = index === week % drops.length; const past = index < week % drops.length; return <button type="button" className={current ? 'is-current' : ''} onClick={() => openTemplate(item)} key={item[0]}><span>W{String(index + 1).padStart(2,'0')}</span><img src={`/templates/${item[2]}`} alt=""/><strong>{item[1]}</strong><small>{current ? 'FREE THIS WEEK' : past ? 'PAST DROP / PREVIEW' : 'UPCOMING PREVIEW'}</small></button> })}</div></section>
}

export function CommunityHub({ templates }) {
  const [mode, setMode] = useState('vote')
  const [status, setStatus] = useState('')
  const [form, setForm] = useState({ email: '', choice: 'Portfolio system', name: '', url: '', message: '' })
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const submit = async (event) => {
    event.preventDefault(); setStatus('Sending…')
    try {
      const response = await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: form.email, source: mode === 'vote' ? 'community-vote' : 'community-remix', template: mode === 'vote' ? form.choice : templates[0][1], name: form.name, projectUrl: form.url, message: form.message, website: '' }) })
      const data = await response.json(); if (!response.ok) throw new Error(data.error || 'Could not send')
      recordPassport(mode === 'vote' ? 'voted' : 'remixed', mode === 'vote' ? form.choice : form.url)
      localStorage.setItem(`1forge-${mode}`, JSON.stringify({ choice: form.choice, at: new Date().toISOString() }))
      setStatus(mode === 'vote' ? 'Vote delivered to the studio. Thank you.' : 'Remix submitted for review. Thank you.')
    } catch (error) { setStatus(error.message) }
  }
  return <section className="community-hub section-shell section-pad"><div className="experience-heading"><div><span className="eyebrow">SHAPE THE NEXT DROP</span><h2>Not testimonials.<br/><em>Real participation.</em></h2></div><p>Vote on what we should forge next or submit something you made. Submissions go directly to the studio and are never presented as public proof without review.</p></div><div className="community-hub__shell"><nav><button type="button" className={mode === 'vote' ? 'is-active' : ''} onClick={() => setMode('vote')}>Vote on the next drop</button><button type="button" className={mode === 'remix' ? 'is-active' : ''} onClick={() => setMode('remix')}>Submit a remix</button></nav><form onSubmit={submit}>{mode === 'vote' ? <><label>What should come next?<select value={form.choice} onChange={(event) => update('choice', event.target.value)}><option>Portfolio system</option><option>SaaS launch kit</option><option>Luxury commerce</option><option>Editorial publication</option><option>Mobile product UI</option></select></label><p>Your vote is email-backed and limited to one stored preference on this device. We do not display a made-up public total.</p></> : <><div className="community-hub__fields"><label>Your name<input required value={form.name} onChange={(event) => update('name', event.target.value)}/></label><label>Project URL<input required type="url" placeholder="https://" value={form.url} onChange={(event) => update('url', event.target.value)}/></label></div><label>What did you change?<textarea required value={form.message} onChange={(event) => update('message', event.target.value)} placeholder="Tell us about the direction, the template and your project."/></label></>}<label>Email<input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="you@studio.com"/></label><button className="button button--primary" type="submit">{mode === 'vote' ? 'Send my vote' : 'Submit for review'} <Arrow/></button>{status && <small role="status">{status}</small>}</form><aside><span>COMMUNITY WALL</span><strong>No approved remixes yet.</strong><p>The first reviewed project will appear here with the maker’s permission. Until then, the wall stays honest.</p></aside></div></section>
}

export function MaterialCursor() {
  const [state, setState] = useState({ x: -100, y: -100, label: '', visible: false })
  useEffect(() => {
    if (!matchMedia('(pointer:fine)').matches) return
    const move = (event) => {
      const target = event.target.closest?.('[data-cursor]')
      setState({ x: event.clientX, y: event.clientY, label: target?.dataset.cursor || '', visible: Boolean(target) })
    }
    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [])
  return <div className={`material-cursor ${state.visible ? 'is-visible' : ''}`} style={{ transform: `translate3d(${state.x}px,${state.y}px,0)` }}>{state.label || 'VIEW'}</div>
}
