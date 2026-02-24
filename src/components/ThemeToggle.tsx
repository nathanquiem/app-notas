"use client"

import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
import { useEffect, useState } from "react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Previne hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-gray-700 dark:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary-light)]"
            title={`Mudar para modo ${theme === 'dark' ? 'claro' : 'escuro'}`}
        >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
    )
}
