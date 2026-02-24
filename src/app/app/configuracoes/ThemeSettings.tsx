"use client"

import { useTheme } from "next-themes"
import { Monitor, Moon, Sun } from "lucide-react"

export function ThemeSettings() {
    const { theme, setTheme } = useTheme()

    return (
        <div className="flex gap-4">
            <button
                onClick={() => setTheme('light')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${theme === 'light' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-slate-50 border-transparent text-gray-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'}`}
            >
                <Sun size={16} /> Tema Claro
            </button>
            <button
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${theme === 'dark' ? 'bg-slate-800 border-slate-600 text-white' : 'bg-slate-50 border-transparent text-gray-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-gray-300 dark:hover:bg-slate-800'}`}
            >
                <Moon size={16} /> Tema Escuro
            </button>
            <button
                onClick={() => setTheme('system')}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium transition-colors ${theme === 'system' ? 'bg-slate-200 border-slate-400 text-slate-800 dark:bg-slate-700 dark:border-slate-500 dark:text-white' : 'bg-slate-50 border-transparent text-gray-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-gray-300 dark:hover:bg-slate-700'}`}
            >
                <Monitor size={16} /> Sistema
            </button>
        </div>
    )
}
