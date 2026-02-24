"use client"

import * as React from "react"
import { Command } from "cmdk"
import { useRouter } from "next/navigation"
import { FileText, KeyRound, Network, Share2, Calculator, Settings, Compass } from "lucide-react"

export function GlobalCommandPalette() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter()

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

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm sm:px-4">
            <div className="w-full max-w-2xl bg-card rounded-xl shadow-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <Command label="Command Menu" className="flex flex-col w-full h-full max-h-[60vh]">
                    <div className="flex items-center border-b border-border px-4 py-3">
                        <Command.Input
                            autoFocus
                            placeholder="Buscar notas, senhas, mapas mentais..."
                            className="flex-1 bg-transparent outline-none text-foreground placeholder:text-gray-400"
                        />
                        <kbd className="hidden sm:inline-block text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-gray-500 px-1.5 py-0.5 rounded border border-border ml-4 uppercase">ESC</kbd>
                    </div>

                    <Command.List className="overflow-y-auto p-2">
                        <Command.Empty className="py-6 text-center text-sm text-gray-500">Nenhum resultado encontrado.</Command.Empty>

                        <Command.Group heading="Ações Rápidas" className="text-xs font-semibold text-gray-400 p-2 uppercase tracking-wide">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/notas'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                            >
                                <FileText size={16} /> Ir para Notas
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/senhas'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                            >
                                <KeyRound size={16} /> Acessar Cofre de Senhas
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/mapas'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                            >
                                <Network size={16} /> Abrir Mapas Mentais
                            </Command.Item>
                        </Command.Group>

                        <Command.Group heading="Configurações & Workspace" className="text-xs font-semibold text-gray-400 p-2 uppercase tracking-wide mt-2">
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/configuracoes'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                            >
                                <Settings size={16} /> Ajustes da Conta
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => router.push('/app/dashboard'))}
                                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer hover:bg-[var(--color-primary)] hover:text-white transition-colors"
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
