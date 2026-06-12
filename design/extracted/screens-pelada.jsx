// screens-pelada.jsx — Visão da Pelada (gerenciamento), modais, permissões
const { useState: useStateV, useEffect: useEffectV } = React;

function permsOf(pelada) {
  return {
    owner: pelada.isOwner,
    manage: pelada.isOwner || pelada.privileges.includes('MANAGE_PLAYERS'),
    draw: pelada.isOwner || pelada.privileges.includes('DRAW_TEAMS'),
  };
}

// ── top bar with back ────────────────────────────────────
function TopBar({ title, onBack, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 12px 12px', flexShrink: 0 }}>
      <button onClick={onBack} aria-label="Voltar" style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', color: 'var(--text)', background: 'var(--card-hi)', border: '1px solid var(--line-soft)' }} className="active:scale-90 transition"><Icon name="back" size={20} /></button>
      <h1 className="font-display font-semibold uppercase truncate" style={{ fontSize: 20, color: 'var(--text)', flex: 1, lineHeight: 1.1 }}>{title}</h1>
      {right}
    </div>
  );
}

// ── action tile ──────────────────────────────────────────
function ActionTile({ icon, label, onClick, locked, danger }) {
  return (
    <button onClick={onClick} style={{
      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 6px', borderRadius: 14,
      background: 'var(--card)', border: '1px solid var(--line-soft)', position: 'relative',
      color: danger ? 'var(--danger)' : 'var(--muted)', opacity: locked ? 0.55 : 1,
    }} className="active:scale-95 transition">
      <Icon name={locked ? 'lock' : icon} size={20} width={2} />
      <span className="font-sans font-bold" style={{ fontSize: 11, color: danger ? 'var(--danger)' : 'var(--text)' }}>{label}</span>
    </button>
  );
}

// ── Pelada view ──────────────────────────────────────────
function Stepper({ value, min, max, onChange }) {
  const btn = (lbl, fn, disabled) => (
    <button onClick={fn} disabled={disabled} style={{ width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'var(--card-hi)', color: 'var(--text)', border: '1px solid var(--line)', opacity: disabled ? 0.4 : 1 }} className="active:scale-90 font-display font-bold text-lg">{lbl}</button>
  );
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {btn('–', () => onChange(Math.max(min, value - 1)), value <= min)}
      <span className="font-display font-bold" style={{ fontSize: 18, color: 'var(--text)', width: 16, textAlign: 'center' }}>{value}</span>
      {btn('+', () => onChange(Math.min(max, value + 1)), value >= max)}
    </div>
  );
}

function PeladaViewScreen({ pelada, convocados, onToggle, onSelectAll, onClear, onBack, onDraw, onAddPlayer, onEditPlayer, onEditName, onPermissions, onDelete, toast, teamsQuantity, onTeams, withPosition, onWithPosition }) {
  const can = permsOf(pelada);
  const count = convocados.length;
  const lockedDraw = !can.draw;

  const lockMsg = () => toast('Apenas o dono da pelada pode fazer isso.', 'error');

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar title={pelada.name} onBack={onBack} />

      <div className="noscroll" style={{ flex: 1, overflowY: 'auto', padding: '0 16px' }}>
        {/* detail / permission card */}
        <div style={{ borderRadius: 18, padding: 16, background: 'linear-gradient(160deg, var(--card-hi), var(--card))', border: '1px solid var(--line-soft)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="user" size={13} stroke="var(--faint)" />
            <span className="font-sans font-semibold" style={{ fontSize: 12.5, color: 'var(--muted)' }}>Organizada por @{pelada.ownerUsername}{can.owner && ' · você'}</span>
          </div>
          <div style={{ display: 'flex', gap: 28, marginTop: 14 }}>
            {[['Jogadores', pelada.players.length], ['Convocados', count]].map(([l, v]) => (
              <div key={l}>
                <div className="font-display font-bold" style={{ fontSize: 24, color: 'var(--text)', lineHeight: 1 }}>{v}</div>
                <div className="font-sans font-semibold uppercase" style={{ fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--faint)', marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
          {/* your permissions */}
          <div style={{ marginTop: 15, paddingTop: 14, borderTop: '1px solid var(--line-soft)' }}>
            <div className="font-sans font-bold uppercase" style={{ fontSize: 9.5, letterSpacing: '0.12em', color: 'var(--faint)', marginBottom: 8 }}>Suas permissões</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{privBadges(pelada)}</div>
          </div>
        </div>

        {/* owner actions */}
        <div style={{ display: 'flex', gap: 9, marginTop: 12 }}>
          <ActionTile icon="pencil" label="Editar nome" locked={!can.owner} onClick={can.owner ? onEditName : lockMsg} />
          <ActionTile icon="shield" label="Permissões" locked={!can.owner} onClick={can.owner ? onPermissions : lockMsg} />
          <ActionTile icon="trash" label="Excluir" danger={can.owner} locked={!can.owner} onClick={can.owner ? onDelete : lockMsg} />
        </div>

        {/* convocados header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '22px 0 12px' }}>
          <div>
            <h2 className="font-display font-semibold uppercase" style={{ fontSize: 17, color: 'var(--text)', lineHeight: 1 }}>Convocados</h2>
            <span className="font-sans" style={{ fontSize: 12, color: 'var(--faint)' }}>{count} de {pelada.players.length} selecionados</span>
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <button onClick={count === pelada.players.length ? onClear : onSelectAll} className="font-sans font-bold" style={{ fontSize: 12, color: 'var(--accent)', padding: '7px 11px', borderRadius: 10, background: 'var(--accent-soft)' }}>
              {count === pelada.players.length ? 'Limpar' : 'Todos'}
            </button>
            {can.manage && (
              <button onClick={onAddPlayer} aria-label="Adicionar jogador" style={{ width: 34, height: 34, borderRadius: 10, display: 'grid', placeItems: 'center', background: 'var(--card-hi)', border: '1px solid var(--line-soft)', color: 'var(--text)' }} className="active:scale-90"><Icon name="plus" size={18} width={2.3} /></button>
            )}
          </div>
        </div>

        {/* player cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
          {pelada.players.map((pl) => {
            const sel = convocados.includes(pl.id);
            return (
              <div key={pl.id} style={{ position: 'relative' }}>
                <PlayerCard player={pl} selectable selected={sel} onToggle={() => onToggle(pl.id)} dim={count > 0} />
                {can.manage && (
                  <button onClick={(e) => { e.stopPropagation(); onEditPlayer(pl); }} aria-label="Editar jogador" style={{
                    position: 'absolute', bottom: 10, right: 10, width: 30, height: 30, borderRadius: 9, display: 'grid', placeItems: 'center',
                    background: 'var(--surface)', border: '1px solid var(--line)', color: 'var(--muted)', zIndex: 2,
                  }} className="active:scale-90"><Icon name="pencil" size={14} /></button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* sticky draw bar */}
      <div style={{ padding: '11px 16px 14px', borderTop: '1px solid var(--line-soft)', background: 'color-mix(in oklch, var(--surface) 90%, transparent)', backdropFilter: 'blur(12px)', flexShrink: 0 }}>
        {/* quick draw controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 11 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
            <span className="font-sans font-bold uppercase" style={{ fontSize: 10.5, letterSpacing: '0.08em', color: 'var(--faint)' }}>Times</span>
            <Stepper value={teamsQuantity} min={2} max={6} onChange={onTeams} />
          </div>
          <button onClick={() => onWithPosition(!withPosition)} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 10px', borderRadius: 10, background: withPosition ? 'var(--accent-soft)' : 'var(--card-hi)', border: '1px solid ' + (withPosition ? 'transparent' : 'var(--line-soft)') }} className="active:scale-95 transition">
            <span style={{ width: 16, height: 16, borderRadius: 5, display: 'grid', placeItems: 'center', background: withPosition ? 'var(--accent)' : 'transparent', border: '1.5px solid ' + (withPosition ? 'var(--accent)' : 'var(--line)'), color: 'var(--accent-ink)' }}>{withPosition && <Icon name="check" size={11} width={3} />}</span>
            <span className="font-sans font-bold" style={{ fontSize: 12, color: withPosition ? 'var(--accent)' : 'var(--muted)' }}>Equilibrar posição</span>
          </button>
        </div>
        <button
          onClick={() => { if (lockedDraw) return lockMsg(); if (count < 2) return toast('Selecione ao menos 2 jogadores.', 'error'); onDraw(); }}
          className="w-full active:scale-[0.98] transition"
          style={{
            position: 'relative',
            height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            background: lockedDraw ? 'var(--card-hi)' : 'linear-gradient(120deg, var(--accent), var(--accent-press))',
            color: lockedDraw ? 'var(--faint)' : 'var(--accent-ink)',
            border: lockedDraw ? '1px solid var(--line)' : 'none',
            boxShadow: lockedDraw ? 'none' : '0 14px 30px -12px var(--accent)',
          }}>
          <Icon name={lockedDraw ? 'lock' : 'shuffle'} size={22} width={2.2} />
          <span className="font-display font-bold uppercase" style={{ fontSize: 17, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{lockedDraw ? 'Sem permissão' : 'Realizar Sorteio'}</span>
          {!lockedDraw && <span className="font-sans font-bold" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, background: 'rgba(0,0,0,0.2)', minWidth: 26, textAlign: 'center', padding: '3px 8px', borderRadius: 20 }}>{count}</span>}
        </button>
      </div>
    </div>
  );
}

// ── Player add/edit modal ────────────────────────────────
const POS_LIST = ['ZAGA', 'MEIO', 'ATAQUE', 'GERAL'];
function PlayerModal({ open, player, onClose, onSave, onDelete }) {
  const editing = !!player;
  const [name, setName] = useStateV('');
  const [stars, setStars] = useStateV(5);
  const [position, setPosition] = useStateV('MEIO');
  useEffectV(() => {
    if (open) { setName(player?.name || ''); setStars(player?.stars ?? 5); setPosition(player?.position || 'MEIO'); }
  }, [open, player]);

  const save = () => {
    if (name.trim().length < 2) return;
    onSave({ id: player?.id, name: name.trim(), stars, position });
  };

  return (
    <Sheet open={open} onClose={onClose} title={editing ? 'Editar jogador' : 'Novo jogador'}
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          {editing && <Button variant="danger" icon="trash" onClick={() => onDelete(player.id)} className="px-4">Remover</Button>}
          <Button full icon="check" onClick={save}>{editing ? 'Salvar' : 'Adicionar'}</Button>
        </div>
      }>
      <Field label="Nome do jogador"><TextInput icon="user" value={name} onChange={setName} placeholder="Ex.: Léo Andrade" maxLength={40} /></Field>

      <Field label="Posição">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 7 }}>
          {POS_LIST.map((k) => {
            const on = position === k; const pc = POSITIONS[k];
            return (
              <button key={k} onClick={() => setPosition(k)} className="font-display font-semibold uppercase transition active:scale-95" style={{
                height: 46, borderRadius: 12, fontSize: 12, letterSpacing: '0.03em',
                background: on ? 'color-mix(in oklch, ' + pc.accent + ' 18%, transparent)' : 'var(--card)',
                color: on ? pc.accent : 'var(--muted)',
                border: '1px solid ' + (on ? pc.accent : 'var(--line-soft)'),
              }}>{pc.short}</button>
            );
          })}
        </div>
      </Field>

      <Field label={`Estrelas · ${stars}/10`}>
        <div style={{ background: 'var(--card)', border: '1px solid var(--line-soft)', borderRadius: 13, padding: '14px 14px 10px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><StarRow stars={stars} size={26} gap={5} /></div>
          <input type="range" min="0" max="10" step="1" value={stars} onChange={(e) => setStars(+e.target.value)}
            style={{ width: '100%', accentColor: 'var(--accent)' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
            <span style={{ fontSize: 10.5, color: 'var(--faint)' }}>0</span>
            <span style={{ fontSize: 10.5, color: 'var(--faint)' }}>10</span>
          </div>
        </div>
      </Field>
    </Sheet>
  );
}

// ── Edit name ────────────────────────────────────────────
function EditNameSheet({ open, pelada, onClose, onSave, toast }) {
  const [name, setName] = useStateV('');
  useEffectV(() => { if (open) setName(pelada?.name || ''); }, [open, pelada]);
  return (
    <Sheet open={open} onClose={onClose} title="Editar nome"
      footer={<Button full icon="check" onClick={() => { if (name.trim().length < 3) return toast('Mínimo 3 caracteres.', 'error'); onSave(name.trim()); }}>Salvar</Button>}>
      <Field label="Nome da pelada" hint="Entre 3 e 30 caracteres"><TextInput icon="ball" value={name} onChange={setName} maxLength={30} /></Field>
    </Sheet>
  );
}

// ── Delete confirm ───────────────────────────────────────
function DeleteSheet({ open, pelada, onClose, onConfirm }) {
  return (
    <Sheet open={open} onClose={onClose} title="Excluir pelada"
      footer={
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="secondary" full onClick={onClose}>Cancelar</Button>
          <Button variant="danger" full icon="trash" onClick={onConfirm}>Excluir</Button>
        </div>
      }>
      <div style={{ textAlign: 'center', padding: '6px 0 4px' }}>
        <div style={{ width: 58, height: 58, borderRadius: 18, margin: '0 auto 14px', display: 'grid', placeItems: 'center', background: 'var(--danger-soft)', color: 'var(--danger)' }}><Icon name="trash" size={26} /></div>
        <p className="font-sans" style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.5 }}>
          Tem certeza que deseja excluir <strong className="font-display uppercase" style={{ color: 'var(--text)' }}>{pelada?.name}</strong>? Todos os jogadores e dados serão perdidos. Esta ação não pode ser desfeita.
        </p>
      </div>
    </Sheet>
  );
}

// ── Permissions screen ───────────────────────────────────
function PermToggle({ on, onClick, accent }) {
  return (
    <button onClick={onClick} style={{ width: 44, height: 26, borderRadius: 20, padding: 3, background: on ? accent : 'var(--line)', transition: 'all .18s', flexShrink: 0 }}>
      <span style={{ display: 'block', width: 20, height: 20, borderRadius: '50%', background: '#fff', transform: on ? 'translateX(18px)' : 'none', transition: 'transform .18s', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }} />
    </button>
  );
}

function PermissionsScreen({ pelada, onBack, onCommit, onAssign, toast }) {
  const [ident, setIdent] = useStateV('');
  const [priv, setPriv] = useStateV('DRAW_TEAMS');
  const [pending, setPending] = useStateV({}); // username -> { manage, draw }

  const baseOf = (m) => ({ manage: m.privileges.includes('MANAGE_PLAYERS'), draw: m.privileges.includes('DRAW_TEAMS') });
  const stateOf = (m) => pending[m.username] || baseOf(m);
  const changed = (m) => { const s = pending[m.username]; if (!s) return false; const b = baseOf(m); return s.manage !== b.manage || s.draw !== b.draw; };
  const toggle = (m, key) => setPending((prev) => { const cur = prev[m.username] || baseOf(m); return { ...prev, [m.username]: { ...cur, [key]: !cur[key] } }; });
  const confirm = (m) => {
    const s = stateOf(m); const privs = [];
    if (s.manage) privs.push('MANAGE_PLAYERS');
    if (s.draw) privs.push('DRAW_TEAMS');
    // ALL when both granted
    onCommit(m.username, privs, privs.length === 2 ? 'ALL' : (privs[0] || 'NONE'));
    const np = { ...pending }; delete np[m.username]; setPending(np);
  };
  const cancel = (m) => { const np = { ...pending }; delete np[m.username]; setPending(np); };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <TopBar title="Permissões" onBack={onBack} />
      <div className="noscroll" style={{ flex: 1, overflowY: 'auto', padding: '0 16px 16px' }}>
        <p className="font-sans" style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>
          Conceda a usuários o poder de <strong style={{ color: 'oklch(0.80 0.12 178)' }}>gerenciar jogadores</strong>, <strong style={{ color: 'var(--accent)' }}>realizar sorteios</strong> ou <strong style={{ color: 'var(--gold)' }}>tudo</strong>. Sem permissão, não há acesso à pelada.
        </p>

        {/* grant new */}
        <div style={{ borderRadius: 16, padding: 14, background: 'var(--card)', border: '1px solid var(--line-soft)', marginBottom: 18 }}>
          <div className="font-display font-semibold uppercase" style={{ fontSize: 14, color: 'var(--text)', marginBottom: 12 }}>Conceder permissão</div>
          <TextInput icon="user" value={ident} onChange={setIdent} placeholder="username ou e-mail" />
          <div style={{ display: 'flex', gap: 7, margin: '10px 0' }}>
            {[['DRAW_TEAMS', 'Sortear'], ['MANAGE_PLAYERS', 'Gerenciar'], ['ALL', 'Todas']].map(([k, l]) => (
              <button key={k} onClick={() => setPriv(k)} className="font-sans font-bold transition" style={{ flex: 1, height: 40, borderRadius: 10, fontSize: 12.5, background: priv === k ? (k === 'ALL' ? 'var(--gold)' : 'var(--accent)') : 'var(--card-hi)', color: priv === k ? (k === 'ALL' ? 'oklch(0.2 0.05 90)' : 'var(--accent-ink)') : 'var(--muted)', border: '1px solid ' + (priv === k ? 'transparent' : 'var(--line-soft)') }}>{l}</button>
            ))}
          </div>
          <Button full icon="plus" onClick={() => { if (!ident.trim()) return toast('Informe um username ou e-mail.', 'error'); onAssign(ident.trim(), priv); setIdent(''); }}>Conceder acesso</Button>
        </div>

        {/* member list */}
        <div className="font-sans font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--faint)', marginBottom: 10 }}>Usuários com acesso · {pelada.members.length}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {pelada.members.map((m) => {
            const s = stateOf(m); const isChanged = changed(m);
            return (
              <div key={m.username} style={{ borderRadius: 15, padding: 13, background: 'var(--card)', border: '1px solid ' + (isChanged ? 'color-mix(in oklch, var(--accent) 45%, var(--line-soft))' : 'var(--line-soft)') }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'var(--card-hi)', color: 'var(--accent)', flexShrink: 0 }}><span className="font-display font-semibold" style={{ fontSize: 15 }}>{m.username.slice(0, 2).toUpperCase()}</span></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="font-sans font-bold truncate" style={{ fontSize: 14, color: 'var(--text)' }}>@{m.username}</div>
                    <div className="font-sans truncate" style={{ fontSize: 11.5, color: 'var(--faint)' }}>{m.email}</div>
                  </div>
                  {m.owner && <PrivBadge tone="owner"><Icon name="crown" size={11} width={2.4} /> Dono</PrivBadge>}
                  {!m.owner && m.privileges.includes('MANAGE_PLAYERS') && m.privileges.includes('DRAW_TEAMS') && <PrivBadge tone="owner">ALL</PrivBadge>}
                </div>
                {!m.owner && (
                  <div style={{ marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--line-soft)', display: 'flex', flexDirection: 'column', gap: 9 }}>
                    {[['manage', 'Gerenciar jogadores', 'oklch(0.78 0.12 178)'], ['draw', 'Realizar sorteios', 'var(--accent)']].map(([key, l, c]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="font-sans font-semibold" style={{ fontSize: 13, color: 'var(--muted)' }}>{l}</span>
                        <PermToggle key={key + (s[key] ? '-on' : '-off')} on={s[key]} accent={c} onClick={() => toggle(m, key)} />
                      </div>
                    ))}
                    {isChanged && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 3, animation: 'fadeUp .2s both' }}>
                        <Button variant="secondary" size="sm" onClick={() => cancel(m)} className="flex-1">Cancelar</Button>
                        {!s.manage && !s.draw
                          ? <Button variant="danger" size="sm" icon="trash" onClick={() => confirm(m)} className="flex-1">Remover acesso</Button>
                          : <Button size="sm" icon="check" onClick={() => confirm(m)} className="flex-1">Confirmar</Button>}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { permsOf, TopBar, PeladaViewScreen, PlayerModal, EditNameSheet, DeleteSheet, PermissionsScreen });
