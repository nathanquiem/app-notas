"use client"

import { useState } from 'react'
import { Eye, EyeOff, Copy, ExternalLink, KeyRound, Loader2, Check } from 'lucide-react'
import { decryptPasswordAction } from '@/app/actions/passwords'

interface PasswordCardProps {
    password: {
        id: string
        title: string
        username: string
        website: string | null
        is_favorite: boolean
        updated_at: string
    }
}

export function PasswordCard({ password }: PasswordCardProps) {
    const [decryptedValue, setDecryptedValue] = useState<string | null>(null)
    const [isDecrypting, setIsDecrypting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)

    const handleReveal = async () => {
        if (decryptedValue) {
            setDecryptedValue(null)
            return
        }

        setIsDecrypting(true)
        setError(null)

        // Aciona a Server Action segura que descriptografará na memória do servidor e devolverá
        const res = await decryptPasswordAction(password.id)

        setIsDecrypting(false)

        if (res.error) {
            setError(res.error)
        } else if (res.value) {
            setDecryptedValue(res.value)
        }
    }

    const handleCopy = () => {
        if (!decryptedValue) return
        navigator.clipboard.writeText(decryptedValue)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="group relative rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
                        <KeyRound size={20} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px] md:max-w-full">{password.title}</h3>
                        <p className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-full">{password.username}</p>
                    </div>
                </div>

                {password.website && (
                    <a
                        href={password.website.startsWith('http') ? password.website : `https://${password.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-blue-500 transition-colors bg-slate-50 dark:bg-slate-800 p-1.5 rounded-md"
                        title="Visitar website"
                    >
                        <ExternalLink size={16} />
                    </a>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                {error && <span className="text-xs text-red-500">{error}</span>}

                <div className="flex items-center gap-2">
                    <div className="flex-1 rounded-md bg-slate-100 dark:bg-slate-900 px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300 flex items-center">
                        {isDecrypting ? (
                            <span className="flex items-center gap-2 text-gray-400"><Loader2 size={14} className="animate-spin" /> Descriptografando...</span>
                        ) : decryptedValue ? (
                            <span>{decryptedValue}</span>
                        ) : (
                            <span className="text-gray-400 tracking-widest">••••••••••••</span>
                        )}
                    </div>

                    <button
                        onClick={handleReveal}
                        disabled={isDecrypting}
                        className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-gray-500 hover:text-blue-500 transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-900"
                        title={decryptedValue ? "Ocultar Senha" : "Revelar Senha"}
                    >
                        {isDecrypting ? <Loader2 size={16} className="animate-spin" /> : decryptedValue ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>

                    <button
                        onClick={handleCopy}
                        disabled={!decryptedValue}
                        className="p-2 rounded-md bg-slate-100 dark:bg-slate-800 text-gray-500 hover:text-green-500 transition-colors border border-transparent hover:border-green-200 dark:hover:border-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Copiar"
                    >
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                    </button>
                </div>
            </div>
        </div>
    )
}
