// components.jsx — UI primitives, player cards, chrome
const { useState, useEffect, useRef } = React;

// ── Icons (simple line geometry) ─────────────────────────
const ICONS = {
  ball:    'M12 2a10 10 0 100 20 10 10 0 000-20zM12 7.5l3.2 2.3-1.2 3.8h-4L8.8 9.8 12 7.5zM12 2.2l2.1 2.6M12 2.2L9.9 4.8M21.6 9.4l-3.1 1M21.6 9.4l-1.3 3.1M18.3 20.2l-1.9-2.7M18.3 20.2l-3.3-.1M5.7 20.2l1.9-2.7M5.7 20.2l3.3-.1M2.4 9.4l3.1 1M2.4 9.4l1.3 3.1',
  list:    'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  trophy:  'M7 4h10v3a5 5 0 01-10 0V4zM7 6H4.5a2.5 2.5 0 005 .5M17 6h2.5a2.5 2.5 0 01-5 .5M9 13.5V17h6v-3.5M8 21h8M12 17v4',
  user:    'M12 12a4 4 0 100-8 4 4 0 000 8zM4.5 20a7.5 7.5 0 0115 0',
  plus:    'M12 5v14M5 12h14',
  check:   'M5 13l4 4L19 7',
  x:       'M6 6l12 12M18 6L6 18',
  pencil:  'M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4',
  trash:   'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  shield:  'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z',
  share:   'M16 6l-4-4-4 4M12 2v13M5 12v7a1 1 0 001 1h12a1 1 0 001-1v-7',
  users:   'M9 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM2.5 20a6.5 6.5 0 0113 0M17 11a3 3 0 000-6M21.5 20a6 6 0 00-4-5.6',
  back:    'M15 19l-7-7 7-7',
  chevron: 'M9 6l6 6-6 6',
  lock:    'M6 11h12v9H6v-9zM8 11V8a4 4 0 018 0v3',
  shuffle: 'M4 5h4l9 14h3M17 5h3M4 19h4l3-4.5M17 19l3-3-3-3M20 5l-3-3',
  star:    'M12 3l2.7 5.7L21 9.5l-4.5 4.3 1.1 6.2L12 17l-5.6 3 1.1-6.2L3 9.5l6.3-.8L12 3z',
  whistle: 'M11 8h10a3 3 0 010 6h-1a6 6 0 11-9-6zM3 9l4 1M4 6l3 2M4 13l3-1',
  logout:  'M14 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2v-2M9 12h11M17 9l3 3-3 3',
  gear:    'M12 9a3 3 0 100 6 3 3 0 000-6zM19.4 13.5a1.7 1.7 0 00.4 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2v.2a2 2 0 11-4 0v-.1a1.7 1.7 0 00-2.9-1.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00-1.2-2.9H1.9a2 2 0 110-4H2a1.7 1.7 0 001.3-2.9l-.1-.1A2 2 0 116 2.6l.1.1A1.7 1.7 0 009 1.5V1.4a2 2 0 014 0v.1a1.7 1.7 0 002.9 1.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 2z',
  tools:   'M14.7 6.3a4 4 0 01-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 015.2-5.2l-2.3 2.3-2.2-.5-.5-2.2 2.3-2.3zM6 18h.01',
  cone:    'M3 20h18M7 20l4-15h2l4 15M8.5 10h7M6.7 15h10.6',
  calendar:'M7 3v3M17 3v3M4 8h16M5 6h14a1 1 0 011 1v12a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z',
  crown:   'M4 18h16M5 18l-1.5-9 5 4L12 6l3.5 7 5-4L19 18',
  eye:     'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7zM12 15a3 3 0 100-6 3 3 0 000 6z',
  download:'M12 3v12M8 11l4 4 4-4M4 21h16',
  whatsapp:'M12 3a9 9 0 00-7.7 13.6L3 21l4.5-1.2A9 9 0 1012 3zM8.5 8.5c.2-.5.4-.5.7-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2.1.4 0 .6l-.4.6c-.1.2-.2.3 0 .6.6 1 1.4 1.6 2.4 2 .3.1.4.1.6-.1l.6-.7c.2-.2.4-.2.6-.1l1.5.7c.2.1.4.2.4.4 0 .6-.3 1.4-1.4 1.6-1 .2-2.4 0-4.3-1.2-2.1-1.3-3.3-3.3-3.4-4.4-.1-.9.2-1.6.4-1.9z',
};
function Icon({ name, size = 22, stroke = 'currentColor', width = 1.9, fill = 'none', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
      strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={ICONS[name]} />
    </svg>
  );
}

// ── Stars ────────────────────────────────────────────────
function Star({ fill = 1, size = 13, color = 'var(--gold)', empty = 'var(--line)' }) {
  const star = (c, sz) => (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      <path d={ICONS.star} fill={c} stroke={c} strokeWidth="0.6" strokeLinejoin="round" />
    </svg>
  );
  return (
    <span style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      {star(empty)}
      <span style={{ position: 'absolute', inset: 0, width: `${fill * 100}%`, overflow: 'hidden' }}>
        {star(color)}
      </span>
    </span>
  );
}
function StarRow({ stars, size = 13, gap = 2 }) {
  return (
    <div style={{ display: 'flex', gap }}>
      {starFill(stars).map((f, i) => <Star key={i} fill={f} size={size} />)}
    </div>
  );
}

// ── Buttons ──────────────────────────────────────────────
function Button({ variant = 'primary', size = 'md', icon, children, full, className = '', ...rest }) {
  const base = 'font-sans font-bold inline-flex items-center justify-center gap-2 rounded-xl transition active:scale-[0.97] select-none disabled:opacity-40 disabled:active:scale-100';
  const sizes = { sm: 'text-[13px] px-3 h-9', md: 'text-[15px] px-4 h-12', lg: 'text-[16px] px-5 h-[54px]' };
  const styleByVariant = {
    primary: { background: 'var(--accent)', color: 'var(--accent-ink)', boxShadow: '0 8px 20px -10px var(--accent)' },
    secondary: { background: 'var(--card-hi)', color: 'var(--text)', border: '1px solid var(--line)' },
    ghost: { background: 'transparent', color: 'var(--muted)' },
    danger: { background: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid color-mix(in oklch, var(--danger) 40%, transparent)' },
    soft: { background: 'var(--accent-soft)', color: 'var(--accent)' },
  };
  return (
    <button className={`${base} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`} style={styleByVariant[variant]} {...rest}>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} width={2.2} />}
      {children}
    </button>
  );
}

function IconButton({ name, onClick, label, danger, size = 40, iconSize = 19 }) {
  return (
    <button onClick={onClick} aria-label={label} style={{
      width: size, height: size, display: 'grid', placeItems: 'center', borderRadius: 12,
      background: 'var(--card-hi)', border: '1px solid var(--line-soft)',
      color: danger ? 'var(--danger)' : 'var(--muted)', flexShrink: 0,
    }} className="transition active:scale-90">
      <Icon name={name} size={iconSize} />
    </button>
  );
}

// ── Position chip ────────────────────────────────────────
function PosChip({ position, small }) {
  const p = POSITIONS[position];
  return (
    <span className="font-display font-semibold uppercase" style={{
      fontSize: small ? 10 : 11, letterSpacing: '0.06em', lineHeight: 1,
      padding: small ? '3px 6px' : '4px 8px', borderRadius: 7,
      color: p.accent, background: 'color-mix(in oklch, ' + p.accent + ' 16%, transparent)',
    }}>{p.short}</span>
  );
}

// ── Player card (matte, big number + stars) ──────────────
function PlayerCard({ player, selectable, selected, onToggle, dim }) {
  const p = POSITIONS[player.position];
  return (
    <button
      onClick={onToggle}
      disabled={!selectable}
      className="text-left transition active:scale-[0.98]"
      style={{
        position: 'relative', borderRadius: 18, padding: 13, overflow: 'hidden', width: '100%',
        background: 'linear-gradient(157deg, var(--card-hi) 0%, var(--card) 52%, var(--card) 100%)',
        border: '1px solid ' + (selected ? 'var(--accent)' : 'var(--line-soft)'),
        boxShadow: selected ? '0 0 0 2px var(--accent-soft), var(--shadow)' : 'var(--shadow)',
        opacity: dim && !selected ? 0.5 : 1,
        cursor: selectable ? 'pointer' : 'default',
      }}>
      {/* position accent edge */}
      <span style={{ position: 'absolute', left: 0, top: 14, bottom: 14, width: 3, borderRadius: 3, background: p.accent }} />
      {/* sheen */}
      <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0) 38%)', pointerEvents: 'none' }} />

      {/* selection check */}
      {selectable && (
        <span style={{
          position: 'absolute', top: 10, right: 10, width: 22, height: 22, borderRadius: '50%',
          display: 'grid', placeItems: 'center',
          background: selected ? 'var(--accent)' : 'transparent',
          border: '1.6px solid ' + (selected ? 'var(--accent)' : 'var(--line)'),
          color: 'var(--accent-ink)', transition: 'all .15s',
        }}>
          {selected && <Icon name="check" size={13} width={3} />}
        </span>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* rating block */}
        <div style={{ width: 46, flexShrink: 0, textAlign: 'center', paddingLeft: 4 }}>
          <div className="font-display font-bold" style={{ fontSize: 34, lineHeight: 0.9, color: 'var(--text)' }}>{player.stars}</div>
          <div className="font-display font-medium uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', color: 'var(--faint)', marginTop: 2 }}>OVR</div>
        </div>
        {/* position badge (in destaque) */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
          background: 'color-mix(in oklch, ' + p.accent + ' 18%, var(--surface))',
          border: '1px solid color-mix(in oklch, ' + p.accent + ' 35%, transparent)',
          color: p.accent,
        }}>
          <span className="font-display font-bold uppercase" style={{ fontSize: 17, lineHeight: 1, letterSpacing: '0.02em' }}>{p.short}</span>
          <span className="font-sans font-semibold uppercase" style={{ fontSize: 7.5, letterSpacing: '0.08em', opacity: 0.8 }}>{p.label}</span>
        </div>
        {/* name + meta */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="font-display font-semibold uppercase truncate" style={{ fontSize: 16, letterSpacing: '0.01em', color: 'var(--text)' }}>{player.name}</div>
          <div style={{ marginTop: 6 }}><StarRow stars={player.stars} size={13} /></div>
        </div>
      </div>
    </button>
  );
}

// ── Mini player card (draw teams) ────────────────────────
function MiniPlayerCard({ player, ink, index }) {
  const p = POSITIONS[player.position];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9, padding: '7px 10px', borderRadius: 11,
      background: 'color-mix(in oklch, ' + ink + ' 8%, var(--card))',
      border: '1px solid var(--line-soft)',
      animation: `slideIn .4s cubic-bezier(.2,.7,.3,1) backwards`, animationDelay: Math.min(index, 14) * 40 + 'ms',
    }}>
      {/* position in destaque */}
      <span style={{ width: 34, height: 32, borderRadius: 8, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'color-mix(in oklch, ' + p.accent + ' 20%, var(--surface))', border: '1px solid color-mix(in oklch, ' + p.accent + ' 32%, transparent)', color: p.accent }}>
        <span className="font-display font-bold uppercase" style={{ fontSize: 12, letterSpacing: '0.02em' }}>{p.short}</span>
      </span>
      <span className="font-sans font-semibold truncate" style={{ fontSize: 13.5, color: 'var(--text)', flex: 1, minWidth: 0 }}>{player.name}</span>
      <StarRow stars={player.stars} size={11} gap={1.5} />
      <span className="font-display font-bold" style={{ fontSize: 16, lineHeight: 1, color: 'var(--text)', width: 18, textAlign: 'right' }}>{player.stars}</span>
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────
function Toast({ toast, onClose }) {
  if (!toast) return null;
  const danger = toast.type === 'error';
  return (
    <div style={{ position: 'absolute', top: 14, left: 14, right: 14, zIndex: 60, animation: 'toastIn .3s cubic-bezier(.2,.8,.3,1) both' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 11, padding: '12px 13px', borderRadius: 14,
        background: danger ? 'oklch(0.30 0.10 25)' : 'oklch(0.42 0.13 158)',
        border: '1px solid ' + (danger ? 'oklch(0.55 0.18 25)' : 'oklch(0.60 0.16 158)'),
        boxShadow: '0 16px 30px -12px rgba(0,0,0,0.6)',
      }}>
        <span style={{ width: 26, height: 26, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(255,255,255,0.18)', color: '#fff', flexShrink: 0 }}>
          <Icon name={danger ? 'x' : 'check'} size={15} width={3} />
        </span>
        <span className="font-sans font-semibold" style={{ fontSize: 13.5, color: '#fff', flex: 1, lineHeight: 1.3 }}>{toast.msg}</span>
        <button onClick={onClose} aria-label="Fechar" style={{ color: 'rgba(255,255,255,0.85)', flexShrink: 0, padding: 2 }} className="active:scale-90">
          <Icon name="x" size={17} width={2.4} />
        </button>
      </div>
    </div>
  );
}

// ── Bottom sheet / modal ─────────────────────────────────
function Sheet({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(5,8,12,0.62)', animation: 'scrim .2s both' }} />
      <div style={{
        position: 'relative', background: 'var(--surface)', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        borderTop: '1px solid var(--line)', boxShadow: '0 -20px 50px -10px rgba(0,0,0,0.5)',
        animation: 'sheetUp .3s cubic-bezier(.2,.8,.25,1) both', maxHeight: '88%', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 10 }}>
          <span style={{ width: 38, height: 4, borderRadius: 2, background: 'var(--line)' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px 8px' }}>
          <h3 className="font-display font-semibold uppercase" style={{ fontSize: 19, letterSpacing: '0.01em', color: 'var(--text)' }}>{title}</h3>
          <button onClick={onClose} aria-label="Fechar" style={{ color: 'var(--faint)' }} className="active:scale-90"><Icon name="x" size={22} /></button>
        </div>
        <div className="noscroll" style={{ padding: '4px 18px 8px', overflowY: 'auto' }}>{children}</div>
        {footer && <div style={{ padding: '12px 18px', paddingBottom: 20, borderTop: '1px solid var(--line-soft)' }}>{footer}</div>}
      </div>
    </div>
  );
}

// ── Form field ───────────────────────────────────────────
function Field({ label, icon, children, hint }) {
  return (
    <label style={{ display: 'block', marginBottom: 14 }}>
      {label && <span className="font-sans font-semibold" style={{ fontSize: 12.5, color: 'var(--muted)', display: 'block', marginBottom: 7, letterSpacing: '0.01em' }}>{label}</span>}
      {children}
      {hint && <span style={{ fontSize: 11.5, color: 'var(--faint)', display: 'block', marginTop: 6 }}>{hint}</span>}
    </label>
  );
}
function inputStyle(focus) {
  return {
    width: '100%', height: 50, borderRadius: 13, padding: '0 14px', fontSize: 15,
    background: 'var(--card)', color: 'var(--text)',
    border: '1px solid ' + (focus ? 'var(--accent)' : 'var(--line)'),
    outline: 'none', fontFamily: 'Manrope, sans-serif', fontWeight: 600,
    boxShadow: focus ? '0 0 0 3px var(--accent-soft)' : 'none', transition: 'all .15s',
  };
}
function TextInput({ value, onChange, placeholder, type = 'text', icon, ...rest }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      {icon && <span style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--faint)' }}><Icon name={icon} size={18} /></span>}
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...inputStyle(focus), paddingLeft: icon ? 42 : 14 }}
        {...rest}
      />
    </div>
  );
}

// ── Bottom tab bar ───────────────────────────────────────
function BottomTabBar({ active, onChange }) {
  const tabs = [
    { key: 'peladas', label: 'Peladas', icon: 'list' },
    { key: 'sorteios', label: 'Sorteios', icon: 'trophy' },
    { key: 'perfil', label: 'Perfil', icon: 'user' },
  ];
  return (
    <div style={{
      display: 'flex', background: 'color-mix(in oklch, var(--surface) 88%, transparent)',
      borderTop: '1px solid var(--line-soft)', backdropFilter: 'blur(14px)',
      padding: '8px 8px 6px', flexShrink: 0,
    }}>
      {tabs.map((t) => {
        const on = active === t.key;
        return (
          <button key={t.key} onClick={() => onChange(t.key)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '5px 0', color: on ? 'var(--accent)' : 'var(--faint)' }} className="transition active:scale-95">
            <Icon name={t.icon} size={23} width={on ? 2.2 : 1.9} fill={on ? 'color-mix(in oklch, var(--accent) 16%, transparent)' : 'none'} />
            <span className="font-sans font-bold" style={{ fontSize: 10.5, letterSpacing: '0.01em' }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Galaxy S25 device frame ──────────────────────────────
function PhoneFrame({ children, light }) {
  return (
    <div style={{
      width: 392, height: 830, borderRadius: 52, padding: 11, flexShrink: 0,
      background: 'linear-gradient(160deg, #2b2f37, #0c0e12 60%)',
      boxShadow: '0 50px 120px -30px rgba(0,0,0,0.85), inset 0 0 0 1.5px rgba(255,255,255,0.05)',
    }}>
      <div className={light ? 'theme-light' : ''} style={{
        position: 'relative', width: '100%', height: '100%', borderRadius: 42, overflow: 'hidden',
        background: 'var(--bg)', display: 'flex', flexDirection: 'column',
      }}>
        {/* status bar */}
        <div style={{ height: 44, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', position: 'relative', zIndex: 5 }}>
          <span className="font-sans font-bold" style={{ fontSize: 14, color: 'var(--text)' }}>21:30</span>
          <div style={{ position: 'absolute', left: '50%', top: 11, transform: 'translateX(-50%)', width: 11, height: 11, borderRadius: '50%', background: '#04060a', boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.08)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text)' }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor"><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="4.5" y="4.5" width="3" height="7.5" rx="1"/><rect x="9" y="2" width="3" height="10" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1" opacity="0.4"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor"><path d="M8 2.2c2 0 3.8.8 5.1 2.1l1-1A8.5 8.5 0 008 .8 8.5 8.5 0 001.9 3.3l1 1A7.2 7.2 0 018 2.2zM8 5.2c1.2 0 2.3.5 3.1 1.3l1-1A6 6 0 008 3.7a6 6 0 00-4.1 1.8l1 1A4.3 4.3 0 018 5.2zM8 8c.6 0 1.2.3 1.6.7l-1.6 1.6L6.4 8.7C6.8 8.3 7.4 8 8 8z"/></svg>
            <svg width="25" height="13" viewBox="0 0 25 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3" stroke="currentColor" opacity="0.5"/><rect x="2" y="2" width="16" height="9" rx="1.5" fill="currentColor"/><rect x="22.5" y="4" width="2" height="5" rx="1" fill="currentColor" opacity="0.5"/></svg>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, {
  Icon, Star, StarRow, Button, IconButton, PosChip, PlayerCard, MiniPlayerCard,
  Toast, Sheet, Field, TextInput, BottomTabBar, PhoneFrame,
});
