// screens-draw.jsx — Sorteio de Times + compartilhar
const { useState: useStateD, useEffect: useEffectD, useRef: useRefD } = React;

function jersey(color, size = 26) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M8.5 3L4 5.5 5.5 10l1.5-.6V20a1 1 0 001 1h8a1 1 0 001-1V9.4l1.5.6L20 5.5 15.5 3a3.5 3.5 0 01-7 0z" />
    </svg>
  );
}

function TeamPanel({ team, color, index, baseDelay }) {
  const light = color.name === 'Branco' || color.name === 'Amarelo';
  return (
    <div style={{
      borderRadius: 18, overflow: 'hidden', background: 'var(--card)',
      border: '1px solid var(--line-soft)', boxShadow: 'var(--shadow)',
      animation: 'popIn .4s cubic-bezier(.2,.8,.3,1) both', animationDelay: baseDelay + 'ms',
    }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '12px 14px', background: `linear-gradient(100deg, ${color.glow}, transparent 70%)`, borderBottom: `2px solid ${color.hex}` }}>
        <span style={{ width: 38, height: 38, borderRadius: 11, display: 'grid', placeItems: 'center', background: color.hex, boxShadow: `0 6px 16px -6px ${color.hex}` }}>{jersey(color.ink, 24)}</span>
        <div style={{ flex: 1 }}>
          <div className="font-display font-bold uppercase" style={{ fontSize: 18, lineHeight: 1, color: light ? color.hex : 'var(--text)', letterSpacing: '0.02em' }}>Time {color.name}</div>
          <div className="font-sans font-semibold" style={{ fontSize: 11.5, color: 'var(--faint)', marginTop: 2 }}>{team.players.length} jogadores</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end' }}>
            <Icon name="star" size={14} fill="var(--gold)" stroke="var(--gold)" width={0.6} />
            <span className="font-display font-bold" style={{ fontSize: 20, color: 'var(--text)', lineHeight: 1 }}>{team.totalStars}</span>
          </div>
          <div className="font-sans font-semibold uppercase" style={{ fontSize: 8.5, letterSpacing: '0.1em', color: 'var(--faint)', marginTop: 2 }}>força</div>
        </div>
      </div>
      {/* players */}
      <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
        {team.players.map((p, i) => <MiniPlayerCard key={p.id} player={p} ink={color.hex} index={index + i} />)}
      </div>
    </div>
  );
}

function DrawScreen({ pelada, teams, withPosition, drawKey, onBack, onRedraw, onShare }) {
  let globalIdx = 0;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar title="Sorteio" onBack={onBack}
        right={<button onClick={onShare} aria-label="Compartilhar" style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', color: 'var(--accent)', background: 'var(--accent-soft)' }} className="active:scale-90"><Icon name="share" size={19} /></button>} />

      <div className="noscroll" style={{ flex: 1, overflowY: 'auto', padding: '0 16px 12px' }}>
        {/* hero */}
        <div style={{ marginBottom: 16, animation: 'fadeUp .4s both' }}>
          <div className="font-sans font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: 5 }}>{pelada.name}</div>
          <h1 className="font-display font-bold uppercase" style={{ fontSize: 30, lineHeight: 0.95, color: 'var(--text)' }}>Times Sorteados</h1>
          <div style={{ display: 'flex', gap: 7, marginTop: 11 }}>
            <PrivBadge tone="draw"><Icon name="trophy" size={11} /> {teams.length} times</PrivBadge>
            <PrivBadge tone={withPosition ? 'manage' : 'muted'}>{withPosition ? 'Equilíbrio por posição' : 'Equilíbrio por estrelas'}</PrivBadge>
          </div>
        </div>

        {/* teams */}
        <div key={drawKey} style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {teams.map((t, i) => {
            const startIdx = globalIdx; globalIdx += t.players.length;
            return <TeamPanel key={i} team={t} color={TEAM_COLORS[i]} index={startIdx} baseDelay={i * 90} />;
          })}
        </div>
      </div>

      {/* actions */}
      <div style={{ padding: '12px 16px 14px', borderTop: '1px solid var(--line-soft)', background: 'color-mix(in oklch, var(--surface) 90%, transparent)', backdropFilter: 'blur(12px)', display: 'flex', gap: 10, flexShrink: 0 }}>
        <button onClick={onShare} aria-label="Compartilhar" style={{ width: 56, height: 54, borderRadius: 16, display: 'grid', placeItems: 'center', background: 'var(--card-hi)', border: '1px solid var(--line)', color: 'var(--text)', flexShrink: 0 }} className="active:scale-95 transition"><Icon name="share" size={21} /></button>
        <button onClick={onRedraw} className="flex-1 active:scale-[0.98] transition" style={{ height: 54, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'linear-gradient(120deg, var(--accent), var(--accent-press))', color: 'var(--accent-ink)', boxShadow: '0 14px 30px -12px var(--accent)' }}>
          <Icon name="shuffle" size={21} width={2.2} />
          <span className="font-display font-bold uppercase" style={{ fontSize: 17, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>Refazer Sorteio</span>
        </button>
      </div>
    </div>
  );
}

// ── Share preview ────────────────────────────────────────
function ShareSheet({ open, onClose, pelada, teams, toast }) {
  const date = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  return (
    <Sheet open={open} onClose={onClose} title="Compartilhar times"
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" icon="download" onClick={() => toast('Imagem salva na galeria.')} className="px-4">Salvar</Button>
          <Button full icon="whatsapp" onClick={() => toast('Abrindo WhatsApp…')}>Enviar no WhatsApp</Button>
        </div>
      }>
      {/* exportable graphic preview */}
      <div style={{ borderRadius: 18, padding: 16, background: 'linear-gradient(165deg, #131a26, #0d121b)', border: '1px solid var(--line)', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(420px 180px at 80% -10%, var(--accent-soft), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'var(--accent)' }}><Icon name="ball" size={18} stroke="var(--accent-ink)" width={1.7} /></div>
          <div style={{ flex: 1 }}>
            <div className="font-display font-bold uppercase" style={{ fontSize: 15, color: '#fff', lineHeight: 1 }}>{pelada.name}</div>
            <div className="font-sans font-semibold" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.5)' }}>{date} · {teams.length} times</div>
          </div>
          <div className="font-display font-bold uppercase" style={{ fontSize: 10, color: 'var(--accent)', letterSpacing: '0.06em' }}>PeladaDraft</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: teams.length > 2 ? '1fr 1fr' : '1fr 1fr', gap: 8, marginTop: 14, position: 'relative' }}>
          {teams.map((t, i) => {
            const c = TEAM_COLORS[i];
            return (
              <div key={i} style={{ borderRadius: 11, padding: '9px 10px', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', borderTop: `2px solid ${c.hex}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span className="font-display font-bold uppercase" style={{ fontSize: 12, color: c.hex }}>{c.name}</span>
                  <span className="font-display font-bold" style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>★{t.totalStars}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {t.players.map((p) => {
                    const pc = POSITIONS[p.position];
                    return (
                      <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span className="font-display font-bold uppercase" style={{ fontSize: 8.5, letterSpacing: '0.03em', color: pc.accent, width: 20, flexShrink: 0 }}>{pc.short}</span>
                        <span className="font-sans font-semibold truncate" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.85)', flex: 1, minWidth: 0 }}>{p.name}</span>
                        <span style={{ flexShrink: 0 }}><StarRow stars={p.stars} size={7} gap={1} /></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 14 }}>
        <button onClick={() => toast('Link copiado!')} className="font-sans font-bold" style={{ fontSize: 12.5, color: 'var(--muted)', padding: '9px 14px', borderRadius: 11, background: 'var(--card-hi)', border: '1px solid var(--line-soft)', display: 'flex', alignItems: 'center', gap: 6 }}><Icon name="share" size={15} /> Copiar link</button>
      </div>
    </Sheet>
  );
}

Object.assign(window, { DrawScreen, ShareSheet });
