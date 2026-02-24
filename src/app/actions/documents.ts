"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateDocumentTitleAction(entity: 'notes' | 'passwords', id: string, title: string) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) return { success: false, error: 'Não autorizado' }

    const { error } = await supabase
        .from(entity)
        .update({ title: title.trim(), updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userData.user.id) // Segurança extra

    if (error) {
        console.error(`Erro ao atualizar título de ${entity}:`, error)
        return { success: false, error: error.message }
    }

    revalidatePath(`/app/${entity === 'notes' ? 'notas' : 'senhas'}`)
    revalidatePath(`/app/${entity === 'notes' ? 'notas' : 'senhas'}/${id}`)

    return { success: true }
}

export async function toggleFavoriteAction(entity: 'notes' | 'passwords', id: string, isFavorite: boolean) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) return { success: false, error: 'Não autorizado' }

    const { error } = await supabase
        .from(entity)
        .update({ is_favorite: isFavorite, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userData.user.id)

    if (error) {
        console.error(`Erro ao atualizar favorito de ${entity}:`, error)
        return { success: false, error: error.message }
    }

    revalidatePath('/app/dashboard')
    revalidatePath(`/app/${entity === 'notes' ? 'notas' : 'senhas'}`)
    revalidatePath(`/app/${entity === 'notes' ? 'notas' : 'senhas'}/${id}`)
    if (entity === 'notes') revalidatePath('/app/notas')
    if (entity === 'passwords') revalidatePath('/app/senhas')

    return { success: true }
}
