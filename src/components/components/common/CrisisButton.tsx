import { useState } from 'react';
import { Phone } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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

export const CrisisButton = () => {
  const [open, setOpen] = useState(false);
  const userId = getUserId();
  const { toast } = useToast();

  const handleOpenChange = async (isOpen: boolean) => {
    setOpen(isOpen);
    
    // Award "asked for help" badge when user opens the crisis dialog
    if (isOpen) {
      // Check if badge already exists
      const badges = await getProgressBadges(userId);
      const hasAskedHelpBadge = badges.some(b => b.badge_type === 'asked_help');
      
      if (!hasAskedHelpBadge) {
        console.log('[Badge] Awarding asked_help badge for opening crisis dialog');
        await awardBadge(userId, 'asked_help', 'Asked for Help');
        
        toast({
          title: '🏆 New Badge Earned!',
          description: 'You earned the "Asked for Help" badge!',
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="crisis-button fixed bottom-6 right-6 z-50 shadow-2xl">
          <Phone className="mr-2 h-5 w-5" />
          Need Help Now
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">You're not in trouble. Help is available.</DialogTitle>
          <DialogDescription className="text-base">
            If you're in crisis or need someone to talk to, these services are here for you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {crisisContacts.map((contact) => (
            <div
              key={contact.number}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{contact.name}</h3>
                  <p className="text-muted-foreground text-sm mt-1">{contact.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">Available: {contact.available}</p>
                </div>
                <a
                  href={contact.isText ? `sms:${contact.number}` : `tel:${contact.number}`}
                  className="ml-4"
                >
                  <Button variant="default" size="lg">
                    <Phone className="mr-2 h-4 w-4" />
                    {contact.number}
                  </Button>
                </a>
              </div>
            </div>
          ))}
          <div className="bg-accent rounded-lg p-4 mt-6">
            <p className="text-sm">
              <strong>Emergency:</strong> If you or someone else is in immediate danger, call 999 for emergency services.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
