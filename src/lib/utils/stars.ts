/**
 * Estrelas vão de 0 a 10; exibimos 5 estrelas (cada uma vale 2 pontos),
 * com suporte a meia estrela — igual ao protótipo.
 */
export function starFill(stars: number): number[] {
  const out: number[] = [];
  let remaining = stars;
  for (let i = 0; i < 5; i++) {
    if (remaining >= 2) out.push(1);
    else if (remaining >= 1) out.push(0.5);
    else out.push(0);
    remaining -= 2;
  }
  return out;
}
