import { createClient } from "@/lib/supabase/server"
import { PasswordEditor } from "@/components/editor/PasswordEditor"
import { Star, Clock, Lock } from "lucide-react"
import { redirect } from "next/navigation"
import { decryptText } from "@/lib/crypto"
import { TrashButton } from "@/components/common/TrashButton"
import { FolderSelect } from "@/components/common/FolderSelect"
import { DocumentTitleInput } from "@/components/common/DocumentTitleInput"
import { ShareButton } from "@/components/common/ShareButton"
import { FavoriteButton } from "@/components/common/FavoriteButton"

export default async function PasswordDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Busca cofre via ID (Garantido pelo RLS)
    const { data: pwd, error } = await supabase
        .from('passwords')
        .select('*')
        .eq('id', id)
        .eq('is_trashed', false)
        .single()

    if (error || !pwd) {
        redirect('/app/senhas')
    }

    // Descriptografia em nivel de Servidor usando Node Crypto (APP_ENCRYPTION_KEY)
    let rawContent = ""
    try {
        rawContent = decryptText(pwd.password_encrypted)
    } catch (e) {
        rawContent = "ERRO: O conteúdo estava corrompido ou a chave global de criptografia local mudou."
    }

    const updatedAt = new Date(pwd.updated_at || pwd.created_at).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    })

    return (
        <div className="space-y-6 max-w-5xl mx-auto h-full flex flex-col pt-4">
            <div className="flex items-start justify-between">
                <div className="max-w-2xl w-full">
                    <div className="flex items-center gap-3">
                        <Lock className="text-orange-500" size={28} />
                        <DocumentTitleInput
                            id={pwd.id}
                            initialTitle={pwd.title}
                            entity="passwords"
                            colorClass="text-orange-600 dark:text-orange-500 focus:border-orange-200"
                        />
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mt-2 ml-10">
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> Atualizado: {updatedAt}
                        </span>
                        <FolderSelect itemId={pwd.id} currentFolderId={pwd.folder_id} entity="passwords" />
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <ShareButton entityId={pwd.id} entityType="passwords" />
                    <FavoriteButton id={pwd.id} entity="passwords" initialIsFavorite={pwd.is_favorite} />
                    <TrashButton id={pwd.id} entity="passwords" />
                </div>
            </div>

            <div className="flex-1 mt-8 max-w-none max-h-screen">
                <PasswordEditor
                    key={pwd.id}
                    passwordId={pwd.id}
                    initialContent={rawContent}
                />
            </div>
        </div>
    )
}
