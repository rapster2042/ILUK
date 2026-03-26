import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ChevronDown, ChevronUp, UtensilsCrossed } from 'lucide-react';
import { getUserId, getShoppingLists, createShoppingList, updateShoppingList, deleteShoppingList, createCompletedTaskForAction } from '@/db/api';
import type { ShoppingList, ShoppingItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

const Shopping = () => {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    swaps: false,
    nutrition: false,
    costCutting: false,
    storage: false,
    planning: false
  });
  const { toast } = useToast();
  const userId = getUserId();

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    const data = await getShoppingLists(userId);
    const sortedLists = data.sort((a, b) => {
      if (a.list_name === 'Meal Plan Shopping List') return -1;
      if (b.list_name === 'Meal Plan Shopping List') return 1;
      return 0;
    });
    setLists(sortedLists);
    setLoading(false);
  };

  const handleCreateList = async () => {
    const isFirstList = lists.length === 0;
    
    const newList = await createShoppingList(userId, 'My Shopping List');
    if (newList) {
      setLists([newList, ...lists]);
      
      // Create a completed task for the first shopping list
      if (isFirstList) {
        await createCompletedTaskForAction(
          userId,
          'Created your first shopping list',
          'Started organizing your shopping',
          'shopping'
        );
      }
    }
  };

  const handleAddItem = async (listId: string) => {
    if (!newItemName.trim()) return;

    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const newItem: ShoppingItem = {
      id: crypto.randomUUID(),
      name: newItemName,
      checked: false
    };

    const updated = await updateShoppingList(listId, {
      items: [...list.items, newItem]
    });

    if (updated) {
      setLists(lists.map(l => l.id === listId ? updated : l));
      setNewItemName('');
    }
  };

  const handleToggleItem = async (listId: string, itemId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );

    const updated = await updateShoppingList(listId, { items: updatedItems });
    if (updated) {
      setLists(lists.map(l => l.id === listId ? updated : l));
    }
  };

  const handleDeleteItem = async (listId: string, itemId: string) => {
    const list = lists.find(l => l.id === listId);
    if (!list) return;

    const updatedItems = list.items.filter(item => item.id !== itemId);
    const updated = await updateShoppingList(listId, { items: updatedItems });
    if (updated) {
      setLists(lists.map(l => l.id === listId ? updated : l));
    }
  };

  const handleDeleteList = async (listId: string) => {
    const success = await deleteShoppingList(listId);
    if (success) {
      setLists(lists.filter(l => l.id !== listId));
      toast({ title: 'List deleted' });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const isCurrentlyExpanded = prev[section];
      // Close all sections
      const allClosed = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {} as { [key: string]: boolean });
      
      // If the clicked section was closed, open it; otherwise keep all closed
      return {
        ...allClosed,
        [section]: !isCurrentlyExpanded
      };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Shopping & Food</h1>
        <p className="text-muted-foreground text-lg">
          Smart shopping tips and budget-friendly advice
        </p>
      </div>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>Shopping Tips</CardTitle>
          <CardDescription>Save money, eat well, and shop smarter</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection('swaps')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">💰 Budget Supermarket Swaps</h3>
              {expandedSections.swaps ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {expandedSections.swaps && (
              <div className="p-4 pt-0 space-y-3">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span>Branded cereal</span>
                  <span className="text-primary font-semibold">→ Own brand (save £1-2)</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span>Fresh veg</span>
                  <span className="text-primary font-semibold">→ Frozen veg (same nutrition, cheaper)</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span>Branded pasta</span>
                  <span className="text-primary font-semibold">→ Value pasta (tastes the same)</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span>Pre-cut fruit</span>
                  <span className="text-primary font-semibold">→ Whole fruit (save 50%)</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span>Bottled water</span>
                  <span className="text-primary font-semibold">→ Tap water (free & safe in UK)</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span>Fresh herbs</span>
                  <span className="text-primary font-semibold">→ Dried herbs (last longer, cheaper)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Ready meals</span>
                  <span className="text-primary font-semibold">→ Batch cook & freeze (save £3-5)</span>
                </div>
              </div>
            )}
          </div>

          <div className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection('nutrition')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">🥗 Nutrition on a Budget</h3>
              {expandedSections.nutrition ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {expandedSections.nutrition && (
              <div className="p-4 pt-0 space-y-2 text-sm">
                <p className="font-semibold mb-2">Cheap & nutritious foods:</p>
                <ul className="space-y-1">
                  <li>• <strong>Eggs</strong> - Complete protein, vitamins, under £2 for 6</li>
                  <li>• <strong>Frozen vegetables</strong> - Same nutrients as fresh, no waste</li>
                  <li>• <strong>Tinned beans</strong> - Protein, fibre, 50p per tin</li>
                  <li>• <strong>Oats</strong> - Filling breakfast, £1 for a week's worth</li>
                  <li>• <strong>Bananas</strong> - Energy, potassium, cheapest fruit</li>
                  <li>• <strong>Tinned tomatoes</strong> - Vitamin C, lycopene, 40p per tin</li>
                  <li>• <strong>Brown rice</strong> - Fibre, energy, lasts months</li>
                  <li>• <strong>Peanut butter</strong> - Protein, healthy fats, £1.50</li>
                </ul>
                <p className="mt-3 text-muted-foreground italic">
                  Frozen veg is picked and frozen at peak freshness - often more nutritious than "fresh" veg that's been sitting for days!
                </p>
              </div>
            )}
          </div>

          <div className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection('costCutting')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">✂️ Cost-Cutting Strategies</h3>
              {expandedSections.costCutting ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {expandedSections.costCutting && (
              <div className="p-4 pt-0 space-y-2 text-sm">
                <ul className="space-y-2">
                  <li>
                    <strong>Shop at discount supermarkets</strong>
                    <p className="text-muted-foreground">Aldi, Lidl, and Iceland are 20-30% cheaper than big brands</p>
                  </li>
                  <li>
                    <strong>Check yellow sticker sections</strong>
                    <p className="text-muted-foreground">Go late evening (7-9pm) for 50-75% off items near expiry</p>
                  </li>
                  <li>
                    <strong>Buy in bulk for staples</strong>
                    <p className="text-muted-foreground">Rice, pasta, tinned goods - cheaper per unit and last months</p>
                  </li>
                  <li>
                    <strong>Avoid meal deals if you don't need all items</strong>
                    <p className="text-muted-foreground">£3 meal deal vs £1 sandwich - only worth it if you want everything</p>
                  </li>
                  <li>
                    <strong>Cook from scratch when possible</strong>
                    <p className="text-muted-foreground">A jar of pasta sauce costs £1.50 - tinned tomatoes cost 40p</p>
                  </li>
                  <li>
                    <strong>Use loyalty cards</strong>
                    <p className="text-muted-foreground">Tesco Clubcard, Sainsbury's Nectar - free money back</p>
                  </li>
                  <li>
                    <strong>Plan meals around what's on offer</strong>
                    <p className="text-muted-foreground">Check supermarket apps for weekly deals before shopping</p>
                  </li>
                </ul>
              </div>
            )}
          </div>

          <div className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection('storage')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">❄️ Food Storage & Reducing Waste</h3>
              {expandedSections.storage ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {expandedSections.storage && (
              <div className="p-4 pt-0 space-y-2 text-sm">
                <p className="font-semibold mb-2">What you can freeze:</p>
                <ul className="space-y-1 mb-3">
                  <li>• Bread (toast from frozen)</li>
                  <li>• Milk (shake well after defrosting)</li>
                  <li>• Cheese (grate first for best results)</li>
                  <li>• Cooked rice and pasta</li>
                  <li>• Leftover curry, stew, soup</li>
                  <li>• Bananas (for smoothies)</li>
                  <li>• Butter and margarine</li>
                </ul>
                <p className="font-semibold mb-2">Understanding dates:</p>
                <ul className="space-y-1">
                  <li>• <strong>Use by</strong> - Safety date, don't eat after this</li>
                  <li>• <strong>Best before</strong> - Quality date, usually fine for days/weeks after</li>
                  <li>• <strong>Display until</strong> - For shop staff, ignore this</li>
                </ul>
                <p className="mt-3 text-muted-foreground italic">
                  Freezing food on the day you buy it can extend its life by months!
                </p>
              </div>
            )}
          </div>

          <div className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection('planning')}
              className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors"
            >
              <h3 className="font-semibold">📝 Meal Planning Basics</h3>
              {expandedSections.planning ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>
            {expandedSections.planning && (
              <div className="p-4 pt-0 space-y-2 text-sm">
                <ul className="space-y-2">
                  <li>
                    <strong>Start with 3 meals per week</strong>
                    <p className="text-muted-foreground">Don't overwhelm yourself - plan Monday, Wednesday, Friday</p>
                  </li>
                  <li>
                    <strong>Choose meals that share ingredients</strong>
                    <p className="text-muted-foreground">Buy one pack of mince, make bolognese and chilli</p>
                  </li>
                  <li>
                    <strong>Keep emergency meals in stock</strong>
                    <p className="text-muted-foreground">Tinned soup, beans on toast, instant noodles for low-energy days</p>
                  </li>
                  <li>
                    <strong>Cook double portions</strong>
                    <p className="text-muted-foreground">Freeze half for a future meal - saves time and energy</p>
                  </li>
                  <li>
                    <strong>Use our Meal Planner</strong>
                    <p className="text-muted-foreground">Check out the Meal Planner page for recipe ideas and automatic shopping lists</p>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="card-soft">
        <CardHeader>
          <CardTitle>My Shopping Lists</CardTitle>
          <CardDescription>Create and manage your shopping lists</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lists.length === 0 && !loading && (
            <p className="text-muted-foreground text-center py-4">No lists yet. Create one to get started!</p>
          )}

          {lists.map((list) => {
            const isMealPlanList = list.list_name === 'Meal Plan Shopping List';
            return (
              <div 
                key={list.id} 
                className={`border rounded-lg p-4 space-y-3 ${
                  isMealPlanList 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {isMealPlanList && <UtensilsCrossed className="h-5 w-5 text-primary" />}
                    <h3 className="font-semibold">{list.list_name}</h3>
                    {isMealPlanList && (
                      <Badge variant="secondary" className="text-xs">
                        From Meal Plans
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteList(list.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

              <div className="space-y-2">
                {list.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => handleToggleItem(list.id, item.id)}
                    />
                    <span className={item.checked ? 'line-through text-muted-foreground' : ''}>
                      {item.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-8 w-8"
                      onClick={() => handleDeleteItem(list.id, item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Add item..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddItem(list.id);
                    }
                  }}
                />
                <Button onClick={() => handleAddItem(list.id)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            );
          })}

          <Button onClick={handleCreateList} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New List
          </Button>
        </CardContent>
      </Card>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">💡 ADHD-Friendly Shopping Tips</h3>
          <ul className="space-y-1 text-sm">
            <li>• Shop online to avoid overwhelm</li>
            <li>• Go at quiet times (early morning or late evening)</li>
            <li>• Use a list and stick to it</li>
            <li>• Don't shop when hungry</li>
            <li>• Set a timer for 30 minutes max</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Shopping;
