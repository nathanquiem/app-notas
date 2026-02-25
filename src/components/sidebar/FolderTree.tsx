"use client"

import { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder as FolderIcon, MoreHorizontal, Plus, FileText, KeyRound, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { Folder } from '@/types/database'
import { useWorkspaceStore } from '@/store/useWorkspaceStore'
import { createClient } from '@/lib/supabase/client'

// --- Lazy Loader para Arquivos (Notas e Senhas) dentro de Pastas ---
function FolderContents({ folderId, level }: { folderId: string, level: number }) {
    const [items, setItems] = useState<Array<{ id: string, title: string, type: 'note' | 'password', url: string }>>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        let isMounted = true

        async function fetchContents() {
            const supabase = createClient()

            // Busca notas da pasta
            const { data: notes } = await supabase
                .from('notes')
                .select('id, title')
                .eq('folder_id', folderId)
                .eq('is_trashed', false)

            // Busca senhas da pasta
            const { data: passwords } = await supabase
                .from('passwords')
                .select('id, title')
                .eq('folder_id', folderId)
                .eq('is_trashed', false)

            if (!isMounted) return

            const combined = [
                ...(notes || []).map(n => ({ id: n.id, title: n.title, type: 'note' as const, url: `/app/notas/${n.id}` })),
                ...(passwords || []).map(p => ({ id: p.id, title: p.title, type: 'password' as const, url: `/app/senhas/${p.id}` }))
            ]

            // Ordena alfabeticamente
            combined.sort((a, b) => a.title.localeCompare(b.title))

            setItems(combined)
            setIsLoading(false)
        }

        fetchContents()

        return () => {
            isMounted = false
        }
    }, [folderId])

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 py-1 px-2 text-xs text-gray-400" style={{ paddingLeft: `${(level + 1) * 12 + 28}px` }}>
                <Loader2 size={12} className="animate-spin" /> Carregando...
            </div>
        )
    }

    if (items.length === 0) {
        return null // Vazio, não renderiza nada além da própria pasta
    }

    return (
        <div className="w-full">
            {items.map(item => (
                <Link
                    key={`${item.type}-${item.id}`}
                    href={item.url}
                    className="flex items-center gap-2 py-1.5 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-sm text-gray-500 dark:text-gray-400 transition-colors group"
                    style={{ paddingLeft: `${(level + 1) * 12 + 10}px` }}
                >
                    {item.type === 'note' ? (
                        <FileText size={14} className="opacity-70 group-hover:text-blue-500 transition-colors shrink-0" />
                    ) : (
                        <KeyRound size={14} className="opacity-70 group-hover:text-orange-500 transition-colors shrink-0" />
                    )}
                    <span className="truncate flex-1 group-hover:text-foreground transition-colors">{item.title}</span>
                </Link>
            ))}
        </div>
    )
}

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

            return (
                <div key={folder.id} className="w-full">
                    <div
                        className={`group flex items-center justify-between py-1 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm text-gray-600 dark:text-gray-300 transition-colors`}
                        style={{ paddingLeft: `${level * 12 + 8}px` }}
                    >
                        <div className="flex items-center gap-2 flex-1" onClick={() => toggleFolder(folder.id)}>
                            <button className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 shrink-0">
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            <FolderIcon size={16} className={folder.color ? `text-[${folder.color}] shrink-0` : 'text-blue-500 shrink-0'} fill="currentColor" fillOpacity={0.2} />
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
                            <FolderIcon size={16} className="text-blue-500 shrink-0" />
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

                    {/* Renderiza subpastas e arquivos lazy recursivamente */}
                    {isExpanded && (
                        <>
                            {renderFolders(folder.id, level + 1)}
                            <FolderContents folderId={folder.id} level={level} />
                        </>
                    )}
                </div>
            )
        })
    }

    if (isLoading && folders.length === 0) {
        return <div className="px-3 py-2 text-sm text-gray-400">Carregando pastas...</div>
    }

    return (
        <div className="space-y-1 mt-6 pb-20">
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
                    <FolderIcon size={16} className="text-blue-500 shrink-0" />
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
