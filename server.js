
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const app = express();
const port = process.env.PORT || 3000;

// Configuração do Banco de Dados
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
 * MIDDLEWARE DE TRANSPILAÇÃO ESBUILD
 * Resolve .tsx para JS em tempo real para o navegador
 */
app.use(async (req, res, next) => {
  const urlPath = req.path;
  
  if (urlPath.endsWith('.tsx') || urlPath.endsWith('.ts')) {
    const relativePath = urlPath.startsWith('/') ? urlPath.substring(1) : urlPath;
    const filePath = path.resolve(__dirname, relativePath);
    
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        const result = await esbuild.transform(content, {
          loader: 'tsx',
          target: 'es2020',
          format: 'esm',
          jsx: 'transform',
          jsxFactory: 'React.createElement',
          jsxFragment: 'React.Fragment',
          define: {
            'process.env.NODE_ENV': '"development"'
          }
        });
        
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        return res.send(result.code);
      } catch (err) {
        console.error(`[ESBUILD ERROR] ${urlPath}:`, err);
        res.setHeader('Content-Type', 'application/javascript');
        return res.status(500).send(`console.error("Erro ao transpilar ${urlPath}: ${err.message}")`);
      }
    }
  }
  next();
});

app.use(express.static(__dirname));

let pool;
try {
  pool = mysql.createPool(dbConfig);
} catch (e) {
  console.error("Erro ao conectar ao banco de dados:", e.message);
}

// --- ROTAS DA API ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: !!pool, timestamp: new Date() });
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, login, role FROM representatives WHERE login = ? AND password = ?',
      [login, password]
    );
    if (rows.length > 0) res.json(rows[0]);
    else res.status(401).json({ error: 'Credenciais inválidas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/plans', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM plans');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/representatives', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM representatives');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/companies', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM companies');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fallback para o index.html (SPA)
app.get('*', (req, res) => {
  if (req.path.includes('.') && !req.path.endsWith('.html')) {
    return res.status(404).send('Not Found');
  }
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`\n🚀 SERVIDOR ETERNITY RODANDO EM: http://localhost:${port}`);
  console.log(`📁 Diretório raiz: ${__dirname}\n`);
});
