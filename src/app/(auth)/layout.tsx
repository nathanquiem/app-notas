import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'MyDocs | Login',
    description: 'Acesse o seu workspace pessoal.',
}

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
                {children}
            </div>
        </div>
    )
}
