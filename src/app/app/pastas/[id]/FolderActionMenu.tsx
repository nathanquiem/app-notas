"use client"

import { useState } from "react"
import { MoreHorizontal, Edit2, Share2, Trash2, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ShareButton } from "@/components/common/ShareButton"

interface FolderActionMenuProps {
    folderId: string
    currentName: string
}

export function FolderActionMenu({ folderId, currentName }: FolderActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isRenaming, setIsRenaming] = useState(false)
    const [newName, setNewName] = useState(currentName)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleDelete = async () => {
        if (!confirm("Tem certeza que deseja mover esta pasta para a lixeira? Notas e Senhas dentro dela também perderão a referência visual temporariamente.")) return

        setIsSubmitting(true)
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
            const { error } = await supabase.from('folders')
                .update({ is_trashed: true, updated_at: new Date().toISOString() })
                .eq('id', folderId)
                .eq('user_id', userData.user.id)

            if (error) {
                alert("Erro ao excluir pasta: " + error.message)
            } else {
                router.refresh()
                router.push('/app/dashboard')
            }
        }
        setIsSubmitting(false)
    }

    const handleRename = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName.trim() || newName.trim() === currentName) {
            setIsRenaming(false)
            return
        }

        setIsSubmitting(true)
        const { data: userData } = await supabase.auth.getUser()
        if (userData?.user) {
            const { error } = await supabase.from('folders')
                .update({ name: newName.trim(), updated_at: new Date().toISOString() })
                .eq('id', folderId)
                .eq('user_id', userData.user.id)

            if (error) {
                alert("Erro ao renomear pasta: " + error.message)
            } else {
                router.refresh()
                setIsRenaming(false)
                setIsOpen(false)
            }
        }
        setIsSubmitting(false)
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
                <MoreHorizontal size={20} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-border z-50 py-1 font-medium text-sm animate-in fade-in zoom-in-95 duration-100">
                        {isRenaming ? (
                            <form onSubmit={handleRename} className="p-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    className="w-full px-2 py-1 text-sm bg-slate-100 dark:bg-slate-800 border-none rounded outline-none focus:ring-1 focus:ring-blue-500"
                                    autoFocus
                                />
                                <button type="submit" disabled={isSubmitting} className="text-blue-500 p-1">
                                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Edit2 size={14} />}
                                </button>
                                <button type="button" onClick={() => setIsRenaming(false)} className="text-gray-400 p-1">
                                    <X size={14} />
                                </button>
                            </form>
                        ) : (
                            <>
                                <button
                                    onClick={() => setIsRenaming(true)}
                                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                                >
                                    <Edit2 size={16} /> Renomear
                                </button>

                                <div className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer" onClick={(e) => e.stopPropagation()}>
                                    <ShareButton entityId={folderId} entityType="folders" />
                                    <span className="pointer-events-none -ml-1">Compartilhar</span>
                                </div>

                                <div className="h-px bg-border my-1" />
                                <button
                                    onClick={handleDelete}
                                    disabled={isSubmitting}
                                    className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 text-red-600 dark:text-red-400 transition-colors"
                                >
                                    <Trash2 size={16} /> {isSubmitting ? 'Movendo...' : 'Mover para Lixeira'}
                                </button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}
