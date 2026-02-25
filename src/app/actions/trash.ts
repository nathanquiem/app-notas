"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type EntityType = 'notes' | 'passwords' | 'folders'

export async function moveToTrashAction(id: string, entity: EntityType) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { error } = await supabase
        .from(entity)
        .update({ is_trashed: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userData.user.id)

    if (error) return { error: error.message }

    // Invalidate caches
    revalidatePath('/app/dashboard')
    revalidatePath(`/app/${entity === 'notes' ? 'notas' : 'senhas'}`)
    revalidatePath('/app/lixeira')

    return { success: true }
}

export async function restoreFromTrashAction(id: string, entity: EntityType) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { error } = await supabase
        .from(entity)
        .update({ is_trashed: false, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userData.user.id)

    if (error) return { error: error.message }

    revalidatePath('/app/lixeira')
    revalidatePath(`/app/${entity === 'notes' ? 'notas' : 'senhas'}`)
    revalidatePath('/app/dashboard')

    return { success: true }
}

export async function deletePermanentlyAction(id: string, entity: EntityType) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { error } = await supabase
        .from(entity)
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user.id)

    if (error) return { error: error.message }

    revalidatePath('/app/lixeira')
    return { success: true }
}

export async function bulkDeletePermanentlyAction(items: { id: string, entity: EntityType }[]) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const grouped = items.reduce((acc, curr) => {
        if (!acc[curr.entity]) acc[curr.entity] = []
        acc[curr.entity].push(curr.id)
        return acc
    }, {} as Record<EntityType, string[]>)

    for (const entity of Object.keys(grouped) as EntityType[]) {
        const ids = grouped[entity]
        if (ids.length > 0) {
            const { error } = await supabase
                .from(entity)
                .delete()
                .in('id', ids)
                .eq('user_id', userData.user.id)
            if (error) return { error: error.message }
        }
    }

    revalidatePath('/app/lixeira')
    return { success: true }
}
