"use server"

import { createClient as createAdminClient } from "@supabase/supabase-js"
import crypto from 'crypto'

export async function verifySharedLinkPasswordAction(token: string, passwordAttempt: string) {
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: link } = await supabaseAdmin
        .from('shared_links')
        .select('protected_password')
        .eq('token', token)
        .single()

    if (!link || !link.protected_password) {
        return { success: false }
    }

    const hashedAttempt = crypto.createHash('sha256').update(passwordAttempt).digest('hex')

    if (hashedAttempt === link.protected_password) {
        return { success: true }
    }

    return { success: false, error: 'Senha incorreta' }
}
