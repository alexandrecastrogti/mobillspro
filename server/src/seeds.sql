-- Seeds Iniciais MobillsPro
-- Alexandre & Amanda (Muriaé/MG) - Outubro de 2026

-- Usuários
INSERT INTO users (id, name, role) VALUES 
(1, 'Alexandre', 'TITULAR'),
(2, 'Amanda', 'PARCEIRA')
ON CONFLICT (id) DO NOTHING;

-- Receitas Alexandre
INSERT INTO incomes (user_name, description, amount, category, is_recurring, reference_month) VALUES 
('Alexandre', 'Salário Líquido Mensal', 9996.21, 'Salário', true, '2026-10'),
('Alexandre', 'Bolsa Monitoria Acadêmica', 1100.00, 'Monitoria', true, '2026-10');

-- Reembolsos Wellhub (Créditos automáticos)
INSERT INTO wellhub_reimbursements (beneficiary, plan_name, amount, status, reference_month) VALUES 
('Amanda', 'Wellhub Silver', 183.30, 'CREDITADO', '2026-10'),
('Taiana', 'Wellhub Silver', 183.30, 'CREDITADO', '2026-10'),
('Nilvana', 'Wellhub Silver', 183.30, 'CREDITADO', '2026-10');

-- Despesas Fixas (50/50 e Individuais)
INSERT INTO fixed_expenses (title, category, total_amount, alexandre_share, amanda_share, is_split_50_50, beneficiary, due_day, due_date, status, payment_method, pix_code, reference_month) VALUES 
('Aluguel Moradia Atual', 'Moradia', 1621.00, 810.50, 810.50, true, 'COMPARTILHADO', 10, '2026-10-10', 'PAGO', 'PIX', 'PIX-ALUGUEL-MURIAE-01', '2026-10'),
('Prestação do Terreno', 'Patrimônio/Terreno', 2686.52, 1343.26, 1343.26, true, 'COMPARTILHADO', 15, '2026-10-15', 'PAGO', 'BOLETO', 'BOL-TERRENO-1026', '2026-10'),
('Energia Elétrica (Energisa Muriaé)', 'Contas de Consumo', 380.00, 190.00, 190.00, true, 'COMPARTILHADO', 20, '2026-10-20', 'PAGO', 'PIX', 'ENERGISA-PIX-49821', '2026-10'),
('Internet Fibra Óptica Muriaé', 'Contas de Consumo', 130.00, 65.00, 65.00, true, 'COMPARTILHADO', 22, '2026-10-22', 'PAGO', 'PIX', 'FIBRA-PIX-883', '2026-10'),
('Condomínio / Taxa Manutenção', 'Moradia', 140.00, 70.00, 70.00, true, 'COMPARTILHADO', 10, '2026-10-10', 'PAGO', 'PIX', 'CONDOMINIO-PIX-12', '2026-10'),
('Água e Esgoto (DEMSUR Muriaé)', 'Contas de Consumo', 90.00, 45.00, 45.00, true, 'COMPARTILHADO', 25, '2026-10-25', 'PAGO', 'PIX', 'DEMSUR-PIX-994', '2026-10'),
('Diarista / Faxina Quinzenal', 'Serviços Domésticos', 360.00, 180.00, 180.00, true, 'COMPARTILHADO', 28, '2026-10-28', 'PAGO', 'PIX', 'DIARISTA-PIX-MARIA', '2026-10'),
('Unimed Individual (Exclusivo Alexandre)', 'Saúde Individual', 485.00, 485.00, 0.00, false, 'ALEXANDRE', 15, '2026-10-15', 'PAGO', 'BOLETO', 'UNIMED-BOL-552', '2026-10'),
('Academia Alexandre (Exclusivo)', 'Saúde & Fitness', 140.00, 140.00, 0.00, false, 'ALEXANDRE', 5, '2026-10-05', 'PAGO', 'PIX', 'ACAD-PIX-ALEX', '2026-10');

-- Cartões de Crédito
INSERT INTO credit_cards (id, card_name, color, closing_day, due_day, credit_limit) VALUES 
(1, 'Nubank', 'purple', 24, 1, 14000.00),
(2, 'Bradesco', 'red', 18, 25, 18500.00),
(3, 'Mercado Pago', 'sky', 10, 17, 8500.00)
ON CONFLICT (id) DO NOTHING;

-- Transações de Cartão com Atípicos de Outubro
INSERT INTO card_transactions (card_id, card_name, establishment, category, amount, transaction_date, installment_info, is_atypical, atypical_reason, reference_month, is_shared) VALUES 
(3, 'Mercado Pago', 'Funilaria & Pintura Muriaé', 'Manutenção Veículo', 1000.00, '2026-10-12', '1/1', true, 'Gasto atípico extraordinário (reparo colisão funilaria)', '2026-10', true),
(2, 'Bradesco', 'Casas Bahia / Eletrodoméstico', 'Bens Duráveis', 480.00, '2026-10-04', '10/10 (FINALIZADO)', true, 'Última parcela (10/10) encerrada em Outubro', '2026-10', true),
(1, 'Nubank', 'Supermercados BH Muriaé - Centro', 'Supermercado', 680.50, '2026-10-06', 'À vista', false, null, '2026-10', true),
(1, 'Nubank', 'Supermercados BH Muriaé - Barra', 'Supermercado', 570.00, '2026-10-21', 'À vista', false, null, '2026-10', true),
(2, 'Bradesco', 'Bahamas Mix Muriaé', 'Supermercado', 890.60, '2026-10-14', 'À vista', false, null, '2026-10', true),
(1, 'Nubank', 'Top Frut Gourmet Muriaé', 'Hortifruti & Carnes', 459.00, '2026-10-18', 'À vista', false, null, '2026-10', true),
(1, 'Nubank', 'Farmácia Indiana Muriaé', 'Farmácia', 110.90, '2026-10-09', 'À vista', false, null, '2026-10', true),
(2, 'Bradesco', 'Posto Faisão Muriaé', 'Combustível', 240.00, '2026-10-11', 'À vista', false, null, '2026-10', true),
(2, 'Bradesco', 'Posto DM Combustíveis', 'Combustível', 240.00, '2026-10-25', 'À vista', false, null, '2026-10', true);

-- Transações Pix (Detector e Alertas)
INSERT INTO pix_transactions (direction, amount, party_name, category, description, transaction_date, e2e_id, is_alert, alert_reason, reference_month) VALUES 
('ENTRADA', 183.30, 'Amanda (Wellhub)', 'Reembolso Wellhub', 'Compensação Wellhub Mensal - Amanda', '2026-10-02T10:14:00Z', 'E00000000202610021014a9918', false, null, '2026-10'),
('ENTRADA', 183.30, 'Taiana (Wellhub)', 'Reembolso Wellhub', 'Compensação Wellhub Mensal - Taiana', '2026-10-03T15:22:00Z', 'E00000000202610031522b7712', false, null, '2026-10'),
('ENTRADA', 183.30, 'Nilvana (Wellhub)', 'Reembolso Wellhub', 'Compensação Wellhub Mensal - Nilvana', '2026-10-04T09:40:00Z', 'E00000000202610040940c3319', false, null, '2026-10'),
('SAIDA', 810.50, 'Imobiliária Muriaé', 'Moradia', 'Metade Aluguel Moradia Atual Outubro/2026', '2026-10-09T14:20:00Z', 'E00000000202610091420d4411', false, null, '2026-10'),
('SAIDA', 180.00, 'Maria da Penha (Diarista)', 'Serviços Domésticos', 'Faxina quinzenal residência Muriaé', '2026-10-28T17:00:00Z', 'E00000000202610281700e5512', false, null, '2026-10'),
('SAIDA', 190.00, 'Energisa Minas Gerais', 'Contas de Consumo', 'Luz compartilhada Muriaé', '2026-10-18T16:30:00Z', 'E00000000202610181630f6613', false, null, '2026-10'),
('SAIDA', 140.00, 'Academia Performance Muriaé', 'Saúde & Fitness', 'Mensalidade Academia Alexandre Outubro', '2026-10-05T09:00:00Z', 'E00000000202610050900g7714', false, null, '2026-10'),
('SAIDA', 250.00, 'Chave Pix Celular Desconhecido', 'Avulso / Manutenção', 'Serviço avulso encanador reparo torneira', '2026-10-23T11:15:00Z', 'E00000000202610231115h8815', true, 'DETECTOR: Pix avulso fora da rotina cadastrada de fixas', '2026-10');

-- Investimentos e Ativos
INSERT INTO investments (account_name, institution, asset_type, currency, balance_original, exchange_rate, balance_brl, annual_rate, monthly_yield_est, last_updated) VALUES 
('Conta Nomad Global (Augusto / Família)', 'Nomad Fintech / DriveWealth USA', 'USD_OFFSHORE', 'USD', 4250.00, 5.7500, 24437.50, '8.5% a.a. (ETF VT + S&P 500)', 165.00, '2026-10-31'),
('Tesouro Selic 2029', 'Tesouro Direto / Itaú', 'RENDA_FIXA_POS', 'BRL', 35000.00, 1.0000, 35000.00, '13.75% a.a. (Taxa Selic Meta)', 375.00, '2026-10-31'),
('CDB 110% CDI Liquidez Diária', 'Nubank / Bradesco', 'RENDA_FIXA_POS', 'BRL', 18450.00, 1.0000, 18450.00, '15.12% a.a. (110% do CDI)', 215.00, '2026-10-31'),
('Terreno Residencial Muriaé (Fração Paga)', 'Loteadora Muriaé', 'PATRIMONIO_IMOVEL', 'BRL', 48500.00, 1.0000, 48500.00, 'Apreciação imobiliária ~10% a.a.', 0.00, '2026-10-31');

