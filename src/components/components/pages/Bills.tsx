import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

const billTypes = [
  {
    id: 'gas-electric',
    title: '⚡ Gas & Electric',
    what: 'Energy for heating, cooking, and electricity in your home.',
    who: 'Usually the tenant pays this, unless your landlord says it\'s included in rent.',
    when: 'Monthly or quarterly. You can choose.',
    howMuch: '£50-150 per month depending on usage and home size.',
    consequences: 'If you don\'t pay, your supply could be cut off. Contact your supplier immediately if you\'re struggling.',
    tips: [
      'Compare suppliers on comparison websites',
      'Ask about payment plans if you\'re struggling',
      'Consider a prepayment meter if budgeting is hard'
    ]
  },
  {
    id: 'water',
    title: '💧 Water',
    what: 'Water supply and sewerage for your home.',
    who: 'Usually the tenant, but check your tenancy agreement.',
    when: 'Usually every 6 months, but you can ask for monthly payments.',
    howMuch: '£20-40 per month on average.',
    consequences: 'Water companies cannot cut off your supply, but they can take you to court for unpaid bills.',
    tips: [
      'Ask about a water meter - might be cheaper',
      'Contact your water company if you\'re struggling',
      'Some companies offer social tariffs for low income'
    ]
  },
  {
    id: 'internet',
    title: '📡 Internet',
    what: 'Broadband/WiFi for your home.',
    who: 'You choose and pay for this yourself.',
    when: 'Monthly, usually by direct debit.',
    howMuch: '£20-40 per month for basic broadband.',
    consequences: 'Service will be disconnected if you don\'t pay. May affect your credit score.',
    tips: [
      'Shop around - prices vary a lot',
      'Social tariffs available for people on benefits',
      'Consider mobile hotspot if cheaper'
    ]
  },
  {
    id: 'council-tax',
    title: '🏛️ Council Tax',
    what: 'Payment to your local council for services like rubbish collection, libraries, etc.',
    who: 'Usually the tenant, unless you\'re in a House in Multiple Occupation (HMO).',
    when: 'Monthly, usually 10 payments over the year (not July and August).',
    howMuch: '£100-200 per month depending on your area and property band.',
    consequences: 'Council can take money from your wages or benefits. Can lead to court action.',
    tips: [
      'You might get a discount if you live alone (25% off)',
      'Students don\'t pay council tax',
      'Apply for Council Tax Reduction if on low income',
      'Contact your council immediately if you can\'t pay'
    ]
  },
  {
    id: 'tv-licence',
    title: '📺 TV Licence',
    what: 'Required if you watch or record live TV or use BBC iPlayer.',
    who: 'Anyone who watches live TV or uses iPlayer.',
    when: 'Yearly (£159) or monthly (about £13.50).',
    howMuch: '£159 per year or about £13.50 per month.',
    consequences: 'You can be fined up to £1,000 if you watch live TV without a licence.',
    tips: [
      'You don\'t need one if you only watch Netflix, YouTube, etc.',
      'Can pay monthly to spread the cost',
      'Free for over 75s on Pension Credit'
    ]
  }
];

const supportContacts = [
  {
    name: 'Citizens Advice',
    description: 'Free, confidential advice on bills and debt',
    phone: '0800 144 8848',
    website: 'https://www.citizensadvice.org.uk'
  },
  {
    name: 'StepChange',
    description: 'Free debt advice charity',
    phone: '0800 138 1111',
    website: 'https://www.stepchange.org'
  },
  {
    name: 'National Debtline',
    description: 'Free debt advice',
    phone: '0808 808 4000',
    website: 'https://www.nationaldebtline.org'
  }
];

const Bills = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Bills & Payments</h1>
        <p className="text-muted-foreground text-lg">
          Understanding what you need to pay and when
        </p>
      </div>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <p className="text-lg">
            <strong>Important:</strong> If you're struggling to pay any bill, contact the company immediately. 
            They have to help you and offer payment plans. You're not in trouble for asking.
          </p>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>UK Bills Explained</CardTitle>
          <CardDescription>
            Click each bill type to learn more
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {billTypes.map((bill) => (
              <AccordionItem key={bill.id} value={bill.id}>
                <AccordionTrigger className="text-left">
                  <span className="text-lg font-semibold">{bill.title}</span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 text-base">
                  <div>
                    <h4 className="font-semibold mb-1">What is it?</h4>
                    <p>{bill.what}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Who pays it?</h4>
                    <p>{bill.who}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">When do I pay?</h4>
                    <p>{bill.when}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">How much?</h4>
                    <p>{bill.howMuch}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">What if I don't pay?</h4>
                    <p>{bill.consequences}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">💡 Tips</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {bill.tips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Need Help With Bills?</CardTitle>
          <CardDescription>
            Free, confidential support available
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {supportContacts.map((contact) => (
            <div key={contact.name} className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-lg">{contact.name}</h3>
              <p className="text-muted-foreground mb-2">{contact.description}</p>
              <div className="flex flex-col gap-2">
                <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                  📞 {contact.phone}
                </a>
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Visit website <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Bills;
