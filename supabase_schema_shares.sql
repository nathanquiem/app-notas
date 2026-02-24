CREATE TABLE IF NOT EXISTS shared_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    permissions TEXT DEFAULT 'view',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own shared links" ON shared_links;
CREATE POLICY "Users can manage their own shared links" 
ON shared_links FOR ALL 
USING (auth.uid() = user_id);
