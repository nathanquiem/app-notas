"use client"

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { createPasswordAction } from '@/app/actions/passwords'

import { useRouter } from 'next/navigation'

export function CreatePasswordModal({ onClose }: { onClose: () => void }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const [title, setTitle] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const res = await createPasswordAction({ title })

        if (res.error) {
            setError(res.error)
            setLoading(false)
        } else {
            router.push(`/app/senhas/${res.id}`)
            onClose()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden">
                <div className="px-6 py-4 flex items-center justify-between border-b border-border">
                    <h2 className="text-lg font-bold text-[var(--color-marine)] dark:text-white">Novo Projeto/Credencial</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && <div className="p-3 rounded-md bg-red-100 text-red-600 text-sm border border-red-200">{error}</div>}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título do Projeto</label>
                        <input
                            required
                            autoFocus
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Ex: API Stripe, Database Produção"
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    <div className="pt-4 border-t border-border flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !title.trim()}
                            className="px-6 py-2 rounded-lg text-sm font-medium bg-[var(--color-primary)] text-white dark:bg-slate-800 dark:text-white hover:bg-orange-600 dark:hover:bg-slate-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                            Criar Documento Seguro
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
