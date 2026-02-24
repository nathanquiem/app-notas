"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
    isOpen: boolean
    toggle: () => void
    setIsOpen: (val: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(true)

    // Optional: Load state from localStorage so it persists across reloads
    useEffect(() => {
        const saved = localStorage.getItem('mydocs-sidebar-open')
        if (saved !== null) {
            setIsOpen(saved === 'true')
        }
    }, [])

    const toggle = () => {
        setIsOpen(prev => {
            const newVal = !prev
            localStorage.setItem('mydocs-sidebar-open', String(newVal))
            return newVal
        })
    }

    const value = {
        isOpen,
        toggle,
        setIsOpen: (val: boolean) => {
            localStorage.setItem('mydocs-sidebar-open', String(val))
            setIsOpen(val)
        }
    }

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = useContext(SidebarContext)
    if (!context) throw new Error("useSidebar must be used within a SidebarProvider")
    return context
}
