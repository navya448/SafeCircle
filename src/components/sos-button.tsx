"use client"

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { Siren } from 'lucide-react'

export function SOSButton() {
  const [status, setStatus] = useState<'idle' | 'arming' | 'sending' | 'sent'>('idle')
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const handleMouseDown = () => {
    if (status === 'idle' || status === 'sent') {
      setStatus('arming')
    }
  }

  const handleMouseUp = () => {
    if (status === 'arming') {
      setStatus('idle')
      setProgress(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  useEffect(() => {
    if (status === 'arming') {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!)
            timerRef.current = null
            setStatus('sending')
            return 100
          }
          return prev + 1
        })
      }, 20)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [status])

  useEffect(() => {
    if (status === 'sending') {
      toast({
        title: 'SOS Alert Activated',
        description: 'Your location and emergency alert have been sent to your trusted contacts and campus security.',
        variant: 'destructive',
      })
      setTimeout(() => {
        setStatus('sent')
      }, 1500)
      setTimeout(() => {
        setStatus('idle')
        setProgress(0)
      }, 6000)
    }
  }, [status, toast])

  const getButtonText = () => {
    switch (status) {
      case 'idle':
        return 'Hold to Activate'
      case 'arming':
        return 'Activating...'
      case 'sending':
        return 'Sending Alert...'
      case 'sent':
        return 'Alert Sent'
      default:
        return 'SOS'
    }
  }

  return (
    <div
      className="relative w-64 h-64 md:w-72 md:h-72 rounded-full flex items-center justify-center select-none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={(e) => { e.preventDefault(); handleMouseDown(); }}
      onTouchEnd={(e) => { e.preventDefault(); handleMouseUp(); }}
      aria-label="SOS Alert Button"
      role="button"
      tabIndex={0}
    >
      <div
        className="absolute inset-0 rounded-full bg-accent/20"
        style={{
          transform: `scale(${progress / 100})`,
          transition: status === 'arming' ? 'transform 0.02s linear' : 'transform 0.5s ease-out',
        }}
      />
      <div
        className={cn(
          'relative w-56 h-56 md:w-64 md:h-64 rounded-full flex flex-col items-center justify-center cursor-pointer transition-all duration-300 shadow-2xl',
          {
            'bg-accent hover:bg-purple-500': status === 'idle' || status === 'arming',
            'bg-red-500 animate-pulse': status === 'sending',
            'bg-green-500': status === 'sent',
          }
        )}
      >
        <Siren className="w-16 h-16 md:w-20 md:h-20 text-white" />
        <span className="text-white font-bold text-xl md:text-2xl mt-2 text-center">{getButtonText()}</span>
      </div>
    </div>
  )
}
