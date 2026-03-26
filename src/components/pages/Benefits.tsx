import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const Benefits = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Benefits & Financial Help</h1>
        <p className="text-muted-foreground text-lg">
          Understanding what support is available in the UK
        </p>
      </div>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <p className="text-lg">
            <strong>You're not alone:</strong> Millions of people in the UK receive benefits. 
            They exist to help you when you need support. There's no shame in claiming what you're entitled to.
          </p>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Universal Credit</CardTitle>
          <CardDescription>Monthly payment to help with living costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What is it?</h3>
            <p>A monthly payment that helps with living costs if you're on a low income or out of work.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Who can get it?</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>You're 18 or over (some exceptions for 16-17 year olds)</li>
              <li>You're under State Pension age</li>
              <li>You have less than £16,000 in savings</li>
              <li>You live in the UK</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How much?</h3>
            <p>Depends on your circumstances. Standard allowance for single person under 25: £292.11 per month (2024/25)</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How long does it take?</h3>
            <p>Usually 5 weeks for your first payment. You can ask for an advance if you need money sooner.</p>
          </div>
          <a href="https://www.gov.uk/universal-credit" target="_blank" rel="noopener noreferrer">
            <Button className="w-full">
              Apply on GOV.UK <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Personal Independence Payment (PIP)</CardTitle>
          <CardDescription>Help with extra costs if you have a disability or health condition</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">What is it?</h3>
            <p>Extra money to help with daily living costs and mobility if you have a long-term health condition or disability.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Who can get it?</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>You're 16 or over</li>
              <li>You have a health condition or disability that affects daily life</li>
              <li>You've had difficulties for at least 3 months and expect them to last 9 months</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">How much?</h3>
            <p>£28.70 to £184.30 per week depending on how your condition affects you.</p>
          </div>
          <a href="https://www.gov.uk/pip" target="_blank" rel="noopener noreferrer">
            <Button className="w-full">
              Learn More on GOV.UK <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Council Tax Reduction</CardTitle>
          <CardDescription>Help paying your council tax</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You might be able to get money off your council tax bill if you're on a low income or benefits.</p>
          <p>The amount depends on:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Where you live</li>
            <li>Your income and savings</li>
            <li>Your circumstances</li>
          </ul>
          <p className="font-semibold">Apply through your local council - each council has different rules.</p>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Need Help With Your Claim?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold">Citizens Advice</h3>
            <p className="text-sm text-muted-foreground mb-2">Free help with benefit claims</p>
            <a href="tel:0800 144 8848" className="text-primary hover:underline">
              📞 0800 144 8848
            </a>
          </div>
          <div className="border border-border rounded-lg p-4">
            <h3 className="font-semibold">Turn2Us</h3>
            <p className="text-sm text-muted-foreground mb-2">Benefits calculator and grants search</p>
            <a href="https://www.turn2us.org.uk" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              Visit website <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Benefits;
