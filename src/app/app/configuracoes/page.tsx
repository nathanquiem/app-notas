import { Settings, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ProfileSettingsForm } from "./ProfileSettingsForm"
import { ThemeSettings } from "./ThemeSettings"

export const dynamic = 'force-dynamic'

export default async function ConfiguracoesPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const fullName = user?.user_metadata?.full_name || ''
    const avatarUrl = user?.user_metadata?.avatar_url || ''

    return (
        <div className="space-y-6 h-full flex flex-col max-w-2xl mx-auto w-full pt-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-[var(--color-marine)] dark:text-white flex items-center gap-2">
                    <Settings className="text-gray-500" /> Configurações de Perfil
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Gerencie as preferências da sua conta e a segurança do MyDocs.</p>
            </div>

            <div className="space-y-4">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <User size={20} className="text-blue-500" />
                        Seu Perfil
                    </h3>
                    <ProfileSettingsForm initialName={fullName} initialAvatar={avatarUrl} />
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-1">Criptografia Local do Cofre</h3>
                    <p className="text-sm text-gray-500 mb-4">Suas senhas são criptografadas nos servidores com AES-256 (Node Crypto). Esta camada de segurança global não pode ser desativada.</p>
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Criptografia AES-256 Ativada
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h3 className="font-semibold text-lg mb-4">Aparência Global</h3>
                    <p className="text-sm text-gray-500 mb-4">Personalize como o MyDocs é exibido para você.</p>
                    <ThemeSettings />
                </div>
            </div>
        </div>
    )
}
