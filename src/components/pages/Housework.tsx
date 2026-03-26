import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

interface CheckedTasks {
  [key: string]: boolean;
}

const Housework = () => {
  const [checkedTasks, setCheckedTasks] = useState<CheckedTasks>(() => {
    const saved = localStorage.getItem('housework-checked-tasks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('housework-checked-tasks', JSON.stringify(checkedTasks));
  }, [checkedTasks]);

  const toggleTask = (taskId: string) => {
    setCheckedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  const clearAllTasks = () => {
    setCheckedTasks({});
  };

  const TaskItem = ({ id, children }: { id: string; children: React.ReactNode }) => (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checkedTasks[id] || false}
        onCheckedChange={() => toggleTask(id)}
        className="h-3.5 w-3.5 shrink-0"
      />
      <label
        htmlFor={id}
        className={`cursor-pointer text-sm leading-tight ${checkedTasks[id] ? 'line-through text-muted-foreground' : ''}`}
      >
        {children}
      </label>
    </div>
  );
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Housework & Maintenance</h1>
        <p className="text-muted-foreground text-lg">
          Simple guides for keeping your space clean - no pressure
        </p>
      </div>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <p className="text-lg">
            <strong>Remember:</strong> Something is better than nothing. 
            Even 5 minutes of cleaning is a win. No judgment here.
          </p>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>5-Minute Clean</CardTitle>
              <CardDescription>For low energy days - pick just one</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearAllTasks}>
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3">🍽️ Kitchen Reset</h3>
              <div className="space-y-2 text-sm">
                <TaskItem id="quick-kitchen-1">Put 5 things away</TaskItem>
                <TaskItem id="quick-kitchen-2">Wipe one surface</TaskItem>
                <TaskItem id="quick-kitchen-3">Wash 3 items</TaskItem>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3">🛏️ Bedroom Tidy</h3>
              <div className="space-y-2 text-sm">
                <TaskItem id="quick-bedroom-1">Make the bed (or just pull duvet up)</TaskItem>
                <TaskItem id="quick-bedroom-2">Put clothes in one pile</TaskItem>
                <TaskItem id="quick-bedroom-3">Clear bedside table</TaskItem>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3">🚿 Bathroom Quick Clean</h3>
              <div className="space-y-2 text-sm">
                <TaskItem id="quick-bathroom-1">Wipe sink</TaskItem>
                <TaskItem id="quick-bathroom-2">Put toiletries away</TaskItem>
                <TaskItem id="quick-bathroom-3">Hang up towel</TaskItem>
              </div>
            </div>
            <div className="border border-border rounded-lg p-4">
              <h3 className="font-semibold mb-3">🗑️ Rubbish Round</h3>
              <div className="space-y-2 text-sm">
                <TaskItem id="quick-rubbish-1">Collect rubbish from one room</TaskItem>
                <TaskItem id="quick-rubbish-2">Take to bin</TaskItem>
                <TaskItem id="quick-rubbish-3">Done!</TaskItem>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Room-by-Room Guides</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="kitchen">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="kitchen">Kitchen</TabsTrigger>
              <TabsTrigger value="bathroom">Bathroom</TabsTrigger>
              <TabsTrigger value="bedroom">Bedroom</TabsTrigger>
            </TabsList>
            <TabsContent value="kitchen" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-3">Daily (5 mins)</h3>
                <div className="space-y-2">
                  <TaskItem id="kitchen-daily-1">Wash dishes or load dishwasher</TaskItem>
                  <TaskItem id="kitchen-daily-2">Wipe counters</TaskItem>
                  <TaskItem id="kitchen-daily-3">Take out rubbish if full</TaskItem>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Weekly (15 mins)</h3>
                <div className="space-y-2">
                  <TaskItem id="kitchen-weekly-1">Clean hob/stove</TaskItem>
                  <TaskItem id="kitchen-weekly-2">Wipe inside microwave</TaskItem>
                  <TaskItem id="kitchen-weekly-3">Sweep or vacuum floor</TaskItem>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="bathroom" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-3">Daily (3 mins)</h3>
                <div className="space-y-2">
                  <TaskItem id="bathroom-daily-1">Wipe sink after use</TaskItem>
                  <TaskItem id="bathroom-daily-2">Hang up towels</TaskItem>
                  <TaskItem id="bathroom-daily-3">Quick toilet brush</TaskItem>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Weekly (20 mins)</h3>
                <div className="space-y-2">
                  <TaskItem id="bathroom-weekly-1">Clean toilet properly</TaskItem>
                  <TaskItem id="bathroom-weekly-2">Wipe shower/bath</TaskItem>
                  <TaskItem id="bathroom-weekly-3">Clean mirror</TaskItem>
                  <TaskItem id="bathroom-weekly-4">Mop floor</TaskItem>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="bedroom" className="space-y-4 mt-4">
              <div>
                <h3 className="font-semibold mb-3">Daily (5 mins)</h3>
                <div className="space-y-2">
                  <TaskItem id="bedroom-daily-1">Make bed (or just straighten duvet)</TaskItem>
                  <TaskItem id="bedroom-daily-2">Put clothes away or in laundry</TaskItem>
                  <TaskItem id="bedroom-daily-3">Open window for fresh air</TaskItem>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Weekly (15 mins)</h3>
                <div className="space-y-2">
                  <TaskItem id="bedroom-weekly-1">Change bed sheets</TaskItem>
                  <TaskItem id="bedroom-weekly-2">Vacuum floor</TaskItem>
                  <TaskItem id="bedroom-weekly-3">Dust surfaces</TaskItem>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Who Fixes What?</CardTitle>
          <CardDescription>Tenant vs Landlord responsibilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-accent rounded-lg p-4">
            <h3 className="font-semibold mb-2">🏠 Landlord Must Fix:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Broken boiler or heating</li>
              <li>Leaking roof or pipes</li>
              <li>Broken windows</li>
              <li>Electrical problems</li>
              <li>Damp and mould (if not your fault)</li>
              <li>Broken toilet or sink</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-2">🔧 You Should Fix:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Lightbulbs</li>
              <li>Batteries in smoke alarms</li>
              <li>Minor blockages you caused</li>
              <li>Things you broke</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            <strong>Tip:</strong> Always report problems to your landlord in writing (email or text) so you have proof.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Housework;
