"use client"

import { PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useSidebar } from "./SidebarProvider"

export function SidebarToggleBtn() {
    const { isOpen, toggle } = useSidebar()

    return (
        <button
            onClick={toggle}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors hidden md:flex mr-4"
            title={isOpen ? "Recolher Menu" : "Expandir Menu"}
        >
            {isOpen ? <PanelLeftClose size={16} /> : <PanelLeftOpen size={16} />}
        </button>
    )
}
