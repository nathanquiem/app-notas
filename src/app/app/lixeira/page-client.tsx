"use client"

import { useState } from "react"
import { Trash2, RotateCcw, FileText, KeyRound, AlertTriangle, Folder as FolderIcon } from "lucide-react"
import { restoreFromTrashAction, deletePermanentlyAction } from "@/app/actions/trash"

export interface TrashedItem {
    id: string
    title: string
    type: 'notes' | 'passwords' | 'folders'
    deleted_at: string
}

export default function LixeiraClient({ items }: { items: TrashedItem[] }) {
    const [isProcessing, setIsProcessing] = useState<string | null>(null)

    const handleRestore = async (id: string, type: 'notes' | 'passwords' | 'folders') => {
        setIsProcessing(id)
        await restoreFromTrashAction(id, type)
        setIsProcessing(null)
    }

    const handleDelete = async (id: string, type: 'notes' | 'passwords' | 'folders') => {
        if (!confirm("Tem certeza? Esta ação não pode ser desfeita.")) return

        setIsProcessing(id)
        await deletePermanentlyAction(id, type)
        setIsProcessing(null)
    }

    return (
        <div className="space-y-6 h-full flex flex-col pt-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white">Lixeira</h1>
                    <p className="text-gray-500 dark:text-gray-400">Itens excluídos permanecem aqui e podem ser restaurados ou destruídos permanentemente.</p>
                </div>
            </div>

            <div className="flex-1">
                {items.length === 0 ? (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-slate-50 dark:bg-slate-900/20 text-center max-w-lg mx-auto mt-12 px-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Trash2 size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lixeira vazia</h3>
                        <p className="text-sm text-gray-500">
                            Não há itens excluídos no momento.
                        </p>
                    </div>
                ) : (
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                        <div className="divide-y divide-border">
                            {items.map(item => (
                                <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg flex-shrink-0 ${item.type === 'notes' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                            item.type === 'passwords' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                            }`}>
                                            {item.type === 'notes' && <FileText size={18} />}
                                            {item.type === 'passwords' && <KeyRound size={18} />}
                                            {item.type === 'folders' && <FolderIcon size={18} />}
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-900 dark:text-white">{item.title}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Excluído em: {new Date(item.deleted_at).toLocaleString('pt-BR')} • {
                                                    item.type === 'notes' ? 'Nota' :
                                                        item.type === 'passwords' ? 'Credencial' : 'Pasta'
                                                }
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        <button
                                            onClick={() => handleRestore(item.id, item.type)}
                                            disabled={isProcessing === item.id}
                                            className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                        >
                                            <RotateCcw size={14} /> Restaurar
                                        </button>

                                        <button
                                            onClick={() => handleDelete(item.id, item.type)}
                                            disabled={isProcessing === item.id}
                                            className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                        >
                                            <AlertTriangle size={14} /> Excluir
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
