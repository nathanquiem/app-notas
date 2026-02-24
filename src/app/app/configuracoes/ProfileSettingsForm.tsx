"use client"

import { useState } from "react"
import { updateProfileAction } from "@/app/actions/auth"
import { Loader2 } from "lucide-react"

export function ProfileSettingsForm({
    initialName,
    initialAvatar
}: {
    initialName: string,
    initialAvatar: string
}) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const formData = new FormData(e.currentTarget)
        const res = await updateProfileAction(formData)

        setLoading(false)
        if (res.error) {
            setMessage("Erro: " + res.error)
        } else {
            setMessage("Perfil atualizado com sucesso!")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {message && (
                <div className={`p-3 rounded-md text-sm border ${message.startsWith("Erro") ? "bg-red-100 text-red-600 border-red-200" : "bg-green-100 text-green-700 border-green-200"}`}>
                    {message}
                </div>
            )}

            <div className="flex items-center gap-6">
                {initialAvatar ? (
                    <img src={initialAvatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-border shadow-sm bg-slate-100" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl font-bold text-gray-400 shrink-0">
                        {initialName.charAt(0).toUpperCase()}
                    </div>
                )}

                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome de Exibição</label>
                    <input
                        name="fullName"
                        defaultValue={initialName}
                        placeholder="Seu nome"
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL do Avatar</label>
                <input
                    name="avatarUrl"
                    defaultValue={initialAvatar}
                    placeholder="https://github.com/seu-user.png"
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
                />
                <p className="text-xs text-gray-500 mt-1">Insira um link direto para uma imagem (ex: GitHub, Imgur).</p>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-[var(--color-primary)] text-white dark:bg-slate-800 dark:text-white rounded-lg hover:bg-[var(--color-primary-light)] dark:hover:bg-slate-700 transition-colors shadow-sm font-medium text-sm disabled:opacity-70 flex items-center gap-2"
            >
                {loading && <Loader2 size={16} className="animate-spin" />}
                Salvar Perfil
            </button>
        </form>
    )
}
