-- Tabela de Categorias Financeiras
CREATE TABLE finance_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#3b82f6',
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- Se null, são as categorias padrão
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS nas categorias
ALTER TABLE finance_categories ENABLE ROW LEVEL SECURITY;

-- Políticas de Categorias (Usuários podem ver as globais e as que eles próprios criaram)
CREATE POLICY "Users can view their own and global categories" ON finance_categories
FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create their own categories" ON finance_categories
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" ON finance_categories
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" ON finance_categories
FOR DELETE USING (auth.uid() = user_id);

-- Inserindo categorias padrão (Globais)
INSERT INTO finance_categories (name, color, user_id) VALUES 
('Alimentação', '#f87171', NULL),
('Moradia', '#fbbf24', NULL),
('Transporte', '#60a5fa', NULL),
('Lazer', '#a78bfa', NULL),
('Saúde', '#34d399', NULL),
('Salário', '#10b981', NULL),
('Serviços', '#9ca3af', NULL);


-- Tabela de Transações Financeiras
CREATE TABLE finance_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    type TEXT CHECK (type IN ('IN', 'OUT')) NOT NULL,
    status TEXT CHECK (status IN ('PAID', 'PENDING')) NOT NULL,
    date DATE NOT NULL,
    category_id UUID REFERENCES finance_categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS nas transações
ALTER TABLE finance_transactions ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança Severas: Cada usuário SÓ VE AS PRÓPRIAS MÁQUINAS
CREATE POLICY "Users can only select their own transactions" ON finance_transactions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own transactions" ON finance_transactions
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own transactions" ON finance_transactions
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own transactions" ON finance_transactions
FOR DELETE USING (auth.uid() = user_id);

-- Criar índices de performance para as datas e usuários (muito utilizado em dashboards)
CREATE INDEX idx_finance_transactions_user_id ON finance_transactions(user_id);
CREATE INDEX idx_finance_transactions_date ON finance_transactions(date);
