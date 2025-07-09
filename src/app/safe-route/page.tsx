
"use client"

import Image from 'next/image'
import { useState, useRef } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SafetyInsightsForm, type SafetyInsightsFormHandle } from '@/components/safety-insights-form'

export default function SafeRoutePage() {
  const [start, setStart] = useState('')
  const [destination, setDestination] = useState('')
  const [mapUrl, setMapUrl] = useState('https://placehold.co/800x400.png')
  const safetyInsightsFormRef = useRef<SafetyInsightsFormHandle>(null)

  const handleFindRoute = (e: React.FormEvent) => {
    e.preventDefault()
    if (start && destination) {
      // Simulate finding a route by updating the map image
      setMapUrl('https://placehold.co/800x400.png?text=Route+from+'+encodeURIComponent(start)+'+to+'+encodeURIComponent(destination))
      
      // Update the description in the safety insights form
      const routeDescription = `Walking from ${start} to ${destination} on campus.`
      safetyInsightsFormRef.current?.setRouteDescription(routeDescription)
    }
  }


  return (
    <div className="p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold text-primary">Safe Route Finder</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Plan Your Route</CardTitle>
              <CardDescription>
                Find the safest way to your destination on campus.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFindRoute}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start">Starting Point</Label>
                      <Input 
                        id="start" 
                        placeholder="e.g., Main Gate" 
                        value={start}
                        onChange={(e) => setStart(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Select
                        onValueChange={setDestination}
                        value={destination}
                        required
                      >
                        <SelectTrigger id="destination">
                          <SelectValue placeholder="Select a campus spot" />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="Library">University Library</SelectItem>
                          <SelectItem value="DH-1">Dining Hall 1</SelectItem>
                          <SelectItem value="Academic Block C">Academic Block C</SelectItem>
                          <SelectItem value="Student Health Center">Student Health Center</SelectItem>
                          <SelectItem value="Sports Complex">Sports Complex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Find Route on Map
                  </Button>
                </div>
              </form>
              <div className="mt-6 rounded-lg overflow-hidden border">
                <Image
                  src={mapUrl}
                  alt="Map with planned route"
                  width={800}
                  height={400}
                  className="w-full transition-all duration-300"
                  key={mapUrl}
                  data-ai-hint="map route"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <SafetyInsightsForm ref={safetyInsightsFormRef} />
        </div>
      </div>
    </div>
  )
}
