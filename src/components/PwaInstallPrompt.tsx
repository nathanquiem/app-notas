"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'

// Define the interface for the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if device is iOS
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIosDevice)

    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone
    
    if (isStandalone) {
      return // Don't show if already installed
    }

    // Has user previously dismissed? 
    const hasDismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (hasDismissed === 'true') {
      // If iOS, maybe don't show ever again if dismissed, or show occasionally
      // For standard install prompt, wait for beforeinstallprompt
      if (isIosDevice) return;
    }

    if (isIosDevice && hasDismissed !== 'true') {
      // iOS doesn't support beforeinstallprompt, show custom instruction
      setTimeout(() => setShowPrompt(true), 3000)
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      
      if (hasDismissed !== 'true') {
        setTimeout(() => setShowPrompt(true), 3000)
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
      }
      setDeferredPrompt(null)
    } else if (isIOS) {
      // Just keep the banner open to show iOS instructions
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  if (!showPrompt) return null

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:bottom-8 md:left-auto md:right-8 md:w-96"
        >
          <div className="bg-zinc-900 border border-zinc-800 text-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 relative overflow-hidden backdrop-blur-xl bg-opacity-90">
            <button 
              onClick={handleDismiss}
              className="absolute top-2 right-2 p-1 text-zinc-400 hover:text-white rounded-full bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 flex items-center justify-center shadow-inner flex-shrink-0">
                <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain drop-shadow-md brightness-0 invert" onError={(e) => { e.currentTarget.src = '/apple-touch-icon.png' }} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Instalar MyDocs</h3>
                <p className="text-xs text-zinc-400 mt-0.5 leading-tight">
                  {isIOS 
                    ? "Para instalar: toque em Compartilhar e depois 'Adicionar à Tela de Início'" 
                    : "Instale o app para acesso mais rápido e uma melhor experiência."}
                </p>
              </div>
            </div>

            {!isIOS && (
              <button
                onClick={handleInstallClick}
                className="w-full bg-white text-black text-sm font-medium py-2.5 rounded-xl hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 mt-1 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
              >
                <Download size={16} />
                Instalar Agora
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
