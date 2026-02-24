"use client"

import { useState } from "react"
import { Lock, Loader2 } from "lucide-react"
import { verifySharedLinkPasswordAction } from "@/app/actions/shares-public"

export function SharedPasswordPrompt({ token, onUnlock }: { token: string, onUnlock: () => void }) {
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        const res = await verifySharedLinkPasswordAction(token, password)
        setLoading(false)

        if (res.success) {
            onUnlock()
        } else {
            setError(res.error || 'Senha incorreta')
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-8 text-center animate-in fade-in slide-in-from-bottom-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Acesso Protegido</h1>
                <p className="text-sm text-gray-500 mb-8">
                    Este documento exige uma senha para ser visualizado.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-sm text-red-500 mb-2">{error}</div>}
                    <input
                        type="password"
                        placeholder="Insira a senha do link..."
                        className="w-full px-4 py-3 border border-border rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-blue-500/50"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={loading || !password}
                        className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl shadow-sm font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 size={16} className="animate-spin" />}
                        Desbloquear Documento
                    </button>
                </form>
            </div>
        </div>
    )
}
