const { createClient } = require('@supabase/supabase-js');
const url = 'https://kwpvjxzfgyiyakveflle.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3cHZqeHpmZ3lpeWFrdmVmbGxlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTg3NjUxMywiZXhwIjoyMDg3NDUyNTEzfQ.5jijnAGrGlfuurnW7erL1uD4JQCAinLG7LlA3CVuZJ0';
const supabase = createClient(url, key);

async function checkToken() {
    const token = 'ad66696c-5879-436e-808a-5ac4c39e53bb';
    console.log('Querying token:', token);
    const { data: link, error: linkError } = await supabase.from('shared_links').select('*').eq('token', token).single();
    if (linkError || !link) {
        console.error('Link Error:', linkError);
        return;
    }
    console.log('Link:', link);

    if (link.entity_type === 'notes') {
        const { data: note, error } = await supabase.from('notes').select('*').eq('id', link.entity_id).single();
        console.log('Note:', note, 'Error:', error);
    } else if (link.entity_type === 'folders') {
        const { data: folder, error } = await supabase.from('folders').select('*').eq('id', link.entity_id).single();
        console.log('Folder:', folder, 'Error:', error);
    } else {
        const { data: password, error } = await supabase.from('passwords').select('*').eq('id', link.entity_id).single();
        console.log('Password:', password, 'Error:', error);
    }
}
checkToken();
