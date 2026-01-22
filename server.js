
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3000;

// Configurações do Banco de Dados (Baseado no api/config.php)
const dbConfig = {
  host: '72.60.136.59',
  user: 'root',
  password: 'Al#!9th18',
  database: 'funeraria',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Middlewares
app.use(cors());
app.use(express.json());

// Pool de Conexão
const pool = mysql.createPool(dbConfig);

// Rota de saúde para o dashboard
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Autenticação
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

// Clientes
app.get('/api/clients', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM clients');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Listagem de familiares (dependentes) de um cliente específico
app.get('/api/clients/:id/family', async (req, res) => {
  try {
    // Busca na tabela de relacionamento (family_members) buscando os detalhes do cliente vinculado
    const [rows] = await pool.execute(`
      SELECT fm.id as bond_id, fm.kinship, c.* 
      FROM family_members fm
      JOIN clients c ON fm.member_client_id = c.id
      WHERE fm.client_id = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Empresas
app.get('/api/companies', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM companies');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Planos
app.get('/api/plans', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM plans');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Representantes
app.get('/api/representatives', async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM representatives');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Configurações Financeiras
app.post('/api/finance/config', async (req, res) => {
  const config = req.body;
  try {
    // Exemplo de persistência das chaves no banco
    for (const [key, value] of Object.entries(config)) {
      await pool.execute(
        'INSERT INTO settings (config_key, config_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE config_value = ?',
        [`finance_${key}`, String(value), String(value)]
      );
    }
    res.json({ success: true, message: 'Configurações aplicadas' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicialização do Servidor
app.listen(port, () => {
  console.log(`Servidor Eternity rodando em http://localhost:${port}`);
  console.log(`Banco de Dados: ${dbConfig.host}`);
});
