# 🐾 Pet-Pag — O Hub Pet do Brasil

Diretório nacional de petshops com marketplace de produtos e serviços pet.

**Stack:** Next.js 15 (App Router) · Drizzle ORM · NeonDB (PostgreSQL) · Resend · Vercel

---

## 🚀 Setup em 5 passos

### 1. Clone e instale

```bash
git clone https://github.com/seu-usuario/petpag.git
cd petpag
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

| Variável | Onde obter |
|---|---|
| `DATABASE_URL` | [console.neon.tech](https://console.neon.tech) → Connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` no terminal |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) |
| `UPLOADTHING_SECRET` | [uploadthing.com/dashboard](https://uploadthing.com/dashboard) |

### 3. Crie o banco de dados

```bash
# Gera as migrations a partir do schema
npm run db:generate

# Aplica as migrations no NeonDB
npm run db:migrate
```

### 4. Rode localmente

```bash
npm run dev
# Acesse http://localhost:3000
```

### 5. Inspecione o banco (opcional)

```bash
npm run db:studio
# Abre o Drizzle Studio em http://localhost:4983
```

---

## 📁 Estrutura do projeto

```
petpag/
├── src/
│   ├── app/
│   │   ├── (public)/          # Rotas públicas (home, petshops, blog)
│   │   │   ├── layout.tsx     # Navbar + Footer
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── petshops/      # Diretório/busca
│   │   │   └── petshop/[slug] # Perfil público do petshop
│   │   ├── dashboard/         # Área logada do dono de petshop
│   │   ├── admin/             # Painel administrativo
│   │   ├── api/
│   │   │   ├── auth/          # NextAuth handlers
│   │   │   └── uploadthing/   # Upload de imagens
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Design tokens + utilitários
│   ├── components/
│   │   ├── shared/            # Navbar, Footer, componentes globais
│   │   ├── petshop/           # Componentes específicos de petshop
│   │   └── ui/                # Primitivos reutilizáveis
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts      # Schema completo do banco (Drizzle)
│   │   │   ├── index.ts       # Conexão com NeonDB
│   │   │   └── queries.ts     # Queries tipadas reutilizáveis
│   │   ├── auth.ts            # NextAuth v5 config
│   │   ├── email/index.ts     # Todos os emails transacionais (Resend)
│   │   ├── actions.ts         # Server Actions (formulários)
│   │   └── utils/index.ts     # Helpers, constantes, tipos
│   ├── middleware.ts           # Proteção de rotas
│   └── types/                 # Tipos globais TypeScript
├── drizzle/                   # Migrations geradas
├── .env.example               # Template de variáveis
├── drizzle.config.ts          # Config do Drizzle Kit
├── tailwind.config.ts         # Design tokens no Tailwind
└── vercel.json                # Config de deploy
```

---

## 🗃️ Schema do banco

### Tabelas principais

| Tabela | Descrição |
|---|---|
| `users` | Tutores, donos de petshop e admins |
| `petshops` | Entidade central — cada loja cadastrada |
| `petshop_services` | Serviços que cada petshop oferece |
| `petshop_photos` | Galeria de fotos (limitado por plano) |
| `petshop_animals` | Tipos de animais atendidos |
| `reviews` | Avaliações de tutores |
| `subscriptions` | Controle de plano (free/pro/premium) |
| `leads` | Mensagens de tutores para petshops |
| `page_views` | Analytics de visitas (sem terceiros) |
| `posts` | Blog editorial + artigos de premium |

### Planos

| Plano | Preço | Fotos | Serviços | Leads | Analytics |
|---|---|---|---|---|---|
| Free | Grátis | 5 | 3 | ❌ | ❌ |
| Pro | R$149/mês | Ilimitado | Ilimitado | ✅ | ✅ |
| Premium | R$349/mês | Ilimitado | Ilimitado | ✅ | ✅ + Banner |

---

## 📧 Emails configurados (Resend)

- **Verificação de email** — ao criar conta
- **Boas-vindas** — após verificação
- **Novo lead** — notifica o petshop de mensagens recebidas
- **Nova avaliação** — notifica o petshop
- **Reset de senha** — link temporário
- **Upgrade de plano** — confirmação de assinatura

---

## 🚢 Deploy no Vercel

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Login e deploy
vercel login
vercel --prod
```

Configure as variáveis de ambiente no painel do Vercel:
**Settings → Environment Variables** → cole os valores do `.env.local`

---

## 📋 Próximas features (backlog)

- [ ] Formulário completo de cadastro de petshop (wizard em 3 etapas)
- [ ] Upload de fotos via UploadThing
- [ ] Formulário de contato (leads) na página do petshop
- [ ] Painel admin — aprovação de petshops
- [ ] Integração Pagar.me / Stripe para assinaturas
- [ ] Sistema de avaliações com formulário
- [ ] Blog com editor Markdown
- [ ] Mapa com geolocalização dos petshops
- [ ] App mobile (React Native)
- [ ] Notificações push (petshop responde avaliação)

---

## 🎨 Design System

Ver `src/app/globals.css` e `tailwind.config.ts`.

Paleta: Azul petróleo `#0A2E3D` · Coral `#FF5733` · Âmbar `#F5A623` · Teal `#0A7B7B`

Estilo: Swiss International Typography adaptado ao mercado pet — grade visível, tipografia massiva, transições mecânicas e precisas.
