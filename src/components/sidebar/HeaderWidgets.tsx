"use client"

import { RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function HeaderWidgets() {
    const router = useRouter()
    const [time, setTime] = useState<Date | null>(null)
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        setTime(new Date())
        const interval = setInterval(() => setTime(new Date()), 60000) // update every minute
        return () => clearInterval(interval)
    }, [])

    const handleRefresh = () => {
        setIsRefreshing(true)
        router.refresh()
        setTimeout(() => setIsRefreshing(false), 500)
    }

    return (
        <div className="flex items-center gap-4 border-r border-border pr-4 mr-2 hidden md:flex">
            {time && (
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {time.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })} • {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
            )}
            <button
                onClick={handleRefresh}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Atualizar Dados"
            >
                <RefreshCw size={14} className={isRefreshing ? "animate-spin text-[var(--color-primary-light)]" : ""} />
            </button>
        </div>
    )
}
