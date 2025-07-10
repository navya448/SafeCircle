import { SOSButton } from '@/components/sos-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Phone, MessageCircle, Siren } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 md:p-8 space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-lg flex flex-col justify-between">
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Logo className="w-10 h-10 text-primary" />
                    <h1 className="text-4xl font-bold text-primary tracking-tight">
                        SafeCircle
                    </h1>
                </div>
                 <p className="text-muted-foreground text-lg pt-2">Your personal safety companion. Help is one tap away.</p>
            </CardHeader>
            <CardContent>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image 
                        src="https://placehold.co/600x400.png"
                        alt="A person walking on a well-lit campus path at night"
                        fill
                        className="object-cover"
                        data-ai-hint="campus security"
                    />
                </div>
            </CardContent>
        </Card>
        
        <div className="space-y-6">
            <Card className="shadow-lg bg-accent/90 text-accent-foreground hover:bg-accent transition-colors">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                        <Siren className="w-8 h-8" />
                        Immediate SOS Alert
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="mb-4">Instantly send an alert with your location to your emergency contacts.</p>
                    {/* The SOSButton component can be added here if desired, or kept separate */}
                    <SOSButton />
                </CardContent>
            </Card>

        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="text-primary" />
              <span>Safe Route</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Find the safest path to your destination.</p>
            <Link href="/safe-route" passHref>
              <Button className="w-full" variant="secondary">Plan Route</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="text-primary" />
              <span>Safety Chat</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Ask the AI assistant for safety advice.</p>
            <Link href="/safety-chat" passHref>
              <Button className="w-full" variant="secondary">Start Chat</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-primary" />
              <span>Emergency Contacts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Manage your trusted contacts for alerts.</p>
            <Link href="/contacts" passHref>
              <Button className="w-full" variant="secondary">View Contacts</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="text-primary" />
              <span>Emergency Resources</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Quick access to emergency services.</p>
            <Link href="/resources" passHref>
              <Button className="w-full" variant="secondary">See Resources</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
