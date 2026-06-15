"use client";

import { BottomSheet } from "@/components/shared/bottom-sheet";

interface TermsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TermsModal({ open, onOpenChange }: TermsModalProps) {
  return (
    <BottomSheet open={open} onOpenChange={onOpenChange} title="Termos e Privacidade">
      <div className="space-y-5 pb-4 font-sans text-[0.84375rem] leading-relaxed text-muted-foreground">
        <p className="text-[0.71875rem] text-faint">
          Última atualização: junho de 2025 · Em conformidade com a Lei nº 13.709/2018 (LGPD)
        </p>

        <section>
          <h2 className="mb-1.5 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            1. Dados pessoais coletados
          </h2>
          <p>
            Para o funcionamento do PeladaDraft coletamos os seguintes dados pessoais:
          </p>
          <ul className="mt-2 space-y-1 pl-4 list-disc">
            <li><strong className="text-foreground">E-mail</strong> — identificação e comunicação de conta.</li>
            <li><strong className="text-foreground">Username</strong> — exibição dentro do app.</li>
            <li><strong className="text-foreground">Senha</strong> — armazenada exclusivamente em formato de hash criptográfico; nunca armazenamos a senha em texto claro.</li>
            <li><strong className="text-foreground">Dados de peladas</strong> — nomes de jogadores, estrelas e posições associadas às peladas que você gerencia.</li>
          </ul>
          <p className="mt-2">
            Não coletamos dados de geolocalização, documentos de identidade, informações financeiras nem qualquer outro dado sensível além dos listados acima.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            2. Finalidade do tratamento
          </h2>
          <p>
            Os dados são utilizados exclusivamente para:
          </p>
          <ul className="mt-2 space-y-1 pl-4 list-disc">
            <li>Criação, autenticação e gerenciamento da sua conta.</li>
            <li>Funcionamento das funcionalidades do app (peladas, jogadores, sorteios, permissões).</li>
            <li>Segurança e prevenção de acessos não autorizados.</li>
          </ul>
          <p className="mt-2">
            A base legal para o tratamento é o <strong className="text-foreground">contrato</strong> (execução de serviço
            solicitado pelo titular) e o <strong className="text-foreground">legítimo interesse</strong> para fins de
            segurança, nos termos do art. 7º da LGPD.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            3. Retenção e exclusão de dados
          </h2>
          <p>
            Seus dados são mantidos enquanto sua conta estiver ativa. Você pode solicitar a exclusão completa da sua
            conta e de todos os dados associados a qualquer momento por meio do e-mail de contato indicado na
            seção 7. Após a solicitação, os dados são removidos em até 30 dias, salvo obrigação legal de retenção.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            4. Seus direitos como titular (LGPD)
          </h2>
          <p>
            Nos termos dos arts. 17 a 22 da LGPD, você tem direito a:
          </p>
          <ul className="mt-2 space-y-1 pl-4 list-disc">
            <li><strong className="text-foreground">Acesso</strong> — confirmar a existência de tratamento e obter cópia dos dados.</li>
            <li><strong className="text-foreground">Correção</strong> — solicitar atualização de dados incompletos ou inexatos.</li>
            <li><strong className="text-foreground">Eliminação</strong> — solicitar exclusão dos dados tratados com base no seu consentimento.</li>
            <li><strong className="text-foreground">Portabilidade</strong> — receber seus dados em formato estruturado.</li>
            <li><strong className="text-foreground">Revogação do consentimento</strong> — retirar seu consentimento a qualquer momento, sem prejuízo do tratamento realizado anteriormente.</li>
            <li><strong className="text-foreground">Oposição</strong> — opor-se a tratamento realizado com fundamento em bases legais diversas do consentimento.</li>
          </ul>
          <p className="mt-2">
            Para exercer qualquer desses direitos, entre em contato pelo e-mail indicado na seção 7.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            5. Compartilhamento de dados
          </h2>
          <p>
            <strong className="text-foreground">Não vendemos nem compartilhamos seus dados pessoais com terceiros</strong> para
            fins comerciais ou publicitários. Os dados poderão ser compartilhados somente quando exigido por lei,
            ordem judicial ou autoridade competente.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            6. Uso de cookies
          </h2>
          <p>
            O PeladaDraft utiliza cookies <strong className="text-foreground">estritamente necessários</strong> para
            autenticação e manutenção da sessão do usuário ({" "}
            <code className="rounded bg-card px-1 py-0.5 text-[0.78125rem]">access_token</code> e{" "}
            <code className="rounded bg-card px-1 py-0.5 text-[0.78125rem]">refresh_token</code>). Não utilizamos
            cookies de rastreamento, publicidade ou analytics.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            7. Contato e encarregado de dados (DPO)
          </h2>
          <p>
            Para dúvidas, solicitações relacionadas aos seus dados ou exercício dos direitos previstos na LGPD,
            entre em contato:
          </p>
          {/* TODO: atualize o e-mail de contato abaixo */}
          <p className="mt-2">
            <strong className="text-foreground">E-mail:</strong>{" "}
            <a
              href="mailto:contato@pelada-draft.com.br"
              className="text-primary underline-offset-2 hover:underline"
            >
              contato@pelada-draft.com.br
            </a>
          </p>
          <p className="mt-1">
            Respondemos em até 15 dias úteis.
          </p>
        </section>

        <section>
          <h2 className="mb-1.5 font-display text-sm font-semibold uppercase tracking-wide text-foreground">
            8. Alterações nestes termos
          </h2>
          <p>
            Podemos atualizar estes termos periodicamente. Notificaremos você sobre mudanças relevantes. O uso
            continuado do app após a publicação das alterações implica aceitação dos novos termos.
          </p>
        </section>
      </div>
    </BottomSheet>
  );
}
