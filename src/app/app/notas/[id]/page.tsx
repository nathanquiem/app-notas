import { createClient } from "@/lib/supabase/server"
import dynamic from "next/dynamic"
import { Star, Clock } from "lucide-react"
import { redirect } from "next/navigation"
import { TrashButton } from "@/components/common/TrashButton"
import { FolderSelect } from "@/components/common/FolderSelect"
import { DocumentTitleInput } from "@/components/common/DocumentTitleInput"
import { ShareButton } from "@/components/common/ShareButton"
import { FavoriteButton } from "@/components/common/FavoriteButton"
import { NoteEditorDynamic } from "@/components/editor/NoteEditorDynamic"

export default async function NoteDetailPage({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const supabase = await createClient()

    // Busca nota via ID garantindo (implicitamente via RLS) proteção de leitura
    const { data: note, error } = await supabase
        .from('notes')
        .select('*')
        .eq('id', id)
        .eq('is_trashed', false)
        .single()

    if (error || !note) {
        redirect('/app/notas')
    }

    // Formatador de Data de atualização
    const updatedAt = new Date(note.updated_at).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short'
    })

    return (
        <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col pt-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="max-w-2xl w-full">
                    <div className="flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <DocumentTitleInput
                                id={note.id}
                                initialTitle={note.title}
                                entity="notes"
                                colorClass="text-[var(--color-marine)] dark:text-white focus:border-[var(--color-primary-light)]"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mt-2">
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> Atualizado: {updatedAt}
                        </span>
                        <FolderSelect itemId={note.id} currentFolderId={note.folder_id} entity="notes" />
                    </div>
                </div>
                <div className="flex items-center gap-1 self-end md:self-auto">
                    <ShareButton entityId={note.id} entityType="notes" />
                    <FavoriteButton id={note.id} entity="notes" initialIsFavorite={note.is_favorite} />
                    <TrashButton id={note.id} entity="notes" />
                </div>
            </div>

            <div className="flex-1 mt-6 prose prose-slate max-w-none">
                <NoteEditorDynamic
                    key={note.id}
                    noteId={note.id}
                    initialContent={note.content}
                />
            </div>
        </div>
    )
}
