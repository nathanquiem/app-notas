"use client" // BlockNote requer renderização Client Side (react-dom)

import { useEffect, useState, useCallback, useRef } from "react"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Check, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

interface EditorProps {
    noteId: string
    initialContent?: any[] | null
}

export function NoteEditor({ noteId, initialContent }: EditorProps) {
    const supabase = createClient()
    const router = useRouter()
    const { resolvedTheme } = useTheme()

    // Converte `null` ou array vazio para `undefined` que o Tiptap precisa para iniciar limpo
    const parsedInitial = initialContent && initialContent.length > 0 ? initialContent as PartialBlock[] : undefined

    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Inicializa o Tiptap
    const editor = useCreateBlockNote({
        initialContent: parsedInitial,
    })

    const saveToDatabase = async (currentBlocks: any) => {
        setIsSaving(true)
        const { error } = await supabase
            .from('notes')
            .update({
                content: currentBlocks,
                updated_at: new Date().toISOString()
            })
            .eq('id', noteId)

        setIsSaving(false)
        if (!error) {
            setLastSaved(new Date())
            router.refresh()
        }
    }

    // Handler de alteração (onChange no BlockNoteView)
    const handleEditorChange = () => {
        if (!editor) return

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveToDatabase(editor.document)
        }, 1500)
    }

    const handleManualSave = () => {
        if (!editor) return
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
        saveToDatabase(editor.document)
    }

    // A UI do BlockNote (renderiza um Notion-like canvas interativo)
    return (
        <div className="w-full h-full pb-32 flex flex-col">
            {/* Indicator Area (Above the Line) */}
            <div className="flex items-center justify-end gap-2 text-xs font-medium text-gray-500 mb-2">
                {isSaving && <Loader2 size={14} className="animate-spin text-[var(--color-primary)]" />}
                {isSaving ? 'Salvando...' : lastSaved ? <><Check size={14} className="text-green-500" /> Salvo às {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</> : 'Aguardando edições...'}
            </div>

            <hr className="border-border mb-6" />

            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                className="min-h-[500px]"
                onChange={handleEditorChange}
            />
        </div>
    )
}
