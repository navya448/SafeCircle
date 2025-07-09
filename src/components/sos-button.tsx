
"use client"

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Siren } from 'lucide-react'
import { sendSOSEmail } from '@/ai/flows/send-sos-email'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from '@/hooks/use-toast'

export function SOSButton() {
  const [status, setStatus] = useState<'idle' | 'arming' | 'sending' | 'sent' | 'error'>('idle')
  const [progress, setProgress] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [emergencyContactEmails, setEmergencyContactEmails] = useState<string[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleMouseDown = () => {
    if (status === 'idle' || status === 'sent' || status === 'error') {
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

  const triggerSOS = () => {
    setStatus('sending');

    const userDataString = localStorage.getItem('safeCircleUser');
    if (!userDataString) {
        toast({
            title: 'Not Signed In',
            description: 'Please sign up to use the SOS feature.',
            variant: 'destructive',
        });
        router.push('/signup');
        setStatus('error');
        return;
    }

    const { name: userName, emergencyContacts } = JSON.parse(userDataString);
    const contactEmails = emergencyContacts?.map((c: any) => c.email) || [];

    if (!contactEmails || contactEmails.length === 0) {
        toast({
            title: 'No Emergency Contacts',
            description: 'Please add an emergency contact in your settings.',
            variant: 'destructive',
        });
        router.push('/contacts');
        setStatus('error');
        return;
    }
    
    setEmergencyContactEmails(contactEmails);


    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await sendSOSEmail({ latitude, longitude, userName, emergencyContacts: contactEmails });
          if (result.success) {
            setShowConfirmation(true);
            setStatus('sent');
          } else {
            throw new Error(result.message || 'Flow returned success: false');
          }
        } catch (error) {
          console.error('Failed to send SOS alert:', error);
          toast({
            title: 'Error Sending Alert',
            description: 'Could not send the SOS alert. Please try again or contact support.',
            variant: 'destructive',
          });
          setStatus('error');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast({
          title: 'Location Error',
          description: 'Could not get your location. Please enable location services.',
          variant: 'destructive',
        });
        setStatus('error');
      }
    );
  };


  useEffect(() => {
    if (status === 'arming') {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!)
            timerRef.current = null
            triggerSOS()
            return 100
          }
          return prev + 1
        })
      }, 20)
    }
    
    if (status === 'sent' || status === 'error') {
        const resetTimer = setTimeout(() => {
            setStatus('idle');
            setProgress(0);
        }, 6000);
        return () => clearTimeout(resetTimer);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [status])

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
      case 'error':
        return 'Failed'
      default:
        return 'SOS'
    }
  }

  return (
    <>
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
            'bg-gray-500': status === 'error',
          }
        )}
      >
        <Siren className="w-16 h-16 md:w-20 md:h-20 text-white" />
        <span className="text-white font-bold text-xl md:text-2xl mt-2 text-center">{getButtonText()}</span>
      </div>
    </div>
    <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>SOS Alert Activated!</AlertDialogTitle>
            <AlertDialogDescription>
                Help is on the way. An alert with your location has been sent to your emergency contacts: <span className="font-medium text-foreground">{emergencyContactEmails.join(', ')}</span>. Please move to a safe location if possible.
                <br /><br />
                <span className="text-xs text-muted-foreground">(This is a simulation. In a real app, an email/SMS would be sent.)</span>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowConfirmation(false)}>
                Okay
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  )
}
