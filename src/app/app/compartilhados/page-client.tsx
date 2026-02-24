"use client"

import { useState } from "react"
import { Share2, FileText, KeyRound, Copy, Check, Link2Off, ExternalLink } from "lucide-react"
import { deleteShareLinkAction } from "@/app/actions/shares"
import Link from "next/link"

export interface SharedItem {
    id: string
    token: string
    entity_type: 'notes' | 'passwords' | 'folders'
    title: string
    permissions: string
    created_at: string
}

export function ShareListClient({ items }: { items: SharedItem[] }) {
    const [copiedToken, setCopiedToken] = useState<string | null>(null)
    const [isRevoking, setIsRevoking] = useState<string | null>(null)

    const handleCopy = (token: string) => {
        const url = `${window.location.origin}/share/${token}`
        navigator.clipboard.writeText(url)
        setCopiedToken(token)
        setTimeout(() => setCopiedToken(null), 2000)
    }

    const handleRevoke = async (token: string) => {
        if (!confirm("Tem certeza que deseja revogar este link? Pessoas que o possuem perderão o acesso imediatamente.")) return

        setIsRevoking(token)
        await deleteShareLinkAction(token)
        setIsRevoking(null)
    }

    return (
        <div className="space-y-6 h-full flex flex-col pt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white">Compartilhados</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gerencie todos os links públicos gerados para seus documentos.</p>
                </div>
            </div>

            <div className="flex-1">
                {items.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-slate-50 dark:bg-slate-900/20 text-center max-w-lg mx-auto mt-12 px-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Share2 size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sem compartilhamentos ativos</h3>
                        <p className="text-sm text-gray-500">
                            Ao gerar um link para suas Notas ou Senhas, eles aparecerão aqui para fácil gerenciamento.
                        </p>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="divide-y divide-border">
                            {items.map(item => (
                                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${item.entity_type === 'notes' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                item.entity_type === 'passwords' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                            }`}>
                                            {item.entity_type === 'notes' && <FileText size={18} />}
                                            {item.entity_type === 'passwords' && <KeyRound size={18} />}
                                            {item.entity_type === 'folders' && <FileText size={18} className="rotate-180" />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                                                {item.title}
                                                <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                                                    {item.permissions === 'view' ? 'Visualização' : 'Edição'}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Criado em {new Date(item.created_at).toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <Link
                                            href={`/share/${item.token}`}
                                            target="_blank"
                                            className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-slate-100 hover:bg-slate-200 dark:text-gray-300 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center gap-1.5"
                                        >
                                            <ExternalLink size={14} /> Abrir
                                        </Link>

                                        <button
                                            onClick={() => handleCopy(item.token)}
                                            className="px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-md transition-colors flex items-center gap-1.5 w-24 justify-center"
                                        >
                                            {copiedToken === item.token ? <Check size={14} /> : <Copy size={14} />}
                                            {copiedToken === item.token ? 'Copiado' : 'Link'}
                                        </button>

                                        <button
                                            onClick={() => handleRevoke(item.token)}
                                            disabled={isRevoking === item.token}
                                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                        >
                                            <Link2Off size={14} /> Revogar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
