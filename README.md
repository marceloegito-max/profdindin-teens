# Professor Dindin Teens

Plataforma gamificada de educação financeira para adolescentes (12-19 anos).

## 🚀 Deploy Rápido na Vercel

### 1. Fazer Upload no GitHub
1. Crie um novo repositório no GitHub chamado `profdindin-teens`
2. Faça upload de todos os arquivos deste ZIP
3. Commit e push

### 2. Deploy na Vercel
1. Acesse vercel.com
2. Clique em "Add New Project"
3. Selecione o repositório `profdindin-teens`
4. Configure as variáveis de ambiente (veja abaixo)
5. Clique em "Deploy"

### 3. Variáveis de Ambiente Necessárias

```
DATABASE_URL=sua-url-do-postgres
NEXTAUTH_URL=https://teens.profdindin.com.br
NEXTAUTH_SECRET=gere-com-openssl-rand-base64-32
NEXT_PUBLIC_APP_URL=https://teens.profdindin.com.br
```

### 4. Banco de Dados
- Use Vercel Postgres ou Supabase
- Após conectar, rode as migrações automaticamente no build

## 📦 Tecnologias
- Next.js 14 (App Router)
- Prisma + PostgreSQL
- NextAuth
- Tailwind CSS + Shadcn UI
- TypeScript

## 👤 Usuário Admin Padrão
- Email: marcelo.egito@gmail.com
- Senha: Admin@2026!

## 📞 Suporte
Entre em contato para dúvidas sobre configuração.
