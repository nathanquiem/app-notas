"use client"

import { useState } from "react"
import { Share2, Link as LinkIcon, Copy, Check, Loader2, X } from "lucide-react"
import { generateShareLinkAction } from "@/app/actions/shares"

interface ShareButtonProps {
    entityId: string
    entityType: 'notes' | 'passwords' | 'folders'
}

export function ShareButton({ entityId, entityType }: ShareButtonProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [token, setToken] = useState<string | null>(null)
    const [copied, setCopied] = useState(false)
    const [password, setPassword] = useState('')

    const handleGenerate = async () => {
        setIsLoading(true)
        const res = await generateShareLinkAction(entityId, entityType, 'view', password)
        setIsLoading(false)
        if (res.token) {
            setToken(res.token)
        } else {
            alert(res.error || 'Erro ao gerar link')
            setIsOpen(false)
        }
    }

    const handleOpen = () => {
        setIsOpen(true)
        // Se já tivermos token recém gerado em memória nesta sessão, mantemos
    }

    const shareUrl = token ? `${window.location.origin}/share/${token}` : ''

    const handleCopy = () => {
        if (!shareUrl) return
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <>
            <button
                onClick={handleOpen}
                className="p-2 rounded-md text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Compartilhar"
            >
                <Share2 size={20} />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-border animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between p-4 border-b border-border">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <Share2 className="text-blue-500" size={20} /> Compartilhar Item
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <p className="text-sm text-gray-500">
                                Qualquer pessoa com este link poderá visualizar este documento.
                            </p>

                            {isLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="animate-spin text-blue-500" size={24} />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {!token ? (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Proteger com Senha (Opcional)
                                                </label>
                                                <input
                                                    type="text" // Texto limpo por exigência/facilidade no app
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    placeholder="Deixe em branco para link público..."
                                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm outline-none focus:ring-2 focus:ring-blue-500/50"
                                                />
                                            </div>
                                            <button
                                                onClick={handleGenerate}
                                                className="w-full h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
                                            >
                                                Gerar Link de Compartilhamento
                                            </button>
                                        </>
                                    ) : (
                                        <div className="flex items-center gap-2 mt-4">
                                            <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-900 border border-border rounded-lg px-3 py-2 overflow-hidden">
                                                <LinkIcon size={16} className="text-gray-400 flex-shrink-0" />
                                                <input
                                                    readOnly
                                                    value={shareUrl}
                                                    className="bg-transparent border-none outline-none w-full text-sm text-gray-600 dark:text-gray-300 font-medium"
                                                />
                                            </div>
                                            <button
                                                onClick={handleCopy}
                                                className="h-10 w-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex-shrink-0"
                                                title="Copiar Link"
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
