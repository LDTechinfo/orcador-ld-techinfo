
Orçador - L&D Techinfo
======================

Conteúdo:
- frontend/  -> Aplicação React (Vite)
- backend/   -> Servidor Node/Express para envio de e-mail

Instruções (Windows)
--------------------
1) Instale Node.js (recomendo versão LTS). https://nodejs.org

2) Frontend
   Abra o terminal (PowerShell) na pasta:
     /mnt/data/Orcador-LD-Techinfo/frontend
   Rode:
     npm install
     npm run dev
   O site ficará disponível em http://localhost:5173 (ou porta indicada pelo Vite).

3) Backend
   Abra outro terminal na pasta:
     /mnt/data/Orcador-LD-Techinfo/backend
   Copie o arquivo .env.example para .env e edite com seu e-mail e senha (recomendo App Password se usar Gmail).
     cp .env.example .env
   Então:
     npm install
     npm start
   O backend rodará em http://localhost:4000

4) Teste
   No frontend, preencha o nome e e-mail do cliente e clique em 'Enviar por e-mail'. Verifique o backend no terminal para logs.

Notas de segurança:
- Para Gmail é recomendado usar App Password (conta com 2FA) ou configurar OAuth2.
- Nunca compartilhe sua senha em locais públicos.

Ajuda rápida:
Se quiser, eu posso:
- Gerar o arquivo ZIP para você baixar (vou gerar agora);
- Ou guiar você passo a passo por chamadas de terminal.

