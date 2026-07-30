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
const defaultProfile = { name: 'Hoài My', handle: 'hoaimy', bio: 'Content creator · Chia sẻ điều hay mỗi ngày ✨', avatar: '', email: 'huyenkim2506@gmail.com' }
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
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => localStorage.setItem('biogen-profile', JSON.stringify(profile)), [profile])
  useEffect(() => localStorage.setItem('biogen-links', JSON.stringify(links)), [links])
  useEffect(() => localStorage.setItem('biogen-theme', theme), [theme])
  useEffect(() => localStorage.setItem('biogen-font', fontFamily), [fontFamily])
  useEffect(() => localStorage.setItem('biogen-published', published), [published])
  useEffect(() => localStorage.setItem('biogen-stats', JSON.stringify(stats)), [stats])
  useEffect(() => { if (!sessionStorage.getItem('biogen-view-recorded')) { sessionStorage.setItem('biogen-view-recorded', 'true'); setStats((old) => ({ ...old, views: old.views + 1 })) } }, [])
  useEffect(() => {
    if (isPublicPage) return
    setProfile((old) => old.handle === 'hoaimy' ? { ...old, name: 'Kim Huyen', handle: 'kimhuyen', email: 'huyenkim2506@gmail.com' } : { ...old, email: 'huyenkim2506@gmail.com' })
    setLinks((old) => old.map((item) => item.id === 1 ? { ...item, title: 'Facebook', url: 'https://www.facebook.com/kiw.hh/', icon: 'f', color: '#1877f2' } : item.id === 2 ? { ...item, title: 'TikTok', url: 'https://www.tiktok.com/@kiw.hh', icon: '♪', color: '#111111' } : item.id === 3 ? { ...item, type: 'link', title: 'Instagram', url: 'https://www.instagram.com/kiw.h_/', icon: '◎', color: '#e1306c' } : item.id === 4 ? { ...item, type: 'link', title: 'YouTube', url: 'https://www.youtube.com/@kimhuyennguyenthi9425/posts', icon: '▶', color: '#ff0000' } : item))
  }, [isPublicPage])

  useEffect(() => {
    if (!supabase) { setRemoteLoaded(true); return undefined }
    if (!isPublicPage && (authLoading || !session)) return undefined
    const handle = isPublicPage ? requestedHandle : profile.handle
    let cancelled = false
    const pageQuery = supabase.from('bio_pages').select('user_id, profile, links, theme, font_family, published, stats')
    const request = isPublicPage ? pageQuery.eq('handle', handle).maybeSingle() : pageQuery.eq('user_id', session.user.id).maybeSingle()
    request
      .then(({ data, error }) => {
        if (error) console.error('Could not load bio page', error)
        if (!cancelled && data) {
          setProfile({ ...data.profile, email: 'huyenkim2506@gmail.com' })
          setLinks((data.links || []).map((item) => item.id === 1 ? { ...item, title: 'Facebook', url: 'https://www.facebook.com/kiw.hh/', icon: 'f', color: '#1877f2' } : item.id === 2 ? { ...item, title: 'TikTok', url: 'https://www.tiktok.com/@kiw.hh', icon: '♪', color: '#111111' } : item.id === 3 ? { ...item, type: 'link', title: 'Instagram', url: 'https://www.instagram.com/kiw.h_/', icon: '◎', color: '#e1306c' } : item.id === 4 ? { ...item, type: 'link', title: 'YouTube', url: 'https://www.youtube.com/@kimhuyennguyenthi9425/posts', icon: '▶', color: '#ff0000' } : item))
          setTheme(data.theme || 'aurora')
          setFontFamily(data.font_family || 'sans')
          setPublished(Boolean(data.published))
          setStats(data.stats || { views: 0, clicks: 0, byLink: {} })
          setNeedsOnboarding(false)
        } else if (!cancelled && !isPublicPage) {
          setNeedsOnboarding(true)
        }
        if (!cancelled) setRemoteLoaded(true)
      })
    return () => { cancelled = true }
  }, [authLoading, isPublicPage, requestedHandle, session?.user?.id])

  useEffect(() => {
    if (!supabase || isPublicPage || !session || needsOnboarding || !remoteLoaded || !profile.handle) return
    supabase.from('bio_pages').upsert({ handle: profile.handle, user_id: session.user.id, profile, links, theme, font_family: fontFamily, published, stats, updated_at: new Date().toISOString() })
      .then(({ error }) => { if (error) console.error('Could not save bio page', error) })
  }, [profile, links, theme, fontFamily, published, stats, remoteLoaded, session, isPublicPage, needsOnboarding])

  if (isPublicPage) return <PublicPage profile={profile} links={links} theme={theme} fontFamily={fontFamily} onClick={(link) => setStats((old) => ({ ...old, clicks: old.clicks + 1, byLink: { ...old.byLink, [link.id]: (old.byLink[link.id] || 0) + 1 } }))} />
  if (supabase && (authLoading || !session)) return <AuthScreen supabase={supabase} />
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

  return <div className="app-shell"><FontPicker value={fontFamily} onChange={setFontFamily}/><ProductTools supabase={supabase} session={session} onSave={(product) => setLinks((old) => [...old, product])}/><AccountTools email={session?.user?.email} onLogout={() => supabase?.auth.signOut()}/><SecurityTools email={session?.user?.email}/>
    <aside className="sidebar"><div className="brand"><div className="brand-mark">✦</div><span>biogen</span></div><div className="workspace-label">WORKSPACE</div><div className="profile-mini"><Avatar profile={profile} small/><div><strong>{profile.name}</strong><small>@{profile.handle}</small></div><MoreHorizontal size={17}/></div><nav className="main-nav"><button className={activeTab === 'editor' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('editor')}><Link2 size={18}/> Bio page</button><button className={activeTab === 'analytics' ? 'nav-item active' : 'nav-item'} onClick={() => setActiveTab('analytics')}><BarChart3 size={18}/> Analytics <span className="new-pill">LIVE</span></button><button className="nav-item" onClick={() => setShowQr(true)}><QrCode size={18}/> QR code</button></nav><div className="nav-bottom"><button className="nav-item"><Settings size={18}/> Settings</button><div className="plan-card"><div className="plan-icon"><Sparkles size={15}/></div><div><strong>Creator plan</strong><small>7 days left in trial</small></div><ExternalLink size={14}/></div><div className="user-row"><Avatar profile={profile} small/><div><strong>{profile.name}</strong><small>my@email.com</small></div><MoreHorizontal size={17}/></div></div></aside>
    <main className="main-content"><header className="topbar"><button className="menu-btn"><Menu size={20}/></button><div><div className="eyebrow">BIO PAGE / {activeTab === 'analytics' ? 'ANALYTICS' : 'EDITOR'}</div><h1>Your story, one link.</h1></div><div className="top-actions"><div className={published ? 'status published' : 'status'}><span></span>{published ? 'Published' : 'Draft'}</div><button className="icon-button" onClick={() => setShowQr(true)} title="QR code"><QrCode size={18}/></button><button className="share-button" onClick={publish}><Share2 size={16}/> {copied ? 'Copied ✓' : 'Copy link'}</button><button className="publish-button" onClick={publish}>{published ? 'Published ✓' : 'Publish'}</button></div></header>
      {activeTab === 'analytics' ? <Analytics links={links} stats={stats}/> : <div className="editor-grid"><section className="editor-column"><div className="section-heading"><div><h2>Content</h2><p>Build your page with blocks that feel like you.</p></div><button className="add-block" onClick={() => setLinkEditor({ type: 'link', title: '', url: '', icon: '↗', color: '#6b5cff' })}><Plus size={16}/> Add block</button></div><div className="content-card"><div className="profile-editor"><label className="avatar-upload"><Avatar profile={profile}/><span className="upload-dot"><Upload size={11}/></span><input type="file" accept="image/*" onChange={uploadAvatar}/></label><div className="profile-fields"><label>DISPLAY NAME<input value={profile.name} onChange={(e) => updateProfile('name', e.target.value)}/></label><label>BIO<textarea value={profile.bio} onChange={(e) => updateProfile('bio', e.target.value)}/></label><label className="handle-field">PAGE URL<div className="url-input"><span>biogen.vn/</span><input value={profile.handle} onChange={(e) => updateProfile('handle', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}/></div></label></div></div><div className="divider"/><div className="block-list">{links.map((link) => <Block key={link.id} link={link} clicks={stats.byLink[link.id] || 0} onRemove={removeLink} onEdit={setLinkEditor} onDragStart={setDraggedId} onDrop={reorder}/>)}</div><button className="add-link-row" onClick={() => setLinkEditor({ type: 'link', title: '', url: '', icon: '↗', color: '#6b5cff' })}><Plus size={16}/> Add a link block</button></div><div className="tip"><Sparkles size={17}/><span><strong>Make it yours.</strong> Upload an avatar, reorder blocks and switch themes. Changes save automatically.</span></div></section><section className="preview-column"><div className="preview-head"><div><h2>Live preview</h2><p>biogen.vn/{profile.handle}</p></div><button className="preview-share" onClick={publish}><ExternalLink size={15}/></button></div><PhonePreview profile={profile} links={links} theme={theme} onClick={recordClick}/><div className="theme-controls"><div className="control-label"><Palette size={15}/> Quick themes <span>Pick a vibe</span></div><div className="theme-row">{[['aurora','Aurora'],['sunset','Sunset'],['midnight','Midnight']].map(([key, label]) => <button key={key} className={theme === key ? 'theme-swatch selected' : 'theme-swatch'} onClick={() => setTheme(key)}><span className={'swatch '+key}></span>{label}</button>)}</div></div></section></div>}
    </main>{showQr && <QrModal close={() => setShowQr(false)} url={publicUrl}/>} {linkEditor && <LinkModal initial={linkEditor} close={() => setLinkEditor(null)} save={saveLink}/>}</div>
}

function Avatar({ profile, small }) { return profile.avatar ? <img className={small ? 'avatar tiny' : 'avatar large'} src={profile.avatar} alt="Avatar"/> : <div className={small ? 'avatar tiny' : 'avatar large'}>{profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div> }
function FontPicker({ value, onChange }) { return <div className="font-picker"><span>Font</span>{[['sans','Clean'],['grotesk','Bold'],['serif','Editorial']].map(([key, label]) => <button key={key} className={value === key ? 'selected '+key : key} onClick={() => onChange(key)}>{label}</button>)}</div> }
function ShopTools({ onAdd }) { return <div className="shop-tools"><span>Quick add</span><button onClick={onAdd}>＋ Shop link</button></div> }
function ProductTools({ supabase, session, onSave }) {
  const [open, setOpen] = useState(false); const [title, setTitle] = useState(''); const [price, setPrice] = useState(''); const [url, setUrl] = useState(''); const [image, setImage] = useState(''); const [busy, setBusy] = useState(false)
  useEffect(() => { const handler = (event) => { if (event.target.closest('.add-link-row')) { event.preventDefault(); event.stopPropagation(); setOpen(true) } }; document.addEventListener('click', handler, true); return () => document.removeEventListener('click', handler, true) }, [])
  const chooseImage = (event) => { const file = event.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => setImage(reader.result); reader.readAsDataURL(file) }
  const save = async (event) => { event.preventDefault(); if (!title.trim() || !url.trim()) return; setBusy(true); let imageUrl = image; const file = event.currentTarget.image.files?.[0]; if (file && supabase && session) { const path = `${session.user.id}/product-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`; const upload = await supabase.storage.from('bio-media').upload(path, file, { upsert: true, contentType: file.type }); if (!upload.error) imageUrl = supabase.storage.from('bio-media').getPublicUrl(path).data.publicUrl } onSave({ id: Date.now(), type: 'product', category: 'shop', title: title.trim(), url: url.trim(), price: price.trim(), image: imageUrl, icon: '🛍', color: '#ff6b35' }); setTitle(''); setPrice(''); setUrl(''); setImage(''); setBusy(false); setOpen(false) }
  return <><button className="product-tools" onClick={() => setOpen(true)}>＋ Product</button>{open && <div className="modal-backdrop" onClick={() => setOpen(false)}><form className="link-modal product-modal" onSubmit={save} onClick={(event) => event.stopPropagation()}><button type="button" className="close-modal" onClick={() => setOpen(false)}>×</button><h2>Thêm sản phẩm</h2><p>Gắn ảnh, giá và link mua hàng.</p><label>ẢNH SẢN PHẨM<input name="image" type="file" accept="image/*" onChange={chooseImage}/></label>{image && <img className="product-image-preview" src={image} alt="Preview"/>}<label>TÊN SẢN PHẨM<input value={title} onChange={(event) => setTitle(event.target.value)} required placeholder="Tên sản phẩm"/></label><label>GIÁ<input value={price} onChange={(event) => setPrice(event.target.value)} placeholder="499.000đ"/></label><label>LINK MUA HÀNG<input value={url} onChange={(event) => setUrl(event.target.value)} required placeholder="https://shopee.vn/..."/></label><div className="modal-buttons"><button type="button" onClick={() => setOpen(false)}>Hủy</button><button className="primary-modal" disabled={busy}>{busy ? 'Đang lưu…' : 'Thêm sản phẩm'}</button></div></form></div>}</>
}
function SecurityTools({ email }) { const [open, setOpen] = useState(false); const [message, setMessage] = useState(''); const reset = async () => { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); setMessage(error ? error.message : 'Đã gửi email đặt lại mật khẩu.') }; return <>{<button className="security-tools" onClick={() => setOpen(true)}>Account</button>}{open && <div className="modal-backdrop" onClick={() => setOpen(false)}><div className="link-modal" onClick={(event) => event.stopPropagation()}><button className="close-modal" onClick={() => setOpen(false)}>×</button><h2>Account settings</h2><p>{email}</p><button className="primary-modal" onClick={reset}>Reset password</button>{message && <small className="auth-message">{message}</small>}</div></div>}</> }
function AccountTools({ email, onLogout }) { return <div className="account-tools"><span>{email}</span><button onClick={onLogout}>Đăng xuất</button></div> }
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
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand-mark">✦</div><h1>Tạo bio page của bạn</h1><p>Chọn username riêng để có link public của riêng bạn.</p><label>Tên hiển thị<input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Tên của bạn"/></label><label>Username<input value={handle} onChange={(event) => setHandle(event.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))} required placeholder="yourname"/><small className="handle-hint">Link: /#/{handle || 'yourname'}</small></label><label>Giới thiệu<textarea value={bio} onChange={(event) => setBio(event.target.value)} placeholder="Bạn làm gì?"/></label><button className="auth-submit" disabled={busy}>{busy ? 'Đang tạo…' : 'Tạo bio page'}</button>{error && <small className="auth-error">{error}</small>}</form></div>
}
function AuthScreen({ supabase }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    const result = mode === 'login'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (result.error) setMessage(result.error.message)
    else setMessage(mode === 'login' ? 'Đăng nhập thành công.' : 'Đăng ký thành công. Kiểm tra email nếu Supabase yêu cầu xác nhận.')
  }
  return <div className="auth-page"><form className="auth-card" onSubmit={submit}><div className="brand-mark">✦</div><h1>{mode === 'login' ? 'Đăng nhập BioGen' : 'Tạo tài khoản BioGen'}</h1><p>Quản lý bio page an toàn bằng tài khoản của bạn.</p><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com"/></label><label>Mật khẩu<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} placeholder="Tối thiểu 6 ký tự"/></label><button className="auth-submit" disabled={busy}>{busy ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Đăng ký'}</button>{message && <small className="auth-message">{message}</small>}<button type="button" className="auth-switch" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMessage('') }}>{mode === 'login' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button></form></div>
}
function LinkVisual({ link, className }) { return <span className={`${className} ${link.type === 'product' ? 'product-visual' : ''}`} style={{ background: link.color }}>{link.image ? <img src={link.image} alt=""/> : link.type === 'video' ? <Play size={15} fill="white"/> : link.icon}</span> }
function Block({ link, clicks, onRemove, onEdit, onDragStart, onDrop }) { return <div className="block-row" draggable onDragStart={() => onDragStart(link.id)} onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(link.id)}><GripVertical className="drag" size={17}/><LinkVisual link={link} className="block-icon"/><button className="block-copy" onClick={() => onEdit(link)}><strong>{link.title}</strong><small>{link.price ? `${link.price} · ` : ''}{link.url}{clicks ? ` · ${clicks} clicks` : ''}</small></button>{link.category === 'shop' && <span className="sale-tag">SHOP</span>}<button className="more-block" onClick={() => onEdit(link)}><MoreHorizontal size={18}/></button><button className="delete-block" onClick={() => onRemove(link.id)}><Trash2 size={15}/></button></div> }
function PhonePreview({ profile, links, theme, onClick }) { return <div className={'phone '+theme}><div className="phone-notch"></div><div className="phone-content"><div className="phone-menu">•••</div><div className="phone-avatar">{profile.avatar ? <img src={profile.avatar} alt=""/> : profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div><h3>{profile.name} <span className="verified">✓</span></h3><p>{profile.bio}</p><div className="socials"><span>f</span><span>◎</span><span>▶</span></div><div className="phone-links">{links.map((link) => <button className="phone-link" key={link.id} onClick={() => onClick(link)}><LinkVisual link={link} className="phone-link-icon"/><strong>{link.title}</strong>{link.price && <small className="phone-price">{link.price}</small>}<MoreHorizontal size={16}/></button>)}</div><div className="powered">✦ biogen</div></div></div> }
function PublicPage({ profile, links, theme, fontFamily, onClick }) { return <div className={'public-page '+theme+' font-'+fontFamily}><div className="public-card"><div className="public-menu">•••</div><div className="public-avatar">{profile.avatar ? <img src={profile.avatar} alt={profile.name}/> : profile.name.split(' ').map((x) => x[0]).slice(-2).join('')}</div><h1>{profile.name} <span className="verified">✓</span></h1><p>{profile.bio}</p><div className="socials"><span>f</span><span>◎</span><span>▶</span></div><div className="public-links">{links.map((link) => <button className="public-link" key={link.id} onClick={() => { onClick(link); if (link.url.startsWith('http')) window.open(link.url, '_blank', 'noopener,noreferrer') }}><LinkVisual link={link} className="phone-link-icon"/><strong>{link.title}{link.price && <small className="public-price">{link.price}</small>}</strong><MoreHorizontal size={17}/></button>)}</div><div className="public-brand">✦ biogen</div></div></div> }
function Analytics({ links, stats }) { const top = [...links].sort((a, b) => (stats.byLink[b.id] || 0) - (stats.byLink[a.id] || 0))[0]; const ctr = stats.views ? ((stats.clicks / stats.views) * 100).toFixed(1) : '0.0'; return <section className="analytics"><div className="section-heading"><div><h2>Analytics overview</h2><p>Data from this browser, saved locally for the MVP.</p></div><button className="date-filter">All time⌄</button></div><div className="metric-grid"><Metric value={stats.views.toLocaleString()} label="Page views" note="Live counter"/><Metric value={stats.clicks.toLocaleString()} label="Total clicks" note="Live counter"/><Metric value={`${ctr}%`} label="Click-through rate" note="Clicks / views"/><Metric value={top ? top.title : '—'} label="Top link" note={top ? `${stats.byLink[top.id] || 0} clicks` : 'No clicks yet'}/></div><div className="chart-card"><div className="chart-title"><div><h3>Link performance</h3><p>Click count by block</p></div></div><div className="performance-list">{links.map((link) => <div className="performance-row" key={link.id}><span className="block-icon" style={{ background: link.color }}>{link.icon}</span><strong>{link.title}</strong><span>{stats.byLink[link.id] || 0} clicks</span><div className="performance-bar"><i style={{ width: `${Math.min(100, ((stats.byLink[link.id] || 0) / Math.max(1, stats.clicks)) * 100 * 3)}%` }}></i></div></div>)}</div></div></section> }
function Metric({ value, label, note }) { return <div className="metric-card"><span>{label}</span><strong>{value}</strong><small className="up">{note}</small></div> }
function LinkModal({ initial, close, save }) { const [draft, setDraft] = useState(initial); const update = (key, value) => setDraft((old) => ({ ...old, [key]: value })); return <div className="modal-backdrop" onClick={close}><div className="link-modal" onClick={(e) => e.stopPropagation()}><button className="close-modal" onClick={close}><X size={18}/></button><h2>{initial.id ? 'Edit block' : 'Add a block'}</h2><p>Give your audience a clear next step.</p><label>BLOCK TYPE<select value={draft.type} onChange={(e) => update('type', e.target.value)}><option value="link">Link</option><option value="video">Video</option><option value="product">Product</option></select></label><label>TITLE<input autoFocus value={draft.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Follow me on Facebook"/></label><label>{draft.type === 'product' ? 'PRICE' : 'URL'}<input value={draft.url} onChange={(e) => update('url', e.target.value)} placeholder={draft.type === 'product' ? '499.000đ' : 'https://...'}/></label><div className="modal-buttons"><button onClick={close}>Cancel</button><button className="primary-modal" onClick={() => save(draft)}>Save block</button></div></div></div> }
function QrModal({ close, url }) { const canvasRef = useRef(null); const [svg, setSvg] = useState(''); useEffect(() => { QRCode.toCanvas(canvasRef.current, url, { width: 180, margin: 1, color: { dark: '#252333', light: '#ffffff' } }); QRCode.toString(url, { type: 'svg', margin: 1 }).then(setSvg) }, [url]); const download = (data, name, type) => { const blob = data instanceof Blob ? data : new Blob([data], { type }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); URL.revokeObjectURL(a.href) }; return <div className="modal-backdrop" onClick={close}><div className="qr-modal" onClick={(e) => e.stopPropagation()}><button className="close-modal" onClick={close}><X size={18}/></button><div className="modal-spark">✦</div><h2>Your QR code</h2><p>Share your BioGen page anywhere.</p><div className="qr-box"><canvas ref={canvasRef}/></div><strong className="qr-url">{url.replace('https://', '')}</strong><div className="qr-actions"><button onClick={() => canvasRef.current.toBlob((blob) => download(blob, 'biogen-qr.png'))}>Download PNG</button><button onClick={() => download(svg, 'biogen-qr.svg', 'image/svg+xml')}>Download SVG</button></div></div></div> }

class ErrorBoundary extends React.Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() { return this.state.error ? <div className="auth-page"><div className="auth-card"><h1>App error</h1><p>{this.state.error.message}</p><button className="auth-submit" onClick={() => window.location.reload()}>Reload</button></div></div> : this.props.children }
}

createRoot(document.getElementById('root')).render(<ErrorBoundary><App /></ErrorBoundary>)
