@echo off
cd /d "%~dp0"
git add index.html main.js style.css chat-api.php netlify.toml netlify/functions/chat.js cloudflare-worker/worker.js cloudflare-worker/wrangler.toml
git commit -m "Add AI chat widget powered by Groq Llama 3.3"
git push origin master
echo.
echo Done! Check https://sk-ideas.github.io/portfolio/
pause
