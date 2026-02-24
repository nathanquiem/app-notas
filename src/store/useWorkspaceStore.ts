import { create } from 'zustand'
import { Folder } from '@/types/database'
import { createClient } from '@/lib/supabase/client'

interface WorkspaceState {
    folders: Folder[]
    isLoading: boolean
    error: string | null

    // Actions
    fetchFolders: () => Promise<void>
    createFolder: (name: string, parentId: string | null, color?: string) => Promise<Folder | null>
    deleteFolder: (id: string) => Promise<boolean>
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    folders: [],
    isLoading: false,
    error: null,

    fetchFolders: async () => {
        set({ isLoading: true, error: null })
        const supabase = createClient()

        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
            set({ isLoading: false, error: 'Usuário não autenticado' })
            return
        }

        const { data, error } = await supabase
            .from('folders')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) {
            set({ isLoading: false, error: error.message })
            return
        }

        set({ folders: data || [], isLoading: false })
    },

    createFolder: async (name: string, parentId: string | null, color?: string) => {
        const supabase = createClient()
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) return null

        const newFolder = {
            name,
            parent_id: parentId,
            color: color || null,
            user_id: userData.user.id
        }

        const { data, error } = await supabase
            .from('folders')
            .insert(newFolder)
            .select()
            .single()

        if (error) {
            set({ error: error.message })
            return null
        }

        // Atualiza estado local adicionando no array
        set((state) => ({ folders: [...state.folders, data] }))
        return data
    },

    deleteFolder: async (id: string) => {
        const supabase = createClient()
        const { error } = await supabase
            .from('folders')
            .delete()
            .eq('id', id)

        if (error) {
            set({ error: error.message })
            return false
        }

        // Atualiza árvore local e remove eventuais filhos (delete em cascata local)
        set((state) => ({
            folders: state.folders.filter(f => f.id !== id && f.parent_id !== id)
        }))

        return true
    }
}))
