# 📋 INSTRUÇÕES PASSO A PASSO PARA DEPLOY

## PASSO 1: SUBIR NO GITHUB

1. Acesse: https://github.com/new
2. Nome do repositório: profdindin-teens
3. Deixe como Public
4. NÃO marque "Add a README"
5. Clique em "Create repository"

6. Na página que abrir, clique em "uploading an existing file"
7. Arraste TODOS os arquivos deste ZIP para a área de upload
8. Escreva uma mensagem: "Initial commit"
9. Clique em "Commit changes"

## PASSO 2: CONECTAR NA VERCEL

1. Acesse: https://vercel.com/new
2. Selecione "Import Git Repository"
3. Procure por "profdindin-teens"
4. Clique em "Import"

## PASSO 3: CONFIGURAR BANCO DE DADOS

### Opção A: Vercel Postgres (Recomendado)
1. Na Vercel, vá em "Storage" → "Create Database"
2. Escolha "Postgres"
3. Nome: profdindin-teens-db
4. Região: São Paulo
5. Clique em "Create"
6. Conecte ao projeto

### Opção B: Supabase (Grátis)
1. Acesse: https://supabase.com
2. Crie novo projeto: profdindin-teens
3. Copie a Connection String
4. Adicione na Vercel como DATABASE_URL

## PASSO 4: CONFIGURAR VARIÁVEIS DE AMBIENTE

Na Vercel, em Settings → Environment Variables, adicione:

1. DATABASE_URL
   - Valor: (copiado do Vercel Postgres ou Supabase)

2. NEXTAUTH_SECRET
   - Gere em: https://generate-secret.vercel.app/32
   - Ou use: openssl rand -base64 32

3. NEXTAUTH_URL
   - Valor: https://teens.profdindin.com.br

4. NEXT_PUBLIC_APP_URL
   - Valor: https://teens.profdindin.com.br

## PASSO 5: FAZER DEPLOY

1. Clique em "Deploy"
2. Aguarde 2-5 minutos
3. Acesse a URL gerada (ex: profdindin-teens.vercel.app)

## PASSO 6: CONFIGURAR DOMÍNIO

1. No projeto na Vercel, vá em Settings → Domains
2. Adicione: teens.profdindin.com.br
3. Copie as instruções DNS
4. Configure no Registro.br:
   - Tipo: CNAME
   - Nome: teens
   - Valor: cname.vercel-dns.com.

## ✅ PRONTO!

Seu site estará no ar em: https://teens.profdindin.com.br

Login admin:
- Email: marcelo.egito@gmail.com
- Senha: Admin@2026!
