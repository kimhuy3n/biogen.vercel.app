import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { createPortal } from 'react-dom'
import QRCode from 'qrcode'
import { BarChart3, ExternalLink, GripVertical, Link2, Menu, MoreHorizontal, Palette, Play, Plus, QrCode, Settings, Share2, Sparkles, Trash2, Upload, X } from 'lucide-react'
import { supabase } from './lib/supabase'
import './styles.css'
import './functional.css'
import './public.css'
import './typography.css'
import './analytics.css'
import './security.css'
import './design.css'
import './sky-themes.css'
import './palette.css'
import './layout-variants.css'
import './advanced-layouts.css'
import './typography-presets.css'
import './customize.css'
import cloudParadise from './assets/sky/floating-cloud-paradise.png'
import skyIsland from './assets/sky/sky-island-fantasy.png'
import glassSky from './assets/sky/glass-sky-layer.png'
import auroraNight from './assets/sky/aurora-night-sky.png'
import heavenLuxury from './assets/sky/heaven-luxury.png'
import dreamRibbon from './assets/sky/dream-ribbon.png'
import bentoSky from './assets/sky/bento-sky-dashboard.png'
import appleVisionSky from './assets/sky/apple-vision-sky.png'
import celestialUniverse from './assets/sky/celestial-universe.png'
import skyGarden from './assets/sky/sky-garden.png'
import ultimateSky from './assets/sky/ultimate-premium-sky.png'
import forestTheme from './assets/sky/forest.png'
import oceanTheme from './assets/sky/ocean.png'
import mountainTheme from './assets/sky/mountain.png'
import sakuraTheme from './assets/sky/sakura.png'
import desertTheme from './assets/sky/desert.png'
import spaceTheme from './assets/sky/space.png'
import cyberpunkTheme from './assets/sky/cyberpunk.png'
import blackGoldTheme from './assets/sky/black-gold.png'
import zenTheme from './assets/sky/japanese-zen.png'
import tropicalTheme from './assets/sky/tropical.png'
import nordicTheme from './assets/sky/nordic.png'
import aiOriginalTheme from './assets/sky/ai-original.png'

const SKY_THEMES = [
  ['cloud', 'Floating Cloud', cloudParadise], ['sky-island', 'Sky Island', skyIsland], ['glass-sky', 'Glass Sky', glassSky],
  ['aurora-night', 'Aurora Night', auroraNight], ['heaven', 'Heaven Luxury', heavenLuxury], ['dream-ribbon', 'Dream Ribbon', dreamRibbon],
  ['bento-sky', 'Bento Sky', bentoSky], ['apple-vision', 'Apple Vision', appleVisionSky], ['celestial', 'Celestial Universe', celestialUniverse],
  ['sky-garden', 'Sky Garden', skyGarden], ['ultimate-sky', 'Ultimate Premium', ultimateSky],
  ['forest', 'Forest', forestTheme], ['ocean-theme', 'Ocean', oceanTheme], ['mountain', 'Mountain', mountainTheme],
  ['sakura', 'Sakura', sakuraTheme], ['desert', 'Desert', desertTheme], ['space', 'Space', spaceTheme],
  ['cyberpunk', 'Cyberpunk', cyberpunkTheme], ['black-gold', 'Black & Gold', blackGoldTheme], ['japanese-zen', 'Japanese Zen', zenTheme],
  ['tropical', 'Tropical Island', tropicalTheme], ['nordic', 'Nordic Minimal', nordicTheme], ['ai-original', 'AI Original', aiOriginalTheme]
]
const ADVANCED_LAYOUTS = [
  ['floating-orb', 'Floating Orb'], ['bento-magazine', 'Bento Magazine'], ['floating-timeline', 'Floating Timeline'],
  ['card-stack', 'Card Stack'], ['infinite-gallery', 'Infinite Gallery'], ['island-navigation', 'Island Navigation'],
  ['curved-wave', 'Curved Wave'], ['story-chapter', 'Story Chapter'], ['hotel-lobby', 'Luxury Hotel'],
  ['museum-exhibition', 'Museum Exhibition'], ['apple-spatial', 'Apple Spatial'], ['creative-flow', 'AI Creative'],
  ['symmetric-square', 'Symmetric Square'], ['mosaic-dashboard', 'Mosaic Dashboard'], ['modular-cube', 'Modular Cube'],
  ['chessboard', 'Chessboard'], ['floating-tile', 'Floating Tile'], ['apple-widget', 'Apple Widget'],
  ['portfolio-blocks', 'Portfolio Blocks'], ['swiss-grid', 'Swiss Grid'],
  ['neo-dashboard', 'Neo Dashboard']
]
const seedLinks = [
  { id: 1, type: 'link', title: 'Theo dõi mình trên Facebook', url: 'https://facebook.com/hoaimy', icon: 'f', color: '#1877f2' },
  { id: 2, type: 'link', title: 'Nhắn tin với mình qua Zalo', url: 'https://zalo.me/hoaimy', icon: 'z', color: '#087cf0' },
  { id: 3, type: 'video', title: 'Một ngày của mình ✨', url: 'https://youtube.com/watch?v=demo', icon: '▶', color: '#f04491' },
  { id: 4, type: 'product', title: 'Khoá học Content Creator', url: '499.000đ', icon: '✦', color: '#ff9845' },
]
const defaultProfile = { name: '', handle: '', bio: '', avatar: '', email: '' }
seedLinks.length = 0
const repairText = (value) => { if (typeof value !== 'string' || !/[ÃÂâ]/.test(value)) return value; try { return decodeURIComponent(escape(value)) } catch { return value } }
const repairData = (value) => Array.isArray(value) ? value.map(repairData) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, repairData(item)])) : repairText(value)
const getStored = (key, fallback) => { try { return repairData(JSON.parse(localStorage.getItem(key))) || repairData(fallback) } catch { return repairData(fallback) } }
const isSafeHttpUrl = (value) => { try { const url = new URL(value); return url.protocol === 'http:' || url.protocol === 'https:' } catch { return false } }
const FONT_STACKS = { sans: "'DM Sans', sans-serif", grotesk: "'Space Grotesk', sans-serif", serif: "Georgia, 'Times New Roman', serif", rounded: "'Trebuchet MS', sans-serif", mono: "'Courier New', monospace", elegant: "'Baskerville', Georgia, serif", display: "Impact, 'Arial Black', sans-serif", hand: "'Segoe Print', 'Comic Sans MS', cursive", condensed: "'Arial Narrow', Arial, sans-serif", pixel: "'Courier New', monospace", apple: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", editorial: "Georgia, 'Times New Roman', serif", material: "'Arial', sans-serif", linear: "'Inter', 'DM Sans', sans-serif", notion: "'Segoe UI', sans-serif", luxury: "'Baskerville', Georgia, serif", friendly: "'Trebuchet MS', sans-serif", zen: "'Yu Gothic', 'Hiragino Kaku Gothic ProN', sans-serif", startup: "'Space Grotesk', 'DM Sans', sans-serif", ultimate: "'Inter', 'Segoe UI', sans-serif" }

function App() {
  const [profile, setProfile] = useState(() => getStored('biogen-profile', { name: '', handle: '', bio: 'Chào bạn! Đây là trang Bio của mình.\nKết nối và khám phá những điều thú vị nhé ✨', avatar: '', email: '' }))
  const [links, setLinks] = useState(() => getStored('biogen-links', []))
  const [theme, setTheme] = useState(() => localStorage.getItem('biogen-theme') || 'aurora')
  const [layout, setLayout] = useState(() => localStorage.getItem('biogen-layout') || 'classic')
  const [backgroundImage, setBackgroundImage] = useState(() => localStorage.getItem('biogen-background') || '')
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('biogen-font') || 'sans')
  const [textColor, setTextColor] = useState(() => localStorage.getItem('biogen-text-color') || '#ffffff')
  const [activeTab, setActiveTab] = useState('editor')
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [customizeOpen, setCustomizeOpen] = useState(true)
  const [showQr, setShowQr] = useState(false)
  const [linkEditor, setLinkEditor] = useState(null)
  const [published, setPublished] = useState(() => localStorage.getItem('biogen-published') === 'true')
  const [draggedId, setDraggedId] = useState(null)
  const [stats, setStats] = useState(() => getStored('biogen-stats', { views: 12482, clicks: 3106, byLink: {} }))
  const [copied, setCopied] = useState(false)
  const [session, setSession] = useState(null)
  const pathHandle = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase()
  const hashHandle = window.location.hash.match(/^#\/([^/?#]+)/)?.[1]?.toLowerCase()
  const requestedHandle = pathHandle || hashHandle
  const isPublicPage = Boolean(requestedHandle)
  const [authLoading, setAuthLoading] = useState(Boolean(supabase && !isPublicPage))
  const [remoteLoaded, setRemoteLoaded] = useState(false)
  const [needsOnboarding, setNeedsOnboarding] = useState(false)
  const publicUrl = `${window.location.origin}/#/${profile.handle}`

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthLoading(false) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => { setRemoteLoaded(false); setNeedsOnboarding(false); setSession(nextSession) })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => localStorage.setItem('biogen-profile', JSON.stringify(profile)), [profile])
  useEffect(() => localStorage.setItem('biogen-links', JSON.stringify(links)), [links])
  useEffect(() => localStorage.setItem('biogen-theme', theme), [theme])
  useEffect(() => localStorage.setItem('biogen-layout', layout), [layout])
  useEffect(() => localStorage.setItem('biogen-background', backgroundImage), [backgroundImage])
  useEffect(() => localStorage.setItem('biogen-font', fontFamily), [fontFamily])
  useEffect(() => localStorage.setItem('biogen-text-color', textColor), [textColor])
  useEffect(() => { document.documentElement.style.setProperty('--bio-text-color', textColor); return () => document.documentElement.style.removeProperty('--bio-text-color') }, [textColor])
  useEffect(() => { document.querySelector('.app-shell')?.style.setProperty('--bio-font-family', FONT_STACKS[fontFamily] || FONT_STACKS.sans) }, [fontFamily])
  useEffect(() => { const shell = document.querySelector('.app-shell'); if (shell) shell.style.setProperty('--selected-sky', backgroundImage ? (backgroundImage.includes('gradient') ? backgroundImage : `url(${backgroundImage})`) : 'none') }, [backgroundImage])
  useEffect(() => { const trigger = document.querySelector('.profile-mini'); const menu = document.querySelector('.account-tools'); if (!trigger || !menu) return undefined; trigger.classList.add('profile-menu-trigger'); const toggle = (event) => { if (event.target.closest('input,button')) return; const open = menu.style.display !== 'flex'; menu.style.setProperty('display', open ? 'flex' : 'none', 'important'); setProfileMenuOpen(open) }; trigger.addEventListener('click', toggle); return () => trigger.removeEventListener('click', toggle) }, [profile.name, profile.handle, remoteLoaded])
  useEffect(() => { document.body.classList.toggle('profile-menu-open', profileMenuOpen); return () => document.body.classList.remove('profile-menu-open') }, [profileMenuOpen])
  useEffect(() => localStorage.setItem('biogen-published', published), [published])
  useEffect(() => localStorage.setItem('biogen-stats', JSON.stringify(stats)), [stats])
  useEffect(() => { if (!sessionStorage.getItem('biogen-view-recorded')) { sessionStorage.setItem('biogen-view-recorded', 'true'); setStats((old) => ({ ...old, views: old.views + 1 })) } }, [])
  useEffect(() => {
    return
    setProfile((old) => old)
    setLinks((old) => old.map((item) => item.id === 1 ? { ...item, title: 'Facebook', url: 'https://www.facebook.com/kiw.hh/', icon: 'f', color: '#1877f2' } : item.id === 2 ? { ...item, title: 'TikTok', url: 'https://www.tiktok.com/@kiw.hh', icon: '♪', color: '#111111' } : item.id === 3 ? { ...item, type: 'link', title: 'Instagram', url: 'https://www.instagram.com/kiw.h_/', icon: '◎', color: '#e1306c' } : item.id === 4 ? { ...item, type: 'link', title: 'YouTube', url: 'https://www.youtube.com/@kimhuyennguyenthi9425/posts', icon: '▶', color: '#ff0000' } : item))
  }, [isPublicPage])

  useEffect(() => {
    if (!supabase) { setRemoteLoaded(true); return undefined }
    if (!isPublicPage && (authLoading || !session)) return undefined
    const handle = isPublicPage ? requestedHandle : profile.handle
    let cancelled = false
    const pageQuery = supabase.from('bio_pages').select('user_id, profile, links, theme, published, stats')
    // Authenticated workspaces must load by owner, not by the temporary local handle.
    // This prevents a returning user from being sent back to onboarding when their
    // saved handle differs from the local default (for example after a rename).
    const request = isPublicPage
      ? pageQuery.eq('handle', handle).maybeSingle()
      : pageQuery.eq('user_id', session.user.id).limit(1).maybeSingle()
    request
      .then(({ data, error }) => {
        if (error) {
          console.error('Could not load bio page', error)
          // A schema/network error must never be treated as a new user.
          // Keep the local workspace open instead of showing onboarding again.
          if (!cancelled && !isPublicPage) { setProfile({ name: '', handle: '', bio: 'Chào bạn! Đây là trang Bio của mình.\nKết nối và khám phá những điều thú vị nhé ✨', avatar: '', email: session.user.email || '' }); setLinks([]); setNeedsOnboarding(false) }
        } else if (!cancelled && data) {
          const savedProfile = repairData(data.profile) || {}
          const savedDesign = savedProfile.__design || {}
          const { __design, ...cleanProfile } = savedProfile
          setProfile({ ...cleanProfile, email: session?.user?.email || cleanProfile.email || '' })
          setLinks(repairData(data.links || []).map((item) => item.id === 1 ? { ...item, title: 'Facebook', url: 'https://www.facebook.com/kiw.hh/', icon: 'f', color: '#1877f2' } : item.id === 2 ? { ...item, title: 'TikTok', url: 'https://www.tiktok.com/@kiw.hh', icon: '♪', color: '#111111' } : item.id === 3 ? { ...item, type: 'link', title: 'Instagram', url: 'https://www.instagram.com/kiw.h_/', icon: '◎', color: '#e1306c' } : item.id === 4 ? { ...item, type: 'link', title: 'YouTube', url: 'https://www.youtube.com/@kimhuyennguyenthi9425/posts', icon: '▶', color: '#ff0000' } : item))
          setTheme(data.theme || 'aurora')
          setLayout(data.layout || savedDesign.layout || 'classic')
          setBackgroundImage(data.background_image || savedDesign.background_image || '')
          setFontFamily(data.font_family || savedDesign.font_family || 'sans')
          setTextColor(data.text_color || savedDesign.text_color || '#ffffff')
          setPublished(Boolean(data.published))
          setStats(data.stats || { views: 0, clicks: 0, byLink: {} })
          setNeedsOnboarding(false)
        } else if (!cancelled && !isPublicPage) {
          setProfile({ name: '', handle: '', bio: 'Chào bạn! Đây là trang Bio của mình.\nKết nối và khám phá những điều thú vị nhé ✨', avatar: '', email: session.user.email || '' })
          setLinks([])
          setNeedsOnboarding(true)
        }
        if (!cancelled) setRemoteLoaded(true)
      })
    return () => { cancelled = true }
  }, [authLoading, isPublicPage, requestedHandle, session?.user?.id])

  useEffect(() => {
    if (!supabase || isPublicPage || !session || !remoteLoaded || profile.handle) return
    try {
      const cached = JSON.parse(localStorage.getItem(`biogen-page-${session.user.id}`) || 'null')
      if (!cached?.profile?.handle) return
      const { __design, ...cachedProfile } = cached.profile
      setProfile({ ...cachedProfile, email: session.user.email || cachedProfile.email || '' })
      setLinks(cached.links || [])
      setTheme(cached.theme || 'aurora')
      setLayout(cached.layout || __design?.layout || 'classic')
      setBackgroundImage(cached.background_image || __design?.background_image || '')
      setFontFamily(cached.font_family || __design?.font_family || 'sans')
      setTextColor(cached.text_color || __design?.text_color || '#ffffff')
      setPublished(Boolean(cached.published))
      setNeedsOnboarding(false)
    } catch { /* ignore invalid local draft */ }
  }, [isPublicPage, profile.handle, remoteLoaded, session?.user?.id])

  useEffect(() => {
    if (!supabase || isPublicPage || !session || needsOnboarding || !remoteLoaded || !profile.handle) return
    const storedProfile = { ...profile, __design: { layout, background_image: backgroundImage, font_family: fontFamily, text_color: textColor } }
    const page = { handle: profile.handle, user_id: session.user.id, profile: storedProfile, links, theme, layout, background_image: backgroundImage, font_family: fontFamily, text_color: textColor, published, updated_at: new Date().toISOString() }
    localStorage.setItem(`biogen-page-${session.user.id}`, JSON.stringify(page))
    supabase.from('bio_pages').upsert(page, { onConflict: 'handle' }).select('handle')
      .then(async ({ error }) => {
        if (!error) return
        const legacyPage = { handle: page.handle, user_id: page.user_id, profile: page.profile, links: page.links, theme: page.theme, published: page.published, stats: stats, updated_at: page.updated_at }
        const fallback = await supabase.from('bio_pages').upsert(legacyPage, { onConflict: 'handle' })
        if (fallback.error) console.error('Could not save bio page:', fallback.error.message)
      })
  }, [profile, links, theme, layout, backgroundImage, fontFamily, textColor, published, remoteLoaded, session, isPublicPage, needsOnboarding])

  useEffect(() => {
    if (!supabase || isPublicPage || activeTab !== 'analytics' || !session) return
    let cancelled = false
    if (!profile.handle) return undefined
    supabase.from('bio_pages').select('stats').eq('handle', profile.handle).maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('Could not refresh analytics', error)
        if (!cancelled && data?.stats) setStats(data.stats)
      })
    return () => { cancelled = true }
  }, [activeTab, isPublicPage, profile.handle, session?.user?.id])

  const recordClick = (link) => {
    if (!isPublicPage) return
    setStats((old) => ({ ...old, clicks: old.clicks + 1, byLink: { ...old.byLink, [link.id]: (old.byLink[link.id] || 0) + 1 } }))
    if (supabase && requestedHandle) {
      supabase.rpc('increment_bio_link_click', { page_handle: requestedHandle, link_id: String(link.id) })
        .then(({ error }) => { if (error) console.error('Could not record link click', error) })
    }
  }
  if (isPublicPage) return <PublicPage profile={profile} links={links} theme={theme} layout={layout} backgroundImage={backgroundImage} fontFamily={fontFamily} textColor={textColor} onClick={recordClick} />
  if (supabase && (authLoading || !session)) return <AuthScreen supabase={supabase} />
  if (supabase && session && !remoteLoaded) return <div className="auth-page"><div className="auth-card"><div className="brand-mark">✦</div><h1>Đang tải tài khoản</h1><p>Đang tải đúng Bio page của user này…</p></div></div>
  if (supabase && needsOnboarding) return <Onboarding profile={profile} supabase={supabase} userId={session.user.id} onComplete={(nextProfile) => { setProfile(nextProfile); setLinks(seedLinks.map((item) => item.id === 1 ? { ...item, title: 'Facebook', url: 'https://www.facebook.com/kiw.hh/', icon: 'f', color: '#1877f2' } : item.id === 2 ? { ...item, title: 'TikTok', url: 'https://www.tiktok.com/@kiw.hh', icon: '♪', color: '#111111' } : item.id === 3 ? { ...item, type: 'link', title: 'Instagram', url: 'https://www.instagram.com/kiw.h_/', icon: '◎', color: '#e1306c' } : item.id === 4 ? { ...item, type: 'link', title: 'YouTube', url: 'https://www.youtube.com/@kimhuyennguyenthi9425/posts', icon: '▶', color: '#ff0000' } : item)); setPublished(false); setNeedsOnboarding(false); setRemoteLoaded(true) }} />

  const updateProfile = (key, value) => setProfile((old) => ({ ...old, [key]: value }))
  const saveLink = (draft) => {
    if (!draft.title.trim() || !draft.url.trim()) return
    const normalized = { ...draft, title: draft.title.trim(), url: draft.url.trim(), category: draft.category || (draft.type === 'product' ? 'shop' : 'other'), price: draft.price?.trim() || '' }
    setLinks((old) => draft.id ? old.map((item) => item.id === draft.id ? normalized : item) : [...old, { ...normalized, id: Date.now() }])
    setLinkEditor(null)
  }
  const removeLink = (id) => setLinks((old) => old.filter((item) => item.id !== id))
  const reorder = (targetId) => {
    if (!draggedId || draggedId === targetId) return
    setLinks((old) => { const next = [...old]; const from = next.findIndex((x) => x.id === draggedId); const to = next.findIndex((x) => x.id === targetId); const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next })
    setDraggedId(null)
  }
  const uploadAvatar = async (event) => { const file = event.target.files?.[0]; if (!file) return; if (supabase && session) { const path = `${session.user.id}/avatar-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`; const { error } = await supabase.storage.from('bio-media').upload(path, file, { upsert: true, contentType: file.type }); if (!error) { const { data } = supabase.storage.from('bio-media').getPublicUrl(path); updateProfile('avatar', data.publicUrl); return } console.error('Avatar upload failed', error) } const reader = new FileReader(); reader.onload = () => updateProfile('avatar', reader.result); reader.readAsDataURL(file) }
  const publish = async () => {
    setPublished(true)
    try {
      await navigator.clipboard.writeText(publicUrl)
    } catch {
      const input = document.createElement('textarea')
      input.value = publicUrl
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return <div className={backgroundImage ? 'app-shell has-custom-background' : 'app-shell'} style={{ '--selected-sky': backgroundImage ? `url(${backgroundImage})` : 'none', '--bio-font-family': fontFamily === 'serif' ? "Georgia, 'Times New Roman', serif" : fontFamily === 'mono' ? "'Courier New', monospace" : fontFamily === 'rounded' ? "'Trebuchet MS', sans-serif" : fontFamily === 'grotesk' ? "'Space Grotesk', sans-serif" : "'DM Sans', sans-serif" }}><button className="customize-toggle" onClick={() => setCustomizeOpen((open) => !open)}>{customizeOpen ? '− Hide Customize' : '+ Customize'}</button><div className={customizeOpen ? 'design-tools-panel' : 'design-tools-panel collapsed'}><div className="design-tools-title">Customize page <small>Design</small></div><FontPicker value={fontFamily} onChange={setFontFamily}/><TextColorPicker value={textColor} onChange={setTextColor}/><div className="background-section"><ColorBackgroundPicker theme={theme} onThemeChange={setTheme} onChange={setBackgroundImage}/></div><PrimaryLayoutPicker value={layout} onChange={setLayout}/><div className="sky-library-section"><BackgroundTools value={backgroundImage} onChange={setBackgroundImage} supabase={supabase} session={session}/><SkyThemeLibrary value={backgroundImage} onChange={setBackgroundImage}/></div><AdvancedLayoutLibrary value={layout} onChange={setLayout}/></div>
    <ProductTools supabase={supabase} session={session} onSave={(product) => setLinks((old) => [...old, product])}/><AccountTools email={session?.user?.email} onLogout={() => supabase?.auth.signOut()}/>{supabase && <SecurityTools email={session?.user?.email}/>} 
    <aside className="sidebar"><div className="brand"><div className="brand-mark">✦</div><span>biogen</span></div><div className="workspace-label">WORKSPACE</div><div className="profile-mini"><Avatar profile={profile} small/><div><strong>{profile.name}</strong><small>@{profile.handle}</small></div><MoreHorizontal size={17}/></div><nav className="main-nav"><button className={activeTab === 'editor' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('editor')}><Link2 size={18}/> Bio page</button><button className={activeTab === 'analytics' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('analytics')}><BarChart3 size={18}/> Analytics <span className="new-pill">LIVE</span></button><button className="nav-item" onClick={() => setShowQr(true)}><QrCode size={18}/> QR code</button></nav><div className="nav-bottom"><button className="nav-item"><Settings size={18}/> Settings</button><div className="plan-card"><div className="plan-icon"><Sparkles size={15}/></div><div><strong>Creator plan</strong><small>7 days left in trial</small></div><ExternalLink size={14}/></div><div className="user-row"><Avatar profile={profile} small/><div><strong>{profile.name}</strong><small>my@email.com</small></div><MoreHorizontal size={17}/></div></div></aside>
    <main className="main-content"><header className="topbar"><button className="menu-btn"><Menu size={20}/></button><div><div className="eyebrow">BIO PAGE / {activeTab === 'analytics' ? 'ANALYTICS' : 'EDITOR'}</div><h1>Your story, one link.</h1></div><div className="top-actions"><div className={published ? 'status published' : 'status'}><span></span>{published ? 'Published' : 'Draft'}</div><button className="icon-button" onClick={() => setShowQr(true)} title="QR code"><QrCode size={18}/></button><button className="share-button" onClick={publish}><Share2 size={16}/> {copied ? 'Copied ✓' : 'Copy link'}</button><button className="publish-button" onClick={publish}>{published ? 'Published ✓' : 'Publish'}</button></div></header>
      {activeTab === 'analytics' ? <AnalyticsDashboard links={links} stats={stats} supabase={supabase} handle={profile.handle}/> : <div className="editor-grid"><section className="editor-column"><div className="section-heading"><div><h2>Content</h2><p>Build your page with blocks that feel like you.</p></div><button className="add-block" onClick={() => setLinkEditor({ type: 'link', title: '', url: '', icon: '↗', color: '#6b5cff' })}><Plus size={16}/> Add block</button></div><div className="content-card"><div className="profile-editor"><label className="avatar-upload"><Avatar profile={profile}/><span className="upload-dot"><Upload size={11}/></span><input type="file" accept="image/*" onChange={uploadAvatar}/></label><div className="profile-fields"><label>DISPLAY NAME<input value={profile.name} onChange={(e) => updateProfile('name', e.target.value)}/></label><label>BIO<textarea value={profile.bio} onChange={(e) => updateProfile('bio', e.target.value)}/></label><label className="handle-field">PAGE URL<div className="url-input"><span>biogen.vn/</span><input value={profile.handle} onChange={(e) => updateProfile('handle', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}/></div></label></div></div><div className="divider"/><div className="block-list">{links.map((link) => <Block key={link.id} link={link} clicks={stats.byLink[link.id] || 0} onRemove={removeLink} onEdit={setLinkEditor} onDragStart={setDraggedId} onDrop={reorder}/>)}</div><button className="add-link-row" onClick={() => setLinkEditor({ type: 'link', title: '', url: '', icon: '↗', color: '#6b5cff' })}><Plus size={16}/> Add a link block</button></div><div className="tip"><Sparkles size={17}/><span><strong>Make it yours.</strong> Upload an avatar, reorder blocks and switch themes. Changes save automatically.</span></div></section><section className="preview-column"><div className="preview-head"><div><h2>Live preview</h2><p>biogen.vn/{profile.handle}</p></div><button className="preview-share" onClick={publish}><ExternalLink size={15}/></button></div><PhonePreview profile={profile} links={links} theme={theme} layout={layout} onClick={recordClick}/><div className="theme-controls"><div className="control-label"><Palette size={15}/> Colors <span>Pick a palette</span></div><div className="theme-row">{[['aurora','Aurora'],['sunset','Sunset'],['midnight','Midnight'],['ocean','Ocean'],['forest','Forest'],['candy','Candy'],['mono','Mono']].map(([key, label]) => <button key={key} className={theme === key ? 'theme-swatch selected' : 'theme-swatch'} onClick={() => setTheme(key)}><span className={'swatch '+key}></span>{label}</button>)}</div><div className="control-label layout-label">Layout <span>Social styles</span></div><div className="theme-row">{[['classic','Classic'],['card','Card'],['minimal','Minimal'],['grid','Grid'],['spotlight','Spotlight'],['glass','Glass'],['magazine','Magazine'],['neon','Neon'],['social','TikTok'],['instagram','Instagram']].map(([key, label]) => <button key={key} className={layout === key ? 'theme-swatch selected' : 'theme-swatch'} onClick={() => setLayout(key)}>{label}</button>)}</div></div></section></div>}
    </main>{showQr && <QrModal close={() => setShowQr(false)} url={publicUrl}/>} {linkEditor && <LinkModal initial={linkEditor} close={() => setLinkEditor(null)} save={saveLink}/>}</div>
}

function Avatar({ profile, small }) { return profile.avatar ? <img className={small ? 'avatar tiny' : 'avatar large'} src={profile.avatar} alt="Avatar" style={{ objectPosition: `${profile.avatarX ?? 50}% ${profile.avatarY ?? 50}%`, transform: `scale(${profile.avatarZoom ?? 1})` }}/> : <div className={small ? 'avatar tiny' : 'avatar large'}>{profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div> }
function BackgroundTools({ value, onChange, supabase, session }) { const inputRef = useRef(null); const [busy, setBusy] = useState(false); const choose = async (event) => { const file = event.target.files?.[0]; if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return; setBusy(true); if (supabase && session) { const path = `${session.user.id}/background-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`; const upload = await supabase.storage.from('bio-media').upload(path, file, { upsert: true, contentType: file.type }); if (!upload.error) onChange(supabase.storage.from('bio-media').getPublicUrl(path).data.publicUrl) } else { const reader = new FileReader(); reader.onload = () => onChange(reader.result); reader.readAsDataURL(file) } setBusy(false) }; return <div className="background-tools"><span>Background</span><button onClick={() => onChange('')} className={!value ? 'selected' : ''}>Default</button><button onClick={() => onChange('radial-gradient(circle at 20% 20%,#fff 0 1px,transparent 2px),radial-gradient(circle at 70% 35%,#fff 0 1px,transparent 2px),linear-gradient(160deg,#050816,#18204d)')}>Night sky</button><button onClick={() => onChange('linear-gradient(160deg,#12372a,#3f8f62 55%,#b6d98c)')}>Nature</button><button onClick={() => inputRef.current?.click()} disabled={busy}>{busy ? 'Uploading…' : 'Upload image'}</button><input ref={inputRef} type="file" accept="image/*" onChange={choose}/></div> }
function UploadBackground({ onChange }) { const inputRef = useRef(null); const [busy, setBusy] = useState(false); const choose = (event) => { const file = event.target.files?.[0]; if (!file || !file.type.startsWith('image/') || file.size > 5 * 1024 * 1024) return; setBusy(true); const reader = new FileReader(); reader.onload = () => { onChange(reader.result); setBusy(false) }; reader.onerror = () => setBusy(false); reader.readAsDataURL(file) }; return <><button className="local-background-upload" onClick={() => inputRef.current?.click()} disabled={busy}>{busy ? 'Loading image…' : 'Upload image'}</button><input ref={inputRef} className="hidden-background-input" type="file" accept="image/*" onChange={choose}/></> }
function SkyThemeLibrary({ value, onChange }) { return <div className="sky-theme-library"><strong>Sky theme library</strong><small>23 generated premium backgrounds · independent from layout</small><UploadBackground onChange={onChange}/><div className="sky-theme-grid">{SKY_THEMES.map(([key, label, image]) => <button key={key} className={value === image ? 'sky-theme selected' : 'sky-theme'} onClick={() => onChange(image)}><img src={image} alt="" loading="lazy" decoding="async"/><span>{label}</span></button>)}</div></div> }
function AdvancedLayoutLibrary({ value, onChange }) { return <div className="advanced-layout-library"><strong>Advanced layout library</strong><small>21 immersive layouts</small><div className="advanced-layout-grid">{ADVANCED_LAYOUTS.map(([key, label]) => <button key={key} className={value === key ? 'selected' : ''} onClick={() => onChange(key)}><span className={'layout-preview '+key}/>{label}</button>)}</div></div> }
function TextColorPicker({ value, onChange }) { const colors = [['#ffffff','White'],['#111827','Black'],['#6b7280','Gray'],['#ef4444','Red'],['#f97316','Orange'],['#eab308','Yellow'],['#22c55e','Green'],['#3b82f6','Blue'],['#8b5cf6','Purple'],['#ec4899','Pink']]; return <div className="text-color-picker"><strong>Text color</strong><div className="text-color-presets">{colors.map(([color, label]) => <button key={color} className={value === color ? 'color-dot selected' : 'color-dot'} style={{ backgroundColor: color }} onClick={() => onChange(color)} title={label}/>)}</div><input type="color" value={value || '#ffffff'} onChange={(event) => onChange(event.target.value)} title="Custom text color"/></div> }
function ColorBackgroundPicker({ theme, onThemeChange, onChange }) { const colors = [['aurora','Aurora','linear-gradient(160deg,#785be8,#d34891 58%,#ff9d79)'],['sunset','Sunset','linear-gradient(160deg,#ff7652,#fcba55 65%,#ffe19a)'],['midnight','Midnight','linear-gradient(160deg,#17152e,#2f2870 70%,#67489e)'],['ocean','Ocean','linear-gradient(160deg,#087e8b,#2f80ed 70%,#56ccf2)'],['forest','Forest','linear-gradient(160deg,#134e4a,#16a085 65%,#b8e994)'],['candy','Candy','linear-gradient(160deg,#ff4f81,#a855f7 65%,#f9a8d4)']]; return <div className="color-background-picker"><strong>Color backgrounds</strong><div>{colors.map(([key, label, gradient]) => <button key={key} className={theme === key ? 'selected' : ''} onClick={() => { onThemeChange(key); onChange(gradient) }}><span style={{ background: gradient }}/>{label}</button>)}</div></div> }
function PrimaryLayoutPicker({ value, onChange }) { const layouts = [['classic','Classic'],['card','Card'],['minimal','Minimal'],['grid','Grid'],['spotlight','Spotlight'],['glass','Glass'],['magazine','Magazine'],['neon','Neon']]; return <div className="primary-layout-picker"><strong>Layout</strong><small>Social styles</small><div>{layouts.map(([key, label]) => <button key={key} className={value === key ? 'selected' : ''} onClick={() => onChange(key)}>{label}</button>)}</div></div> }
function FontPicker({ value, onChange }) { const fonts = [['apple','Apple Minimal'],['editorial','Editorial'],['material','Material'],['linear','Linear'],['notion','Notion'],['luxury','Luxury Serif'],['friendly','Rounded'],['zen','Japanese Zen'],['startup','Startup'],['ultimate','Ultimate']]; return <div className="font-picker"><span>Typography</span>{fonts.map(([key, label]) => <button key={key} className={value === key ? 'selected '+key : key} onClick={() => onChange(key)}>{label}</button>)}</div> }
function ShopTools({ onAdd }) { return <div className="shop-tools"><span>Quick add</span><button onClick={onAdd}>＋ Shop link</button></div> }
function ProductTools({ supabase, session, onSave }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [navHost, setNavHost] = useState(null)
  useEffect(() => { const openProduct = () => setOpen(true); window.addEventListener('biogen-open-product', openProduct); return () => window.removeEventListener('biogen-open-product', openProduct) }, [])
  useEffect(() => { setNavHost(document.querySelector('.main-nav')) }, [])
  const chooseImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) return setError('Vui lòng chọn file ảnh.')
    if (file.size > 5 * 1024 * 1024) return setError('Ảnh phải nhỏ hơn 5MB.')
    setError('')
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result)
    reader.readAsDataURL(file)
  }
  const save = async (event) => {
    event.preventDefault()
    if (!title.trim() || !url.trim()) return
    setBusy(true)
    setError('')
    const file = event.currentTarget.image.files?.[0]
    let imageUrl = ''
    if (file && supabase && session) {
      const path = `${session.user.id}/product-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`
      const upload = await supabase.storage.from('bio-media').upload(path, file, { upsert: true, contentType: file.type })
      if (upload.error) { setError(upload.error.message); setBusy(false); return }
      imageUrl = supabase.storage.from('bio-media').getPublicUrl(path).data.publicUrl
    } else {
      imageUrl = image
    }
    onSave({ id: Date.now(), type: 'product', category: 'shop', title: title.trim(), url: url.trim(), price: price.trim(), image: imageUrl, icon: '🛍', color: '#ff6b35' })
    setTitle(''); setPrice(''); setUrl(''); setImage(''); setError(''); setBusy(false); setOpen(false)
  }
  return <>{navHost && createPortal(<button className="nav-item" onClick={() => { setError(''); setOpen(true) }}><Plus size={18}/> Product</button>, navHost)}{open && <div className="modal-backdrop" onClick={() => setOpen(false)}><form className="link-modal product-modal" onSubmit={save} onClick={(event) => event.stopPropagation()}><button type="button" className="close-modal" onClick={() => setOpen(false)}>×</button><h2>Thêm sản phẩm</h2><p>Gắn ảnh, giá và link mua hàng.</p><label>ẢNH SẢN PHẨM<input name="image" type="file" accept="image/*" onChange={chooseImage}/></label>{image && <img className="product-image-preview" src={image} alt="Preview"/>}{error && <small className="auth-error">{error}</small>}<label>TÊN SẢN PHẨM<input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Tên sản phẩm"/></label><label>GIÁ<input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="499.000đ"/></label><label>LINK MUA HÀNG<input value={url} onChange={(event) => setUrl(event.target.value)} required placeholder="https://shopee.vn/..."/></label><div className="modal-buttons"><button type="button" onClick={() => setOpen(false)}>Hủy</button><button className="primary-modal" disabled={busy}>{busy ? 'Đang lưu…' : 'Thêm sản phẩm'}</button></div></form></div>}</>
}

function ProductToolsLegacy({ supabase, session, onSave }) {
  const [open, setOpen] = useState(false); const [title, setTitle] = useState(''); const [price, setPrice] = useState(''); const [url, setUrl] = useState(''); const [image, setImage] = useState(''); const [busy, setBusy] = useState(false)
  const chooseImage = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setImage(reader.result); reader.readAsDataURL(file) }
  const save = async (event) => { event.preventDefault(); if (!title.trim() || !url.trim()) return; setBusy(true); let imageUrl = image; const file = event.currentTarget.image.files?.[0]; if (file && supabase && session) { const path = `${session.user.id}/product-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`; const upload = await supabase.storage.from('bio-media').upload(path, file, { upsert: true, contentType: file.type }); if (!upload.error) imageUrl = supabase.storage.from('bio-media').getPublicUrl(path).data.publicUrl } onSave({ id: Date.now(), type: 'product', category: 'shop', title: title.trim(), url: url.trim(), price: price.trim(), image: imageUrl, icon: '🛍', color: '#ff6b35' }); setTitle(''); setPrice(''); setUrl(''); setImage(''); setBusy(false); setOpen(false) }
  return <><button className="product-tools" onClick={() => setOpen(true)}>＋ Product</button>{open && <div className="modal-backdrop" onClick={() => setOpen(false)}><form className="link-modal product-modal" onSubmit={save} onClick={(event) => event.stopPropagation()}><button type="button" className="close-modal" onClick={() => setOpen(false)}>×</button><h2>Thêm sản phẩm</h2><p>Gắn ảnh, giá và link mua hàng.</p><label>ẢNH SẢN PHẨM<input name="image" type="file" accept="image/*" onChange={chooseImage}/></label>{image && <img className="product-image-preview" src={image} alt="Preview"/>}<label>TÊN SẢN PHẨM<input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Tên sản phẩm"/></label><label>GIÁ<input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="499.000đ"/></label><label>LINK MUA HÀNG<input value={url} onChange={(event) => setUrl(event.target.value)} required placeholder="https://shopee.vn/..."/></label><div className="modal-buttons"><button type="button" onClick={() => setOpen(false)}>Hủy</button><button className="primary-modal" disabled={busy}>{busy ? 'Đang lưu…' : 'Thêm sản phẩm'}</button></div></form></div>}</>
}
function SecurityTools({ email }) {
  const [open, setOpen] = useState(false)
  const [factor, setFactor] = useState(null)
  const [qrCode, setQrCode] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const loadFactors = async () => { const { data } = await supabase.auth.mfa.listFactors(); const verified = data?.totp?.find((item) => item.status === 'verified'); setFactor(verified || null) }
  const startMfa = async () => { setBusy(true); setMessage(''); const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'BioGen Authenticator' }); if (error) setMessage(error.message); else { setFactor(data); setQrCode(data.totp.qr_code) } setBusy(false) }
  const verifyMfa = async () => { if (!factor?.id || code.length < 6) return; setBusy(true); const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code }); setMessage(error ? error.message : 'Đã bật bảo mật 2 lớp thành công.'); if (!error) { setQrCode(''); setCode(''); await loadFactors() } setBusy(false) }
  const reset = async () => { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); setMessage(error ? error.message : 'Đã gửi email đặt lại mật khẩu.') }
  return <>{<button className="security-tools" onClick={() => { setOpen(true); loadFactors() }}>Account</button>}{open && <div className="modal-backdrop" onClick={() => setOpen(false)}><div className="link-modal" onClick={(event) => event.stopPropagation()}><button className="close-modal" onClick={() => setOpen(false)}>×</button><h2>Account security</h2><p>{email}</p><button className="primary-modal" onClick={reset}>Reset password</button><hr/><h3>Two-factor authentication</h3>{factor && !qrCode ? <p className="auth-message">Bảo mật 2 lớp đang bật.</p> : !qrCode ? <button className="primary-modal" onClick={startMfa} disabled={busy}>{busy ? 'Đang chuẩn bị…' : 'Bật bảo mật 2 lớp'}</button> : <><p>Quét mã QR bằng Google Authenticator hoặc Authy, sau đó nhập mã 6 số.</p><img className="mfa-qr" src={qrCode} alt="QR code for authenticator"/><input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" placeholder="Mã 6 số"/><button className="primary-modal" onClick={verifyMfa} disabled={busy || code.length !== 6}>Xác nhận 2 lớp</button></>}{message && <small className="auth-message">{message}</small>}</div></div>}</>
}
function AccountTools({ email, onLogout }) { const logout = async () => { await onLogout?.(); window.location.assign('/'); }; return <div className="account-tools"><span>{email}</span><button onClick={logout}>Đăng xuất</button></div> }
function Onboarding({ profile, supabase, userId, onComplete }) {
  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState(profile.bio || '')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    const cleanHandle = handle.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '')
    if (!name.trim() || cleanHandle.length < 3) { setError('Tên và username tối thiểu 3 ký tự là bắt buộc.'); return }
    setBusy(true); setError('')
    const { data, error: lookupError } = await supabase.from('bio_pages').select('user_id').eq('handle', cleanHandle).maybeSingle()
    if (lookupError) { setBusy(false); setError(lookupError.message); return }
    if (data?.user_id && data.user_id !== userId) { setBusy(false); setError('Username này đã được sử dụng.'); return }
    setBusy(false)
    onComplete({ ...profile, name: name.trim(), handle: cleanHandle, bio: bio.trim(), email: profile.email || '' })
  }
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand-mark">✦</div><h1>Tạo bio page của bạn</h1><p>Chọn username riêng để có link public của riêng bạn.</p><label>Tên hiển thị<input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Tên của bạn"/></label><label>Username<input value={handle} onChange={(event) => setHandle(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} required placeholder="yourname"/><small className="handle-hint">Link: /#/{handle || 'yourname'}</small></label><label>Giới thiệu<textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bạn làm gì?"/></label><button className="auth-submit" disabled={busy}>{busy ? 'Đang tạo…' : 'Tạo bio page'}</button>{error && <small className="auth-error">{error}</small>}<button type="button" className="auth-switch" onClick={() => supabase.auth.signOut()}>Đăng xuất / Đổi tài khoản</button></form></div>
}
function AuthScreen({ supabase }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState(() => localStorage.getItem('biogen-last-email') || '')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [canResend, setCanResend] = useState(false)
  const [busy, setBusy] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/` } })
    setBusy(false)
    if (result.error) setMessage(result.error.message)
    else { setCanResend(mode === 'signup' && !result.data.session); setMessage(mode === 'login' ? 'Đăng nhập thành công.' : result.data.session ? 'Đăng ký thành công.' : 'Đăng ký thành công. Hãy kiểm tra Inbox/Spam để xác nhận email rồi đăng nhập.') }
  }
  const resend = async () => { setBusy(true); const { error } = await supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo: `${window.location.origin}/` } }); setMessage(error ? error.message : 'Đã gửi lại email xác nhận. Hãy kiểm tra Inbox/Spam.'); setBusy(false) }
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand-mark">✦</div><h1>{mode === 'login' ? 'Đăng nhập BioGen' : 'Tạo tài khoản BioGen'}</h1><p>Quản lý bio page an toàn bằng tài khoản của bạn.</p><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com"/></label><label>Mật khẩu<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} placeholder="Tối thiểu 6 ký tự"/></label><button className="auth-submit" disabled={busy}>{busy ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</button>{message && <small className="auth-message">{message}</small>}{canResend && <button type="button" className="auth-switch" onClick={resend} disabled={busy}>Gửi lại email xác nhận</button>}<button type="button" className="auth-switch" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage(''); setCanResend(false) }}>{mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button></form></div>
}
function LinkVisual({ link, className }) { return <span className={`${className} ${link.type === 'product' ? 'product-visual' : ''}`} style={{ background: link.color }}>{link.image ? <img src={link.image} alt=""/> : link.type === 'video' ? <Play size={15} fill="white"/> : link.icon}</span> }
function Block({ link, clicks, onRemove, onEdit, onDragStart, onDrop }) { return <div className="block-row" draggable onDragStart={() => onDragStart(link.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(link.id)}><GripVertical className="drag" size={17}/><LinkVisual link={link} className="block-icon"/><button className="block-copy" onClick={() => onEdit(link)}><strong>{link.title}</strong><small>{link.price ? `${link.price} · ` : ''}{link.url}{clicks ? ` · ${clicks} clicks` : ''}</small></button>{link.category === 'shop' && <span className="sale-tag">SHOP</span>}<button className="more-block" onClick={() => onEdit(link)}><MoreHorizontal size={18}/></button><button className="delete-block" onClick={() => onRemove(link.id)}><Trash2 size={15}/></button></div> }
function PhonePreview({ profile, links, theme, layout, onClick }) { return <div className={'phone '+theme+' layout-'+layout}><div className="phone-notch"></div><div className="phone-content"><div className="phone-menu">•••</div><div className="phone-avatar">{profile.avatar ? <img src={profile.avatar} alt="" style={{ objectPosition: `${profile.avatarX ?? 50}% ${profile.avatarY ?? 50}%`, transform: `scale(${profile.avatarZoom ?? 1})` }}/> : profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div><h3>{profile.name}</h3><p>{profile.bio}</p><div className="socials"><span>f</span><span>◎</span><span>▶</span></div><div className="phone-links">{links.map((link) => <button className="phone-link" key={link.id} onClick={() => onClick(link)}><LinkVisual link={link} className="phone-link-icon"/><strong>{link.title}</strong>{link.price && <small className="phone-price">{link.price}</small>}<MoreHorizontal size={16}/></button>)}</div><div className="powered">✦ biogen</div></div></div> }
function PublicPage({ profile, links, theme, layout, backgroundImage, fontFamily, onClick }) { const bg = backgroundImage?.includes('gradient') ? backgroundImage : backgroundImage ? `linear-gradient(#1116,#1116), url(${backgroundImage})` : undefined; return <div className={'public-page '+theme+' layout-'+layout+' font-'+fontFamily} style={bg ? { backgroundImage: bg } : undefined}><div className="public-card"><div className="public-menu">•••</div><div className="public-avatar">{profile.avatar ? <img src={profile.avatar} alt={profile.name} style={{ objectPosition: `${profile.avatarX ?? 50}% ${profile.avatarY ?? 50}%`, transform: `scale(${profile.avatarZoom ?? 1})` }}/> : profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div><h1>{profile.name}</h1><p>{profile.bio}</p><div className="socials"><span>f</span><span>◎</span><span>▶</span></div><div className="public-links">{links.map((link) => <button className="public-link" key={link.id} onClick={() => { onClick(link); if (isSafeHttpUrl(link.url)) window.open(link.url, '_blank', 'noopener,noreferrer') }}><LinkVisual link={link} className="phone-link-icon"/><strong>{link.title}{link.price && <small className="public-price">{link.price}</small>}</strong><MoreHorizontal size={17}/></button>)}</div><div className="public-brand">✦ biogen</div></div></div> }
function AnalyticsDashboard({ links, stats, supabase, handle }) {
  const [liveStats, setLiveStats] = useState(stats)
  const [refreshing, setRefreshing] = useState(false)
  const refresh = async () => {
    if (!supabase || !handle) return
    setRefreshing(true)
    const { data, error } = await supabase.from('bio_pages').select('stats').eq('handle', handle).maybeSingle()
    if (error) console.error('Could not load analytics stats', error)
    if (data?.stats) setLiveStats(data.stats)
    setRefreshing(false)
  }
  useEffect(() => { setLiveStats(stats) }, [stats])
  useEffect(() => { refresh() }, [supabase, handle])
  const current = liveStats || { clicks: 0, byLink: {} }
  const totalClicks = Number(current.clicks || 0)
  const ranked = [...links].map((link) => ({ ...link, clickCount: Number(current.byLink?.[link.id] || 0) })).sort((a, b) => b.clickCount - a.clickCount)
  const totalByLink = ranked.reduce((sum, link) => sum + link.clickCount, 0)
  let offset = 0
  const pieParts = ranked.filter((link) => link.clickCount > 0).map((link) => {
    const start = offset
    offset += (link.clickCount / Math.max(1, totalByLink)) * 100
    return `${link.color || '#7762ee'} ${start}% ${offset}%`
  })
  const top = ranked[0]
  return <section className="analytics"><div className="section-heading"><div><h2>Analytics overview</h2><p>Live click data for {handle || 'this page'}.</p></div><button className="date-filter" onClick={refresh} disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh'}</button></div><div className="metric-grid"><Metric value={totalClicks.toLocaleString()} label="Total clicks" note="Public page only"/><Metric value={top ? top.title : '—'} label="Top link" note={top ? `${top.clickCount} clicks` : 'No clicks yet'}/></div><div className="chart-card"><div className="chart-title"><div><h3>Click distribution</h3><p>Share of clicks by link</p></div></div><div className="pie-layout"><div className="pie-chart" style={{ background: pieParts.length ? `conic-gradient(${pieParts.join(', ')})` : '#ececf2' }}><div className="pie-hole"><strong>{totalByLink.toLocaleString()}</strong><small>clicks</small></div></div><div className="pie-legend">{ranked.map((link) => <div className="pie-legend-row" key={link.id}><i style={{ background: link.color || '#7762ee' }}></i><span>{link.title}</span><strong>{link.clickCount}</strong></div>)}</div></div></div></section>
}

function Analytics({ links, stats, supabase, handle }) {
  const [liveStats, setLiveStats] = useState(stats)
  const [refreshing, setRefreshing] = useState(false)
  const refresh = async () => {
    if (!supabase || !handle) return
    setRefreshing(true)
    const { data, error } = await supabase.from('bio_pages').select('stats').eq('handle', handle).maybeSingle()
    if (error) console.error('Could not load analytics stats', error)
    if (data?.stats) setLiveStats(data.stats)
    setRefreshing(false)
  }
  useEffect(() => { setLiveStats(stats) }, [stats])
  useEffect(() => { refresh() }, [supabase, handle])
  const current = liveStats || { views: 0, clicks: 0, byLink: {} }
  const top = [...links].sort((a, b) => (current.byLink[b.id] || 0) - (current.byLink[a.id] || 0))[0]
  const ctr = current.views ? ((current.clicks / current.views) * 100).toFixed(1) : '0.0'
  return <section className="analytics"><div className="section-heading"><div><h2>Analytics overview</h2><p>Live data for {handle || 'this page'}.</p></div><button className="date-filter" onClick={refresh} disabled={refreshing}>{refreshing ? 'Refreshing…' : 'Refresh'}</button></div><div className="metric-grid"><Metric value={Number(current.views || 0).toLocaleString()} label="Page views" note="Live counter"/><Metric value={Number(current.clicks || 0).toLocaleString()} label="Total clicks" note="Live counter"/><Metric value={`${ctr}%`} label="Click-through rate" note="Clicks / views"/><Metric value={top ? top.title : '—'} label="Top link" note={top ? `${current.byLink[top.id] || 0} clicks` : 'No clicks yet'}/></div><div className="chart-card"><div className="chart-title"><div><h3>Link performance</h3><p>Click count by block</p></div></div><div className="performance-list">{links.map((link) => <div className="performance-row" key={link.id}><span className="block-icon" style={{ background: link.color }}>{link.icon}</span><strong>{link.title}</strong><span>{current.byLink[link.id] || 0} clicks</span><div className="performance-bar"><i style={{ width: `${Math.min(100, ((current.byLink[link.id] || 0) / Math.max(1, current.clicks)) * 100 * 3)}%` }}></i></div></div>)}</div></div></section>
}
function Metric({ value, label, note }) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong><small className="up">{note}</small></div> }
const ICON_OPTIONS = [['f', 'Facebook', '#1877f2'], ['♪', 'TikTok', '#111111'], ['Z', 'Zalo', '#087cf0'], ['➤', 'Telegram', '#229ed9'], ['◎', 'Instagram', '#e1306c'], ['▶', 'YouTube', '#ff0000'], ['◉', 'WhatsApp', '#25d366'], ['✉', 'Email', '#6b5cff'], ['↗', 'Website', '#ff9845'], ['S', 'Shopee', '#ee4d2d'], ['L', 'Lazada', '#0f146d'], ['T', 'Tiki', '#1a94ff'], ['Se', 'Sendo', '#ed1c24'], ['🛍', 'TikTok Shop', '#111111'], ['A', 'Amazon', '#ff9900'], ['e', 'eBay', '#0064d2'], ['E', 'Etsy', '#f1641e'], ['Ali', 'AliExpress', '#ff4747']]
function LinkModal({ initial, close, save }) {
  const [draft, setDraft] = useState(initial)
  const update = (key, value) => setDraft((old) => ({ ...old, [key]: value }))
  return <div className="modal-backdrop" onClick={close}><div className="link-modal" onClick={(e) => e.stopPropagation()}><button className="close-modal" onClick={close}><X size={18}/></button><h2>{initial.id ? 'Edit block' : 'Add a block'}</h2><p>Choose an icon and add a clear next step.</p><label>BLOCK TYPE<select value={draft.type} onChange={(e) => update('type', e.target.value)}><option value="link">Link</option><option value="video">Video</option><option value="product">Product</option></select></label><label>ICON<div className="icon-library">{ICON_OPTIONS.map(([icon, label, color]) => <button type="button" key={label} title={label} className={draft.icon === icon ? 'icon-choice selected' : 'icon-choice'} onClick={() => setDraft((old) => ({ ...old, icon, color }))}><span style={{ background: color }}>{icon}</span><small>{label}</small></button>)}</div></label><label>TITLE<input autoFocus value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Follow me on Facebook"/></label><label>{draft.type === 'product' ? 'PRICE' : 'URL'}<input value={draft.url} onChange={(e) => update('url', e.target.value)} placeholder={draft.type === 'product' ? '499.000đ' : 'https://...'}/></label><div className="modal-buttons"><button onClick={close}>Cancel</button><button className="primary-modal" onClick={() => save(draft)}>Save block</button></div></div></div>
}
function QrModal({ close, url }) { const canvasRef = useRef(null); const [svg, setSvg] = useState(''); useEffect(() => { QRCode.toCanvas(canvasRef.current, url, { width: 180, margin: 1, color: { dark: '#252333', light: '#ffffff' } }); QRCode.toString(url, { type: 'svg', margin: 1 }).then(setSvg) }, [url]); const download = (data, name, type) => { const blob = data instanceof Blob ? data : new Blob([data], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href) }; return <div className="modal-backdrop" onClick={close}><div className="qr-modal" onClick={(e) => e.stopPropagation()}><button className="close-modal" onClick={close}><X size={18}/></button><div className="modal-spark">✦</div><h2>Your QR code</h2><p>Share your BioGen page anywhere.</p><div className="qr-box"><canvas ref={canvasRef}/></div><strong className="qr-url">{url.replace('https://', '')}</strong><div className="qr-actions"><button onClick={() => canvasRef.current.toBlob((blob) => download(blob, 'biogen-qr.png'))}>Download PNG</button><button onClick={() => download(svg, 'biogen-qr.svg', 'image/svg+xml')}>Download SVG</button></div></div></div> }

class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() { return this.state.error ? <div className="auth-page"><div className="auth-card"><h1>App error</h1><p>{this.state.error.message}</p><button className="auth-submit" onClick={() => window.location.reload()}>Reload</button></div></div> : this.props.children }
}

createRoot(document.getElementById('root')).render(<ErrorBoundary><App /></ErrorBoundary>)
