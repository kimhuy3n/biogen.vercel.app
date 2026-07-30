import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import QRCode from 'qrcode'
import { BarChart3, ExternalLink, GripVertical, Link2, Menu, MoreHorizontal, Palette, Play, Plus, QrCode, Settings, Share2, Sparkles, Trash2, Upload, X } from 'lucide-react'
import { supabase } from './lib/supabase'
import './styles.css'
import './functional.css'
import './public.css'
import './typography.css'

const seedLinks = [
  { id: 1, type: 'link', title: 'Theo dõi mình trên Facebook', url: 'https://facebook.com/hoaimy', icon: 'f', color: '#1877f2' },
  { id: 2, type: 'link', title: 'Nhắn tin với mình qua Zalo', url: 'https://zalo.me/hoaimy', icon: 'z', color: '#087cf0' },
  { id: 3, type: 'video', title: 'Một ngày của mình ✨', url: 'https://youtube.com/watch?v=demo', icon: '▶', color: '#f04491' },
  { id: 4, type: 'product', title: 'Khoá học Content Creator', url: '499.000đ', icon: '✦', color: '#ff9845' },
]
const defaultProfile = { name: 'Hoài My', handle: 'hoaimy', bio: 'Content creator · Chia sẻ điều hay mỗi ngày ✨', avatar: '' }
const getStored = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback } catch { return fallback } }

function App() {
  const [profile, setProfile] = useState(() => getStored('biogen-profile', defaultProfile))
  const [links, setLinks] = useState(() => getStored('biogen-links', seedLinks))
  const [theme, setTheme] = useState(() => localStorage.getItem('biogen-theme') || 'aurora')
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('biogen-font') || 'sans')
  const [activeTab, setActiveTab] = useState('editor')
  const [showQr, setShowQr] = useState(false)
  const [linkEditor, setLinkEditor] = useState(null)
  const [published, setPublished] = useState(() => localStorage.getItem('biogen-published') === 'true')
  const [draggedId, setDraggedId] = useState(null)
  const [stats, setStats] = useState(() => getStored('biogen-stats', { views: 12482, clicks: 3106, byLink: {} }))
  const [copied, setCopied] = useState(false)
  const pathHandle = window.location.pathname.split('/').filter(Boolean)[0]?.toLowerCase()
  const hashHandle = window.location.hash.match(/^#\/([^/?#]+)/)?.[1]?.toLowerCase()
  const requestedHandle = pathHandle || hashHandle
  const isPublicPage = Boolean(requestedHandle)
  const [remoteLoaded, setRemoteLoaded] = useState(false)
  const publicUrl = `${window.location.origin}/#/${profile.handle}`

  useEffect(() => localStorage.setItem('biogen-profile', JSON.stringify(profile)), [profile])
  useEffect(() => localStorage.setItem('biogen-links', JSON.stringify(links)), [links])
  useEffect(() => localStorage.setItem('biogen-theme', theme), [theme])
  useEffect(() => localStorage.setItem('biogen-font', fontFamily), [fontFamily])
  useEffect(() => localStorage.setItem('biogen-published', published), [published])
  useEffect(() => localStorage.setItem('biogen-stats', JSON.stringify(stats)), [stats])
  useEffect(() => { if (!sessionStorage.getItem('biogen-view-recorded')) { sessionStorage.setItem('biogen-view-recorded', 'true'); setStats((old) => ({ ...old, views: old.views + 1 })) } }, [])
  useEffect(() => {
    if (isPublicPage) return
    setProfile((old) => old.handle === 'hoaimy' ? { ...old, name: 'Kim Huyen', handle: 'kimhuyen' } : old)
    setLinks((old) => old.map((item) => item.id === 1 ? { ...item, title: 'Facebook', url: 'https://www.facebook.com/kiw.hh/', icon: 'f', color: '#1877f2' } : item.id === 2 ? { ...item, title: 'TikTok', url: 'https://www.tiktok.com/@kiw.hh', icon: '♪', color: '#111111' } : item.id === 3 ? { ...item, type: 'link', title: 'Instagram', url: 'https://www.instagram.com/kiw.h_/', icon: '◎', color: '#e1306c' } : item.id === 4 ? { ...item, type: 'link', title: 'YouTube', url: 'https://www.youtube.com/@kimhuyennguyenthi9425/posts', icon: '▶', color: '#ff0000' } : item))
  }, [isPublicPage])

  useEffect(() => {
    if (!supabase) { setRemoteLoaded(true); return undefined }
    const handle = isPublicPage ? requestedHandle : profile.handle
    let cancelled = false
    supabase.from('bio_pages').select('profile, links, theme, font_family, published, stats').eq('handle', handle).maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error('Could not load bio page', error)
        if (!cancelled && data) {
          setProfile(data.profile)
          setLinks((data.links || []).map((item) => item.id === 1 ? { ...item, title: 'Facebook', url: 'https://www.facebook.com/kiw.hh/', icon: 'f', color: '#1877f2' } : item.id === 2 ? { ...item, title: 'TikTok', url: 'https://www.tiktok.com/@kiw.hh', icon: '♪', color: '#111111' } : item.id === 3 ? { ...item, type: 'link', title: 'Instagram', url: 'https://www.instagram.com/kiw.h_/', icon: '◎', color: '#e1306c' } : item.id === 4 ? { ...item, type: 'link', title: 'YouTube', url: 'https://www.youtube.com/@kimhuyennguyenthi9425/posts', icon: '▶', color: '#ff0000' } : item))
          setTheme(data.theme || 'aurora')
          setFontFamily(data.font_family || 'sans')
          setPublished(Boolean(data.published))
          setStats(data.stats || { views: 0, clicks: 0, byLink: {} })
        }
        if (!cancelled) setRemoteLoaded(true)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!supabase || !remoteLoaded || !profile.handle) return
    supabase.from('bio_pages').upsert({ handle: profile.handle, profile, links, theme, font_family: fontFamily, published, stats, updated_at: new Date().toISOString() })
      .then(({ error }) => { if (error) console.error('Could not save bio page', error) })
  }, [profile, links, theme, fontFamily, published, stats, remoteLoaded])

  if (isPublicPage) return <PublicPage profile={profile} links={links} theme={theme} fontFamily={fontFamily} onClick={(link) => setStats((old) => ({ ...old, clicks: old.clicks + 1, byLink: { ...old.byLink, [link.id]: (old.byLink[link.id] || 0) + 1 } }))} />

  const updateProfile = (key, value) => setProfile((old) => ({ ...old, [key]: value }))
  const saveLink = (draft) => {
    if (!draft.title.trim() || !draft.url.trim()) return
    const normalized = { ...draft, title: draft.title.trim(), url: draft.url.trim() }
    setLinks((old) => draft.id ? old.map((item) => item.id === draft.id ? normalized : item) : [...old, { ...normalized, id: Date.now() }])
    setLinkEditor(null)
  }
  const removeLink = (id) => setLinks((old) => old.filter((item) => item.id !== id))
  const reorder = (targetId) => {
    if (!draggedId || draggedId === targetId) return
    setLinks((old) => { const next = [...old]; const from = next.findIndex((x) => x.id === draggedId); const to = next.findIndex((x) => x.id === targetId); const [moved] = next.splice(from, 1); next.splice(to, 0, moved); return next })
    setDraggedId(null)
  }
  const uploadAvatar = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => updateProfile('avatar', reader.result); reader.readAsDataURL(file) }
  const recordClick = (link) => setStats((old) => ({ ...old, clicks: old.clicks + 1, byLink: { ...old.byLink, [link.id]: (old.byLink[link.id] || 0) + 1 } }))
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

  return <div className="app-shell"><FontPicker value={fontFamily} onChange={setFontFamily}/>
    <aside className="sidebar"><div className="brand"><div className="brand-mark">✦</div><span>biogen</span></div><div className="workspace-label">WORKSPACE</div><div className="profile-mini"><Avatar profile={profile} small/><div><strong>{profile.name}</strong><small>@{profile.handle}</small></div><MoreHorizontal size={17}/></div><nav className="main-nav"><button className={activeTab === 'editor' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('editor')}><Link2 size={18}/> Bio page</button><button className={activeTab === 'analytics' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('analytics')}><BarChart3 size={18}/> Analytics <span className="new-pill">LIVE</span></button><button className="nav-item" onClick={() => setShowQr(true)}><QrCode size={18}/> QR code</button></nav><div className="nav-bottom"><button className="nav-item"><Settings size={18}/> Settings</button><div className="plan-card"><div className="plan-icon"><Sparkles size={15}/></div><div><strong>Creator plan</strong><small>7 days left in trial</small></div><ExternalLink size={14}/></div><div className="user-row"><Avatar profile={profile} small/><div><strong>{profile.name}</strong><small>my@email.com</small></div><MoreHorizontal size={17}/></div></div></aside>
    <main className="main-content"><header className="topbar"><button className="menu-btn"><Menu size={20}/></button><div><div className="eyebrow">BIO PAGE / {activeTab === 'analytics' ? 'ANALYTICS' : 'EDITOR'}</div><h1>Your story, one link.</h1></div><div className="top-actions"><div className={published ? 'status published' : 'status'}><span></span>{published ? 'Published' : 'Draft'}</div><button className="icon-button" onClick={() => setShowQr(true)} title="QR code"><QrCode size={18}/></button><button className="share-button" onClick={publish}><Share2 size={16}/> {copied ? 'Copied ✓' : 'Copy link'}</button><button className="publish-button" onClick={publish}>{published ? 'Published ✓' : 'Publish'}</button></div></header>
      {activeTab === 'analytics' ? <Analytics links={links} stats={stats}/> : <div className="editor-grid"><section className="editor-column"><div className="section-heading"><div><h2>Content</h2><p>Build your page with blocks that feel like you.</p></div><button className="add-block" onClick={() => setLinkEditor({ type: 'link', title: '', url: '', icon: '↗', color: '#6b5cff' })}><Plus size={16}/> Add block</button></div><div className="content-card"><div className="profile-editor"><label className="avatar-upload"><Avatar profile={profile}/><span className="upload-dot"><Upload size={11}/></span><input type="file" accept="image/*" onChange={uploadAvatar}/></label><div className="profile-fields"><label>DISPLAY NAME<input value={profile.name} onChange={(e) => updateProfile('name', e.target.value)}/></label><label>BIO<textarea value={profile.bio} onChange={(e) => updateProfile('bio', e.target.value)}/></label><label className="handle-field">PAGE URL<div className="url-input"><span>biogen.vn/</span><input value={profile.handle} onChange={(e) => updateProfile('handle', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}/></div></label></div></div><div className="divider"/><div className="block-list">{links.map((link) => <Block key={link.id} link={link} clicks={stats.byLink[link.id] || 0} onRemove={removeLink} onEdit={setLinkEditor} onDragStart={setDraggedId} onDrop={reorder}/>)}</div><button className="add-link-row" onClick={() => setLinkEditor({ type: 'link', title: '', url: '', icon: '↗', color: '#6b5cff' })}><Plus size={16}/> Add a link block</button></div><div className="tip"><Sparkles size={17}/><span><strong>Make it yours.</strong> Upload an avatar, reorder blocks and switch themes. Changes save automatically.</span></div></section><section className="preview-column"><div className="preview-head"><div><h2>Live preview</h2><p>biogen.vn/{profile.handle}</p></div><button className="preview-share" onClick={publish}><ExternalLink size={15}/></button></div><PhonePreview profile={profile} links={links} theme={theme} onClick={recordClick}/><div className="theme-controls"><div className="control-label"><Palette size={15}/> Quick themes <span>Pick a vibe</span></div><div className="theme-row">{[['aurora','Aurora'],['sunset','Sunset'],['midnight','Midnight']].map(([key, label]) => <button key={key} className={theme === key ? 'theme-swatch selected' : 'theme-swatch'} onClick={() => setTheme(key)}><span className={'swatch '+key}></span>{label}</button>)}</div></div></section></div>}
    </main>{showQr && <QrModal close={() => setShowQr(false)} url={publicUrl}/>} {linkEditor && <LinkModal initial={linkEditor} close={() => setLinkEditor(null)} save={saveLink}/>}</div>
}

function Avatar({ profile, small }) { return profile.avatar ? <img className={small ? 'avatar tiny' : 'avatar large'} src={profile.avatar} alt="Avatar"/> : <div className={small ? 'avatar tiny' : 'avatar large'}>{profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div> }
function FontPicker({ value, onChange }) { return <div className="font-picker"><span>Font</span>{[['sans','Clean'],['grotesk','Bold'],['serif','Editorial']].map(([key, label]) => <button key={key} className={value === key ? 'selected '+key : key} onClick={() => onChange(key)}>{label}</button>)}</div> }
function Block({ link, clicks, onRemove, onEdit, onDragStart, onDrop }) { return <div className="block-row" draggable onDragStart={() => onDragStart(link.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(link.id)}><GripVertical className="drag" size={17}/><div className="block-icon" style={{ background: link.color }}>{link.type === 'video' ? <Play size={15} fill="white"/> : link.icon}</div><button className="block-copy" onClick={() => onEdit(link)}><strong>{link.title}</strong><small>{link.url}{clicks ? ` · ${clicks} clicks` : ''}</small></button>{link.type === 'product' && <span className="sale-tag">SELLING</span>}<button className="more-block" onClick={() => onEdit(link)}><MoreHorizontal size={18}/></button><button className="delete-block" onClick={() => onRemove(link.id)}><Trash2 size={15}/></button></div> }
function PhonePreview({ profile, links, theme, onClick }) { return <div className={'phone '+theme}><div className="phone-notch"></div><div className="phone-content"><div className="phone-menu">•••</div><div className="phone-avatar">{profile.avatar ? <img src={profile.avatar} alt=""/> : profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div><h3>{profile.name} <span className="verified">✓</span></h3><p>{profile.bio}</p><div className="socials"><span>f</span><span>◎</span><span>▶</span></div><div className="phone-links">{links.map((link) => <button className="phone-link" key={link.id} onClick={() => onClick(link)}><span className="phone-link-icon" style={{ background: link.color }}>{link.icon}</span><strong>{link.title}</strong><MoreHorizontal size={16}/></button>)}</div><div className="powered">✦ biogen</div></div></div> }
function PublicPage({ profile, links, theme, fontFamily, onClick }) { return <div className={'public-page '+theme+' font-'+fontFamily}><div className="public-card"><div className="public-menu">•••</div><div className="public-avatar">{profile.avatar ? <img src={profile.avatar} alt={profile.name}/> : profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div><h1>{profile.name} <span className="verified">✓</span></h1><p>{profile.bio}</p><div className="socials"><span>f</span><span>◎</span><span>▶</span></div><div className="public-links">{links.map((link) => <button className="public-link" key={link.id} onClick={() => { onClick(link); if (link.url.startsWith('http')) window.open(link.url, '_blank', 'noopener,noreferrer') }}><span className="phone-link-icon" style={{ background: link.color }}>{link.icon}</span><strong>{link.title}</strong><MoreHorizontal size={17}/></button>)}</div><div className="public-brand">✦ biogen</div></div></div> }
function Analytics({ links, stats }) { const top = [...links].sort((a, b) => (stats.byLink[b.id] || 0) - (stats.byLink[a.id] || 0))[0]; const ctr = stats.views ? ((stats.clicks / stats.views) * 100).toFixed(1) : '0.0'; return <section className="analytics"><div className="section-heading"><div><h2>Analytics overview</h2><p>Data from this browser, saved locally for the MVP.</p></div><button className="date-filter">All time⌄</button></div><div className="metric-grid"><Metric value={stats.views.toLocaleString()} label="Page views" note="Live counter"/><Metric value={stats.clicks.toLocaleString()} label="Total clicks" note="Live counter"/><Metric value={`${ctr}%`} label="Click-through rate" note="Clicks / views"/><Metric value={top ? top.title : '—'} label="Top link" note={top ? `${stats.byLink[top.id] || 0} clicks` : 'No clicks yet'}/></div><div className="chart-card"><div className="chart-title"><div><h3>Link performance</h3><p>Click count by block</p></div></div><div className="performance-list">{links.map((link) => <div className="performance-row" key={link.id}><span className="block-icon" style={{ background: link.color }}>{link.icon}</span><strong>{link.title}</strong><span>{stats.byLink[link.id] || 0} clicks</span><div className="performance-bar"><i style={{ width: `${Math.min(100, ((stats.byLink[link.id] || 0) / Math.max(1, stats.clicks)) * 100 * 3)}%` }}></i></div></div>)}</div></div></section> }
function Metric({ value, label, note }) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong><small className="up">{note}</small></div> }
function LinkModal({ initial, close, save }) { const [draft, setDraft] = useState(initial); const update = (key, value) => setDraft((old) => ({ ...old, [key]: value })); return <div className="modal-backdrop" onClick={close}><div className="link-modal" onClick={(e) => e.stopPropagation()}><button className="close-modal" onClick={close}><X size={18}/></button><h2>{initial.id ? 'Edit block' : 'Add a block'}</h2><p>Give your audience a clear next step.</p><label>BLOCK TYPE<select value={draft.type} onChange={(e) => update('type', e.target.value)}><option value="link">Link</option><option value="video">Video</option><option value="product">Product</option></select></label><label>TITLE<input autoFocus value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Follow me on Facebook"/></label><label>{draft.type === 'product' ? 'PRICE' : 'URL'}<input value={draft.url} onChange={(e) => update('url', e.target.value)} placeholder={draft.type === 'product' ? '499.000đ' : 'https://...'}/></label><div className="modal-buttons"><button onClick={close}>Cancel</button><button className="primary-modal" onClick={() => save(draft)}>Save block</button></div></div></div> }
function QrModal({ close, url }) { const canvasRef = useRef(null); const [svg, setSvg] = useState(''); useEffect(() => { QRCode.toCanvas(canvasRef.current, url, { width: 180, margin: 1, color: { dark: '#252333', light: '#ffffff' } }); QRCode.toString(url, { type: 'svg', margin: 1 }).then(setSvg) }, [url]); const download = (data, name, type) => { const blob = data instanceof Blob ? data : new Blob([data], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href) }; return <div className="modal-backdrop" onClick={close}><div className="qr-modal" onClick={(e) => e.stopPropagation()}><button className="close-modal" onClick={close}><X size={18}/></button><div className="modal-spark">✦</div><h2>Your QR code</h2><p>Share your BioGen page anywhere.</p><div className="qr-box"><canvas ref={canvasRef}/></div><strong className="qr-url">{url.replace('https://', '')}</strong><div className="qr-actions"><button onClick={() => canvasRef.current.toBlob((blob) => download(blob, 'biogen-qr.png'))}>Download PNG</button><button onClick={() => download(svg, 'biogen-qr.svg', 'image/svg+xml')}>Download SVG</button></div></div></div> }

createRoot(document.getElementById('root')).render(<App />)
