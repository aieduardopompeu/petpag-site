import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://petpag.com.br";

// =============================================================================
// TEMPLATES
// Email HTML inline — sem dependência de template engine
// =============================================================================

function baseTemplate(content: string) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #FAF9F6; margin: 0; padding: 0; }
    .wrap { max-width: 600px; margin: 0 auto; padding: 2rem 1rem; }
    .header { border-bottom: 3px solid #0A2E3D; padding-bottom: 1.5rem; margin-bottom: 2rem; }
    .logo { font-size: 1.5rem; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase; color: #0A2E3D; }
    .logo span { color: #FF5733; }
    .content { background: #fff; border: 2px solid #0A2E3D; padding: 2rem; }
    .btn { display: inline-block; background: #FF5733; color: #fff; font-weight: 700; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; padding: 0.85rem 2rem; margin-top: 1.5rem; }
    .footer { font-size: 0.75rem; color: #888; margin-top: 2rem; border-top: 1px solid #ddd; padding-top: 1rem; }
    h1 { font-size: 1.5rem; font-weight: 900; text-transform: uppercase; letter-spacing: -0.02em; color: #0A2E3D; margin: 0 0 1rem; }
    p { color: #444; line-height: 1.7; margin: 0 0 1rem; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="header">
      <div class="logo">Pet<span>-Pag</span></div>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      Pet-Pag — O Hub Pet do Brasil<br>
      Este é um email automático, não responda a esta mensagem.
    </div>
  </div>
</body>
</html>`;
}

// =============================================================================
// EMAIL FUNCTIONS
// =============================================================================

/** Verificação de email ao criar conta */
export async function sendVerificationEmail(email: string, token: string) {
  const url = `${APP_URL}/api/auth/verify?token=${token}`;
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Confirme seu email — Pet-Pag",
    html: baseTemplate(`
      <h1>Confirme seu email</h1>
      <p>Clique no botão abaixo para verificar seu endereço de email e ativar sua conta no Pet-Pag.</p>
      <p>O link expira em <strong>24 horas</strong>.</p>
      <a href="${url}" class="btn">Verificar email</a>
      <p style="margin-top:1.5rem;font-size:0.8rem;color:#888">
        Ou cole este link no navegador:<br>${url}
      </p>
    `),
  });
}

/** Boas-vindas após verificação */
export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Bem-vindo ao Pet-Pag! 🐾",
    html: baseTemplate(`
      <h1>Bem-vindo, ${name}!</h1>
      <p>Sua conta no Pet-Pag foi criada com sucesso. Agora você pode cadastrar seu petshop e alcançar milhares de tutores em todo o Brasil.</p>
      <a href="${APP_URL}/petshop/novo" class="btn">Cadastrar meu petshop</a>
    `),
  });
}

/** Notificação de novo lead recebido */
export async function sendLeadNotification({
  ownerEmail,
  petshopName,
  visitorName,
  visitorEmail,
  visitorPhone,
  message,
}: {
  ownerEmail: string;
  petshopName: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone?: string;
  message: string;
}) {
  return resend.emails.send({
    from: FROM,
    to: ownerEmail,
    subject: `Nova mensagem para ${petshopName} — Pet-Pag`,
    html: baseTemplate(`
      <h1>Nova mensagem recebida</h1>
      <p>Seu petshop <strong>${petshopName}</strong> recebeu uma nova mensagem pelo Pet-Pag.</p>
      <table style="width:100%;border-collapse:collapse;margin:1rem 0">
        <tr><td style="padding:0.5rem 0;border-bottom:1px solid #eee;color:#888;width:120px">Nome</td><td style="padding:0.5rem 0;border-bottom:1px solid #eee;font-weight:600">${visitorName}</td></tr>
        <tr><td style="padding:0.5rem 0;border-bottom:1px solid #eee;color:#888">Email</td><td style="padding:0.5rem 0;border-bottom:1px solid #eee">${visitorEmail}</td></tr>
        ${visitorPhone ? `<tr><td style="padding:0.5rem 0;border-bottom:1px solid #eee;color:#888">Telefone</td><td style="padding:0.5rem 0;border-bottom:1px solid #eee">${visitorPhone}</td></tr>` : ""}
        <tr><td style="padding:0.5rem 0;color:#888;vertical-align:top">Mensagem</td><td style="padding:0.5rem 0">${message}</td></tr>
      </table>
      <a href="${APP_URL}/dashboard/mensagens" class="btn">Ver no dashboard</a>
    `),
  });
}

/** Notificação de nova avaliação */
export async function sendReviewNotification({
  ownerEmail,
  petshopName,
  reviewerName,
  rating,
  body,
}: {
  ownerEmail: string;
  petshopName: string;
  reviewerName: string;
  rating: number;
  body?: string;
}) {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  return resend.emails.send({
    from: FROM,
    to: ownerEmail,
    subject: `Nova avaliação para ${petshopName} — Pet-Pag`,
    html: baseTemplate(`
      <h1>Nova avaliação recebida</h1>
      <p><strong>${reviewerName}</strong> avaliou o <strong>${petshopName}</strong>.</p>
      <p style="font-size:1.5rem;letter-spacing:2px;color:#F5A623">${stars}</p>
      ${body ? `<p style="border-left:3px solid #FF5733;padding-left:1rem;color:#555">"${body}"</p>` : ""}
      <a href="${APP_URL}/dashboard/avaliacoes" class="btn">Responder avaliação</a>
    `),
  });
}

/** Reset de senha */
export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${APP_URL}/nova-senha?token=${token}`;
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: "Redefinir senha — Pet-Pag",
    html: baseTemplate(`
      <h1>Redefinir sua senha</h1>
      <p>Recebemos um pedido para redefinir a senha da sua conta. Clique no botão abaixo para criar uma nova senha.</p>
      <p>O link expira em <strong>1 hora</strong>. Se você não fez esta solicitação, ignore este email.</p>
      <a href="${url}" class="btn">Redefinir senha</a>
    `),
  });
}

/** Confirmação de upgrade de plano */
export async function sendPlanUpgradeEmail({
  email,
  name,
  plan,
}: {
  email: string;
  name: string;
  plan: "pro" | "premium";
}) {
  const planName = plan === "pro" ? "Pro" : "Premium";
  const price = plan === "pro" ? "R$149/mês" : "R$349/mês";
  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Plano ${planName} ativado — Pet-Pag`,
    html: baseTemplate(`
      <h1>Plano ${planName} ativado!</h1>
      <p>Olá, ${name}. Seu plano <strong>${planName} (${price})</strong> foi ativado com sucesso.</p>
      <p>Agora você tem acesso a todos os recursos premium do Pet-Pag, incluindo destaque na busca regional e relatórios de visitas.</p>
      <a href="${APP_URL}/dashboard" class="btn">Acessar dashboard</a>
    `),
  });
}
