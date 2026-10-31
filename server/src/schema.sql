-- MobillsPro PostgreSQL Schema
-- Sistema Definitivo de Controle Financeiro Pessoal Alexandre & Amanda em Muriaé/MG

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incomes (
    id SERIAL PRIMARY KEY,
    user_name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_recurring BOOLEAN DEFAULT TRUE,
    reference_month VARCHAR(7) NOT NULL, -- YYYY-MM
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wellhub_reimbursements (
    id SERIAL PRIMARY KEY,
    beneficiary VARCHAR(100) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'CREDITADO',
    reference_month VARCHAR(7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fixed_expenses (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    total_amount NUMERIC(12, 2) NOT NULL,
    alexandre_share NUMERIC(12, 2) NOT NULL,
    amanda_share NUMERIC(12, 2) NOT NULL,
    is_split_50_50 BOOLEAN DEFAULT TRUE,
    beneficiary VARCHAR(100) NOT NULL, -- 'COMPARTILHADO' ou 'ALEXANDRE'
    due_day INT NOT NULL,
    due_date VARCHAR(10) NOT NULL, -- YYYY-MM-DD
    status VARCHAR(50) DEFAULT 'PENDENTE', -- 'PAGO', 'PENDENTE'
    payment_method VARCHAR(50) DEFAULT 'PIX',
    paid_at TIMESTAMP WITH TIME ZONE,
    pix_code VARCHAR(100),
    reference_month VARCHAR(7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS credit_cards (
    id SERIAL PRIMARY KEY,
    card_name VARCHAR(50) NOT NULL, -- 'Nubank', 'Bradesco', 'Mercado Pago'
    color VARCHAR(20) NOT NULL,
    closing_day INT NOT NULL,
    due_day INT NOT NULL,
    credit_limit NUMERIC(12, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS card_transactions (
    id SERIAL PRIMARY KEY,
    card_id INT REFERENCES credit_cards(id),
    card_name VARCHAR(50) NOT NULL,
    establishment VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    installment_info VARCHAR(50),
    is_atypical BOOLEAN DEFAULT FALSE,
    atypical_reason VARCHAR(255),
    reference_month VARCHAR(7) NOT NULL,
    is_shared BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS pix_transactions (
    id SERIAL PRIMARY KEY,
    direction VARCHAR(20) NOT NULL, -- 'ENTRADA' ou 'SAIDA'
    amount NUMERIC(12, 2) NOT NULL,
    party_name VARCHAR(255) NOT NULL, -- Quem pagou / recebeu
    category VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    transaction_date TIMESTAMP WITH TIME ZONE NOT NULL,
    e2e_id VARCHAR(100),
    is_alert BOOLEAN DEFAULT FALSE,
    alert_reason VARCHAR(255),
    reference_month VARCHAR(7) NOT NULL
);

CREATE TABLE IF NOT EXISTS housing_simulation (
    id SERIAL PRIMARY KEY,
    current_rent NUMERIC(12, 2) DEFAULT 810.50,
    current_land_installment NUMERIC(12, 2) DEFAULT 1343.26,
    current_fuel NUMERIC(12, 2) DEFAULT 480.00,
    new_caixa_sac_installment NUMERIC(12, 2) DEFAULT 3231.32,
    new_condo NUMERIC(12, 2) DEFAULT 250.00,
    new_fuel NUMERIC(12, 2) DEFAULT 120.00,
    land_status VARCHAR(50) DEFAULT 'MANTER_OU_VENDER',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS investments (
    id SERIAL PRIMARY KEY,
    account_name VARCHAR(100) NOT NULL, -- 'Nomad Global (Augusto)', 'Tesouro Selic', 'CDB Liquidez Diária'
    institution VARCHAR(100) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- 'USD_OFFSHORE', 'RENDA_FIXA_POS', 'ACOES'
    currency VARCHAR(10) DEFAULT 'BRL',
    balance_original NUMERIC(14, 2) NOT NULL,
    exchange_rate NUMERIC(8, 4) DEFAULT 1.0000,
    balance_brl NUMERIC(14, 2) NOT NULL,
    annual_rate VARCHAR(50),
    monthly_yield_est NUMERIC(12, 2),
    last_updated DATE NOT NULL
);
