import { Star, FileText, KeyRound, Clock } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Link from "next/link"

export const dynamic = 'force-dynamic'

export default async function FavoritesIndexPage() {
    const supabase = await createClient()

    // Fetch favorites
    const [
        { data: favNotes },
        { data: favPasswords }
    ] = await Promise.all([
        supabase.from('notes').select('id, title, updated_at, is_favorite').eq('is_favorite', true).eq('is_trashed', false),
        supabase.from('passwords').select('id, title, updated_at, is_favorite').eq('is_favorite', true).eq('is_trashed', false)
    ])

    const hasFavorites = (favNotes && favNotes.length > 0) || (favPasswords && favPasswords.length > 0)

    return (
        <div className="space-y-8 h-full flex flex-col pt-4 pb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white flex items-center gap-2">
                        <Star className="text-yellow-500" fill="currentColor" /> Favoritos
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Encontre rapidamente suas notas e credenciais fixadas.</p>
                </div>
            </div>

            {!hasFavorites ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl bg-slate-50 dark:bg-slate-900/20 text-center max-w-lg mx-auto px-4 mt-12 min-h-[300px]">
                    <div className="w-16 h-16 bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Star size={32} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sem favoritos</h3>
                    <p className="text-sm text-gray-500 mb-6">
                        Você ainda não marcou nenhum item como favorito. Utilize o ícone de estrela nas notas ou credenciais para fixá-las aqui.
                    </p>
                </div>
            ) : (
                <div className="space-y-10">
                    {/* Notas Favoritas */}
                    {favNotes && favNotes.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                <FileText size={16} /> Notas
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {favNotes.map(note => (
                                    <Link href={`/app/notas/${note.id}`} key={note.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-32 hover:border-[var(--color-primary-light)]">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{note.title}</h3>
                                            <Star size={18} fill="currentColor" className="text-yellow-500 shrink-0" />
                                        </div>
                                        <div className="mt-4 flex flex-col text-xs text-gray-500 font-medium pt-2 border-t border-border">
                                            <span className="flex items-center gap-1"><Clock size={12} /> Atualizado {new Date(note.updated_at).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Senhas Favoritas */}
                    {favPasswords && favPasswords.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                                <KeyRound size={16} /> Cofres de Senha
                            </h3>
                            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {favPasswords.map(pwd => (
                                    <Link href={`/app/senhas/${pwd.id}`} key={pwd.id} className="group flex flex-col justify-between rounded-xl border border-border bg-card p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-32 hover:border-orange-200 dark:hover:border-orange-900/50">
                                        <div className="flex items-start justify-between">
                                            <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">{pwd.title}</h3>
                                            <Star size={18} fill="currentColor" className="text-yellow-500 shrink-0" />
                                        </div>
                                        <div className="mt-4 flex flex-col text-xs text-gray-500 font-medium pt-2 border-t border-border">
                                            <span className="flex items-center gap-1"><Clock size={12} /> Atualizado {new Date(pwd.updated_at).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
