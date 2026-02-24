"use client"

import { useState } from "react"
import { Trash2, Loader2 } from "lucide-react"
import { moveToTrashAction } from "@/app/actions/trash"
import { useRouter } from "next/navigation"

interface TrashButtonProps {
    id: string
    entity: 'notes' | 'passwords'
}

export function TrashButton({ id, entity }: TrashButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleTrash = async () => {
        if (!confirm("Deseja mover este item para a lixeira?")) return

        setIsDeleting(true)
        const res = await moveToTrashAction(id, entity)

        if (res.success) {
            const redirectPath = entity === 'notes' ? 'notas' : 'senhas'
            router.push(`/app/${redirectPath}`)
        } else {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleTrash}
            disabled={isDeleting}
            className="p-2 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
            title="Mover para Lixeira"
        >
            {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
        </button>
    )
}
