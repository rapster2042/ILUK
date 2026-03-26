// Updated: Multiple meals per day with online recipe search and AI generation
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Clock, Coins, ShoppingCart, X, ChevronDown, ChevronUp, Loader2, AlertTriangle, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { recipes as localRecipes, type Recipe } from '@/data/recipes';
import { getUserId, getMealPlans, saveMealPlan, createMealPlanShoppingList, createCompletedTaskForAction } from '@/db/api';
import type { MealSlot } from '@/types';

interface DayMeals {
  day: string;
  meals: MealSlot[];
}

interface MealDBRecipe {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  [key: string]: string;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Normalize ingredient names to purchasable items
const normalizeIngredient = (item: string): string => {
  let normalized = item.trim();
  
  // Extract main ingredient only - drop everything after comma or "for"
  // Examples: "Carrot, finely chopped" → "Carrot"
  //           "Vegetable oil for seasoning" → "Vegetable oil"
  if (normalized.includes(',')) {
    normalized = normalized.split(',')[0].trim();
  }
  if (normalized.toLowerCase().includes(' for ')) {
    normalized = normalized.split(/\s+for\s+/i)[0].trim();
  }
  
  // Convert to lowercase for processing
  normalized = normalized.toLowerCase();
  
  // Remove preparation methods that might still be in the main part
  const prepMethods = [
    'chopped', 'sliced', 'diced', 'grated', 'shredded', 'minced', 'crushed',
    'peeled', 'cubed', 'julienned', 'finely', 'roughly', 'thinly', 'thickly',
    'fresh', 'dried', 'frozen', 'tinned', 'canned', 'cooked', 'raw', 
    'whole', 'halved', 'quartered'
  ];
  
  prepMethods.forEach(method => {
    normalized = normalized.replace(new RegExp(`\\b${method}\\b`, 'gi'), '').trim();
  });
  
  // Clean up extra spaces
  normalized = normalized.replace(/\s+/g, ' ').trim();
  
  // Capitalize first letter of each word for display
  return normalized.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

// Parse quantity from amount string
const parseQuantity = (amount: string): { value: number; unit: string } => {
  // Handle fractions
  const fractionMap: { [key: string]: number } = {
    '1/4': 0.25, '1/3': 0.33, '1/2': 0.5, '2/3': 0.67, '3/4': 0.75
  };
  
  let numericValue = 0;
  let unit = '';
  
  // Check for fractions
  for (const [fraction, value] of Object.entries(fractionMap)) {
    if (amount.includes(fraction)) {
      numericValue = value;
      unit = amount.replace(fraction, '').trim();
      return { value: numericValue, unit };
    }
  }
  
  // Parse regular numbers
  const match = amount.match(/^([\d.]+)\s*(.*)$/);
  if (match) {
    numericValue = parseFloat(match[1]);
    unit = match[2].trim();
  } else {
    // If no number found, treat as 1 unit
    numericValue = 1;
    unit = amount;
  }
  
  return { value: numericValue, unit };
};

// Combine quantities intelligently
const combineQuantities = (amounts: string[]): string => {
  if (amounts.length === 1) return amounts[0];
  
  // Parse all amounts
  const parsed = amounts.map(parseQuantity);
  
  // Check if all have the same unit
  const firstUnit = parsed[0].unit;
  const sameUnit = parsed.every(p => p.unit === firstUnit);
  
  if (sameUnit && firstUnit) {
    // Sum up values
    const total = parsed.reduce((sum, p) => sum + p.value, 0);
    
    // Format nicely
    if (total % 1 === 0) {
      return `${total} ${firstUnit}`;
    } else {
      return `${total.toFixed(1)} ${firstUnit}`;
    }
  }
  
  // If units don't match or are complex, list them
  return amounts.join(' + ');
};

const MealPlans = () => {
  const [weekMeals, setWeekMeals] = useState<DayMeals[]>(
    DAYS.map(day => ({ day, meals: [] }))
  );
  const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>(
    Object.fromEntries(DAYS.map(day => [day, '']))
  );
  const [showSuggestions, setShowSuggestions] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(DAYS.map(day => [day, false]))
  );
  const [expandedMeals, setExpandedMeals] = useState<{ [key: string]: boolean }>({});
  const [onlineRecipes, setOnlineRecipes] = useState<{ [key: string]: Recipe[] }>({});
  const [aiGeneratedRecipes, setAiGeneratedRecipes] = useState<{ [key: string]: { recipe: Recipe; searchTerm: string } | null }>({});
  const [isSearching, setIsSearching] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(DAYS.map(day => [day, false]))
  );
  const [isGeneratingAI, setIsGeneratingAI] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(DAYS.map(day => [day, false]))
  );
  const [servingFilter, setServingFilter] = useState<'1' | '2'>('1');
  const [loading, setLoading] = useState(true);
  const [isShoppingListExpanded, setIsShoppingListExpanded] = useState(false);
  const { toast } = useToast();
  const userId = getUserId();

  useEffect(() => {
    loadMealPlans();
  }, []);

  const loadMealPlans = async () => {
    try {
      const plans = await getMealPlans(userId);
      if (plans.length > 0) {
        const loadedMeals = DAYS.map(day => {
          const plan = plans.find(p => p.day === day);
          return {
            day,
            meals: plan?.meals || []
          };
        });
        setWeekMeals(loadedMeals);
      }
    } catch (error) {
      console.error('Error loading meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveMealPlanToDb = async (day: string, meals: MealSlot[]) => {
    try {
      await saveMealPlan(userId, day, meals);
    } catch (error) {
      console.error('Error saving meal plan:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save meal plan. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const convertMealDBToRecipe = (meal: MealDBRecipe): Recipe => {
    const ingredients: { item: string; amount1: string; amount2: string }[] = [];
    
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      
      if (ingredient && ingredient.trim()) {
        const amount = measure?.trim() || 'As needed';
        
        // Parse and scale amounts for 1 and 2 servings
        const amount1 = scaleIngredientAmount(amount, 0.5); // Half for single serving
        const amount2 = amount; // Original amount for 2 people
        
        ingredients.push({
          item: ingredient.trim(),
          amount1,
          amount2
        });
      }
    }

    const instructions = meal.strInstructions
      .split(/\r?\n/)
      .filter(line => line.trim().length > 0)
      .map(line => line.trim());

    return {
      id: `online-${meal.idMeal}`,
      name: meal.strMeal,
      prepTime: '30-45 mins',
      cost: '£3-5',
      difficulty: 'Easy',
      ingredients,
      instructions,
      tags: ['online'],
      searchTerms: [meal.strMeal.toLowerCase()]
    };
  };

  // Helper function to scale ingredient amounts
  const scaleIngredientAmount = (amount: string, scale: number): string => {
    // Handle common patterns like "2 cups", "1 tbsp", "500g", etc.
    const numberMatch = amount.match(/^(\d+\.?\d*)\s*(.*)$/);
    if (numberMatch) {
      const num = parseFloat(numberMatch[1]);
      const unit = numberMatch[2];
      const scaled = num * scale;
      
      // Round to reasonable precision
      const rounded = scaled < 1 ? Math.round(scaled * 10) / 10 : Math.round(scaled);
      return `${rounded} ${unit}`;
    }
    
    // Handle fractions like "1/2 cup"
    const fractionMatch = amount.match(/^(\d+)\/(\d+)\s*(.*)$/);
    if (fractionMatch) {
      const numerator = parseInt(fractionMatch[1]);
      const denominator = parseInt(fractionMatch[2]);
      const unit = fractionMatch[3];
      const decimal = (numerator / denominator) * scale;
      
      if (decimal < 1) {
        return `${Math.round(decimal * 10) / 10} ${unit}`;
      }
      return `${Math.round(decimal)} ${unit}`;
    }
    
    // If we can't parse it, return as-is with a note
    return amount.includes('to taste') || amount.includes('As needed') 
      ? amount 
      : `${amount} (adjust to taste)`;
  };

  const searchOnlineRecipes = useCallback(async (searchTerm: string, day: string) => {
    if (!searchTerm.trim() || searchTerm.length < 3) return;

    setIsSearching(prev => ({ ...prev, [day]: true }));

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchTerm)}`
      );
      
      if (!response.ok) throw new Error('Failed to fetch recipes');
      
      const data = await response.json();
      
      if (data.meals && Array.isArray(data.meals)) {
        const convertedRecipes = data.meals.map(convertMealDBToRecipe);
        setOnlineRecipes(prev => ({
          ...prev,
          [day]: convertedRecipes
        }));
      } else {
        setOnlineRecipes(prev => ({
          ...prev,
          [day]: []
        }));
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      toast({
        title: 'Search failed',
        description: 'Could not fetch recipes. Showing local recipes instead.',
        variant: 'destructive'
      });
    } finally {
      setIsSearching(prev => ({ ...prev, [day]: false }));
    }
  }, [toast]);

  const generateAIRecipe = useCallback(async (searchTerm: string, day: string) => {
    setIsGeneratingAI(prev => ({ ...prev, [day]: true }));
    
    try {
      const APP_ID = import.meta.env.VITE_APP_ID;
      console.log('Generating AI recipe for:', searchTerm);
      console.log('Using APP_ID:', APP_ID);
      
      const prompt = `Create a simple recipe for "${searchTerm}" suitable for 1-2 people. 
      
Please format the response EXACTLY as follows:

RECIPE NAME: [name]
PREP TIME: [time in minutes]
COST: [£ or ££ or £££]
SERVINGS: 2

INGREDIENTS:
- [amount for 1 person] | [amount for 2 people] [ingredient name]

IMPORTANT: Each ingredient line MUST follow this exact format:
- 100g | 200g chicken breast
- 1 tbsp | 2 tbsp olive oil
- 50ml | 100ml milk

The ingredient name must come AFTER the amounts. For example:
CORRECT: - 100g | 200g pasta
WRONG: - pasta 100g | 200g

List all ingredients (max 12 ingredients).

INSTRUCTIONS:
1. [step 1]
2. [step 2]
(continue for all steps)

Keep it simple, affordable, and suitable for someone learning to cook. Use common UK ingredients and measurements (g, ml, tbsp, tsp).`;

      const response = await fetch(
        'https://api-integrations.appmedo.com/app-8a0fiym6u1a9/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-App-Id': APP_ID
          },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`AI generation failed: ${response.status} ${errorText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (!reader) {
        throw new Error('No response body reader available');
      }

      console.log('Starting to read stream...');
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('Stream reading complete');
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        console.log('Received chunk:', chunk.substring(0, 100) + '...');
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonData = JSON.parse(line.slice(6));
              const text = jsonData.candidates?.[0]?.content?.parts?.[0]?.text;
              if (text) {
                fullText += text;
              }
            } catch (e) {
              console.warn('Failed to parse JSON line:', line, e);
            }
          }
        }
      }

      console.log('Full AI response text:', fullText);

      if (!fullText.trim()) {
        throw new Error('AI returned empty response');
      }

      // Parse the AI response into a Recipe object
      const recipe = parseAIRecipe(fullText, searchTerm);
      if (recipe) {
        console.log('Successfully parsed recipe:', recipe.name);
        setAiGeneratedRecipes(prev => ({ ...prev, [day]: { recipe, searchTerm: searchTerm.toLowerCase().trim() } }));
        toast({
          title: 'Recipe generated!',
          description: `Created "${recipe.name}" with AI. Please verify instructions before cooking.`,
        });
      } else {
        console.error('Failed to parse recipe from text:', fullText);
        throw new Error('Could not parse AI recipe');
      }
    } catch (error) {
      console.error('Error generating AI recipe:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'AI generation failed',
        description: errorMessage.includes('AI generation failed') 
          ? 'Could not connect to AI service. Please try again.'
          : 'Could not generate recipe. Please try a different search term.',
        variant: 'destructive'
      });
      setAiGeneratedRecipes(prev => ({ ...prev, [day]: null }));
    } finally {
      setIsGeneratingAI(prev => ({ ...prev, [day]: false }));
    }
  }, [toast]);

  const parseAIRecipe = (text: string, searchTerm: string): Recipe | null => {
    try {
      console.log('Parsing AI recipe text...');
      const lines = text.split('\n').map(l => l.trim()).filter(l => l);
      
      let name = searchTerm;
      let prepTime = '30 mins';
      let cost = '££';
      const ingredients: { item: string; amount1: string; amount2: string }[] = [];
      const instructions: string[] = [];
      
      let section = '';
      
      for (const line of lines) {
        // Check for section headers (case insensitive)
        const upperLine = line.toUpperCase();
        
        if (upperLine.startsWith('RECIPE NAME:') || upperLine.startsWith('NAME:')) {
          name = line.replace(/^(RECIPE NAME:|NAME:)/i, '').trim();
          console.log('Found recipe name:', name);
        } else if (upperLine.startsWith('PREP TIME:') || upperLine.startsWith('TIME:')) {
          prepTime = line.replace(/^(PREP TIME:|TIME:)/i, '').trim();
          if (!prepTime.includes('min')) prepTime += ' mins';
          console.log('Found prep time:', prepTime);
        } else if (upperLine.startsWith('COST:')) {
          const rawCost = line.replace(/^COST:/i, '').trim();
          // Normalize cost to £, ££, or £££ format
          if (rawCost.includes('£££') || rawCost.toLowerCase().includes('expensive') || rawCost.toLowerCase().includes('high')) {
            cost = '£££';
          } else if (rawCost.includes('££') || rawCost.toLowerCase().includes('moderate') || rawCost.toLowerCase().includes('medium')) {
            cost = '££';
          } else if (rawCost.includes('£') || rawCost.toLowerCase().includes('cheap') || rawCost.toLowerCase().includes('low') || rawCost.toLowerCase().includes('budget')) {
            cost = '£';
          } else {
            cost = rawCost || '££'; // Default to moderate if can't parse
          }
          console.log('Found cost:', cost, '(from:', rawCost, ')');
        } else if (upperLine === 'INGREDIENTS:' || upperLine.startsWith('INGREDIENTS')) {
          section = 'ingredients';
          console.log('Entering ingredients section');
        } else if (upperLine === 'INSTRUCTIONS:' || upperLine === 'METHOD:' || upperLine.startsWith('INSTRUCTIONS') || upperLine.startsWith('METHOD')) {
          section = 'instructions';
          console.log('Entering instructions section');
        } else if (section === 'ingredients' && (line.startsWith('-') || line.startsWith('•') || line.startsWith('*'))) {
          const ingredientLine = line.substring(1).trim();
          console.log('Parsing ingredient line:', ingredientLine);
          const parts = ingredientLine.split('|');
          
          if (parts.length >= 2) {
            // Format: amount1 | amount2 ingredient
            const amount1 = parts[0].trim();
            const rest = parts[1].trim();
            
            // Try to extract amount2 and item more intelligently
            // Match pattern: optional number, optional space, optional unit, then the rest is the item
            const match = rest.match(/^([\d\/\.\s]*(?:g|ml|tbsp|tsp|cup|cups|oz|lb|lbs|kg|mg|l)?)\s*(.+)$/i);
            
            if (match && match[2]) {
              const amount2 = match[1].trim() || 'As needed';
              const item = match[2].trim();
              ingredients.push({ item, amount1, amount2 });
              console.log('Added ingredient (pipe format):', { item, amount1, amount2 });
            } else {
              // If regex fails, treat everything after pipe as item
              const item = rest.trim();
              ingredients.push({ item, amount1, amount2: amount1 });
              console.log('Added ingredient (pipe format, no amount2):', { item, amount1, amount2: amount1 });
            }
          } else {
            // Fallback: try to parse "amount ingredient" format
            const match = ingredientLine.match(/^([\d\/\.\s]+(?:g|ml|tbsp|tsp|cup|cups|oz|lb|lbs|kg|mg|l)?)\s+(.+)$/i);
            if (match && match[2]) {
              const amount = match[1].trim();
              const item = match[2].trim();
              ingredients.push({ item, amount1: amount, amount2: amount });
              console.log('Added ingredient (fallback):', { item, amount1: amount, amount2: amount });
            } else if (ingredientLine) {
              // Last resort: treat whole line as ingredient with "As needed"
              ingredients.push({ item: ingredientLine, amount1: 'As needed', amount2: 'As needed' });
              console.log('Added ingredient (no amount):', ingredientLine);
            }
          }
        } else if (section === 'instructions' && /^\d+[\.\)]/.test(line)) {
          const instruction = line.replace(/^\d+[\.\)]\s*/, '').trim();
          if (instruction) {
            instructions.push(instruction);
            console.log('Added instruction:', instruction.substring(0, 50) + '...');
          }
        }
      }
      
      console.log('Parsing complete. Ingredients:', ingredients.length, 'Instructions:', instructions.length);
      console.log('Parsed values - Name:', name, 'PrepTime:', prepTime, 'Cost:', cost);
      
      if (ingredients.length === 0 || instructions.length === 0) {
        console.error('Parsing failed: missing ingredients or instructions');
        return null;
      }
      
      const recipe = {
        id: `ai-${Date.now()}`,
        name,
        ingredients,
        instructions,
        prepTime,
        cost,
        difficulty: 'Easy' as const,
        tags: ['ai-generated'],
        searchTerms: [searchTerm.toLowerCase()]
      };
      
      console.log('Successfully created recipe:', recipe.name);
      return recipe;
    } catch (error) {
      console.error('Error parsing AI recipe:', error);
      return null;
    }
  };

  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {};

    DAYS.forEach(day => {
      const term = searchTerms[day];
      if (term && term.length >= 3) {
        timers[day] = setTimeout(() => {
          searchOnlineRecipes(term, day);
        }, 500);
      }
    });

    return () => {
      Object.values(timers).forEach(timer => clearTimeout(timer));
    };
  }, [searchTerms, searchOnlineRecipes]);

  const getSuggestions = (day: string) => {
    const term = searchTerms[day]?.toLowerCase().trim();
    if (!term) return [];

    const online = onlineRecipes[day] || [];
    const local = localRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(term) ||
      recipe.searchTerms.some(searchTerm => searchTerm.includes(term))
    );

    // Add AI-generated recipe ONLY if it matches the current search term
    const aiRecipeData = aiGeneratedRecipes[day];
    const aiRecipe = aiRecipeData && aiRecipeData.searchTerm.toLowerCase() === term 
      ? aiRecipeData.recipe 
      : null;
    
    const combined = aiRecipe ? [aiRecipe, ...online, ...local] : [...online, ...local];
    
    const unique = combined.filter((recipe, index, self) =>
      index === self.findIndex(r => r.name === recipe.name)
    );

    // Filter and sort recipes based on serving size preference
    const filtered = unique
      .filter(recipe => {
        // Prefer recipes with 12 or fewer ingredients (suitable for 1-2 people)
        return recipe.ingredients.length <= 12;
      })
      .sort((a, b) => {
        // Prioritize AI-generated recipes
        if (a.tags.includes('ai-generated') && !b.tags.includes('ai-generated')) return -1;
        if (!a.tags.includes('ai-generated') && b.tags.includes('ai-generated')) return 1;
        
        // Then prioritize recipes with fewer ingredients
        const ingredientDiff = a.ingredients.length - b.ingredients.length;
        if (ingredientDiff !== 0) return ingredientDiff;
        
        // Then sort by name
        return a.name.localeCompare(b.name);
      });

    return filtered.slice(0, 10);
  };

  const addMeal = (day: string, recipe: Recipe) => {
    // Check if this is the first meal across all days
    const totalMeals = weekMeals.reduce((sum, dayMeal) => sum + dayMeal.meals.length, 0);
    const isFirstMeal = totalMeals === 0;
    
    const newSlot: MealSlot = {
      id: `${day}-${Date.now()}`,
      recipe,
      servings: parseInt(servingFilter)
    };

    setWeekMeals(prev => {
      const updated = prev.map(dayMeal =>
        dayMeal.day === day
          ? { ...dayMeal, meals: [...dayMeal.meals, newSlot] }
          : dayMeal
      );
      const dayMeals = updated.find(d => d.day === day);
      if (dayMeals) {
        saveMealPlanToDb(day, dayMeals.meals);
      }
      return updated;
    });
    
    // Create a completed task for the first meal
    if (isFirstMeal) {
      createCompletedTaskForAction(
        userId,
        'Created your first meal plan',
        'Started planning your meals for the week',
        'learning'
      );
    }
    
    setSearchTerms(prev => ({ ...prev, [day]: '' }));
    setShowSuggestions(prev => ({ ...prev, [day]: false }));
  };

  const removeMeal = (day: string, slotId: string) => {
    setWeekMeals(prev => {
      const updated = prev.map(dayMeal =>
        dayMeal.day === day
          ? { ...dayMeal, meals: dayMeal.meals.filter(slot => slot.id !== slotId) }
          : dayMeal
      );
      const dayMeals = updated.find(d => d.day === day);
      if (dayMeals) {
        saveMealPlanToDb(day, dayMeals.meals);
      }
      return updated;
    });
  };

  const updateServings = (day: string, slotId: string, servings: number) => {
    setWeekMeals(prev => {
      const updated = prev.map(dayMeal =>
        dayMeal.day === day
          ? {
              ...dayMeal,
              meals: dayMeal.meals.map(slot =>
                slot.id === slotId ? { ...slot, servings } : slot
              )
            }
          : dayMeal
      );
      const dayMeals = updated.find(d => d.day === day);
      if (dayMeals) {
        saveMealPlanToDb(day, dayMeals.meals);
      }
      return updated;
    });
  };

  const toggleExpanded = (slotId: string) => {
    setExpandedMeals(prev => ({ ...prev, [slotId]: !prev[slotId] }));
  };

  const allMeals = weekMeals.flatMap(day => day.meals);

  const shoppingList = useMemo(() => {
    const ingredientMap = new Map<string, { amounts: string[]; count: number; originalNames: string[] }>();

    allMeals.forEach(slot => {
      slot.recipe.ingredients.forEach(ing => {
        const amount = slot.servings === 1 ? ing.amount1 : ing.amount2;
        const normalizedName = normalizeIngredient(ing.item);
        const existing = ingredientMap.get(normalizedName);
        
        if (existing) {
          ingredientMap.set(normalizedName, {
            amounts: [...existing.amounts, amount],
            count: existing.count + 1,
            originalNames: [...existing.originalNames, ing.item]
          });
        } else {
          ingredientMap.set(normalizedName, { 
            amounts: [amount], 
            count: 1,
            originalNames: [ing.item]
          });
        }
      });
    });

    return Array.from(ingredientMap.entries()).map(([item, data]) => ({
      item,
      amount: combineQuantities(data.amounts),
      shared: data.count > 1,
      count: data.count,
      originalNames: data.originalNames
    })).sort((a, b) => {
      // Sort by shared first (shared ingredients at top), then alphabetically
      if (a.shared && !b.shared) return -1;
      if (!a.shared && b.shared) return 1;
      return a.item.localeCompare(b.item);
    });
  }, [allMeals]);

  const saveShoppingList = async () => {
    if (shoppingList.length === 0) {
      toast({
        title: 'No items',
        description: 'Add some meals first to create a shopping list.',
        variant: 'destructive'
      });
      return;
    }

    try {
      const items = shoppingList.map(item => ({
        name: `${item.item} - ${item.amount}`,
        quantity: item.count > 1 ? item.count : undefined
      }));

      await createMealPlanShoppingList(userId, items);

      toast({
        title: 'Shopping list saved!',
        description: 'Your meal plan shopping list has been added to the Shopping module.',
      });
    } catch (error) {
      console.error('Error saving shopping list:', error);
      toast({
        title: 'Save failed',
        description: 'Could not save shopping list. Please try again.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Weekly Meal Planner</h1>
        <p className="text-muted-foreground text-lg">
          Plan all your meals and get a smart shopping list
        </p>
      </div>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">💡 How to use:</h3>
          <div className="flex items-center gap-2 mb-4">
            <Label htmlFor="serving-filter" className="text-sm">Planning for:</Label>
            <Select value={servingFilter} onValueChange={(v) => setServingFilter(v as '1' | '2')}>
              <SelectTrigger id="serving-filter" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 person</SelectItem>
                <SelectItem value="2">2 people</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ul className="space-y-1 text-sm">
            <li>• Choose if you're cooking for 1 person or 2 people above</li>
            <li>• Type any meal name - we'll find simple recipes perfect for your needs</li>
            <li>• Recipes are filtered to show simpler options with fewer ingredients</li>
            <li>• Ingredients automatically adjust when you change serving size</li>
            <li>• Add multiple meals per day - they stack above the search box</li>
            <li>• Get a combined shopping list with shared ingredients highlighted</li>
          </ul>
        </CardContent>
      </Card>

      {allMeals.length > 0 && (
        <Card className="card-soft border-primary">
          <CardHeader 
            className="cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={() => setIsShoppingListExpanded(!isShoppingListExpanded)}
          >
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Your Shopping List ({allMeals.length} meals planned)
              {isShoppingListExpanded ? (
                <ChevronUp className="h-5 w-5 ml-auto" />
              ) : (
                <ChevronDown className="h-5 w-5 ml-auto" />
              )}
            </CardTitle>
            {isShoppingListExpanded && (
              <CardDescription>
                {shoppingList.filter(i => i.shared).length > 0 && (
                  <span className="text-success font-semibold">
                    ✓ {shoppingList.filter(i => i.shared).length} ingredients used in multiple meals - save money!
                  </span>
                )}
              </CardDescription>
            )}
          </CardHeader>
          {isShoppingListExpanded && (
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-2">
                {shoppingList.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      item.shared ? 'bg-success/10 border border-success' : 'bg-muted'
                    }`}
                  >
                    <div className="font-medium">{item.item}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.amount}
                      {item.shared && (
                        <span className="text-success font-semibold ml-2">
                          (used in {item.count} meals)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={saveShoppingList}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Save to Shopping
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                  Print Shopping List
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      <div className="space-y-4">
        {weekMeals.map((dayMeals) => (
          <Card key={dayMeals.day} className="card-soft">
            <CardHeader>
              <CardTitle>{dayMeals.day}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dayMeals.meals.map((slot) => (
                <div key={slot.id} className="border rounded-lg p-4 space-y-3 bg-muted/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{slot.recipe.name}</h4>
                        {slot.recipe.tags.includes('online') && (
                          <Badge variant="default" className="text-xs">Online</Badge>
                        )}
                      </div>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Clock className="h-3 w-3" />
                          {slot.recipe.prepTime}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1 text-xs">
                          <Coins className="h-3 w-3" />
                          {slot.recipe.cost}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Select
                        value={slot.servings.toString()}
                        onValueChange={(value) => updateServings(dayMeals.day, slot.id, parseInt(value))}
                      >
                        <SelectTrigger className="w-20 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMeal(dayMeals.day, slot.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpanded(slot.id)}
                    className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors"
                  >
                    {expandedMeals[slot.id] ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        Hide Details
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        Show Details
                      </>
                    )}
                  </button>

                  {expandedMeals[slot.id] && (
                    <div className="space-y-3 pt-2 border-t">
                      {slot.recipe.tags.includes('ai-generated') && (
                        <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                          <div className="text-xs">
                            <p className="font-semibold text-warning-foreground mb-1">AI-Generated Recipe</p>
                            <p className="text-warning-foreground/80">
                              This recipe was created by AI. Please verify cooking times, temperatures, 
                              and instructions for safety before cooking.
                            </p>
                          </div>
                        </div>
                      )}
                      <div>
                        <h5 className="text-sm font-semibold mb-2">Ingredients:</h5>
                        <ul className="space-y-1 text-sm">
                          {slot.recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span>•</span>
                              <span>
                                {slot.servings === 1 ? ing.amount1 : ing.amount2} {ing.item}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-sm font-semibold mb-2">Instructions:</h5>
                        <ol className="space-y-2 text-sm">
                          {slot.recipe.instructions.map((step, idx) => (
                            <li key={idx} className="flex gap-2">
                              <span className="font-semibold text-primary">{idx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              <div className="relative -mt-[5px]">
                <Label htmlFor={`search-${dayMeals.day}`}>Add a meal</Label>
                <div className="relative mt-[5px]">
                  <Input
                    id={`search-${dayMeals.day}`}
                    placeholder="e.g. curry, pasta, pizza, omelette, sandwich..."
                    value={searchTerms[dayMeals.day]}
                    onChange={(e) => {
                      setSearchTerms(prev => ({ ...prev, [dayMeals.day]: e.target.value }));
                      setShowSuggestions(prev => ({ ...prev, [dayMeals.day]: true }));
                    }}
                    onFocus={() => setShowSuggestions(prev => ({ ...prev, [dayMeals.day]: true }))}
                    onBlur={() => {
                      setTimeout(() => {
                        setShowSuggestions(prev => ({ ...prev, [dayMeals.day]: false }));
                      }, 200);
                    }}
                  />
                  {isSearching[dayMeals.day] && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </div>
                {showSuggestions[dayMeals.day] && (
                  <>
                    {getSuggestions(dayMeals.day).length > 0 ? (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {getSuggestions(dayMeals.day).map((recipe) => (
                          <div key={recipe.id}>
                            {recipe.tags.includes('ai-generated') && (
                              <div className="px-4 py-2 bg-warning/10 border-b border-warning/20 flex items-start gap-2">
                                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                                <p className="text-xs text-warning-foreground">
                                  <strong>AI-Generated Recipe:</strong> This recipe was created by AI. 
                                  Please verify cooking times and instructions for safety.
                                </p>
                              </div>
                            )}
                            <button
                              className="w-full text-left px-4 py-3 hover:bg-accent transition-colors border-b last:border-b-0"
                              onClick={() => addMeal(dayMeals.day, recipe)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium flex items-center gap-2">
                                    {recipe.name}
                                    {recipe.tags.includes('ai-generated') && (
                                      <Sparkles className="h-3 w-3 text-primary" />
                                    )}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex gap-2 mt-1 flex-wrap">
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {recipe.prepTime}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Coins className="h-3 w-3" />
                                      {recipe.cost}
                                    </span>
                                    <span className="text-xs">
                                      {recipe.ingredients.length} ingredients
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {recipe.ingredients.length <= 8 && (
                                    <Badge variant="secondary" className="text-xs">Simple</Badge>
                                  )}
                                  {recipe.tags.includes('online') && (
                                    <Badge variant="default" className="text-xs">Online</Badge>
                                  )}
                                  {recipe.tags.includes('ai-generated') && (
                                    <Badge variant="outline" className="text-xs border-primary text-primary">AI</Badge>
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : searchTerms[dayMeals.day] && searchTerms[dayMeals.day].length >= 3 && !isSearching[dayMeals.day] && !isGeneratingAI[dayMeals.day] && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg p-4">
                        <p className="text-sm text-muted-foreground mb-3">
                          No recipes found for "{searchTerms[dayMeals.day]}". 
                          Would you like to generate a recipe with AI?
                        </p>
                        <Button
                          onClick={() => generateAIRecipe(searchTerms[dayMeals.day], dayMeals.day)}
                          className="w-full"
                          size="sm"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Recipe with AI
                        </Button>
                      </div>
                    )}
                    {isGeneratingAI[dayMeals.day] && (
                      <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating recipe with AI... This may take a moment.
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-2">💰 Money-Saving Tips:</h3>
          <ul className="space-y-1 text-sm">
            <li>• Buy own-brand products - same quality, lower price</li>
            <li>• Frozen vegetables are just as good and cheaper</li>
            <li>• Cook extra and freeze for another day</li>
            <li>• Tinned tomatoes last longer than fresh</li>
            <li>• Buy rice and pasta in bulk - they keep for months</li>
            <li>• Plan meals that share ingredients to reduce waste</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default MealPlans;
