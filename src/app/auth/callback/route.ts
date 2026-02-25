import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/app/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Em produção na Vercel, o "origin" da request.url pode vir como o domínio interno da Vercel
            // O ideal é ler o host real que o usuário acessou
            const host = request.headers.get('host')
            const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'

            const redirectOrigin = host ? `${protocol}://${host}` : origin

            return NextResponse.redirect(`${redirectOrigin}${next}`)
        }
    }

    // Se houver erro, redireciona de volta para o login relatando o problema
    const host = request.headers.get('host')
    const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
    const redirectOrigin = host ? `${protocol}://${host}` : origin

    return NextResponse.redirect(`${redirectOrigin}/login?error=Invalid_or_expired_recovery_link`)
}
