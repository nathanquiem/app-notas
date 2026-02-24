"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfileAction(formData: FormData) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const fullName = formData.get('fullName') as string
    const avatarUrl = formData.get('avatarUrl') as string

    if (!fullName || fullName.trim() === '') {
        return { error: 'O Nome Completo não pode estar vazio.' }
    }

    const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl }
    })

    if (error) return { error: error.message }

    revalidatePath('/app/configuracoes')
    revalidatePath('/app/dashboard')
    revalidatePath('/app/layout')

    return { success: true }
}

export async function logoutAction() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
