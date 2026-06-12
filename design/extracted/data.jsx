// data.jsx — domain model, seed data, draw engine
// Mirrors the Peladas API: Pelada{name, ownerUsername, privileges[], players[]},
// Player{name, stars 0-10, position ZAGA|MEIO|ATAQUE|GERAL}, privileges MANAGE_PLAYERS|DRAW_TEAMS.

const CURRENT_USER = { username: 'rafa_10', email: 'rafa@email.com' };

// position metadata
const POSITIONS = {
  ZAGA:   { key: 'ZAGA',   label: 'Zaga',   short: 'ZAG', accent: 'oklch(0.70 0.13 233)' },
  MEIO:   { key: 'MEIO',   label: 'Meio',   short: 'MEI', accent: 'oklch(0.78 0.12 178)' },
  ATAQUE: { key: 'ATAQUE', label: 'Ataque', short: 'ATA', accent: 'oklch(0.74 0.16 48)'  },
  GERAL:  { key: 'GERAL',  label: 'Geral',  short: 'GER', accent: 'oklch(0.70 0.02 250)' },
};
const POSITION_ORDER = ['ATAQUE', 'MEIO', 'ZAGA', 'GERAL'];

// team identities — exact order required by brief: Amarelo, Azul, Branco, Verde, Vermelho, Preto
const TEAM_COLORS = [
  { name: 'Amarelo',  hex: '#F5C518', ink: '#1a1505', glow: 'rgba(245,197,24,0.30)' },
  { name: 'Azul',     hex: '#2E7BFF', ink: '#ffffff', glow: 'rgba(46,123,255,0.34)' },
  { name: 'Branco',   hex: '#E8EDF3', ink: '#15181d', glow: 'rgba(232,237,243,0.26)' },
  { name: 'Verde',    hex: '#22C55E', ink: '#06210f', glow: 'rgba(34,197,94,0.30)' },
  { name: 'Vermelho', hex: '#FB4D54', ink: '#ffffff', glow: 'rgba(251,77,84,0.32)' },
  { name: 'Preto',    hex: '#222831', ink: '#eef3f8', glow: 'rgba(120,140,170,0.28)' },
];

let _pid = 0;
const P = (name, stars, position) => ({ id: 'p' + (++_pid), name, stars, position });

// a strong, full roster for the user's main pelada
const ROSTER_QUARTA = [
  P('Rafa Lemos', 8, 'MEIO'),
  P('Bruno Salles', 9, 'ATAQUE'),
  P('Diego Martins', 7, 'ZAGA'),
  P('Caio Ferreira', 6, 'MEIO'),
  P('Léo Andrade', 10, 'ATAQUE'),
  P('Thiago Rocha', 5, 'ZAGA'),
  P('Vini Souza', 7, 'MEIO'),
  P('Gabriel Pinto', 8, 'ZAGA'),
  P('Murilo Costa', 4, 'GERAL'),
  P('Felipe Nunes', 6, 'ATAQUE'),
  P('Igor Ramos', 9, 'MEIO'),
  P('Pedro Aguiar', 5, 'ATAQUE'),
  P('Lucas Brito', 7, 'ZAGA'),
  P('Mateus Lima', 3, 'GERAL'),
  P('André Teixeira', 6, 'MEIO'),
  P('Rodrigo Maia', 8, 'ATAQUE'),
];

const ROSTER_SOCIETY = [
  P('Juninho', 7, 'ATAQUE'), P('Bibi', 8, 'MEIO'), P('Cadu', 6, 'ZAGA'),
  P('Renan', 5, 'MEIO'), P('Tales', 9, 'ATAQUE'), P('Davi', 4, 'ZAGA'),
  P('Otávio', 7, 'MEIO'), P('Henrique', 6, 'ATAQUE'), P('Samuel', 5, 'ZAGA'),
  P('Nando', 8, 'MEIO'), P('Zé Carlos', 3, 'GERAL'), P('Wesley', 7, 'ATAQUE'),
];

// members & their privileges, for the permissions screen
const SEED_PELADAS = [
  {
    id: 'pel1', name: 'Pelada de Quarta', ownerUsername: 'rafa_10',
    privileges: ['MANAGE_PLAYERS', 'DRAW_TEAMS'], // you are the owner → all powers
    isOwner: true,
    players: ROSTER_QUARTA,
    members: [
      { username: 'rafa_10', email: 'rafa@email.com', owner: true, privileges: ['MANAGE_PLAYERS', 'DRAW_TEAMS'] },
      { username: 'bibi', email: 'bibi@email.com', owner: false, privileges: ['DRAW_TEAMS'] },
      { username: 'cadu_z', email: 'cadu@email.com', owner: false, privileges: ['MANAGE_PLAYERS'] },
      { username: 'tales9', email: 'tales@email.com', owner: false, privileges: ['DRAW_TEAMS'] },
    ],
  },
  {
    id: 'pel2', name: 'Society dos Cria', ownerUsername: 'bibi',
    privileges: ['DRAW_TEAMS'], // member who can draw, but not manage players
    isOwner: false,
    players: ROSTER_SOCIETY,
    members: [
      { username: 'bibi', email: 'bibi@email.com', owner: true, privileges: ['MANAGE_PLAYERS', 'DRAW_TEAMS'] },
      { username: 'rafa_10', email: 'rafa@email.com', owner: false, privileges: ['DRAW_TEAMS'] },
    ],
  },
  {
    id: 'pel3', name: 'Fut de Domingo FC', ownerUsername: 'marcao',
    privileges: ['DRAW_TEAMS'], // you can draw teams in this pelada
    isOwner: false,
    players: ROSTER_QUARTA.slice(0, 14).map((p) => ({ ...p, id: p.id + 'b' })),
    members: [
      { username: 'marcao', email: 'marcao@email.com', owner: true, privileges: ['MANAGE_PLAYERS', 'DRAW_TEAMS'] },
      { username: 'rafa_10', email: 'rafa@email.com', owner: false, privileges: ['DRAW_TEAMS'] },
    ],
  },
];

// ── helpers ───────────────────────────────────────────────
// stars are 0..10. Render as 5-star row (each star = 2 points), supporting halves.
function starFill(stars) {
  // returns array of 5 values: 1 = full, 0.5 = half, 0 = empty
  const out = [];
  let remaining = stars;
  for (let i = 0; i < 5; i++) {
    if (remaining >= 2) out.push(1);
    else if (remaining >= 1) out.push(0.5);
    else out.push(0);
    remaining -= 2;
  }
  return out;
}

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function avgStars(players) {
  if (!players.length) return 0;
  return players.reduce((s, p) => s + p.stars, 0) / players.length;
}

// balanced draw — greedy: lowest total-stars team first; when withPosition,
// also even out each position across teams. 2..6 teams.
function drawTeams(players, k, withPosition) {
  const teams = Array.from({ length: k }, (_, i) => ({
    i, players: [], totalStars: 0, posCount: {},
  }));
  // sort by stars desc with random tiebreak so equal players shuffle each draw
  const sorted = [...players].sort((a, b) => b.stars - a.stars || Math.random() - 0.5);
  for (const p of sorted) {
    let pool = teams;
    if (withPosition) {
      const min = Math.min(...teams.map((t) => t.posCount[p.position] || 0));
      pool = teams.filter((t) => (t.posCount[p.position] || 0) === min);
    }
    pool = [...pool].sort(
      (a, b) =>
        a.totalStars - b.totalStars ||
        a.players.length - b.players.length ||
        Math.random() - 0.5
    );
    const t = pool[0];
    t.players.push(p);
    t.totalStars += p.stars;
    t.posCount[p.position] = (t.posCount[p.position] || 0) + 1;
  }
  // order each team's players by position then stars for a tidy lineup
  for (const t of teams) {
    t.players.sort(
      (a, b) =>
        POSITION_ORDER.indexOf(a.position) - POSITION_ORDER.indexOf(b.position) ||
        b.stars - a.stars
    );
  }
  return teams;
}

Object.assign(window, {
  CURRENT_USER, POSITIONS, POSITION_ORDER, TEAM_COLORS, SEED_PELADAS,
  starFill, initials, avgStars, drawTeams,
});
