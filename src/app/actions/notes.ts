"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNoteServerAction(folderId: string | null = null) {
    const supabase = await createClient()

    // O Auth Server client já extrai os cookies para determinar o user_id automaticamente pelo middleware
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    // Insere no banco com título default
    const { data, error } = await supabase
        .from('notes')
        .insert({
            title: 'Nota sem título',
            user_id: userData.user.id,
            folder_id: folderId
        })
        .select('id')
        .single()

    if (error) return { error: error.message }

    revalidatePath('/app/notas')
    revalidatePath('/app/dashboard')

    return { id: data.id }
}
