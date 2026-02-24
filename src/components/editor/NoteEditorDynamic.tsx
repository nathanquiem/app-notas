"use client"

import dynamic from "next/dynamic"

// Importa o editor de notas ignorando o SSR para evitar erros de 'window is not defined' do BlockNote
export const NoteEditorDynamic = dynamic(
    () => import("@/components/editor/NoteEditor").then(mod => mod.NoteEditor),
    { ssr: false }
)
