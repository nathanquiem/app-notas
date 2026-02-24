"use client"

import { useState, useEffect } from "react"
import { updateDocumentTitleAction } from "@/app/actions/documents"

interface DocumentTitleInputProps {
    id: string
    initialTitle: string
    entity: 'notes' | 'passwords'
    colorClass: string
}

export function DocumentTitleInput({ id, initialTitle, entity, colorClass }: DocumentTitleInputProps) {
    const [title, setTitle] = useState(initialTitle)
    const [isSaving, setIsSaving] = useState(false)

    // Sincroniza o prop caso mude via Server Components
    useEffect(() => {
        setTitle(initialTitle)
    }, [initialTitle])

    const handleBlur = async () => {
        if (title.trim() === '' || title === initialTitle) {
            setTitle(initialTitle)
            return
        }

        setIsSaving(true)
        const res = await updateDocumentTitleAction(entity, id, title)
        setIsSaving(false)

        if (!res.success) {
            alert("Erro ao salvar o título: " + res.error)
            setTitle(initialTitle)
        }
    }

    return (
        <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            disabled={isSaving}
            title="title"
            className={`w-full text-4xl font-bold tracking-tight bg-transparent outline-none border-b border-transparent transition-colors py-2 ${colorClass}`}
        />
    )
}
