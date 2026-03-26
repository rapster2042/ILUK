import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Housing = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Rent & Housing</h1>
        <p className="text-muted-foreground text-lg">
          Know your rights and responsibilities as a tenant
        </p>
      </div>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Understanding Your Tenancy Agreement</CardTitle>
          <CardDescription>Key things to look for in your contract</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="rent">
              <AccordionTrigger>How much is the rent?</AccordionTrigger>
              <AccordionContent>
                <p>Look for the monthly rent amount and when it's due. Check if it includes any bills.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="deposit">
              <AccordionTrigger>What about the deposit?</AccordionTrigger>
              <AccordionContent>
                <p>Your deposit must be protected in a government-approved scheme. Your landlord must give you details within 30 days.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="repairs">
              <AccordionTrigger>Who fixes what?</AccordionTrigger>
              <AccordionContent>
                <p><strong>Landlord fixes:</strong> Structure, heating, hot water, electrics, gas safety</p>
                <p className="mt-2"><strong>You fix:</strong> Things you break, minor maintenance like changing lightbulbs</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Do I Need to Pay Council Tax?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-accent rounded-lg p-4">
            <p className="font-semibold mb-2">✓ You DON'T pay if:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You're a full-time student</li>
              <li>You're under 18</li>
              <li>You live in certain types of care homes</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <p className="font-semibold mb-2">You DO pay if:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>You're 18+ and not a student</li>
              <li>You rent a flat or house</li>
            </ul>
            <p className="mt-2 text-sm"><strong>Discount:</strong> 25% off if you live alone</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Your Rights as a Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex gap-2">
              <span>✓</span>
              <span>Live in a property that's safe and in good repair</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Have your deposit protected</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Be given notice before your landlord visits (usually 24 hours)</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Challenge unfair rent increases</span>
            </li>
            <li className="flex gap-2">
              <span>✓</span>
              <span>Not be discriminated against</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Housing;
