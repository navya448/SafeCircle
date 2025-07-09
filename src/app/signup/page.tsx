
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
import { Label } from '@/components/ui/label'
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome to SafeCircle</CardTitle>
          <CardDescription>
            Create your account to get started.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
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
               <FormField
                control={form.control}
                name="emergencyContactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emergency Contact's Name</FormLabel>
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
                    <FormLabel>Emergency Contact's Email</FormLabel>
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
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}
