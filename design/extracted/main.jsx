// app.jsx — root: navigation, state, tabs, tweaks, toast (PeladaDraft)
const { useState: uS, useEffect: uE, useRef: uR } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "teamsQuantity": 2,
  "withPosition": true,
  "light": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [authed, setAuthed] = uS(false);
  const [tab, setTab] = uS('peladas');
  const [view, setView] = uS('list'); // list | pelada | permissions | draw
  const [drawFrom, setDrawFrom] = uS('pelada');
  const [activeId, setActiveId] = uS(null);

  const [peladas, setPeladas] = uS(() => SEED_PELADAS.map((p) => ({ ...p })));
  const [convocados, setConvocados] = uS(() => {
    const m = {}; SEED_PELADAS.forEach((p) => { m[p.id] = p.players.map((x) => x.id); }); return m;
  });

  const [draw, setDraw] = uS(null); // { peladaId, teams, withPosition }
  const [drawKey, setDrawKey] = uS(0);

  const [toast, setToastState] = uS(null);
  const toastTimer = uR(null);
  const fire = (msg, type = 'success') => {
    setToastState({ msg, type });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastState(null), 2800);
  };

  // modals
  const [createOpen, setCreateOpen] = uS(false);
  const [playerModal, setPlayerModal] = uS({ open: false, player: null });
  const [editNameOpen, setEditNameOpen] = uS(false);
  const [deleteOpen, setDeleteOpen] = uS(false);
  const [shareOpen, setShareOpen] = uS(false);

  const active = peladas.find((p) => p.id === activeId) || null;

  // ── helpers ──
  const updatePelada = (id, fn) => setPeladas((ps) => ps.map((p) => (p.id === id ? fn(p) : p)));

  const runDraw = (pelada) => {
    const ids = convocados[pelada.id] || [];
    const players = pelada.players.filter((p) => ids.includes(p.id));
    const k = Math.max(2, Math.min(t.teamsQuantity, players.length, 6));
    const teams = drawTeams(players, k, t.withPosition);
    setDraw({ peladaId: pelada.id, teams, withPosition: t.withPosition });
    setDrawKey((x) => x + 1);
  };

  // live re-draw when teams/balance tweaks change while viewing a draw
  uE(() => {
    if (view === 'draw' && active) runDraw(active);
    // eslint-disable-next-line
  }, [t.teamsQuantity, t.withPosition]);

  // ── navigation ──
  const goManage = (id) => { setActiveId(id); setView('pelada'); };
  const goDraw = (from) => { if (active) { runDraw(active); setDrawFrom(from); setView('draw'); } };
  const switchTab = (k) => { setTab(k); if (k === 'peladas') setView('list'); };

  // ── convocados ──
  const toggleConv = (pid) => setConvocados((m) => {
    const cur = m[activeId] || [];
    return { ...m, [activeId]: cur.includes(pid) ? cur.filter((x) => x !== pid) : [...cur, pid] };
  });
  const selectAll = () => setConvocados((m) => ({ ...m, [activeId]: active.players.map((p) => p.id) }));
  const clearConv = () => setConvocados((m) => ({ ...m, [activeId]: [] }));

  // ── CRUD ──
  const createPelada = (name) => {
    const id = 'pel' + Date.now();
    const np = { id, name, ownerUsername: CURRENT_USER.username, privileges: ['MANAGE_PLAYERS', 'DRAW_TEAMS'], isOwner: true, players: [], members: [{ username: CURRENT_USER.username, email: CURRENT_USER.email, owner: true, privileges: ['MANAGE_PLAYERS', 'DRAW_TEAMS'] }] };
    setPeladas((ps) => [np, ...ps]);
    setConvocados((m) => ({ ...m, [id]: [] }));
    setCreateOpen(false);
    fire('Pelada criada com sucesso.');
  };

  const savePlayer = ({ id, name, stars, position }) => {
    if (id) {
      updatePelada(activeId, (p) => ({ ...p, players: p.players.map((pl) => (pl.id === id ? { ...pl, name, stars, position } : pl)) }));
      fire('Jogador atualizado.');
    } else {
      const nid = 'np' + Date.now();
      updatePelada(activeId, (p) => ({ ...p, players: [...p.players, { id: nid, name, stars, position }] }));
      setConvocados((m) => ({ ...m, [activeId]: [...(m[activeId] || []), nid] }));
      fire('Jogador adicionado.');
    }
    setPlayerModal({ open: false, player: null });
  };
  const deletePlayer = (id) => {
    updatePelada(activeId, (p) => ({ ...p, players: p.players.filter((pl) => pl.id !== id) }));
    setConvocados((m) => ({ ...m, [activeId]: (m[activeId] || []).filter((x) => x !== id) }));
    setPlayerModal({ open: false, player: null });
    fire('Jogador removido.');
  };
  const saveName = (name) => { updatePelada(activeId, (p) => ({ ...p, name })); setEditNameOpen(false); fire('Nome atualizado.'); };
  const confirmDelete = () => { const nm = active.name; setPeladas((ps) => ps.filter((p) => p.id !== activeId)); setDeleteOpen(false); setView('list'); setTab('peladas'); fire(`"${nm}" foi excluída.`); };

  const commitPerms = (username, privs, action) => {
    if (!privs.length) {
      // no permission = no access → user is removed from the pelada
      updatePelada(activeId, (p) => ({ ...p, members: p.members.filter((m) => m.username !== username) }));
      fire('Acesso removido.');
      return;
    }
    updatePelada(activeId, (p) => ({
      ...p, members: p.members.map((m) => m.username === username ? { ...m, privileges: privs } : m),
    }));
    fire('Permissão atualizada.');
  };
  const assignPriv = (ident, priv) => {
    const grant = priv === 'ALL' ? ['MANAGE_PLAYERS', 'DRAW_TEAMS'] : [priv];
    updatePelada(activeId, (p) => {
      const exists = p.members.find((m) => m.username === ident || m.email === ident);
      if (exists) return { ...p, members: p.members.map((m) => m === exists ? { ...m, privileges: [...new Set([...m.privileges, ...grant])] } : m) };
      return { ...p, members: [...p.members, { username: ident.replace(/@.*/, ''), email: ident.includes('@') ? ident : ident + '@email.com', owner: false, privileges: grant }] };
    });
    fire('Acesso concedido.');
  };

  // ── render screen ──
  let screen = null;
  if (!authed) {
    screen = <AuthScreen onLogin={() => { setAuthed(true); setTab('peladas'); setView('list'); }} toast={fire} />;
  } else if (tab === 'peladas' && view === 'list') {
    screen = <PeladaListScreen peladas={peladas} onManage={goManage} onCreate={() => setCreateOpen(true)} toast={fire} />;
  } else if (tab === 'peladas' && view === 'pelada' && active) {
    screen = <PeladaViewScreen
      pelada={active} convocados={convocados[active.id] || []}
      onToggle={toggleConv} onSelectAll={selectAll} onClear={clearConv}
      onBack={() => setView('list')} onDraw={() => goDraw('pelada')}
      onAddPlayer={() => setPlayerModal({ open: true, player: null })}
      onEditPlayer={(pl) => setPlayerModal({ open: true, player: pl })}
      onEditName={() => setEditNameOpen(true)} onPermissions={() => setView('permissions')}
      onDelete={() => setDeleteOpen(true)} toast={fire}
      teamsQuantity={t.teamsQuantity} onTeams={(v) => setTweak('teamsQuantity', v)}
      withPosition={t.withPosition} onWithPosition={(v) => setTweak('withPosition', v)} />;
  } else if (tab === 'peladas' && view === 'permissions' && active) {
    screen = <PermissionsScreen pelada={active} onBack={() => setView('pelada')} onCommit={commitPerms} onAssign={assignPriv} toast={fire} />;
  } else if (tab === 'peladas' && view === 'draw' && active && draw) {
    screen = <DrawScreen pelada={active} teams={draw.teams} withPosition={draw.withPosition} drawKey={drawKey}
      onBack={() => setView(drawFrom)} onRedraw={() => runDraw(active)} onShare={() => setShareOpen(true)} />;
  } else if (tab === 'sorteios') {
    screen = <SorteiosTab draw={draw} peladas={peladas} onOpen={() => { setActiveId(draw.peladaId); setTab('peladas'); setDrawFrom('list'); setView('draw'); }} onGo={() => switchTab('peladas')} />;
  } else if (tab === 'perfil') {
    screen = <PerfilTab peladas={peladas} light={t.light} onTheme={(v) => setTweak('light', v)} onLogout={() => { setAuthed(false); }} toast={fire} />;
  }

  const showTabs = authed && (view === 'list' && tab === 'peladas' || tab === 'sorteios' || tab === 'perfil');
  const activeTab = tab;

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <PhoneFrame light={t.light}>
        <Toast toast={toast} onClose={() => setToastState(null)} />
        {screen}
        {showTabs && <BottomTabBar active={activeTab} onChange={switchTab} />}
        {/* gesture pill */}
        <div style={{ height: 22, display: 'grid', placeItems: 'center', flexShrink: 0 }}>
          <span style={{ width: 110, height: 4, borderRadius: 3, background: 'var(--line)' }} />
        </div>

        {/* modals (inside phone) */}
        <CreatePeladaSheet open={createOpen} onClose={() => setCreateOpen(false)} onCreate={createPelada} toast={fire} />
        <PlayerModal open={playerModal.open} player={playerModal.player} onClose={() => setPlayerModal({ open: false, player: null })} onSave={savePlayer} onDelete={deletePlayer} />
        <EditNameSheet open={editNameOpen} pelada={active} onClose={() => setEditNameOpen(false)} onSave={saveName} toast={fire} />
        <DeleteSheet open={deleteOpen} pelada={active} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} />
        {draw && active && <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} pelada={active} teams={draw.teams} toast={fire} />}
      </PhoneFrame>

      <TweaksPanel>
        <TweakSection label="Sorteio" />
        <TweakSlider label="Quantidade de times" value={t.teamsQuantity} min={2} max={6} step={1} onChange={(v) => setTweak('teamsQuantity', v)} />
        <TweakToggle label="Equilibrar por posição" value={t.withPosition} onChange={(v) => setTweak('withPosition', v)} />
        <TweakSection label="Aparência" />
        <TweakToggle label="Tema claro" value={t.light} onChange={(v) => setTweak('light', v)} />
      </TweaksPanel>
    </div>
  );
}

// ── Sorteios tab ──
function SorteiosTab({ draw, peladas, onOpen, onGo }) {
  return (
    <div className="noscroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <ScreenHeader subtitle="Histórico" title="Sorteios" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px 40px', textAlign: 'center' }}>
        {/* construction emblem */}
        <div style={{ position: 'relative', width: 116, height: 116, marginBottom: 26 }}>
          <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: 'var(--accent-soft)', animation: 'pulseRing 2.4s ease-in-out infinite' }} />
          <div style={{ position: 'absolute', inset: 14, borderRadius: 24, display: 'grid', placeItems: 'center', background: 'linear-gradient(155deg, var(--card-hi), var(--card))', border: '1px solid var(--line)' }}>
            <Icon name="tools" size={46} stroke="var(--accent)" width={1.7} />
          </div>
          {/* corner cone badge */}
          <div style={{ position: 'absolute', right: -4, bottom: -4, width: 38, height: 38, borderRadius: 12, display: 'grid', placeItems: 'center', background: 'var(--gold)', border: '3px solid var(--bg)' }}>
            <Icon name="cone" size={20} stroke="oklch(0.2 0.05 90)" width={2} />
          </div>
        </div>

        <span className="font-sans font-bold uppercase" style={{ fontSize: 10.5, letterSpacing: '0.16em', color: 'var(--accent)', marginBottom: 10 }}>Em breve</span>
        <h2 className="font-display font-bold uppercase" style={{ fontSize: 26, lineHeight: 1, color: 'var(--text)' }}>Histórico em construção</h2>
        <p className="font-sans" style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.55, margin: '12px auto 24px', maxWidth: 280 }}>
          O histórico de sorteios ainda está sendo desenvolvido. Em breve você poderá revisar e compartilhar todos os times já sorteados aqui.
        </p>

        {/* progress hint */}
        <div style={{ width: '100%', maxWidth: 260, marginBottom: 26 }}>
          <div style={{ height: 6, borderRadius: 4, background: 'var(--card-hi)', overflow: 'hidden' }}>
            <div style={{ width: '62%', height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, var(--accent), var(--accent-press))' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
            <span className="font-sans font-semibold" style={{ fontSize: 11, color: 'var(--faint)' }}>Desenvolvimento</span>
            <span className="font-sans font-bold" style={{ fontSize: 11, color: 'var(--muted)' }}>62%</span>
          </div>
        </div>

        <Button variant="secondary" icon="shuffle" onClick={onGo} className="px-5">Ir para uma pelada</Button>
      </div>
    </div>
  );
}

// ── Perfil tab ──
function PerfilTab({ peladas, light, onTheme, onLogout, toast }) {
  const owned = peladas.filter((p) => p.isOwner).length;
  const totalPlayers = peladas.reduce((s, p) => s + p.players.length, 0);
  return (
    <div className="noscroll" style={{ flex: 1, overflowY: 'auto' }}>
      <ScreenHeader subtitle="Conta" title="Perfil" />
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, borderRadius: 18, padding: 16, background: 'linear-gradient(160deg, var(--card-hi), var(--card))', border: '1px solid var(--line-soft)', boxShadow: 'var(--shadow)' }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, display: 'grid', placeItems: 'center', background: 'linear-gradient(150deg, var(--accent), var(--accent-press))', color: 'var(--accent-ink)' }}><span className="font-display font-bold" style={{ fontSize: 24 }}>{CURRENT_USER.username.slice(0, 2).toUpperCase()}</span></div>
          <div style={{ minWidth: 0 }}>
            <div className="font-display font-semibold uppercase" style={{ fontSize: 20, color: 'var(--text)' }}>@{CURRENT_USER.username}</div>
            <div className="font-sans" style={{ fontSize: 12.5, color: 'var(--faint)' }}>{CURRENT_USER.email}</div>
          </div>
        </div>

        {/* theme */}
        <div style={{ marginTop: 12, borderRadius: 16, padding: 14, background: 'var(--card)', border: '1px solid var(--line-soft)' }}>
          <div className="font-display font-semibold uppercase" style={{ fontSize: 13, color: 'var(--text)', marginBottom: 11 }}>Tema</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[['Escuro', false], ['Claro', true]].map(([lbl, val]) => (
              <button key={lbl} onClick={() => onTheme(val)} className="font-sans font-bold transition" style={{ flex: 1, height: 42, borderRadius: 11, fontSize: 13.5, background: light === val ? 'var(--accent)' : 'var(--card-hi)', color: light === val ? 'var(--accent-ink)' : 'var(--muted)', border: '1px solid ' + (light === val ? 'transparent' : 'var(--line-soft)') }}>{lbl}</button>
            ))}
          </div>
        </div>

        {/* menu */}
        <div style={{ marginTop: 12, borderRadius: 16, background: 'var(--card)', border: '1px solid var(--line-soft)', overflow: 'hidden' }}>
          {[['gear', 'Configurações da conta'], ['shield', 'Privacidade e segurança'], ['ball', 'Sobre o PeladaDraft']].map(([ic, lbl], i) => (
            <button key={lbl} onClick={() => toast('Em breve.')} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 13, padding: '14px 15px', borderTop: i ? '1px solid var(--line-soft)' : 'none', color: 'var(--text)' }} className="active:bg-black/10 text-left">
              <Icon name={ic} size={19} stroke="var(--muted)" />
              <span className="font-sans font-semibold" style={{ fontSize: 14, flex: 1 }}>{lbl}</span>
              <Icon name="chevron" size={17} stroke="var(--faint)" />
            </button>
          ))}
        </div>

        <button onClick={onLogout} style={{ width: '100%', marginTop: 14, marginBottom: 8, height: 50, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, background: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid color-mix(in oklch, var(--danger) 35%, transparent)' }} className="active:scale-[0.98] transition">
          <Icon name="logout" size={19} />
          <span className="font-sans font-bold" style={{ fontSize: 14.5 }}>Sair da conta</span>
        </button>
      </div>
    </div>
  );
}

window.App = App;
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
