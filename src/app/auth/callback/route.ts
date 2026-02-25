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
            // Em provedores com Reverse Proxy (como Coolify, Traefik, Nginx), o host real
            // fica nos headers x-forwarded. O internal host pode ser apenas o IP do Docker ou localhost.
            const forwardedHost = request.headers.get('x-forwarded-host')
            const forwardedProto = request.headers.get('x-forwarded-proto')

            const host = forwardedHost ?? request.headers.get('host')
            const protocol = forwardedProto ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https')

            const redirectOrigin = host ? `${protocol}://${host}` : origin

            return NextResponse.redirect(`${redirectOrigin}${next}`)
        }
    }

    // Se houver erro, redireciona de volta para o login relatando o problema
    const forwardedHost = request.headers.get('x-forwarded-host')
    const forwardedProto = request.headers.get('x-forwarded-proto')
    const host = forwardedHost ?? request.headers.get('host')
    const protocol = forwardedProto ?? (process.env.NODE_ENV === 'development' ? 'http' : 'https')

    const redirectOrigin = host ? `${protocol}://${host}` : origin

    return NextResponse.redirect(`${redirectOrigin}/login?error=Invalid_or_expired_recovery_link`)
}
