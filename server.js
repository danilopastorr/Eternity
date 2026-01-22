
// ... (código anterior preservado) ...

// Rota de saúde para o dashboard
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Configurações Financeiras
app.post('/api/finance/config', async (req, res) => {
  const config = req.body;
  try {
    // Aqui você faria o INSERT/UPDATE na tabela de configurações do seu DB
    // Para efeito de demonstração, retornamos sucesso
    console.log('Nova configuração financeira recebida:', config);
    res.json({ success: true, message: 'Configurações aplicadas' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// Listagem de familiares de um cliente específico
app.get('/api/clients/:id/family', async (req, res) => {
  try {
    const [rows] = await pool.execute(`
      SELECT fm.id as bond_id, fm.kinship, c.* 
      FROM family_members fm
      JOIN clients c ON fm.member_client_id = c.id
      WHERE fm.client_id = ?
    `, [req.params.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// ... (resto do arquivo server.js) ...
