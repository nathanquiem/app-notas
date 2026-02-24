"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export async function generateShareLinkAction(
    entityId: string,
    entityType: 'notes' | 'passwords' | 'folders',
    permissions: 'view' | 'edit' = 'view',
    password?: string
) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) return { error: 'Não autorizado' }

    // Verifica se já existe um link (Sem senha)
    // Se o user quiser senha agora, vamos apagar o velho e criar novo mais abaixo, 
    // ou simplesmente criar um novo se não houver.
    const { data: existingLink } = await supabase
        .from('shared_links')
        .select('token, protected_password')
        .eq('entity_id', entityId)
        .eq('entity_type', entityType)
        .eq('user_id', userData.user.id)
        .single()

    if (existingLink && !password && !existingLink.protected_password) {
        return { token: existingLink.token }
    }

    if (existingLink && (password || existingLink.protected_password)) {
        // Se a entidade já tinha um link mas precisa alterar senha, deletamos o velho
        await supabase.from('shared_links').delete().eq('token', existingLink.token)
    }

    let passwordHash = null
    if (password && password.trim() !== '') {
        passwordHash = crypto.createHash('sha256').update(password).digest('hex')
    }

    // Cria novo
    const { data: newLink, error } = await supabase
        .from('shared_links')
        .insert({
            user_id: userData.user.id,
            entity_id: entityId,
            entity_type: entityType,
            permissions,
            protected_password: passwordHash
        })
        .select('token')
        .single()

    if (error) return { error: error.message }

    revalidatePath('/app/compartilhados')

    return { token: newLink.token }
}

export async function deleteShareLinkAction(tokenId: string) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()

    if (!userData?.user) return { error: 'Não autorizado' }

    const { error } = await supabase
        .from('shared_links')
        .delete()
        .eq('token', tokenId)
        .eq('user_id', userData.user.id)

    if (error) return { error: error.message }

    revalidatePath('/app/compartilhados')
    return { success: true }
}
