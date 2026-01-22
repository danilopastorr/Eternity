
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
  host: '72.60.136.59',
  user: 'root',
  password: 'Al#!9th18',
  database: 'funeraria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

app.use(cors());
app.use(express.json());

/**
 * MIDDLEWARE DE TRANSPILAÇÃO INTELIGENTE
 */
app.use(async (req, res, next) => {
  const urlPath = req.path;
  let filePath = path.join(__dirname, urlPath);

  // Se não tem extensão, tenta encontrar .tsx ou .ts
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + '.tsx')) filePath += '.tsx';
    else if (fs.existsSync(filePath + '.ts')) filePath += '.ts';
  }

  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = await esbuild.transform(content, {
          loader: filePath.endsWith('.tsx') ? 'tsx' : 'ts',
          target: 'es2020',
          format: 'esm',
          jsx: 'transform',
          jsxFactory: 'React.createElement',
          jsxFragment: 'React.Fragment',
          define: { 'process.env.NODE_ENV': '"development"' }
        });
        
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        return res.send(result.code);
      } catch (err) {
        console.error(`[ESBUILD] Erro em ${urlPath}:`, err.message);
        res.setHeader('Content-Type', 'application/javascript');
        return res.status(500).send(`console.error("Erro de transpilação: ${err.message}")`);
      }
    }
  }
  next();
});

app.use(express.static(__dirname));

let pool;
try {
  pool = mysql.createPool(dbConfig);
  console.log('✅ Banco de dados conectado.');
} catch (e) {
  console.error("❌ Erro MySQL:", e.message);
}

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: !!pool }));

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, login, role FROM representatives WHERE login = ? AND password = ?',
      [login, password]
    );
    if (rows.length > 0) res.json(rows[0]);
    else res.status(401).json({ error: 'Incorreto' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Fallback para SPA - Importante: NÃO deve capturar arquivos com extensão (css, js, tsx)
app.get('*', (req, res) => {
  if (req.path.includes('.')) return res.status(404).send('Not Found');
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`\n🚀 SERVIDOR ONLINE: http://localhost:${port}\n`);
});
