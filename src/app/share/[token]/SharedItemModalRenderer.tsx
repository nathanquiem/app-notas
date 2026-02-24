"use client"

import { useState } from "react"
import { Eye, ExternalLink, X, FileText, KeyRound } from "lucide-react"
import { SharedNoteRenderer } from "./SharedNoteRenderer"
import { BlockNoteView } from "@blocknote/mantine"

export function SharedItemModalRenderer({
    type,
    title,
    content
}: {
    type: 'notes' | 'passwords',
    title: string,
    content: string
}) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 border border-border text-gray-700 dark:text-gray-300 rounded hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
                <Eye size={14} /> Visualizar
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-8">
                    <div className="bg-white dark:bg-card w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl border border-border animate-in fade-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-border">
                            <div className="flex items-center gap-3">
                                {type === 'notes' ? (
                                    <FileText className="text-blue-500" size={24} />
                                ) : (
                                    <KeyRound className="text-orange-500" size={24} />
                                )}
                                <h3 className="font-bold text-xl text-[var(--color-marine)] dark:text-white line-clamp-1">{title}</h3>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4 sm:p-8 overflow-y-auto flex-1 prose prose-slate max-w-none">
                            {type === 'notes' ? (
                                <SharedNoteRenderer content={content} />
                            ) : (
                                <div className="bg-slate-900 border border-slate-700/50 rounded-xl p-6 overflow-x-auto shadow-inner">
                                    <pre className="font-mono text-sm sm:text-base text-green-400 whitespace-pre-wrap break-all">
                                        {content}
                                    </pre>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
