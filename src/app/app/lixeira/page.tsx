import { createClient } from "@/lib/supabase/server"
import LixeiraClient, { TrashedItem } from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function LixeiraServerContainer() {
    const supabase = await createClient()

    const [
        { data: trashNotes },
        { data: trashPasswords },
        { data: trashFolders }
    ] = await Promise.all([
        supabase.from('notes').select('id, title, updated_at').eq('is_trashed', true),
        supabase.from('passwords').select('id, title, updated_at').eq('is_trashed', true),
        supabase.from('folders').select('id, name, updated_at').eq('is_trashed', true),
    ])

    let trashItems: TrashedItem[] = []

    if (trashNotes) {
        trashNotes.forEach(n => trashItems.push({ id: n.id, title: n.title, deleted_at: n.updated_at || new Date().toISOString(), type: 'notes' }))
    }
    if (trashPasswords) {
        trashPasswords.forEach(p => trashItems.push({ id: p.id, title: p.title, deleted_at: p.updated_at || new Date().toISOString(), type: 'passwords' }))
    }
    if (trashFolders) {
        trashFolders.forEach(f => trashItems.push({ id: f.id, title: f.name, deleted_at: f.updated_at || new Date().toISOString(), type: 'folders' }))
    }

    trashItems.sort((a, b) => new Date(b.deleted_at).getTime() - new Date(a.deleted_at).getTime())

    return <LixeiraClient items={trashItems} />
}
