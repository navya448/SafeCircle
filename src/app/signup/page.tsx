
"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { Logo } from '@/components/logo'
import Image from 'next/image'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  emergencyContactName: z.string().min(2, { message: 'Contact name must be at least 2 characters.' }),
  emergencyContactRelationship: z.string().min(2, { message: 'Relationship must be at least 2 characters.' }),
  emergencyContactEmail: z.string().email({ message: 'Please enter a valid email address.' }),
})

export default function SignUpPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactEmail: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      // In a real app, you'd have a backend for user registration.
      // Here, we'll use localStorage for simplicity.
      const userData = {
        name: values.name,
        emergencyContacts: [{
          id: Date.now(),
          name: values.emergencyContactName,
          relationship: values.emergencyContactRelationship,
          email: values.emergencyContactEmail
        }],
      }
      localStorage.setItem('safeCircleUser', JSON.stringify(userData))
      
      toast({
        title: 'Sign Up Successful!',
        description: "You're all set up. Welcome to SafeCircle.",
      })
      
      router.push('/')
    } catch (error) {
      toast({
        title: 'Sign Up Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      })
      console.error(error)
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <div className="absolute inset-0 z-0">
        <Image
          src="/img.png"
          alt="Illustration of a person walking on a campus at night, looking at their phone."
          fill
          className="object-cover"
          data-ai-hint="night campus walk"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <Card className="w-full max-w-md shadow-2xl z-20 bg-background/80 backdrop-blur-sm">
        <CardHeader className="text-center space-y-2">
           <div className="mx-auto flex items-center gap-3">
              <Logo className="w-10 h-10 text-primary" />
              <CardTitle className="text-3xl font-bold tracking-tight">SafeCircle</CardTitle>
           </div>
          <CardDescription>
            Create your account to get started with your safety companion.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
               <h3 className="font-medium text-center">Your Details</h3>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="py-2">
                 <hr/>
               </div>
               <h3 className="font-medium text-center">Your Primary Emergency Contact</h3>
               <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact's Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="emergencyContactRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Friend, Parent" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="emergencyContactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact's Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g., contact@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={loading}>
                 {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
