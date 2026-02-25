"use client"

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, LayoutDashboard, FileText, KeyRound, Network, Share2, Star, Trash2, Settings, Wallet, Menu } from 'lucide-react'
import { FolderTree } from '@/components/sidebar/FolderTree'
import { GlobalCommandPalette } from '@/components/sidebar/GlobalCommandPalette'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogoutSidebarButton } from '@/components/sidebar/LogoutSidebarButton'
import { HeaderSearch } from '@/components/sidebar/HeaderSearch'
import { HeaderWidgets } from '@/components/sidebar/HeaderWidgets'
import { SidebarToggleBtn } from '@/components/sidebar/SidebarToggleBtn'
import { useSidebar } from '@/components/sidebar/SidebarProvider'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'

export function AppSidebarContent({ children }: { children: ReactNode }) {
    const { isOpen: isDesktopOpen } = useSidebar()
    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [userMeta, setUserMeta] = useState<{ name: string, avatar: string } | null>(null)
    const supabase = createClient()

    useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user?.user_metadata) {
                setUserMeta({
                    name: user.user_metadata.full_name || '',
                    avatar: user.user_metadata.avatar_url || ''
                })
            }
        })
    }, [])

    const closeMobileSidebar = () => setIsMobileOpen(false)

    // Sidebar Content Component to avoid duplication
    const SidebarInner = () => (
        <>
            <div className="h-16 flex items-center px-6 border-b border-border flex-shrink-0">
                <Link href="/app/dashboard" className="flex items-center gap-2 group" onClick={closeMobileSidebar}>
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-transform group-hover:scale-105">
                        <Image src="/logo.png" alt="MyDocs Logo" width={24} height={24} className="object-cover" />
                    </div>
                    <span className="font-bold text-lg tracking-tight text-[var(--color-marine)] dark:text-white">MyDocs</span>
                </Link>
            </div>

            <div className="p-4 flex-1 overflow-y-auto space-y-6">
                {/* Main Navigation */}
                <div className="space-y-1">
                    <Link href="/app/dashboard" onClick={closeMobileSidebar} className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg bg-slate-100 dark:bg-slate-800 text-[var(--color-primary)] font-medium transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
                        <LayoutDashboard size={18} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/app/notas" onClick={closeMobileSidebar} className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
                        <FileText size={18} />
                        <span>Notas</span>
                    </Link>
                    <Link href="/app/senhas" onClick={closeMobileSidebar} className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
                        <KeyRound size={18} />
                        <span>Cofre de Senhas</span>
                    </Link>
                    <Link href="/app/financas" onClick={closeMobileSidebar} className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
                        <Wallet size={18} />
                        <span>Finanças</span>
                    </Link>
                </div>

                {/* secondary nav */}
                <div>
                    <div className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Workspace</div>
                    <div className="space-y-1">
                        <Link href="/app/compartilhados" onClick={closeMobileSidebar} className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
                            <Share2 size={18} />
                            <span>Compartilhados</span>
                        </Link>
                        <Link href="/app/favoritos" onClick={closeMobileSidebar} className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
                            <Star size={18} />
                            <span>Favoritos</span>
                        </Link>
                        <Link href="/app/lixeira" onClick={closeMobileSidebar} className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:text-gray-300 dark:hover:text-red-400 transition-colors">
                            <Trash2 size={18} />
                            <span>Lixeira</span>
                        </Link>
                    </div>

                    <div onClick={closeMobileSidebar} className="mt-2">
                        <FolderTree />
                    </div>
                </div>
            </div>

            {/* Footer Nav */}
            <div className="p-3 border-t border-border space-y-1 flex flex-col flex-shrink-0">
                <Link href="/app/configuracoes" onClick={closeMobileSidebar} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300 transition-colors">
                    <Settings size={18} />
                    <span>Configurações</span>
                </Link>
                <div onClick={closeMobileSidebar}>
                    <LogoutSidebarButton />
                </div>

                <div className="pt-3 mt-1 text-center">
                    <a
                        href="https://nathanquiem.com.br/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-medium text-gray-400 hover:text-[var(--color-primary)] dark:hover:text-gray-200 transition-colors"
                    >
                        Desenvolvido por Nathan Quiem
                    </a>
                </div>
            </div>
        </>
    )

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">

            {/* Mobile Sidebar Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card flex flex-col transition-transform duration-300 md:hidden ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarInner />
            </aside>

            {/* Desktop Sidebar */}
            {isDesktopOpen && (
                <aside className="w-64 border-r border-border bg-card hidden md:flex flex-col flex-shrink-0 animate-in slide-in-from-left-4 duration-300">
                    <SidebarInner />
                </aside>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-background transition-all duration-300">
                {/* Topbar Placeholder */}
                <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 flex-shrink-0">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        <SidebarToggleBtn />
                        <button
                            onClick={() => setIsMobileOpen(true)}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors md:hidden"
                        >
                            <Menu size={20} />
                        </button>
                        <div className="flex-1 min-w-0 max-w-[200px] sm:max-w-xs">
                            <HeaderSearch />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-4 pl-2">
                        <HeaderWidgets />
                        {/* Theme Toggle Provider (next-themes) */}
                        <div className="hidden sm:block">
                            <ThemeToggle />
                        </div>
                        {/* Avatar placeholder */}
                        <div className="flex-shrink-0">
                            {userMeta?.avatar ? (
                                <img src={userMeta.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border-2 border-transparent hover:border-[var(--color-primary-light)] transition-all cursor-pointer" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[var(--color-marine)] text-white flex items-center justify-center font-bold text-sm cursor-pointer border-2 border-transparent hover:border-[var(--color-primary-light)] transition-all">
                                    {userMeta?.name ? userMeta.name.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-background p-4 lg:p-8">
                    <div className="max-w-6xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>

            <GlobalCommandPalette />
        </div>
    )
}
