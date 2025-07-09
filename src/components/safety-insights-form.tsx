"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getSafetyInsights, type SafetyInsightsOutput } from '@/ai/flows/safety-insights'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { AlertTriangle, CheckCircle, Loader2 } from 'lucide-react'
import { Badge } from './ui/badge'

const formSchema = z.object({
  routeDescription: z.string().min(10, 'Please provide a more detailed route description.'),
  campusSecurityReports: z.string().min(1, 'Please provide campus security reports.'),
  policeBlotterData: z.string().min(1, 'Please provide police blotter data.'),
})

export function SafetyInsightsForm() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SafetyInsightsOutput | null>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      routeDescription: '',
      campusSecurityReports: 'Recent incidents: a few noise complaints, one instance of petty theft near the dorms on the east side of campus.',
      policeBlotterData: 'General area reports: traffic violation on Main St, public intoxication arrest 2 miles from campus.',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const insights = await getSafetyInsights(values)
      setResult(insights)
    } catch (e) {
      setError('Failed to get safety insights. Please try again.')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const RiskBadge = ({ level }: { level: 'low' | 'medium' | 'high' }) => {
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      high: 'bg-red-100 text-red-800 border-red-200',
    }
    const icons = {
      low: <CheckCircle className="h-4 w-4 mr-1" />,
      medium: <AlertTriangle className="h-4 w-4 mr-1" />,
      high: <AlertTriangle className="h-4 w-4 mr-1" />,
    }
    return (
      <Badge className={cn('capitalize text-sm', variants[level])}>
        {icons[level]}
        {level} Risk
      </Badge>
    )
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Safety Insights</CardTitle>
        <CardDescription>
          Get an AI-powered risk assessment for your route.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="routeDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Route Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Walking from the library to the south dorms around 10 PM." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="campusSecurityReports"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campus Security Reports</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste recent campus security reports here." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="policeBlotterData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Police Blotter Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Paste recent police blotter data here." {...field} rows={4} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Analyzing...' : 'Get Safety Insights'}
            </Button>
            {error && <p className="text-destructive mt-4 text-sm">{error}</p>}
          </CardFooter>
        </form>
      </Form>
      {result && (
        <CardContent>
          <div className="space-y-4 p-4 border rounded-lg bg-background">
            <h3 className="font-bold text-lg">Assessment Result</h3>
            <div className="flex items-center">
              <RiskBadge level={result.riskLevel} />
            </div>
            <div>
              <h4 className="font-semibold">Risk Factors</h4>
              <p className="text-sm text-muted-foreground">{result.riskFactors}</p>
            </div>
            <div>
              <h4 className="font-semibold">Recommendations</h4>
              <p className="text-sm text-muted-foreground">{result.recommendations}</p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
