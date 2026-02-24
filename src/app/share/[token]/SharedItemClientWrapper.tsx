"use client"

import { useState } from "react"
import { SharedPasswordPrompt } from "./SharedPasswordPrompt"

export function SharedItemClientWrapper({
    token,
    isProtected,
    children
}: {
    token: string,
    isProtected: boolean,
    children: React.ReactNode
}) {
    const [unlocked, setUnlocked] = useState(!isProtected)

    if (!unlocked) {
        return <SharedPasswordPrompt token={token} onUnlock={() => setUnlocked(true)} />
    }

    return <>{children}</>
}
