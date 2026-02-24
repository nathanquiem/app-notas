import { ReactNode } from 'react'
import Link from 'next/link'
import { Search, LayoutDashboard, FileText, KeyRound, Network, Share2, Star, Trash2, Settings, LogOut } from 'lucide-react'
import { FolderTree } from '@/components/sidebar/FolderTree'
import { GlobalCommandPalette } from '@/components/sidebar/GlobalCommandPalette'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogoutSidebarButton } from '@/components/sidebar/LogoutSidebarButton'
import { HeaderSearch } from '@/components/sidebar/HeaderSearch'
import { HeaderWidgets } from '@/components/sidebar/HeaderWidgets'
import { SidebarProvider } from '@/components/sidebar/SidebarProvider'
import { AppSidebarContent } from '@/components/sidebar/AppSidebarContent'
import Image from 'next/image'

export default function AppLayout({ children }: { children: ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebarContent>
                {children}
            </AppSidebarContent>
        </SidebarProvider>
    )
}

