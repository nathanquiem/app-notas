import { createClient } from "@/lib/supabase/server"
import NotesIndexClient from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function NotesServerContainer() {
  const supabase = await createClient()

  const { data: notes } = await supabase
    .from('notes')
    .select('id, title, is_favorite, updated_at')
    .eq('is_trashed', false)
    .order('updated_at', { ascending: false })

  return <NotesIndexClient notes={notes || []} />
}
