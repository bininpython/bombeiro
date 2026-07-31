# Canhoto — Rumo à Farda

**“Cada treino é um passo até a farda.”**

Aplicação web desenvolvida sob medida para candidatos ao TAF do Corpo de Bombeiros Militar de Minas Gerais (CFSd BM 2027), focada no registro, análise e gamificação do treinamento físico.

## 🚀 Arquitetura e Tecnologias

- **Framework:** Next.js 15 (App Router) + React 19
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS + shadcn/ui
- **Banco de Dados & Autenticação:** Supabase (PostgreSQL)
- **Hospedagem Recomendada:** Vercel

## ⚙️ Instalação Local

1. **Pré-requisitos:** Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 18+ recomendada) instalado em sua máquina.
2. Abra o terminal na pasta do projeto (`Bombeiro`).
3. Instale as dependências executando:
   ```bash
   npm install
   ```
4. Crie o arquivo de variáveis de ambiente. Duplique o arquivo `.env.example`, renomeie para `.env.local` e preencha as variáveis com os dados do seu projeto Supabase.
5. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
6. Acesse a aplicação em `http://localhost:3000`.

## 🗄️ Configuração do Banco de Dados (Supabase)

1. Crie uma conta e um novo projeto no [Supabase](https://supabase.com).
2. Vá até a seção **SQL Editor**.
3. Execute os scripts localizados na pasta `supabase/migrations/` na seguinte ordem:
   - `001_initial_schema.sql` (Criação de todas as tabelas)
   - `002_rls_policies.sql` (Políticas de segurança Row Level Security)
   - `003_seed_taf_data.sql` (Dados base do edital CFSd 2027)

## 🌐 Deploy na Vercel

O projeto está pronto para ir ao ar. Para fazer o deploy:

1. Suba o código para um repositório no GitHub.
2. Crie uma conta na [Vercel](https://vercel.com) e clique em **Add New > Project**.
3. Importe o repositório do GitHub.
4. Na seção **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Clique em **Deploy**. A Vercel cuidará do build e colocará sua aplicação online!

## 🧪 Testes

O motor de pontuação é a área mais sensível da aplicação. Para rodar a bateria de testes unitários que cobre 80+ cenários extraídos diretamente do edital oficial:

```bash
npm run test
```

## ⚖️ Aviso Legal

O **Canhoto — Rumo à Farda** é uma ferramenta independente e não possui vínculo com o Corpo de Bombeiros Militar de Minas Gerais. Os parâmetros foram baseados no Edital nº 10/2026. Em caso de atualizações ou retificações oficiais, o candidato deve sempre consultar os documentos oficiais do concurso.
