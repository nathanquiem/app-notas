"use client"

import { useState, useEffect } from "react"
import { updatePasswordContentAction } from "@/app/actions/passwords"
import { Loader2, Check } from "lucide-react"

interface PasswordEditorProps {
    passwordId: string
    initialContent: string
}

export function PasswordEditor({ passwordId, initialContent }: PasswordEditorProps) {
    const [content, setContent] = useState(initialContent)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(new Date())

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (content === initialContent) return // Evita salvamento sem mudanças reais desde a carga inicial

            setIsSaving(true)
            const res = await updatePasswordContentAction(passwordId, content)
            setIsSaving(false)

            if (res.success) {
                setLastSaved(new Date())
            }
        }, 1500)

        return () => clearTimeout(handler)
    }, [content, passwordId, initialContent])

    return (
        <div className="w-full h-full flex flex-col pt-2 relative">
            <div className="absolute -top-10 right-4 flex items-center justify-end text-xs font-medium text-gray-500 gap-2">
                {isSaving ? (
                    <><Loader2 size={14} className="animate-spin text-orange-500" /> Criptografando...</>
                ) : lastSaved ? (
                    <><Check size={14} className="text-green-500" /> Salvo em nuvem criptografada</>
                ) : null}
            </div>

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="DATABASE_PROD&#10;user: admin&#10;password: *******"
                className="flex-1 w-full bg-slate-900 text-green-400 p-6 rounded-xl font-mono text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 leading-relaxed shadow-inner"
                spellCheck={false}
            />
        </div>
    )
}
