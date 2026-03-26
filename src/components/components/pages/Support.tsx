import { useEffect } from 'react';
import { Phone, Heart, MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUserId, awardBadge, getProgressBadges } from '@/db/api';
import { useToast } from '@/hooks/use-toast';

const crisisContacts = [
  {
    name: 'NHS 111',
    number: '111',
    description: 'For urgent medical help',
    available: '24/7'
  },
  {
    name: 'Samaritans',
    number: '116 123',
    description: 'Free to call, someone to talk to',
    available: '24/7'
  },
  {
    name: 'Shout',
    number: '85258',
    description: 'Text service for crisis support',
    available: '24/7',
    isText: true
  },
  {
    name: 'Mind Infoline',
    number: '0300 123 3393',
    description: 'Mental health information and support',
    available: 'Mon-Fri 9am-6pm'
  },
  {
    name: 'Papyrus HOPELINEUK',
    number: '0800 068 4141',
    description: 'For young people under 35',
    available: 'Mon-Fri 9am-midnight, Weekends 2pm-midnight'
  }
];

const onlineResources = [
  {
    name: 'NHS Mental Health Services',
    url: 'https://www.nhs.uk/mental-health/',
    description: 'Find local NHS mental health services and support'
  },
  {
    name: 'Mind',
    url: 'https://www.mind.org.uk/',
    description: 'Mental health charity with advice and support'
  },
  {
    name: 'Young Minds',
    url: 'https://www.youngminds.org.uk/',
    description: 'Mental health support for young people'
  },
  {
    name: 'Rethink Mental Illness',
    url: 'https://www.rethink.org/',
    description: 'Support and advice for people affected by mental illness'
  }
];

const Support = () => {
  const userId = getUserId();
  const { toast } = useToast();

  useEffect(() => {
    const awardHelpBadge = async () => {
      // Check if badge already exists
      const badges = await getProgressBadges(userId);
      const hasAskedHelpBadge = badges.some(b => b.badge_type === 'asked_help');
      
      if (!hasAskedHelpBadge) {
        console.log('[Badge] Awarding asked_help badge for visiting Support page');
        await awardBadge(userId, 'asked_help', 'Asked for Help');
        
        toast({
          title: '🏆 New Badge Earned!',
          description: 'You earned the "Asked for Help" badge!',
        });
      }
    };
    
    awardHelpBadge();
  }, [userId, toast]);

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center py-8">
        <Heart className="h-16 w-16 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-2">You're Not Alone</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          You're not in trouble. Help is available. These services are here to support you.
        </p>
      </div>

      <Card className="card-soft border-destructive/50 bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-6 w-6 text-destructive" />
            Emergency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-4">
            <strong>If you or someone else is in immediate danger, call 999 for emergency services.</strong>
          </p>
          <a href="tel:999">
            <Button variant="destructive" size="lg" className="w-full sm:w-auto">
              <Phone className="mr-2 h-5 w-5" />
              Call 999 Now
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Crisis Support Helplines</CardTitle>
          <CardDescription>
            Free, confidential support available when you need it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {crisisContacts.map((contact) => (
            <div
              key={contact.number}
              className="bg-card-mint rounded-xl p-4 hover:shadow-md transition-all border-0"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{contact.description}</p>
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    Available: {contact.available}
                  </p>
                </div>
                <a
                  href={contact.isText ? `sms:${contact.number}` : `tel:${contact.number}`}
                  className="w-full sm:w-auto"
                >
                  <Button variant="default" size="lg" className="w-full sm:w-auto">
                    <Phone className="mr-2 h-4 w-4" />
                    {contact.isText ? 'Text' : 'Call'} {contact.number}
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Online Resources</CardTitle>
          <CardDescription>
            Helpful websites for mental health information and support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {onlineResources.map((resource) => (
            <a
              key={resource.url}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-card-mint rounded-xl p-4 hover:shadow-md transition-all border-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    {resource.name}
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                  </h3>
                  <p className="text-muted-foreground text-sm mt-1">{resource.description}</p>
                </div>
              </div>
            </a>
          ))}
        </CardContent>
      </Card>

      <Card className="card-soft bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Remember</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">
            ✓ It's okay to ask for help - it's a sign of strength, not weakness
          </p>
          <p className="text-sm">
            ✓ Your feelings are valid, and you deserve support
          </p>
          <p className="text-sm">
            ✓ Things can get better with the right help
          </p>
          <p className="text-sm">
            ✓ You don't have to go through this alone
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;
