import { createClient } from "@/lib/supabase/server"
import { ShareListClient, SharedItem } from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CompartilhadosPage() {
    const supabase = await createClient()

    const { data: shares, error } = await supabase
        .from('shared_links')
        .select('*')
        .order('created_at', { ascending: false })

    if (error || !shares) {
        return <ShareListClient items={[]} />
    }

    // Separar IDs por tipo
    const noteIds = shares.filter(s => s.entity_type === 'notes').map(s => s.entity_id)
    const passwordIds = shares.filter(s => s.entity_type === 'passwords').map(s => s.entity_id)
    const folderIds = shares.filter(s => s.entity_type === 'folders').map(s => s.entity_id)

    // Buscar títulos em paralelo
    const [
        { data: notes },
        { data: passwords },
        { data: folders }
    ] = await Promise.all([
        noteIds.length > 0 ? supabase.from('notes').select('id, title').in('id', noteIds) : { data: [] },
        passwordIds.length > 0 ? supabase.from('passwords').select('id, title').in('id', passwordIds) : { data: [] },
        folderIds.length > 0 ? supabase.from('folders').select('id, name').in('id', folderIds) : { data: [] }
    ])

    // Mapear de volta para os shares
    const items: SharedItem[] = shares.map(share => {
        let title = 'Desconhecido'
        if (share.entity_type === 'notes' && notes) {
            title = notes.find(n => n.id === share.entity_id)?.title || 'Nota excluída'
        } else if (share.entity_type === 'passwords' && passwords) {
            title = passwords.find(p => p.id === share.entity_id)?.title || 'Senha excluída'
        } else if (share.entity_type === 'folders' && folders) {
            title = folders.find(f => f.id === share.entity_id)?.name || 'Pasta excluída'
        }

        return {
            id: share.id,
            token: share.token,
            entity_type: share.entity_type as 'notes' | 'passwords' | 'folders',
            title,
            permissions: share.permissions,
            created_at: share.created_at
        }
    })

    return <ShareListClient items={items} />
}
