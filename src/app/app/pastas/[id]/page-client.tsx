"use client"

import { FileText, KeyRound, Folder as FolderIcon, Clock, ChevronRight, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { Folder } from "@/types/database"
import { FolderActionMenu } from "./FolderActionMenu"

interface NoteItem { id: string; title: string; is_favorite: boolean; updated_at: string }
interface PasswordItem { id: string; title: string; is_favorite: boolean; updated_at: string }

export default function FolderViewClient({
    folder,
    subFolders,
    notes,
    passwords
}: {
    folder: Folder
    subFolders: Folder[]
    notes: NoteItem[]
    passwords: PasswordItem[]
}) {
    const hasItems = subFolders.length > 0 || notes.length > 0 || passwords.length > 0

    return (
        <div className="space-y-8 h-full flex flex-col pt-4 pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FolderIcon size={28} className={folder.color ? `text-[${folder.color}]` : 'text-blue-500'} fill="currentColor" fillOpacity={0.2} />
                    <h1 className="text-3xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white">
                        {folder.name}
                    </h1>
                </div>
                {/* Menu de Contexto (Renomear, Compartilhar, Excluir) */}
                <FolderActionMenu folderId={folder.id} currentName={folder.name} />
            </div>

            {!hasItems ? (
                <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-slate-50 dark:bg-slate-900/20 text-center max-w-lg mx-auto px-4 mt-12">
                    <div className="w-16 h-16 bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FolderIcon size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Pasta Vazia</h3>
                    <p className="text-sm text-gray-500">
                        Crie e mova Notas ou Cofres para esta pasta, selecionando-a pelo dropdown nos cabeçalhos dos documentos.
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Subpastas */}
                    {subFolders.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                <FolderIcon size={16} /> Subpastas
                            </h3>
                            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                                {subFolders.map(sf => (
                                    <Link key={sf.id} href={`/app/pastas/${sf.id}`} className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-blue-300 dark:hover:border-blue-900 transition-colors shadow-sm cursor-pointer group">
                                        <FolderIcon size={24} className={sf.color ? `text-[${sf.color}]` : 'text-blue-500'} fill="currentColor" fillOpacity={0.2} />
                                        <span className="font-medium text-gray-800 dark:text-gray-200 truncate flex-1">{sf.name}</span>
                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 transition-colors opacity-0 group-hover:opacity-100" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notas */}
                    {notes.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                <FileText size={16} /> Notas
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {notes.map(note => (
                                    <Link href={`/app/notas/${note.id}`} key={note.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow hover:border-blue-200 dark:hover:border-blue-900/50 cursor-pointer h-32">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{note.title}</h3>
                                            <FileText size={18} className="text-blue-500 shrink-0" />
                                        </div>
                                        <div className="mt-4 flex flex-col text-xs text-gray-500 font-medium pt-2 border-t border-border">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {note.updated_at ? new Date(note.updated_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Recente'}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Senhas */}
                    {passwords.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                <KeyRound size={16} /> Cofres
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {passwords.map(pwd => (
                                    <Link href={`/app/senhas/${pwd.id}`} key={pwd.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow hover:border-orange-200 dark:hover:border-orange-900/50 cursor-pointer h-32">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{pwd.title}</h3>
                                            <KeyRound size={18} className="text-orange-500 shrink-0" />
                                        </div>
                                        <div className="mt-4 flex flex-col text-xs text-gray-500 font-medium pt-2 border-t border-border">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {pwd.updated_at ? new Date(pwd.updated_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Recente'}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
