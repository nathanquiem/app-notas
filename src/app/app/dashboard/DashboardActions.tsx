"use client"

import { FileText, KeyRound, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createNoteServerAction } from "@/app/actions/notes"
import { CreatePasswordModal } from "@/components/vault/CreatePasswordModal"

export function DashboardActions() {
    const [loadingNote, setLoadingNote] = useState(false)
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
    const router = useRouter()

    const handleCreateNote = async () => {
        setLoadingNote(true)
        const res = await createNoteServerAction()
        if (res.id) {
            router.push(`/app/notas/${res.id}`)
        } else {
            setLoadingNote(false)
            alert(res.error || 'Erro ao criar nota')
        }
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            <button
                onClick={handleCreateNote}
                disabled={loadingNote}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-dashed border-border text-sm font-medium text-gray-600 dark:text-gray-300 disabled:opacity-70"
            >
                {loadingNote ? <Loader2 size={20} className="animate-spin text-[var(--color-primary-light)]" /> : <FileText size={20} className="text-[var(--color-primary-light)]" />}
                Nova Nota
            </button>
            <button
                onClick={() => setIsPasswordModalOpen(true)}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-dashed border-border text-sm font-medium text-gray-600 dark:text-gray-300"
            >
                <KeyRound size={20} className="text-[var(--color-primary-light)]" />
                Salvar Senha
            </button>

            {isPasswordModalOpen && <CreatePasswordModal onClose={() => setIsPasswordModalOpen(false)} />}
        </div>
    )
}
