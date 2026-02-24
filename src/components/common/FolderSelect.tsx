"use client"

import { useState, useEffect } from "react"
import { Folder as FolderIcon, Check, ChevronsUpDown } from "lucide-react"
import { useWorkspaceStore } from "@/store/useWorkspaceStore"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface FolderSelectProps {
    itemId: string
    currentFolderId: string | null
    entity: 'notes' | 'passwords'
}

export function FolderSelect({ itemId, currentFolderId, entity }: FolderSelectProps) {
    const { folders, fetchFolders } = useWorkspaceStore()
    const [isOpen, setIsOpen] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    useEffect(() => {
        if (folders.length === 0) {
            fetchFolders()
        }
    }, [folders.length, fetchFolders])

    const handleSelect = async (folderId: string | null) => {
        setIsUpdating(true)
        setIsOpen(false)

        const { error } = await supabase
            .from(entity)
            .update({ folder_id: folderId })
            .eq('id', itemId)

        setIsUpdating(false)
        if (!error) {
            router.refresh()
        }
    }

    const currentFolder = folders.find(f => f.id === currentFolderId)

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isUpdating}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors border border-transparent focus:border-blue-500 outline-none w-[180px] justify-between"
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <FolderIcon size={14} className={currentFolder?.color ? `text-[${currentFolder.color}]` : "text-blue-500"} />
                    <span className="truncate">{currentFolder ? currentFolder.name : 'Nenhuma pasta'}</span>
                </div>
                <ChevronsUpDown size={14} className="opacity-50" />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-card border border-border rounded-lg shadow-lg z-20 py-1">
                        <button
                            onClick={() => handleSelect(null)}
                            className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                        >
                            <span className="flex items-center gap-2">
                                <FolderIcon size={14} className="text-gray-400" />
                                Nenhuma pasta
                            </span>
                            {currentFolderId === null && <Check size={14} className="text-blue-500" />}
                        </button>

                        {folders.map(folder => (
                            <button
                                key={folder.id}
                                onClick={() => handleSelect(folder.id)}
                                className="w-full flex items-center justify-between px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-700 dark:text-gray-300"
                            >
                                <span className="flex items-center gap-2 truncate pr-4">
                                    <FolderIcon size={14} className={folder.color ? `text-[${folder.color}]` : "text-blue-500"} />
                                    <span className="truncate">{folder.name}</span>
                                </span>
                                {currentFolderId === folder.id && <Check size={14} className="text-blue-500 flex-shrink-0" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
