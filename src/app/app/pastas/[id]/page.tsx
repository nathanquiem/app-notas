import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import FolderViewClient from "./page-client"

export const dynamic = 'force-dynamic'

export default async function FolderViewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    // 1. Busca a Pasta
    const { data: folder, error: folderError } = await supabase
        .from('folders')
        .select('*')
        .eq('id', id)
        .single()

    if (folderError || !folder) {
        notFound()
    }

    // 2. Busca subpastas
    const { data: subFolders } = await supabase
        .from('folders')
        .select('*')
        .eq('parent_id', id)
        .order('name', { ascending: true })

    // 3. Busca Notas
    const { data: notes } = await supabase
        .from('notes')
        .select('id, title, is_favorite, updated_at')
        .eq('folder_id', id)
        .eq('is_trashed', false)
        .order('updated_at', { ascending: false })

    // 4. Busca Senhas
    const { data: passwords } = await supabase
        .from('passwords')
        .select('id, title, is_favorite, updated_at')
        .eq('folder_id', id)
        .eq('is_trashed', false)
        .order('updated_at', { ascending: false })

    return (
        <FolderViewClient
            folder={folder}
            subFolders={subFolders || []}
            notes={notes || []}
            passwords={passwords || []}
        />
    )
}
