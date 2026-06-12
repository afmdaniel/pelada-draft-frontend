// screens-auth.jsx — Login / Cadastro
const AuthScreen = ({ onLogin, toast }) => {
  const [mode, setMode] = React.useState('login'); // login | register
  const [identifier, setIdentifier] = React.useState('rafa_10');
  const [email, setEmail] = React.useState('');
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('••••••');
  const [confirm, setConfirm] = React.useState('');

  const isLogin = mode === 'login';

  const submit = () => {
    if (isLogin) {
      if (!identifier || !password) return toast('Preencha e-mail/username e senha.', 'error');
      onLogin();
    } else {
      if (!email || !username || !password) return toast('Preencha todos os campos.', 'error');
      if (password !== confirm) return toast('As senhas não coincidem.', 'error');
      onLogin();
    }
  };

  return (
    <div className="noscroll" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 26px' }}>
        {/* logo */}
        <div style={{ animation: 'fadeUp .5s both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 26 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18, display: 'grid', placeItems: 'center',
              background: 'linear-gradient(150deg, var(--accent), var(--accent-press))',
              boxShadow: '0 14px 30px -10px var(--accent)',
            }}>
              <Icon name="ball" size={32} stroke="var(--accent-ink)" width={1.7} />
            </div>
            <div>
              <div className="font-display font-bold uppercase" style={{ fontSize: 30, lineHeight: 0.95, color: 'var(--text)', letterSpacing: '0.01em' }}>Pelada<span style={{ color: 'var(--accent)' }}>Draft</span></div>
              <div className="font-sans font-semibold" style={{ fontSize: 12.5, color: 'var(--faint)', marginTop: 3 }}>Times equilibrados em segundos</div>
            </div>
          </div>
        </div>

        {/* segmented */}
        <div style={{ display: 'flex', gap: 4, padding: 4, borderRadius: 14, background: 'var(--card)', border: '1px solid var(--line-soft)', marginBottom: 22, animation: 'fadeUp .5s .05s both' }}>
          {[['login', 'Entrar'], ['register', 'Criar conta']].map(([k, lbl]) => (
            <button key={k} onClick={() => setMode(k)} className="font-sans font-bold transition" style={{
              flex: 1, height: 40, borderRadius: 10, fontSize: 14,
              background: mode === k ? 'var(--accent)' : 'transparent',
              color: mode === k ? 'var(--accent-ink)' : 'var(--muted)',
            }}>{lbl}</button>
          ))}
        </div>

        <div key={mode} style={{ animation: 'fadeUp .35s both' }}>
          {isLogin ? (
            <>
              <Field label="E-mail ou username"><TextInput icon="user" value={identifier} onChange={setIdentifier} placeholder="seu@email.com" /></Field>
              <Field label="Senha"><TextInput icon="lock" type="password" value={password} onChange={setPassword} placeholder="Sua senha" /></Field>
            </>
          ) : (
            <>
              <Field label="E-mail"><TextInput icon="user" value={email} onChange={setEmail} placeholder="seu@email.com" /></Field>
              <Field label="Username"><TextInput icon="user" value={username} onChange={setUsername} placeholder="comofica" /></Field>
              <Field label="Senha"><TextInput icon="lock" type="password" value={password} onChange={setPassword} placeholder="Mín. 6 caracteres" /></Field>
              <Field label="Confirmar senha"><TextInput icon="lock" type="password" value={confirm} onChange={setConfirm} placeholder="Repita a senha" /></Field>
            </>
          )}

          <Button full size="lg" onClick={submit} className="mt-1">{isLogin ? 'Entrar' : 'Criar conta'}</Button>

          {isLogin && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <button onClick={() => setMode('register')} className="font-sans font-semibold" style={{ fontSize: 13.5, color: 'var(--muted)' }}>
                Não tem conta? <span style={{ color: 'var(--accent)' }}>Criar nova conta</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ padding: '14px 26px 26px', textAlign: 'center' }}>
        <span style={{ fontSize: 11.5, color: 'var(--faint)' }}>Ao continuar você concorda com os termos da pelada ⚽</span>
      </div>
    </div>
  );
};

window.AuthScreen = AuthScreen;
