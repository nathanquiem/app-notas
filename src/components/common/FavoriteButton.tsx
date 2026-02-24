"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { toggleFavoriteAction } from "@/app/actions/documents"
import { useRouter } from "next/navigation"

interface FavoriteButtonProps {
    id: string
    entity: 'notes' | 'passwords'
    initialIsFavorite: boolean
}

export function FavoriteButton({ id, entity, initialIsFavorite }: FavoriteButtonProps) {
    const [isFav, setIsFav] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleToggle = async () => {
        setIsLoading(true)
        // Optimistic UI update
        const previousState = isFav
        setIsFav(!isFav)

        const res = await toggleFavoriteAction(entity, id, !previousState)

        if (!res.success) {
            alert("Erro ao favoritar item: " + res.error)
            setIsFav(previousState) // Revert on error
        }
        setIsLoading(false)
        router.refresh()
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading}
            className={`p-2 rounded-md transition-colors ${isFav
                    ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                    : 'text-gray-400 hover:text-gray-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
            <Star size={20} fill={isFav ? 'currentColor' : 'none'} className={isLoading ? 'opacity-50' : 'opacity-100'} />
        </button>
    )
}
