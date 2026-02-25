import { FileText, KeyRound, Network, Share2, Star } from "lucide-react"
import { createClient } from '@/lib/supabase/server'
import { DashboardActions } from './DashboardActions'
import Link from "next/link"

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface RecentItem {
    id: string
    title: string
    is_favorite: boolean
    updated_at: string
    type: 'note' | 'password'
    url: string
}

export default async function DashboardPage() {
    const supabase = await createClient()

    // Realiza fetchings em paralelo
    const [
        { count: notesCount, data: recentNotes },
        { count: passwordsCount, data: recentPasswords }
    ] = await Promise.all([
        supabase.from('notes').select('id, title, is_favorite, updated_at', { count: 'exact' }).eq('is_trashed', false).order('updated_at', { ascending: false }).limit(5),
        supabase.from('passwords').select('id, title, is_favorite, updated_at', { count: 'exact' }).eq('is_trashed', false).order('updated_at', { ascending: false }).limit(5),
    ])

    // Combina e ordena os itens recentes
    let recentItems: RecentItem[] = []

    if (recentNotes) {
        recentNotes.forEach(n => recentItems.push({ ...n, type: 'note', url: `/app/notas/${n.id}` }))
    }
    if (recentPasswords) {
        recentPasswords.forEach(p => recentItems.push({ ...p, type: 'password', url: `/app/senhas/${p.id}` }))
    }

    // Ordenar pela data de atualização
    recentItems.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    recentItems = recentItems.slice(0, 5)

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white">Seu Workspace</h1>
                <p className="text-gray-500 dark:text-gray-400">Bem-vindo ao MyDocs. Aqui está um resumo do seu cofre.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-100/50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                            <FileText size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total de Notas</p>
                            <h3 className="text-2xl font-bold">{notesCount || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-orange-100/50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                            <KeyRound size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Senhas Salvas</p>
                            <h3 className="text-2xl font-bold">{passwordsCount || 0}</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-green-100/50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                            <Share2 size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Links Ativos</p>
                            <h3 className="text-2xl font-bold">0</h3>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-purple-100/50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                            <Network size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conexões</p>
                            <h3 className="text-2xl font-bold">0</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">Acesso Recente</h3>
                    <div className="space-y-4">
                        {recentItems.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Nenhum item recente encontrado.</p>
                        ) : (
                            recentItems.map(item => (
                                <Link href={item.url} key={item.id} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0 group">
                                    <div className="flex items-center gap-3">
                                        {item.type === 'note' && <FileText size={16} className="text-blue-500 drop-shadow-sm" />}
                                        {item.type === 'password' && <KeyRound size={16} className="text-orange-500 drop-shadow-sm" />}
                                        <span className="font-medium text-sm group-hover:text-[var(--color-primary)] transition-colors line-clamp-1">{item.title}</span>
                                        {item.is_favorite && <Star size={14} className="text-yellow-500 fill-yellow-500 drop-shadow-sm ml-1" />}
                                    </div>
                                    <span className="text-xs text-gray-400 whitespace-nowrap">
                                        {new Date(item.updated_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                <div className="col-span-3 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">Ações Rápidas</h3>
                    <DashboardActions />
                </div>
            </div>
        </div>
    )
}
