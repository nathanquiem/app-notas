"use client"

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder as FolderIcon, MoreHorizontal, Plus } from 'lucide-react'
import Link from 'next/link'
import { Folder } from '@/types/database'
import { useWorkspaceStore } from '@/store/useWorkspaceStore'

export function FolderTree() {
    const { folders, fetchFolders, createFolder, isLoading } = useWorkspaceStore()
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
    const [isCreating, setIsCreating] = useState<string | null>(null) // ID do pai ou 'root'
    const [newFolderName, setNewFolderName] = useState('')

    useEffect(() => {
        fetchFolders()
    }, [fetchFolders])

    const toggleFolder = (folderId: string) => {
        const newExpanded = new Set(expandedFolders)
        if (newExpanded.has(folderId)) {
            newExpanded.delete(folderId)
        } else {
            newExpanded.add(folderId)
        }
        setExpandedFolders(newExpanded)
    }

    const handleCreateFolder = async (parentId: string | null) => {
        if (!newFolderName.trim()) {
            setIsCreating(null)
            return
        }
        await createFolder(newFolderName, parentId)
        setNewFolderName('')
        setIsCreating(null)
        if (parentId) {
            setExpandedFolders(prev => new Set(prev).add(parentId))
        }
    }

    // Função recursiva para renderizar pastas
    const renderFolders = (parentId: string | null, level: number = 0) => {
        const childFolders = folders.filter(f => f.parent_id === parentId)

        return childFolders.map(folder => {
            const isExpanded = expandedFolders.has(folder.id)
            const hasChildren = folders.some(f => f.parent_id === folder.id)

            return (
                <div key={folder.id} className="w-full">
                    <div
                        className={`group flex items-center justify-between py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm text-gray-600 dark:text-gray-300 transition-colors`}
                        style={{ paddingLeft: `${level * 12 + 8}px` }}
                    >
                        <div className="flex items-center gap-2 flex-1" onClick={() => toggleFolder(folder.id)}>
                            <button className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                {hasChildren ? (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <span className="w-4" />}
                            </button>
                            <FolderIcon size={16} className={folder.color ? `text-[${folder.color}]` : 'text-blue-500'} fill="currentColor" fillOpacity={0.2} />
                            <Link href={`/app/pastas/${folder.id}`} onClick={(e) => e.stopPropagation()} className="truncate flex-1 font-medium hover:text-[var(--color-primary)] transition-colors">
                                {folder.name}
                            </Link>
                        </div>

                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsCreating(folder.id) }}
                                className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                            >
                                <Plus size={14} />
                            </button>
                            <button className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded">
                                <MoreHorizontal size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Input para criar subpasta sob esta pasta */}
                    {isCreating === folder.id && (
                        <div className="flex items-center gap-2 py-1 px-2" style={{ paddingLeft: `${(level + 1) * 12 + 28}px` }}>
                            <FolderIcon size={16} className="text-blue-500" />
                            <input
                                autoFocus
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleCreateFolder(folder.id)
                                    if (e.key === 'Escape') setIsCreating(null)
                                }}
                                onBlur={() => handleCreateFolder(folder.id)}
                                className="flex-1 bg-transparent border-b border-[var(--color-primary)] outline-none text-sm text-foreground focus:border-b-2"
                                placeholder="Nome da pasta..."
                            />
                        </div>
                    )}

                    {/* Renderiza subpastas recursivamente */}
                    {isExpanded && renderFolders(folder.id, level + 1)}
                </div>
            )
        })
    }

    if (isLoading && folders.length === 0) {
        return <div className="px-3 py-2 text-sm text-gray-400">Carregando pastas...</div>
    }

    return (
        <div className="space-y-1 mt-6">
            <div className="flex items-center justify-between px-3 py-1 group">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pastas</span>
                <button
                    onClick={() => setIsCreating('root')}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded text-gray-500 transition-opacity"
                >
                    <Plus size={14} />
                </button>
            </div>

            {isCreating === 'root' && (
                <div className="flex items-center gap-2 py-1 px-3 pl-8">
                    <FolderIcon size={16} className="text-blue-500" />
                    <input
                        autoFocus
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleCreateFolder(null)
                            if (e.key === 'Escape') setIsCreating(null)
                        }}
                        onBlur={() => handleCreateFolder(null)}
                        className="flex-1 bg-transparent border-b border-[var(--color-primary)] outline-none text-sm text-foreground focus:border-b-2"
                        placeholder="Nova pasta raiz..."
                    />
                </div>
            )}

            {renderFolders(null, 0)}

            {folders.length === 0 && !isCreating && !isLoading && (
                <div className="px-5 py-3 text-xs text-gray-400 italic">
                    Nenhuma pasta criada.
                </div>
            )}
        </div>
    )
}
