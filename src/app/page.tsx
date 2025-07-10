import { SOSButton } from '@/components/sos-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Phone, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/logo';

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 space-y-8 min-h-full">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-4">
          <Logo className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            SafeCircle
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">Your personal safety companion. Help is one tap away.</p>
      </div>

      <SOSButton />

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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
              <Button className="w-full">Plan Route</Button>
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
              <Button className="w-full">Start Chat</Button>
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
              <Button className="w-full">View Contacts</Button>
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
              <Button className="w-full">See Resources</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
