"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [accessKey, setAccessKey] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        if (accessKey !== 'quechave') {
            setError('Chave de acesso inválida. Você não tem permissão para cadastrar.')
            return
        }

        setLoading(true)

        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name
                }
            }
        })

        if (signUpError) {
            setError(signUpError.message)
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
                <p className="text-gray-500 dark:text-gray-400">Crie seu workspace seguro</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="name">Nome completo</label>
                    <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoComplete="name"
                        placeholder="Seu nome"
                        className="w-full flex h-10 rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                        required
                        disabled={loading}
                    />
                </div>
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
                    <label className="text-sm font-medium" htmlFor="password">Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        className="w-full flex h-10 rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                        required
                        disabled={loading}
                    />
                </div>

                {/* Campo de verificação exigido pelo usuário */}
                <div className="space-y-2 pt-2 border-t border-border mt-4">
                    <label className="text-sm font-bold text-[var(--color-primary)]" htmlFor="accessKey">Digite sua chave de acesso</label>
                    <p className="text-xs text-gray-500 mb-1">Somente usuários autorizados podem se cadastrar na plataforma.</p>
                    <input
                        id="accessKey"
                        type="password"
                        value={accessKey}
                        onChange={(e) => setAccessKey(e.target.value)}
                        placeholder="Chave secreta"
                        className="w-full flex h-10 rounded-md border border-border bg-slate-50 dark:bg-slate-800/50 px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all font-mono"
                        required
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 mt-2 rounded-md bg-[var(--color-marine)] text-white dark:bg-slate-800 dark:text-white font-medium hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-marine)] dark:focus:ring-offset-gray-900 flex items-center justify-center disabled:opacity-70"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar Conta'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Já possui uma conta? </span>
                <Link href="/login" className="font-medium text-[var(--color-primary)] hover:underline">
                    Entrar
                </Link>
            </div>
        </div>
    )
}
