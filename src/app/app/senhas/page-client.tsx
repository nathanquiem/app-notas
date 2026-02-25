"use client"

import { KeyRound, Plus, Clock, Star, Folder } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import { CreatePasswordModal } from "@/components/vault/CreatePasswordModal"
import { useWorkspaceStore } from "@/store/useWorkspaceStore"

interface PasswordItem {
    id: string
    title: string
    is_favorite: boolean
    folder_id: string | null
    updated_at: string
}

export default function PasswordsIndexClient({ passwords }: { passwords: PasswordItem[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { folders } = useWorkspaceStore()

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white">Cofre de Projetos</h1>
                    <p className="text-gray-500 dark:text-gray-400">Páginas criptografadas blindadas. Ninguém além de você pode ler os documentos.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-foreground)] dark:bg-white text-background dark:text-black rounded-full hover:opacity-90 transition-opacity shadow-sm font-medium text-sm"
                >
                    <Plus size={16} />
                    Novo Cofre
                </button>
            </div>

            <div className="flex-1">
                {(!passwords || passwords.length === 0) ? (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-slate-50 dark:bg-slate-900/20 text-center max-w-lg mx-auto mt-12 px-4">
                        <div className="w-16 h-16 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <KeyRound size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Seu cofre está vazio</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Guarde tokens estruturados, senhas e chaves de banco de dados em um ambiente altamente seguro.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Criar Primeiro Documento Seguro
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
                        {passwords.map(pwd => {
                            const folderName = folders.find(f => f.id === pwd.folder_id)?.name
                            return (
                                <Link
                                    href={`/app/senhas/${pwd.id}`}
                                    key={pwd.id}
                                    className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all hover:border-orange-500/50 dark:hover:border-orange-500/50 cursor-pointer h-36"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{pwd.title}</h3>
                                        <KeyRound size={18} className="text-orange-500 shrink-0 drop-shadow-sm ml-2" />
                                    </div>

                                    <div className="mt-auto mb-3 flex items-center gap-2 flex-wrap">
                                        {pwd.is_favorite && <Star size={14} className="text-yellow-500 fill-yellow-500 drop-shadow-sm" />}
                                        {folderName && (
                                            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-medium text-gray-600 dark:text-gray-300">
                                                <Folder size={12} className="text-gray-400" />
                                                <span className="truncate max-w-[100px]">{folderName}</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-col text-xs text-gray-500 font-medium pt-2 border-t border-border">
                                        <span className="flex items-center gap-1"><Clock size={12} /> {pwd.updated_at ? new Date(pwd.updated_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : 'Recente'}</span>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>

            {isModalOpen && <CreatePasswordModal onClose={() => setIsModalOpen(false)} />}
        </div>
    )
}
