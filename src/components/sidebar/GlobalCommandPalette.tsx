"use client"

import * as React from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { FileText, KeyRound, Share2, Calculator, Settings, Compass, Folder, Loader2 } from "lucide-react"
import { createClient } from '@/lib/supabase/client'

export function GlobalCommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

    const [folders, setFolders] = React.useState<any[]>([])
    const [notes, setNotes] = React.useState<any[]>([])
    const [passwords, setPasswords] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        const openCustomEvent = () => setOpen(true)

        document.addEventListener("keydown", down)
        window.addEventListener("open-command-palette", openCustomEvent)
        return () => {
            document.removeEventListener("keydown", down)
            window.removeEventListener("open-command-palette", openCustomEvent)
        }
    }, [])

    React.useEffect(() => {
        if (!open) return;

        async function fetchData() {
            setLoading(true)
            const supabase = createClient()

            const [
                { data: fData },
                { data: nData },
                { data: pData }
            ] = await Promise.all([
                supabase.from('folders').select('id, name').order('name'),
                supabase.from('notes').select('id, title').eq('is_trashed', false).order('updated_at', { ascending: false }).limit(20),
                supabase.from('passwords').select('id, title').eq('is_trashed', false).order('updated_at', { ascending: false }).limit(20)
            ])

            if (fData) setFolders(fData)
            if (nData) setNotes(nData)
            if (pData) setPasswords(pData)

            setLoading(false)
        }

        fetchData()
    }, [open])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-2xl bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <Command label="Command Menu" className="flex flex-col w-full h-full max-h-[60vh]">
                    <div className="flex items-center border-b border-border px-4 py-3">
                        <Command.Input
                            autoFocus
                            placeholder="Buscar notas, senhas, pastas..."
                            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-gray-400"
                        />
                        <kbd className="hidden sm:inline-block text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-gray-500 px-1.5 py-0.5 rounded border border-border ml-4 uppercase">ESC</kbd>
                    </div>

                    <Command.List className="overflow-y-auto p-2 pb-4">
                        <Command.Empty className="py-6 text-center text-sm text-gray-500">
                            {loading ? <Loader2 className="animate-spin mx-auto w-5 h-5 text-gray-400" /> : "Nenhum resultado encontrado."}
                        </Command.Empty>

                        <Command.Group heading="Ações Rápidas" className="text-[10px] font-semibold text-gray-400 p-2 uppercase tracking-wide">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/notas'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer aria-selected:bg-[var(--color-primary)] aria-selected:text-white transition-colors"
                            >
                                <FileText size={16} /> Nova Nota
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/senhas'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer aria-selected:bg-[var(--color-primary)] aria-selected:text-white transition-colors"
                            >
                                <KeyRound size={16} /> Novo Documento Seguro
                            </Command.Item>
                        </Command.Group>

                        {folders.length > 0 && (
                            <Command.Group heading="Suas Pastas" className="text-[10px] font-semibold text-gray-400 p-2 uppercase tracking-wide mt-1">
                                {folders.map(folder => (
                                    <Command.Item
                                        key={folder.id}
                                        value={`pasta ${folder.name}`}
                                        onSelect={() => runCommand(() => router.push(`/app/pastas/${folder.id}`))}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer aria-selected:bg-[var(--color-primary)] aria-selected:text-white transition-colors"
                                    >
                                        <Folder size={16} /> {folder.name}
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {notes.length > 0 && (
                            <Command.Group heading="Notas Recentes" className="text-[10px] font-semibold text-gray-400 p-2 uppercase tracking-wide mt-1">
                                {notes.map(note => (
                                    <Command.Item
                                        key={note.id}
                                        value={`nota ${note.title || 'sem titulo'}`}
                                        onSelect={() => runCommand(() => router.push(`/app/notas/${note.id}`))}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer aria-selected:bg-[var(--color-primary)] aria-selected:text-white transition-colors"
                                    >
                                        <FileText size={16} /> {note.title || 'Nota sem título'}
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        {passwords.length > 0 && (
                            <Command.Group heading="Cofre de Senhas" className="text-[10px] font-semibold text-gray-400 p-2 uppercase tracking-wide mt-1">
                                {passwords.map(pwd => (
                                    <Command.Item
                                        key={pwd.id}
                                        value={`senha cofre credencial pass ${pwd.title || 'sem titulo'}`}
                                        onSelect={() => runCommand(() => router.push(`/app/senhas/${pwd.id}`))}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer aria-selected:bg-[var(--color-primary)] aria-selected:text-white transition-colors"
                                    >
                                        <KeyRound size={16} /> {pwd.title}
                                    </Command.Item>
                                ))}
                            </Command.Group>
                        )}

                        <Command.Group heading="Configurações & Workspace" className="text-[10px] font-semibold text-gray-400 p-2 uppercase tracking-wide mt-1">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/configuracoes'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer aria-selected:bg-[var(--color-primary)] aria-selected:text-white transition-colors"
                            >
                                <Settings size={16} /> Ajustes da Conta
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/dashboard'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer aria-selected:bg-[var(--color-primary)] aria-selected:text-white transition-colors"
                            >
                                <Compass size={16} /> Visão Geral (Dashboard)
                            </Command.Item>
                        </Command.Group>

                    </Command.List>
                </Command>
            </div>

            {/* Clique fora para fechar */}
            <div className="fixed inset-0 -z-10" onClick={() => setOpen(false)} />
        </div>
    )
}
