"use client"

import { useState } from "react"
import { Trash2, RotateCcw, FileText, KeyRound, AlertTriangle, Folder as FolderIcon, CheckSquare, Square } from "lucide-react"
import { restoreFromTrashAction, deletePermanentlyAction, bulkDeletePermanentlyAction } from "@/app/actions/trash"

export interface TrashedItem {
    id: string
    title: string
    type: 'notes' | 'passwords' | 'folders'
    deleted_at: string
}

export default function LixeiraClient({ items }: { items: TrashedItem[] }) {
    const [isProcessing, setIsProcessing] = useState<string | null>(null)
    const [isBulkProcessing, setIsBulkProcessing] = useState(false)
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

    const handleRestore = async (id: string, type: 'notes' | 'passwords' | 'folders') => {
        setIsProcessing(id)
        await restoreFromTrashAction(id, type)
        setIsProcessing(null)
    }

    const handleDelete = async (id: string, type: 'notes' | 'passwords' | 'folders') => {
        if (!confirm("Tem certeza? Esta ação não pode ser desfeita e o documento será apagado permanentemente do banco de dados.")) return

        setIsProcessing(id)
        await deletePermanentlyAction(id, type)

        // Remove from selection if it was selected
        if (selectedItems.has(id)) {
            const next = new Set(selectedItems)
            next.delete(id)
            setSelectedItems(next)
        }
        setIsProcessing(null)
    }

    const handleBulkDelete = async () => {
        if (selectedItems.size === 0) return
        if (!confirm(`Tem certeza que deseja excluir permanentemente os ${selectedItems.size} itens selecionados do banco de dados?`)) return

        setIsBulkProcessing(true)
        const itemsToDelete = items.filter(i => selectedItems.has(i.id)).map(i => ({ id: i.id, entity: i.type }))

        await bulkDeletePermanentlyAction(itemsToDelete)

        setSelectedItems(new Set())
        setIsBulkProcessing(false)
    }

    const toggleSelection = (id: string) => {
        const next = new Set(selectedItems)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        setSelectedItems(next)
    }

    const toggleSelectAll = () => {
        if (selectedItems.size === items.length) {
            setSelectedItems(new Set())
        } else {
            setSelectedItems(new Set(items.map(i => i.id)))
        }
    }

    const allSelected = items.length > 0 && selectedItems.size === items.length
    const someSelected = selectedItems.size > 0

    return (
        <div className="space-y-6 h-full flex flex-col pt-4 pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white">Lixeira</h1>
                    <p className="text-gray-500 dark:text-gray-400">Itens excluídos permanecem aqui e podem ser restaurados ou destruídos permanentemente do banco de dados.</p>
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
                    <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">

                        {/* Header Actions */}
                        <div className="p-4 border-b border-border bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleSelectAll}
                                    className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    {allSelected ? <CheckSquare size={18} className="text-blue-500" /> : <Square size={18} className="text-gray-400" />}
                                    Selecionar Tudo
                                </button>
                                {someSelected && <span className="text-xs text-gray-500 border-l border-border pl-3">{selectedItems.size} selecionados</span>}
                            </div>

                            {someSelected && (
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={isBulkProcessing}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Trash2 size={16} />
                                    {isBulkProcessing ? 'Excluindo...' : 'Excluir Selecionados'}
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="divide-y divide-border">
                            {items.map(item => {
                                const isSelected = selectedItems.has(item.id)
                                return (
                                    <div key={item.id} className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isSelected ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                        <div className="flex items-center gap-4">
                                            <button onClick={() => toggleSelection(item.id)} className="text-gray-400 hover:text-blue-500 transition-colors">
                                                {isSelected ? <CheckSquare size={20} className="text-blue-500" /> : <Square size={20} />}
                                            </button>

                                            <div className={`p-2 rounded-lg flex-shrink-0 ${item.type === 'notes' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                                item.type === 'passwords' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400'
                                                }`}>
                                                {item.type === 'notes' && <FileText size={18} />}
                                                {item.type === 'passwords' && <KeyRound size={18} />}
                                                {item.type === 'folders' && <FolderIcon size={18} />}
                                            </div>
                                            <div>
                                                <h4 className={`font-medium ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-900 dark:text-white'}`}>{item.title}</h4>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    Excluído em: {new Date(item.deleted_at).toLocaleString('pt-BR')} • {
                                                        item.type === 'notes' ? 'Nota' :
                                                            item.type === 'passwords' ? 'Credencial' : 'Pasta'
                                                    }
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-auto pl-10 sm:pl-0">
                                            <button
                                                onClick={() => handleRestore(item.id, item.type)}
                                                disabled={isProcessing === item.id || isBulkProcessing}
                                                className="px-3 py-1.5 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                <RotateCcw size={14} /> Restaurar
                                            </button>

                                            <button
                                                onClick={() => handleDelete(item.id, item.type)}
                                                disabled={isProcessing === item.id || isBulkProcessing}
                                                className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
                                            >
                                                <AlertTriangle size={14} /> Excluir
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
