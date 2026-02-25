"use client"

import { useState, useEffect, useRef } from "react"
import { updatePasswordContentAction } from "@/app/actions/passwords"
import { Loader2, Check } from "lucide-react"
import { BlockNoteEditor, PartialBlock } from "@blocknote/core"
import { BlockNoteView } from "@blocknote/mantine"
import { useCreateBlockNote } from "@blocknote/react"
import "@blocknote/core/fonts/inter.css"
import "@blocknote/mantine/style.css"
import { useTheme } from "next-themes"

interface PasswordEditorProps {
    passwordId: string
    initialContent: string
}

export function PasswordEditor({ passwordId, initialContent }: PasswordEditorProps) {
    const { resolvedTheme } = useTheme()
    const [isSaving, setIsSaving] = useState(false)
    const [lastSaved, setLastSaved] = useState<Date | null>(new Date())
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Tenta parsear o initialContent. Se não for um JSON válido do BlockNote (dados antigos/raw text), 
    // converte para um array de PartialBlock de texto simples.
    let parsedInitial: PartialBlock[] | undefined = undefined
    try {
        if (initialContent && initialContent.trim() !== "") {
            const parsed = JSON.parse(initialContent)
            if (Array.isArray(parsed) && parsed.length > 0) {
                parsedInitial = parsed
            } else {
                // Caso seja um JSON mas não array
                parsedInitial = [{ type: "paragraph", content: initialContent }]
            }
        }
    } catch {
        // Se falhar no parse, significa que era um texto simples legado sem formatação
        if (initialContent && initialContent.trim() !== "") {
            // Separa por quebras de linha para manter a formatação visual legada
            parsedInitial = initialContent.split('\n').map(line => ({
                type: "paragraph",
                content: line
            })) as PartialBlock[]
        }
    }

    // Inicializa o Tiptap / BlockNote
    const editor = useCreateBlockNote({
        initialContent: parsedInitial,
    })

    const saveToDatabase = async (currentBlocks: any[]) => {
        setIsSaving(true)
        // Salva o JSON estruturado do BlockNote como string (o servidor cuidará da criptografia disso)
        const contentString = JSON.stringify(currentBlocks)
        const res = await updatePasswordContentAction(passwordId, contentString)
        setIsSaving(false)

        if (res.success) {
            setLastSaved(new Date())
        }
    }

    // Handler de alteração (onChange no BlockNoteView)
    const handleEditorChange = () => {
        if (!editor) return

        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current)
        }

        saveTimeoutRef.current = setTimeout(() => {
            saveToDatabase(editor.document)
        }, 1500)
    }

    return (
        <div className="w-full h-full flex flex-col pt-2 relative pb-32">
            <div className="absolute -top-10 right-4 flex items-center justify-end text-xs font-medium text-gray-500 gap-2">
                {isSaving ? (
                    <><Loader2 size={14} className="animate-spin text-orange-500" /> Criptografando...</>
                ) : lastSaved ? (
                    <><Check size={14} className="text-green-500" /> Salvo em nuvem criptografada</>
                ) : null}
            </div>

            <div className="flex-1 w-full bg-[#050505] border border-blue-500/30 rounded-xl overflow-y-auto shadow-inner pt-4">
                <BlockNoteView
                    editor={editor}
                    theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
                    className="min-h-[500px] password-vault-editor"
                    onChange={handleEditorChange}
                />
            </div>
            {/* 
              Customizamos o CSS com baixa especificidade para que o texto padrão continue "Blue"
              mas permitindo que o BlockNote sobrescreva a cor quando o usuário desejar.
            */}
            <style jsx global>{`
                /* Fundo global do editor para integrar com a borda que criamos */
                .password-vault-editor .bn-editor {
                    background-color: transparent !important;
                }

                /* Mobile/Global Override para preencher a tela */
                .password-vault-editor .ProseMirror {
                    max-width: 100% !important;
                    padding-inline: 16px !important;
                }

                @media (min-width: 768px) {
                    .password-vault-editor .ProseMirror {
                        padding-inline: 48px !important;
                    }
                }

                /* Fonte monospace e cor padrão sem !important, usando pseudo-classe :where para ter peso (0,0,0) na tabela de especificidade CSS */
                :where(.password-vault-editor .bn-editor [data-content-type="paragraph"]) {
                    color: #60a5fa; /* Tailwind blue-400 */
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
                
                /* Listas e blocos padrão herdando a mesma fonte */
                :where(.password-vault-editor .bn-editor [data-content-type="bulletListItem"], 
                       .password-vault-editor .bn-editor [data-content-type="numberedListItem"]) {
                    color: #60a5fa;
                    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
                }
            `}</style>
        </div>
    )
}
