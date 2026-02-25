"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { TransactionType, TransactionStatus } from '@/types/database'

// --- TRANSAÇÕES ---

export async function createTransactionAction(data: {
    description: string
    amount: number
    type: TransactionType
    status: TransactionStatus
    date: string
    category_id: string | null
}) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { error } = await supabase
        .from('finance_transactions')
        .insert({
            ...data,
            user_id: userData.user.id
        })

    if (error) return { error: error.message }

    revalidatePath('/app/financas')
    return { success: true }
}

export async function updateTransactionStatusAction(id: string, newStatus: TransactionStatus) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { error } = await supabase
        .from('finance_transactions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', userData.user.id) // Reforço RLS

    if (error) return { error: error.message }
    return { success: true }
}

export async function deleteTransactionAction(id: string) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { error } = await supabase
        .from('finance_transactions')
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user.id)

    if (error) return { error: error.message }

    revalidatePath('/app/financas')
    return { success: true }
}

// --- CATEGORIAS ---

export async function createCategoryAction(data: { name: string, color: string }) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { data: newCategory, error } = await supabase
        .from('finance_categories')
        .insert({
            name: data.name,
            color: data.color,
            user_id: userData.user.id
        })
        .select('*')
        .single()

    if (error) return { error: error.message }

    revalidatePath('/app/financas')
    return { success: true, category: newCategory }
}

export async function deleteCategoryAction(id: string) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    // RLS já bloqueia exclusão de categorias globais (user_id = null)
    const { error } = await supabase
        .from('finance_categories')
        .delete()
        .eq('id', id)
        .eq('user_id', userData.user.id)

    if (error) return { error: error.message }
    return { success: true }
}

export async function updateTransactionAction(id: string, data: {
    description: string
    amount: number
    type: TransactionType
    status: TransactionStatus
    date: string
    category_id: string | null
}) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { error } = await supabase
        .from('finance_transactions')
        .update({
            ...data,
            updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', userData.user.id) // Reforço RLS

    if (error) return { error: error.message }

    revalidatePath('/app/financas')
    return { success: true }
}

export async function updateCategoryAction(id: string, data: { name: string, color: string }) {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    const { data: updatedCategory, error } = await supabase
        .from('finance_categories')
        .update({
            name: data.name,
            color: data.color
        })
        .eq('id', id)
        .eq('user_id', userData.user.id) // Reforço RLS. Categorias Default tem user=null, logo não editará.
        .select('*')
        .single()

    if (error) return { error: error.message }

    revalidatePath('/app/financas')
    return { success: true, category: updatedCategory }
}
