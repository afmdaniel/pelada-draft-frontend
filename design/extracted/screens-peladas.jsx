// screens-peladas.jsx — Lista de Peladas, criar pelada, empty state
const { useState: useStateP } = React;

function ScreenHeader({ title, subtitle, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '6px 20px 16px' }}>
      <div>
        {subtitle && <div className="font-sans font-bold uppercase" style={{ fontSize: 11, letterSpacing: '0.14em', color: 'var(--accent)', marginBottom: 4 }}>{subtitle}</div>}
        <h1 className="font-display font-bold uppercase" style={{ fontSize: 27, lineHeight: 1, color: 'var(--text)' }}>{title}</h1>
      </div>
      {right}
    </div>
  );
}

function PrivBadge({ children, tone = 'muted' }) {
  const tones = {
    owner: { bg: 'color-mix(in oklch, var(--gold) 18%, transparent)', fg: 'var(--gold)' },
    draw: { bg: 'var(--accent-soft)', fg: 'var(--accent)' },
    manage: { bg: 'color-mix(in oklch, oklch(0.78 0.12 178) 16%, transparent)', fg: 'oklch(0.80 0.12 178)' },
    muted: { bg: 'var(--card-hi)', fg: 'var(--faint)' },
  };
  const t = tones[tone];
  return (
    <span className="font-sans font-bold" style={{ fontSize: 10.5, padding: '3px 8px', borderRadius: 7, background: t.bg, color: t.fg, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>{children}</span>
  );
}

function privBadges(pelada) {
  if (pelada.isOwner) return [<PrivBadge key="o" tone="owner"><Icon name="crown" size={11} width={2.4} /> Dono</PrivBadge>];
  const out = [];
  if (pelada.privileges.includes('MANAGE_PLAYERS') && pelada.privileges.includes('DRAW_TEAMS')) return [<PrivBadge key="all" tone="owner">ALL</PrivBadge>];
  if (pelada.privileges.includes('MANAGE_PLAYERS')) out.push(<PrivBadge key="m" tone="manage">Gerenciar</PrivBadge>);
  if (pelada.privileges.includes('DRAW_TEAMS')) out.push(<PrivBadge key="d" tone="draw">Sortear</PrivBadge>);
  return out;
}

function PeladaCard({ pelada, onManage, index }) {
  return (
    <div style={{
      borderRadius: 18, padding: 16, background: 'var(--card)', border: '1px solid var(--line-soft)',
      boxShadow: 'var(--shadow)', animation: `fadeUp .4s both`, animationDelay: (index * 60) + 'ms',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <h3 className="font-display font-semibold uppercase truncate" style={{ fontSize: 19, color: 'var(--text)', lineHeight: 1.05 }}>{pelada.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5 }}>
            <Icon name="user" size={13} stroke="var(--faint)" />
            <span className="font-sans font-semibold" style={{ fontSize: 12.5, color: 'var(--muted)' }}>@{pelada.ownerUsername}{pelada.isOwner && ' · você'}</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'flex-end' }}>{privBadges(pelada)}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 15 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon name="users" size={16} stroke="var(--muted)" />
            <span className="font-display font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>{pelada.players.length}</span>
            <span className="font-sans" style={{ fontSize: 12, color: 'var(--faint)' }}>jogadores</span>
          </span>
        </div>
        <Button size="sm" variant="primary" icon="chevron" onClick={() => onManage(pelada.id)} className="flex-row-reverse pl-3 pr-2">Gerenciar</Button>
      </div>
    </div>
  );
}

function EmptyState({ onCreate }) {
  return (
    <div style={{
      borderRadius: 18, padding: '30px 22px', textAlign: 'center',
      background: 'repeating-linear-gradient(135deg, var(--card) 0 12px, transparent 12px 24px), var(--surface)',
      border: '1px dashed var(--line)',
    }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, margin: '0 auto 14px', display: 'grid', placeItems: 'center', background: 'var(--card-hi)', border: '1px solid var(--line-soft)' }}>
        <Icon name="whistle" size={30} stroke="var(--faint)" />
      </div>
      <h3 className="font-display font-semibold uppercase" style={{ fontSize: 18, color: 'var(--text)' }}>Nenhuma pelada ainda</h3>
      <p className="font-sans" style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, margin: '8px auto 18px', maxWidth: 250 }}>
        Você ainda não organizou nenhuma pelada. Crie a primeira e comece a montar os times.
      </p>
      <Button icon="plus" onClick={onCreate} className="mx-auto px-5">Criar Pelada</Button>
    </div>
  );
}

function PeladaListScreen({ peladas, onManage, onCreate, toast }) {
  return (
    <div className="noscroll" style={{ flex: 1, overflowY: 'auto' }}>
      <ScreenHeader
        subtitle={`Olá, @${CURRENT_USER.username}`}
        title="Suas Peladas"
        right={<button onClick={onCreate} aria-label="Criar pelada" style={{ width: 44, height: 44, borderRadius: 14, display: 'grid', placeItems: 'center', background: 'var(--accent)', color: 'var(--accent-ink)', boxShadow: '0 10px 22px -10px var(--accent)' }} className="active:scale-90 transition"><Icon name="plus" size={24} width={2.4} /></button>}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
        {peladas.map((p, i) => <PeladaCard key={p.id} pelada={p} onManage={onManage} index={i} />)}
      </div>

      {/* Empty-state preview (as requested) */}
      <div style={{ padding: '24px 16px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ height: 1, flex: 1, background: 'var(--line-soft)' }} />
          <span className="font-sans font-bold uppercase" style={{ fontSize: 10, letterSpacing: '0.12em', color: 'var(--faint)' }}>Prévia · estado vazio</span>
          <span style={{ height: 1, flex: 1, background: 'var(--line-soft)' }} />
        </div>
        <EmptyState onCreate={onCreate} />
      </div>
      <div style={{ height: 12 }} />
    </div>
  );
}

function CreatePeladaSheet({ open, onClose, onCreate, toast }) {
  const [name, setName] = useStateP('');
  React.useEffect(() => { if (open) setName(''); }, [open]);
  const submit = () => {
    if (name.trim().length < 3) return toast('O nome precisa ter ao menos 3 caracteres.', 'error');
    onCreate(name.trim());
  };
  return (
    <Sheet open={open} onClose={onClose} title="Nova Pelada"
      footer={<Button full size="lg" icon="check" onClick={submit}>Criar Pelada</Button>}>
      <p className="font-sans" style={{ fontSize: 13.5, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>
        Dê um nome ao grupo. Você será o <strong style={{ color: 'var(--text)' }}>dono</strong> e poderá adicionar jogadores e gerenciar permissões.
      </p>
      <Field label="Nome da pelada" hint="Entre 3 e 30 caracteres">
        <TextInput icon="ball" value={name} onChange={setName} placeholder="Ex.: Pelada de Quinta" maxLength={30} />
      </Field>
    </Sheet>
  );
}

Object.assign(window, { ScreenHeader, PrivBadge, privBadges, PeladaCard, EmptyState, PeladaListScreen, CreatePeladaSheet });
