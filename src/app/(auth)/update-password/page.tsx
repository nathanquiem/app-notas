"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error: updateError } = await supabase.auth.updateUser({
            password: password
        })

        if (updateError) {
            setError(updateError.message)
            setLoading(false)
            return
        }

        // Redirect to dashboard after updating password
        router.push('/app/dashboard')
    }

    return (
        <div className="p-8">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white mb-2">Definir Nova Senha</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Digite sua nova senha abaixo para recuperar seu acesso ao workspace.</p>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
                {error && (
                    <div className="p-3 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm rounded-md border border-red-200 dark:border-red-800">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="password">Nova Senha</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="new-password"
                        placeholder="••••••••"
                        className="w-full flex h-10 rounded-md border border-border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                        required
                        disabled={loading}
                        minLength={6}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 rounded-md bg-[var(--color-primary)] text-white dark:bg-slate-800 dark:text-white font-medium hover:bg-blue-700 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] dark:focus:ring-offset-gray-900 mt-2 flex items-center justify-center disabled:opacity-70"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Atualizar Senha'}
                </button>
            </form>
        </div>
    )
}
