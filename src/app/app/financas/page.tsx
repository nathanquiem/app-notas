import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import FinanceClientPage from "./page-client"

export const dynamic = 'force-dynamic'

export default async function FinancePage() {
    const supabase = await createClient()

    const { data: userData, error } = await supabase.auth.getUser()

    if (error || !userData?.user) {
        redirect('/login')
    }

    return <FinanceClientPage />
}
