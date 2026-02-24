-- Habilitar a extensão para geração de UUIDs (necessário apenas se não estiver habilitada)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- TABELAS CORE
-- ==========================================

-- 1. Tabela: folders
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    parent_id UUID REFERENCES folders(id) ON DELETE CASCADE,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela: notes
CREATE TABLE IF NOT EXISTS notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title TEXT NOT NULL DEFAULT 'Nova Nota',
    content JSONB,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_trashed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabela: passwords
CREATE TABLE IF NOT EXISTS passwords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    folder_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    username TEXT,
    password_encrypted TEXT NOT NULL,
    website TEXT,
    notes TEXT,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_trashed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);



-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Excluir as políticas se elas já existirem, para podermos recriá-las sem erro
DROP POLICY IF EXISTS "Users can manage their own folders" ON folders;
DROP POLICY IF EXISTS "Users can manage their own notes" ON notes;
DROP POLICY IF EXISTS "Users can manage their own passwords" ON passwords;

-- Criar as Políticas de Segurança Pessoal (Isolamento total por user_id)
-- Usuário só pode Selecionar, Inserir, Atualizar e Deletar o que lhe pertence.

CREATE POLICY "Users can manage their own folders" 
ON folders FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own notes" 
ON notes FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their own passwords" 
ON passwords FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
-- ==========================================
-- SHARED LINKS (COMPARTILHAMENTO)
-- ==========================================

CREATE TABLE IF NOT EXISTS shared_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'notes', 'passwords', 'mindmaps'
    entity_id UUID NOT NULL,
    token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    permissions TEXT DEFAULT 'view', -- 'view', 'edit'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own shared links" ON shared_links;
CREATE POLICY "Users can manage their own shared links" 
ON shared_links FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
