"use client"

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const supabase = createClient()

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(false)

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
        })

        if (resetError) {
            setError(resetError.message)
        } else {
            setSuccess(true)
        }
        setLoading(false)
    }

    return (
        <div className="p-8">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white mb-2">Recuperar Acesso</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Insira o seu email para receber o link de redefinição de segurança</p>
            </div>

            {success ? (
                <div className="text-center space-y-4">
                    <div className="p-4 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-sm rounded-md border border-green-200 dark:border-green-800">
                        Link de recuperação enviado! Verifique a sua caixa de entrada (e a pasta de spam) para redefinir sua senha.
                    </div>
                </div>
            ) : (
                <form onSubmit={handleReset} className="space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="email">Email de recuperação</label>
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

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-10 rounded-md bg-[var(--color-primary)] text-white dark:bg-slate-800 dark:text-white font-medium hover:bg-blue-700 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] dark:focus:ring-offset-gray-900 mt-2 flex items-center justify-center disabled:opacity-70"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Link'}
                    </button>
                </form>
            )}

            <div className="mt-6 text-center text-sm">
                <Link href="/login" className="font-medium text-gray-500 hover:text-[var(--color-marine)] dark:hover:text-white transition-colors">
                    ← Voltar ao login
                </Link>
            </div>
        </div>
    )
}
