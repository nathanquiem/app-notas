import { create } from 'zustand'
import { FinanceTransaction, FinanceCategory } from '@/types/database'
import { createClient } from '@/lib/supabase/client'
import {
    createTransactionAction,
    updateTransactionStatusAction,
    deleteTransactionAction,
    updateTransactionAction, // new
    createCategoryAction,
    deleteCategoryAction,
    updateCategoryAction // new
} from '@/app/actions/finance'

interface FinanceState {
    transactions: FinanceTransaction[]
    categories: FinanceCategory[]
    isLoading: boolean
    isLoadingCategories: boolean
    error: string | null

    // Actions
    fetchInitialData: (month: number, year: number) => Promise<void>
    createTransaction: (data: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>
    updateTransaction: (id: string, data: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>
    toggleTransactionStatus: (id: string, currentStatus: 'PAID' | 'PENDING') => Promise<boolean>
    deleteTransaction: (id: string) => Promise<boolean>

    createCategory: (name: string, color: string) => Promise<boolean>
    updateCategory: (id: string, name: string, color: string) => Promise<boolean>
    deleteCategory: (id: string) => Promise<boolean>
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
    transactions: [],
    categories: [],
    isLoading: false,
    isLoadingCategories: false,
    error: null,

    fetchInitialData: async (month: number, year: number) => {
        set({ isLoading: true, isLoadingCategories: true, error: null })
        const supabase = createClient()

        // As categorias são pequenas, abaixamos todas de uma vez
        const { data: catData, error: catError } = await supabase
            .from('finance_categories')
            .select('*')
            .order('name', { ascending: true })

        if (catError) {
            set({ error: catError.message, isLoadingCategories: false })
        } else {
            set({ categories: catData || [], isLoadingCategories: false })
        }

        // Transactions filtradas por mês/ano atual para não pesar a RAM
        // Em um app real, podemos usar .gte() e .lte() para o primeiro e último dia do mês
        const startDate = new Date(year, month, 1).toISOString().split('T')[0]
        const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0]

        const { data: transData, error: transError } = await supabase
            .from('finance_transactions')
            .select('*')
            .gte('date', startDate)
            .lte('date', endDate)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false })

        if (transError) {
            set({ error: transError.message, isLoading: false })
        } else {
            set({ transactions: transData || [], isLoading: false })
        }
    },

    createTransaction: async (data) => {
        const res = await createTransactionAction(data)
        if (res.error) {
            set({ error: res.error })
            return false
        }
        return true
    },

    updateTransaction: async (id, data) => {
        const res = await updateTransactionAction(id, data)
        if (res.error) {
            set({ error: res.error })
            return false
        }
        return true
    },

    toggleTransactionStatus: async (id, currentStatus) => {
        const newStatus = currentStatus === 'PAID' ? 'PENDING' : 'PAID'

        // Optimistic UI Update
        const previousTransactions = get().transactions
        set({
            transactions: previousTransactions.map(t =>
                t.id === id ? { ...t, status: newStatus } : t
            )
        })

        const res = await updateTransactionStatusAction(id, newStatus)
        if (res.error) {
            // Revert on failure
            set({ transactions: previousTransactions, error: res.error })
            return false
        }
        return true
    },

    deleteTransaction: async (id) => {
        const previousTransactions = get().transactions
        set({ transactions: previousTransactions.filter(t => t.id !== id) })

        const res = await deleteTransactionAction(id)
        if (res.error) {
            set({ transactions: previousTransactions, error: res.error })
            return false
        }
        return true
    },

    createCategory: async (name, color) => {
        const res = await createCategoryAction({ name, color })
        if (res.error || !res.category) {
            set({ error: res.error || 'Erro desconhecido' })
            return false
        }

        // Atualiza a lista
        set(state => ({
            categories: [...state.categories, res.category as FinanceCategory].sort((a, b) => a.name.localeCompare(b.name))
        }))
        return true
    },

    updateCategory: async (id, name, color) => {
        const res = await updateCategoryAction(id, { name, color })
        if (res.error || !res.category) {
            set({ error: res.error || 'Erro ao atualizar (Talvez seja uma categoria padrão não-editável)' })
            return false
        }

        // Atualiza a lista localmente
        set(state => ({
            categories: state.categories.map(c => c.id === id ? res.category as FinanceCategory : c).sort((a, b) => a.name.localeCompare(b.name))
        }))
        return true
    },

    deleteCategory: async (id) => {
        const previousCategories = get().categories
        set({ categories: previousCategories.filter(c => c.id !== id) })

        const res = await deleteCategoryAction(id)
        if (res.error) {
            set({ categories: previousCategories, error: res.error })
            return false
        }
        return true
    }
}))
