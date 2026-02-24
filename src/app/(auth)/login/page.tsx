"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            setError('Email ou senha inválidos.')
            setLoading(false)
            return
        }

        // Força recarregamento completo para que o Middleware Server-Side detecte o Cookie recém-criado
        window.location.href = '/app/dashboard'
    }

    return (
        <div className="p-8">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white mb-2">MyDocs</h1>
                <p className="text-gray-500 dark:text-gray-400">Entre para acessar seu workspace</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        placeholder="seu@email.com"
                        className="w-full flex h-10 rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                        required
                        disabled={loading}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium" htmlFor="password">Senha</label>
                        <Link href="/reset-password" className="text-sm text-[var(--color-primary)] hover:underline">
                            Esqueci a senha
                        </Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="w-full flex h-10 rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                        required
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 rounded-md bg-[var(--color-primary)] text-white dark:bg-slate-800 dark:text-white font-medium hover:bg-blue-700 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] dark:focus:ring-offset-gray-900 flex items-center justify-center disabled:opacity-70"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Entrar'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Não tem uma conta? </span>
                <Link href="/register" className="font-medium text-[var(--color-primary)] hover:underline">
                    Criar conta
                </Link>
            </div>
        </div>
    )
}
