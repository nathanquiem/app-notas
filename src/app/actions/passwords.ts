"use server"

import { createClient } from '@/lib/supabase/server'
import { encryptText, decryptText } from '@/lib/crypto'
import { revalidatePath } from 'next/cache'

export async function createPasswordAction(data: { title: string }) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    // Cria uma string vazia inicial criptografada para agir como espaço do documento
    const encryptedPassword = encryptText("")

    const { data: newPwd, error } = await supabase
        .from('passwords')
        .insert({
            title: data.title,
            password_encrypted: encryptedPassword,
            user_id: userData.user.id
        })
        .select('id')
        .single()

    if (error) return { error: error.message }

    revalidatePath('/app/senhas')
    return { id: newPwd.id }
}

export async function updatePasswordContentAction(id: string, content_raw: string) {
    const supabase = await createClient()

    const { data: userData } = await supabase.auth.getUser()
    if (!userData?.user) return { error: 'Não autorizado' }

    try {
        const encryptedPassword = encryptText(content_raw)
        const { error } = await supabase
            .from('passwords')
            .update({
                password_encrypted: encryptedPassword
            })
            .eq('id', id)
            .eq('user_id', userData.user.id) // Reforço garantido de Segurança RLS

        if (error) return { error: error.message }
        return { success: true }
    } catch (e: any) {
        return { error: 'Falha durante a Criptografia da chave AES do Servidor.' }
    }
}

export async function decryptPasswordAction(passwordId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('passwords')
        .select('password_encrypted')
        .eq('id', passwordId)
        .single()

    if (error || !data) return { error: 'Senha não encontrada' }

    // O Server Decrypta e retorna para que seja visualizada num estado efêmero do Cliente
    try {
        const decrypted = decryptText(data.password_encrypted)
        return { value: decrypted }
    } catch (e: any) {
        return { error: 'A chave de Criptografia falhou. As senhas podem estar corrompidas.' }
    }
}
