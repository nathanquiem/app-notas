"use client"

import { useState } from "react"
import { LogOut } from "lucide-react"
import { logoutAction } from "@/app/actions/auth"

export function LogoutSidebarButton() {
    const [isLoggingOut, setIsLoggingOut] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        await logoutAction()
    }

    return (
        <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors text-left"
        >
            <LogOut size={18} />
            <span>{isLoggingOut ? 'Saindo...' : 'Sair'}</span>
        </button>
    )
}
