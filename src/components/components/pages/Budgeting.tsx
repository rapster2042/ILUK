import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { getUserId, getBudget, createOrUpdateBudget, awardBadge, createCompletedTaskForAction } from '@/db/api';
import type { Budget } from '@/types';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Budgeting = () => {
  const [budget, setBudget] = useState<Omit<Budget, 'id' | 'user_id' | 'updated_at'>>({
    total_income: 0,
    rent: 0,
    food: 0,
    bills: 0,
    fun: 0,
    other: 0,
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const userId = getUserId();

  useEffect(() => {
    loadBudget();
  }, []);

  const loadBudget = async () => {
    const existingBudget = await getBudget(userId);
    if (existingBudget) {
      setBudget({
        total_income: existingBudget.total_income,
        rent: existingBudget.rent,
        food: existingBudget.food,
        bills: existingBudget.bills,
        fun: existingBudget.fun,
        other: existingBudget.other,
      });
    }
    setLoading(false);
  };

  const handleSave = async () => {
    const existingBudget = await getBudget(userId);
    const isFirstBudget = !existingBudget;
    
    await createOrUpdateBudget(userId, budget);
    
    // If this is the first budget, create a completed task for it
    if (isFirstBudget) {
      await createCompletedTaskForAction(
        userId,
        'Created your first budget',
        'Set up money buckets for budgeting',
        'budgeting'
      );
      
      // Award first budget badge
      await awardBadge(userId, 'first_budget', 'Budget Creator');
    }
    
    toast({
      title: '✓ Budget saved',
      description: 'Your money buckets have been updated.',
    });
  };

  const totalAllocated = budget.rent + budget.food + budget.bills + budget.fun + budget.other;
  const remaining = budget.total_income - totalAllocated;
  const isOverBudget = remaining < 0;

  const handleSliderChange = (category: keyof typeof budget, value: number[]) => {
    setBudget({ ...budget, [category]: value[0] });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Money Buckets</h1>
        <p className="text-muted-foreground text-lg">
          Simple budgeting - divide your money into buckets
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="mt-2">
              <HelpCircle className="h-4 w-4 mr-2" />
              Understanding Budgeting
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Understanding Budgeting</DialogTitle>
              <DialogDescription>
                A simple guide to managing your money without stress
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">What is budgeting?</h3>
                <p className="text-sm">
                  Budgeting is just deciding where your money goes before you spend it. 
                  Think of it like sorting your money into different pots or "buckets" - 
                  one for rent, one for food, one for fun, etc.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Why bother?</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Less stress</strong> - You know if you can afford something</li>
                  <li>• <strong>No surprises</strong> - You won't run out of money unexpectedly</li>
                  <li>• <strong>More control</strong> - You decide where your money goes</li>
                  <li>• <strong>Guilt-free spending</strong> - If it's in your "fun" bucket, spend it!</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">The 50/30/20 rule (simplified)</h3>
                <p className="text-sm mb-3">
                  This is a guideline, not a rule. Don't stress if your numbers are different.
                </p>
                <div className="space-y-3">
                  <div className="bg-accent rounded-lg p-3">
                    <div className="font-semibold">50% - Needs (essentials)</div>
                    <p className="text-sm text-muted-foreground">Rent, bills, food, transport</p>
                  </div>
                  <div className="bg-accent rounded-lg p-3">
                    <div className="font-semibold">30% - Wants (nice to have)</div>
                    <p className="text-sm text-muted-foreground">Going out, hobbies, subscriptions, treats</p>
                  </div>
                  <div className="bg-accent rounded-lg p-3">
                    <div className="font-semibold">20% - Savings (for later)</div>
                    <p className="text-sm text-muted-foreground">Emergency fund, future goals</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  Reality check: If you're on benefits or low income, 50/30/20 might not work. 
                  That's okay! Just focus on covering essentials first, then see what's left.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">How to start (easy steps)</h3>
                <ol className="space-y-2 text-sm">
                  <li>
                    <strong>1. Write down your income</strong>
                    <p className="text-muted-foreground">How much money comes in each week or month? (Benefits, wages, etc.)</p>
                  </li>
                  <li>
                    <strong>2. List your essentials</strong>
                    <p className="text-muted-foreground">Rent, bills, food - things you MUST pay</p>
                  </li>
                  <li>
                    <strong>3. See what's left</strong>
                    <p className="text-muted-foreground">Income minus essentials = your flexible money</p>
                  </li>
                  <li>
                    <strong>4. Divide the rest</strong>
                    <p className="text-muted-foreground">Split between fun, savings, and other stuff</p>
                  </li>
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">ADHD/Autism-friendly tips</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Use visual tools</strong> - The sliders on this page help you see your money</li>
                  <li>• <strong>Keep it simple</strong> - Don't track every penny, just the big buckets</li>
                  <li>• <strong>Automate if possible</strong> - Set up standing orders so bills pay themselves</li>
                  <li>• <strong>Use separate accounts</strong> - Some banks let you create "pots" for different buckets</li>
                  <li>• <strong>Weekly is easier than monthly</strong> - Smaller numbers, less overwhelming</li>
                  <li>• <strong>Round numbers</strong> - £50 is easier to work with than £47.32</li>
                  <li>• <strong>Build in buffer</strong> - Overestimate expenses slightly for peace of mind</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">What if I mess up?</h3>
                <p className="text-sm">
                  You will. Everyone does. That's normal. Budgeting is a skill that takes practice. 
                  If you overspend one week, just adjust next week. No judgment, no guilt. 
                  The goal is progress, not perfection.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Common mistakes (and how to avoid them)</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Forgetting irregular expenses</strong>
                    <p className="text-muted-foreground">Birthdays, haircuts, annual subscriptions - add a bit to "other" for these</p>
                  </li>
                  <li>
                    <strong>Being too strict</strong>
                    <p className="text-muted-foreground">If you don't allow any fun money, you'll burn out and give up</p>
                  </li>
                  <li>
                    <strong>Not tracking at all</strong>
                    <p className="text-muted-foreground">You don't need to track every penny, but check your bank balance weekly</p>
                  </li>
                  <li>
                    <strong>Comparing to others</strong>
                    <p className="text-muted-foreground">Your budget is personal. What works for someone else might not work for you</p>
                  </li>
                </ul>
              </div>

              <div className="bg-accent rounded-lg p-4">
                <h3 className="font-semibold mb-2">Remember:</h3>
                <p className="text-sm">
                  A budget isn't about restricting yourself - it's about giving yourself permission 
                  to spend guilt-free because you know you've covered the important stuff first. 
                  It's a tool to reduce anxiety, not create it.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Your Weekly Income</CardTitle>
          <CardDescription>
            How much money do you get each week? (Benefits, wages, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Label htmlFor="income" className="text-2xl">£</Label>
            <Input
              id="income"
              type="number"
              value={budget.total_income || ''}
              onChange={(e) => setBudget({ ...budget, total_income: Number(e.target.value) })}
              className="text-2xl font-bold"
              placeholder="0"
            />
          </div>
        </CardContent>
      </Card>

      {budget.total_income > 0 && (
        <>
          <Card className="card-soft">
            <CardHeader>
              <CardTitle>Divide Into Buckets</CardTitle>
              <CardDescription>
                Move the sliders to split your money. Start with the essentials.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>🏠 Rent</Label>
                  <span className="font-bold">£{budget.rent}</span>
                </div>
                <Slider
                  value={[budget.rent]}
                  onValueChange={(value) => handleSliderChange('rent', value)}
                  max={budget.total_income}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>🍽️ Food</Label>
                  <span className="font-bold">£{budget.food}</span>
                </div>
                <Slider
                  value={[budget.food]}
                  onValueChange={(value) => handleSliderChange('food', value)}
                  max={budget.total_income}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>⚡ Bills (Gas, Electric, Water, etc.)</Label>
                  <span className="font-bold">£{budget.bills}</span>
                </div>
                <Slider
                  value={[budget.bills]}
                  onValueChange={(value) => handleSliderChange('bills', value)}
                  max={budget.total_income}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>🎉 Fun Money</Label>
                  <span className="font-bold">£{budget.fun}</span>
                </div>
                <Slider
                  value={[budget.fun]}
                  onValueChange={(value) => handleSliderChange('fun', value)}
                  max={budget.total_income}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>💼 Other</Label>
                  <span className="font-bold">£{budget.other}</span>
                </div>
                <Slider
                  value={[budget.other]}
                  onValueChange={(value) => handleSliderChange('other', value)}
                  max={budget.total_income}
                  step={5}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          <Card className={`card-soft ${isOverBudget ? 'border-destructive' : 'border-success'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isOverBudget ? (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                ) : (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                )}
                Am I Okay?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span>Total Income:</span>
                  <span className="font-bold">£{budget.total_income}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Total Allocated:</span>
                  <span className="font-bold">£{totalAllocated}</span>
                </div>
                <div className={`flex justify-between text-xl font-bold ${isOverBudget ? 'text-destructive' : 'text-success'}`}>
                  <span>Remaining:</span>
                  <span>£{remaining}</span>
                </div>
                {isOverBudget ? (
                  <p className="text-destructive">
                    You've allocated more than you have. Try reducing some buckets.
                  </p>
                ) : remaining === 0 ? (
                  <p className="text-success">
                    Perfect! You've allocated all your money.
                  </p>
                ) : (
                  <p className="text-success">
                    Great! You have £{remaining} left over. Consider saving it or adding to your buckets.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSave} size="lg" className="w-full">
            Save My Budget
          </Button>
        </>
      )}
    </div>
  );
};

export default Budgeting;
