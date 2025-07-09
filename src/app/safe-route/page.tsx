import Image from 'next/image'
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
import { SafetyInsightsForm } from '@/components/safety-insights-form'

export default function SafeRoutePage() {
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start">Starting Point</Label>
                    <Input id="start" placeholder="Your current location" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Select>
                      <SelectTrigger id="destination">
                        <SelectValue placeholder="Select a safe spot" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="security-office">Campus Security Office</SelectItem>
                        <SelectItem value="police-station">Main Police Station</SelectItem>
                        <SelectItem value="library">University Library</SelectItem>
                        <SelectItem value="health-center">Student Health Center</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button className="w-full">
                  Find Route on Map
                </Button>
              </div>
              <div className="mt-6 rounded-lg overflow-hidden border">
                <Image
                  src="https://placehold.co/800x400.png"
                  alt="Map placeholder"
                  width={800}
                  height={400}
                  className="w-full"
                  data-ai-hint="map route"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <SafetyInsightsForm />
        </div>
      </div>
    </div>
  )
}
