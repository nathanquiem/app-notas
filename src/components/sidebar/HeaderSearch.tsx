"use client"

import { Search } from "lucide-react"

export function HeaderSearch() {
    return (
        <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
            className="md:w-72 h-10 rounded-full bg-slate-100 dark:bg-slate-900 border-transparent border focus:ring-2 focus:ring-[var(--color-primary-light)] flex items-center px-4 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-all gap-2 shadow-sm"
        >
            <Search size={16} />
            <span className="flex-1 text-left">Busca Rápida...</span>
            <kbd className="hidden md:inline-flex items-center text-[10px] font-medium text-gray-400 bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded shadow-sm border border-border">⌘/CTRL K</kbd>
        </button>
    )
}
