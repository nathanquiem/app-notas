"use client"

import { FileText, Plus, Loader2, Clock } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createNoteServerAction } from "@/app/actions/notes"
import Link from "next/link"

interface NoteItem {
    id: string
    title: string
    is_favorite: boolean
    updated_at: string
}

export default function NotesIndexClient({ notes }: { notes: NoteItem[] }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleCreateNote = async () => {
        setLoading(true)
        const res = await createNoteServerAction()
        if (res.id) {
            router.push(`/app/notas/${res.id}`)
            router.refresh()
        } else {
            setLoading(false)
            alert(res.error || 'Erro ao criar nota')
        }
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white">Minhas Notas</h1>
                    <p className="text-gray-500 dark:text-gray-400">Gerencie todas as suas anotações e documentos ricos.</p>
                </div>
                <button
                    onClick={handleCreateNote}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-[var(--color-foreground)] dark:bg-white text-background dark:text-black rounded-full hover:opacity-90 transition-opacity shadow-sm font-medium text-sm disabled:opacity-70"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                    Nova Nota
                </button>
            </div>

            <div className="flex-1">
                {(!notes || notes.length === 0) ? (
                    <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-slate-50 dark:bg-slate-900/20 text-center max-w-lg mx-auto mt-12 px-4">
                        <div className="w-16 h-16 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <FileText size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Nenhuma nota selecionada</h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Selecione uma nota na lista de pastas ou crie uma nova nota agora mesmo utilizando o painel acima.
                        </p>
                        <button
                            onClick={handleCreateNote}
                            disabled={loading}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-border rounded-md shadow-sm text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            {loading ? 'Criando...' : 'Criar primeira nota'}
                        </button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
                        {notes.map(note => (
                            <Link href={`/app/notas/${note.id}`} key={note.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all hover:border-[var(--color-primary-light)] dark:hover:border-blue-900 cursor-pointer h-32">
                                <div className="flex items-start justify-between">
                                    <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{note.title}</h3>
                                    <FileText size={18} className="text-blue-500 shrink-0 drop-shadow-sm" />
                                </div>
                                <div className="mt-4 flex flex-col text-xs text-gray-500 font-medium pt-2 border-t border-border">
                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(note.updated_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
