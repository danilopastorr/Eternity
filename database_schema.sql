
-- ... (preservando o início do arquivo conforme fornecido) ...

-- 6. Tabela de Configurações Gerais (API Bancária, Taxas, etc)
CREATE TABLE IF NOT EXISTS settings (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Inserindo chaves padrões para configuração financeira
INSERT INTO settings (config_key, config_value) VALUES 
('finance_gateway', 'mercadopago'),
('finance_env', 'sandbox'),
('finance_tax_rate', '2.5'),
('finance_fixed_fee', '0.90'),
('finance_public_key', ''),
('finance_secret_key', '')
ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP;

-- ... (resto do arquivo) ...
