"use client"
import { useCreateBlockNote } from "@blocknote/react"
import { BlockNoteView } from "@blocknote/mantine"
import { useTheme } from "next-themes"

export function SharedNoteRenderer({ content }: { content: any }) {
    const { resolvedTheme } = useTheme()

    // Inicializa o Tiptap em modo estrito read-only
    const editor = useCreateBlockNote({
        initialContent: content,
    })

    if (!editor) return null

    return (
        <BlockNoteView
            editor={editor}
            theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
            editable={false}
        />
    )
}
