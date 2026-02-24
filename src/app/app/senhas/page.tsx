import { createClient } from "@/lib/supabase/server"
import PasswordsIndexPage from "./page-client"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function PasswordsServerContainer() {
    const supabase = await createClient()

    // O SC injeta os dados de servidor para o Client Component renderizar o state visual do Modal.
    const { data: passwords } = await supabase
        .from('passwords')
        .select('id, title, is_favorite, updated_at')
        .eq('is_trashed', false)
        .order('created_at', { ascending: false })

    return <PasswordsIndexPage passwords={passwords || []} />
}
