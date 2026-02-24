import Link from 'next/link'

export default function ResetPasswordPage() {
    return (
        <div className="p-8">
            <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white mb-2">Recuperar Acesso</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Insira o seu email para receber o link de redefinição de segurança</p>
            </div>

            <form className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="email">Email de recuperação</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="seu@email.com"
                        className="w-full flex h-10 rounded-md border bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full h-10 rounded-md bg-[var(--color-primary)] text-white dark:bg-slate-800 dark:text-white font-medium hover:bg-blue-700 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] dark:focus:ring-offset-gray-900 mt-2"
                >
                    Enviar Link
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <Link href="/login" className="font-medium text-gray-500 hover:text-[var(--color-marine)] dark:hover:text-white transition-colors">
                    ← Voltar ao login
                </Link>
            </div>
        </div>
    )
}
