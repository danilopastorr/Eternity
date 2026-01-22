
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const esbuild = require('esbuild');

const app = express();
const port = 3000;

// Configurações do Banco de Dados
const dbConfig = {
  host: '72.60.136.59',
  user: 'root',
  password: 'Al#!9th18',
  database: 'funeraria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Middlewares básicos
app.use(cors());
app.use(express.json());

/**
 * MIDDLEWARE DE TRANSPILAÇÃO (O segredo para resolver a tela branca)
 * Este bloco intercepta requisições para arquivos .tsx e os converte
 * em JavaScript que o navegador entende em tempo real.
 */
app.use(async (req, res, next) => {
  if (req.url.endsWith('.tsx') || req.url.endsWith('.ts')) {
    const filePath = path.join(__dirname, req.path);
    
    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const result = await esbuild.transform(content, {
          loader: 'tsx',
          target: 'es2020',
          format: 'esm',
        });
        
        res.setHeader('Content-Type', 'application/javascript');
        return res.send(result.code);
      } catch (err) {
        console.error(`Erro ao transpilar ${req.url}:`, err);
        return res.status(500).send(`console.error("Erro de Transpilação: ${err.message}")`);
      }
    }
  }
  next();
});

// Servir arquivos estáticos (HTML, CSS, imagens)
app.use(express.static(__dirname));

// Pool de Conexão com Banco de Dados
let pool;
try {
  pool = mysql.createPool(dbConfig);
} catch (e) {
  console.error("Falha ao criar pool de conexão:", e.message);
}

// --- ROTAS DE API ---

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date(), db: !!pool });
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  try {
    const [rows] = await pool.execute(
      'SELECT id, name, login, role FROM representatives WHERE login = ? AND password = ?',
      [login, password]
    );
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(401).json({ error: 'Credenciais inválidas' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clients LIMIT 100');
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

// Rota Fallback para o React (SPA)
app.get('*', (req, res) => {
  // Se for uma tentativa de buscar um arquivo que não existe, não manda o index.html
  if (req.url.includes('.')) return res.status(404).send('Not found');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicialização
app.listen(port, () => {
  console.log(`\n🚀 Eternity Admin Smart Server Online!`);
  console.log(`🔗 Acesso local: http://localhost:${port}`);
  console.log(`🛠️ Modo: Transpilação em tempo real ativa (.tsx -> .js)`);
  console.log(`🗄️ Banco de Dados: ${dbConfig.host}\n`);
});
