import { notFound } from "next/navigation"
import { decryptText } from "@/lib/crypto"
import { BlockNoteView } from "@blocknote/mantine"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import { Share2, FileText, KeyRound, Lock } from "lucide-react"
import { SharedNoteRenderer } from "./SharedNoteRenderer"
import { SharedItemClientWrapper } from "./SharedItemClientWrapper"
import { SharedItemModalRenderer } from "./SharedItemModalRenderer"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export const dynamic = 'force-dynamic'

export default async function SharedItemPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params

    // Conecta como ADMIN (Bypassa o RLS) para que acessos públicos (sem auth.uid()) 
    // consigam carregar o link compartilhado.
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Busca o Token Unico
    const { data: link, error: linkError } = await supabaseAdmin
        .from('shared_links')
        .select('*')
        .eq('token', token)
        .single()

    if (linkError || !link) {
        if (linkError) console.error("Error fetching shared link:", linkError)
        notFound()
    }

    const isProtected = !!link.protected_password

    // 2. Busca e renderiza dependendo do Tipo
    if (link.entity_type === 'notes') {
        const { data: note, error } = await supabaseAdmin
            .from('notes')
            .select('*')
            .eq('id', link.entity_id)
            .single()

        if (error || !note || note.is_trashed) notFound()

        return (
            <SharedItemClientWrapper token={token} isProtected={isProtected}>
                <div className="min-h-screen bg-background text-foreground py-12 px-4 selection:bg-[var(--color-primary-light)] selection:text-white">
                    <main className="max-w-4xl mx-auto">
                        <div className="prose prose-slate max-w-none">
                            <div className="flex flex-col gap-3 mb-10 border-b border-border pb-6">
                                <h1 className="text-4xl font-bold text-[var(--color-marine)] dark:text-white mb-0 mt-0">{note.title}</h1>
                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">
                                    Documento Seguro via MyDocs
                                </div>
                            </div>
                            <SharedNoteRenderer content={note.content} />
                        </div>
                    </main>
                </div>
            </SharedItemClientWrapper>
        )
    }

    if (link.entity_type === 'passwords') {
        const { data: pwd, error } = await supabaseAdmin
            .from('passwords')
            .select('*')
            .eq('id', link.entity_id)
            .single()

        if (error || !pwd || pwd.is_trashed) notFound()

        let decryptedContent = "Erro de Descriptografia."
        try {
            decryptedContent = decryptText(pwd.password_encrypted)
        } catch (e) {
            // ...
        }

        return (
            <SharedItemClientWrapper token={token} isProtected={isProtected}>
                <div className="min-h-screen bg-background text-foreground py-12 px-4 selection:bg-[var(--color-primary-light)] selection:text-white">
                    <main className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
                            <Share2 size={16} /> <span>Compartilhado via MyDocs</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12">
                            <div className="flex items-center gap-3 mb-8 border-b border-border pb-6">
                                <Lock className="text-orange-500" size={32} />
                                <h1 className="text-4xl font-bold text-orange-600 dark:text-orange-500 mb-0">{pwd.title}</h1>
                            </div>

                            <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 overflow-x-auto shadow-inner">
                                <pre className="font-mono text-sm sm:text-base text-green-400 whitespace-pre-wrap break-all">
                                    {decryptedContent}
                                </pre>
                            </div>
                        </div>
                    </main>
                </div>
            </SharedItemClientWrapper>
        )
    }

    if (link.entity_type === 'folders') {
        const { data: folder, error: folderErr } = await supabaseAdmin
            .from('folders')
            .select('*')
            .eq('id', link.entity_id)
            .single()

        if (folderErr || !folder) notFound()

        // Busca o conteúdo publicamente legível (tudo que não tiver is_trashed)
        const { data: notes } = await supabaseAdmin.from('notes').select('id, title, updated_at, content').eq('folder_id', folder.id).eq('is_trashed', false)
        const { data: passwords } = await supabaseAdmin.from('passwords').select('id, title, updated_at, password_encrypted').eq('folder_id', folder.id).eq('is_trashed', false)

        return (
            <SharedItemClientWrapper token={token} isProtected={isProtected}>
                <div className="min-h-screen bg-background text-foreground py-12 px-4 selection:bg-[var(--color-primary-light)] selection:text-white">
                    <main className="max-w-4xl mx-auto">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-8">
                            <Share2 size={16} /> <span>Pasta Compartilhada via MyDocs</span>
                        </div>

                        <div className="bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-8 sm:p-12">
                            <div className="flex items-center gap-3 mb-8 border-b border-border pb-6">
                                <FileText className="text-blue-500" size={32} />
                                <h1 className="text-4xl font-bold text-[var(--color-marine)] dark:text-white mb-0">{folder.name}</h1>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4">Notas Contidas na Pasta</h3>
                                    {notes && notes.length > 0 ? (
                                        <ul className="grid gap-4 sm:grid-cols-2">
                                            {notes.map(n => (
                                                <li key={n.id} className="relative group p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border flex flex-col items-start hover:border-blue-500/50 hover:shadow-sm transition-all">
                                                    <div className="flex items-center gap-2 mb-2 w-full">
                                                        <FileText size={16} className="text-blue-500" />
                                                        <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{n.title}</span>
                                                    </div>
                                                    <div className="w-full mt-2 pt-2 border-t border-border flex justify-end">
                                                        <SharedItemModalRenderer
                                                            type="notes"
                                                            title={n.title}
                                                            content={n.content}
                                                        />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : <p className="text-sm text-gray-500">Nenhuma nota nesta pasta.</p>}
                                </div>

                                <div>
                                    <h3 className="font-semibold text-lg border-b border-border pb-2 mb-4">Cofres de Senha</h3>
                                    {passwords && passwords.length > 0 ? (
                                        <ul className="grid gap-4 sm:grid-cols-2">
                                            {passwords.map(p => {
                                                let decryptedPass = "Falha ao descriptografar"
                                                try { decryptedPass = decryptText(p.password_encrypted) } catch (e) { }

                                                return (
                                                    <li key={p.id} className="relative group p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-border flex flex-col items-start hover:border-orange-500/50 hover:shadow-sm transition-all">
                                                        <div className="flex items-center gap-2 mb-2 w-full">
                                                            <KeyRound size={16} className="text-orange-500" />
                                                            <span className="font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{p.title}</span>
                                                        </div>
                                                        <div className="w-full mt-2 pt-2 border-t border-border flex justify-end">
                                                            <SharedItemModalRenderer
                                                                type="passwords"
                                                                title={p.title}
                                                                content={decryptedPass}
                                                            />
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    ) : <p className="text-sm text-gray-500">Nenhum cofre nesta pasta.</p>}
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </SharedItemClientWrapper>
        )
    }

    return notFound()
}
