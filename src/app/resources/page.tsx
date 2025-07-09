import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Shield, ShieldAlert, HeartHandshake } from 'lucide-react';

const resources = [
  {
    name: 'Campus Security',
    description: 'For on-campus emergencies and assistance.',
    phone: '123-456-7890',
    icon: Shield,
  },
  {
    name: 'Local Police Department',
    description: 'For off-campus or serious emergencies.',
    phone: '911',
    icon: ShieldAlert,
  },
  {
    name: 'Women\'s Safety Helpline',
    description: 'Confidential support and resources.',
    phone: '234-567-8901',
    icon: HeartHandshake,
  },
  {
    name: 'Mental Health Crisis Line',
    description: '24/7 support for mental health emergencies.',
    phone: '345-678-9012',
    icon: Phone,
  },
];

export default function ResourcesPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Emergency Resources</h1>
        <p className="text-muted-foreground mt-2">Quick access to important phone numbers.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((resource) => (
          <Card key={resource.name} className="shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <resource.icon className="w-8 h-8 text-primary mt-1" />
                <div className="flex-1">
                  <span>{resource.name}</span>
                  <CardDescription className="mt-1">{resource.description}</CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
                <a href={`tel:${resource.phone}`} className="w-full">
                    <Button className="w-full">
                        <Phone className="mr-2 h-4 w-4" />
                        Call Now ({resource.phone})
                    </Button>
                </a>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
