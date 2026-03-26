import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, BookOpen, ChevronRight } from 'lucide-react';
import { getUserId, getLearningProgress, updateLearningProgress, checkAndAwardBadges, createCompletedTaskForAction } from '@/db/api';
import { useToast } from '@/hooks/use-toast';
import type { LearningProgress } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: {
    sections: {
      heading: string;
      content: string | string[];
    }[];
  };
}

interface Course {
  id: string;
  title: string;
  description: string;
  icon: string;
  lessons: Lesson[];
}

const courses: Course[] = [
  {
    id: 'food-safety',
    title: 'Food Safety Basics',
    description: 'Learn how to store, prepare, and cook food safely',
    icon: '🍽️',
    lessons: [
      {
        id: 'food-safety-1',
        title: 'Understanding Food Dates',
        description: 'What "use by" and "best before" really mean',
        duration: '5 mins',
        content: {
          sections: [
            {
              heading: 'Use By Date',
              content: [
                'This is the IMPORTANT one for safety',
                'Don\'t eat food after this date - it could make you ill',
                'Found on: meat, fish, dairy, ready meals',
                'Even if it looks and smells fine, bacteria you can\'t see might be growing'
              ]
            },
            {
              heading: 'Best Before Date',
              content: [
                'This is about quality, not safety',
                'Food is usually still safe to eat after this date',
                'It might just not taste as good or be as fresh',
                'Found on: crisps, biscuits, tinned food, dried pasta',
                'Use your judgment - if it looks, smells, and tastes fine, it\'s probably okay'
              ]
            },
            {
              heading: 'Quick Tips',
              content: [
                '• When in doubt, throw it out - food poisoning is horrible',
                '• Trust your nose - if it smells bad, don\'t eat it',
                '• Check dates when you buy food',
                '• Put newer items at the back of the fridge so you use older ones first'
              ]
            }
          ]
        }
      },
      {
        id: 'food-safety-2',
        title: 'Safe Food Storage',
        description: 'Where and how to store different foods',
        duration: '7 mins',
        content: {
          sections: [
            {
              heading: 'Fridge Temperature',
              content: 'Your fridge should be between 0-5°C. If you have a fridge thermometer, check it. If not, your fridge should feel cold but not freezing.'
            },
            {
              heading: 'What Goes in the Fridge',
              content: [
                '• Raw meat and fish (bottom shelf in sealed containers)',
                '• Dairy products (milk, cheese, yogurt)',
                '• Cooked leftovers (cool them first, then cover)',
                '• Opened jars and tins',
                '• Salad and vegetables (in the drawer)',
                '• Eggs (in the UK, eggs can go in the cupboard or fridge)'
              ]
            },
            {
              heading: 'What Stays in the Cupboard',
              content: [
                '• Bread (unless you want to keep it longer - then freeze it)',
                '• Potatoes, onions, garlic',
                '• Tinned food (unopened)',
                '• Dried pasta, rice, cereals',
                '• Biscuits, crisps, snacks',
                '• Tea, coffee, sugar'
              ]
            },
            {
              heading: 'Raw Meat Safety',
              content: [
                '• Always store raw meat on the bottom shelf',
                '• Keep it in a sealed container or bag',
                '• This stops juices dripping onto other food',
                '• Never put cooked food next to raw meat',
                '• Wash your hands after touching raw meat'
              ]
            }
          ]
        }
      },
      {
        id: 'food-safety-3',
        title: 'Cooking Safely',
        description: 'How to cook food properly to avoid illness',
        duration: '6 mins',
        content: {
          sections: [
            {
              heading: 'Cooking Temperatures',
              content: [
                'Food needs to be cooked all the way through to kill bacteria.',
                'You don\'t need a thermometer - just check:',
                '• Chicken: No pink meat, juices run clear',
                '• Mince: No pink bits anywhere',
                '• Fish: Flakes easily with a fork',
                '• Eggs: White and yolk are solid (unless you like runny yolk - that\'s fine)'
              ]
            },
            {
              heading: 'Reheating Leftovers',
              content: [
                '• Only reheat food once',
                '• Make sure it\'s piping hot all the way through',
                '• Stir it halfway through if using a microwave',
                '• If you\'re not sure it\'s hot enough, heat it more',
                '• Don\'t reheat rice more than once (it can cause food poisoning)'
              ]
            },
            {
              heading: 'Defrosting Food',
              content: [
                '• Defrost in the fridge overnight (safest)',
                '• Or use the microwave defrost setting',
                '• Never defrost on the counter at room temperature',
                '• Once defrosted, cook within 24 hours',
                '• Never refreeze raw meat that\'s been defrosted'
              ]
            },
            {
              heading: 'Kitchen Hygiene',
              content: [
                '• Wash your hands before cooking',
                '• Use different chopping boards for raw meat and vegetables',
                '• Wash knives and boards after cutting raw meat',
                '• Wipe surfaces with hot soapy water',
                '• Tea towels and sponges get gross - wash or replace them regularly'
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'cleaning-practices',
    title: 'Cleaning Best Practices',
    description: 'Effective cleaning routines and techniques',
    icon: '🧹',
    lessons: [
      {
        id: 'cleaning-1',
        title: 'Essential Cleaning Products',
        description: 'What you actually need (and what you don\'t)',
        duration: '5 mins',
        content: {
          sections: [
            {
              heading: 'The Basics (Start Here)',
              content: [
                '• Multi-purpose cleaner (for most surfaces)',
                '• Washing up liquid (for dishes and general cleaning)',
                '• Toilet cleaner',
                '• Cloths or sponges',
                '• Bin bags',
                'That\'s it! You don\'t need loads of expensive products.'
              ]
            },
            {
              heading: 'Budget-Friendly Alternatives',
              content: [
                '• White vinegar (great for limescale and windows)',
                '• Bicarbonate of soda (good for scrubbing)',
                '• Washing up liquid + warm water (cleans most things)',
                'These cost pennies and work just as well as fancy cleaners.'
              ]
            },
            {
              heading: 'What You Don\'t Need',
              content: [
                '• Separate cleaners for every room',
                '• Expensive branded products',
                '• Antibacterial everything (regular cleaning is fine)',
                '• Fabric fresheners (open a window instead)',
                'Marketing makes you think you need loads of products. You don\'t.'
              ]
            },
            {
              heading: 'Safety Tips',
              content: [
                '• Never mix bleach with other cleaners (creates toxic fumes)',
                '• Open windows when cleaning',
                '• Keep products away from food',
                '• Read labels if you have sensitive skin',
                '• Store safely if you have pets'
              ]
            }
          ]
        }
      },
      {
        id: 'cleaning-2',
        title: 'Preventing Mould & Damp',
        description: 'How to stop mould before it starts',
        duration: '6 mins',
        content: {
          sections: [
            {
              heading: 'Why Mould Happens',
              content: 'Mould grows in damp, warm places with poor air flow. It loves bathrooms, kitchens, and cold walls. The good news: you can prevent most of it.'
            },
            {
              heading: 'Daily Prevention',
              content: [
                '• Open windows for 10-15 minutes every day (even in winter)',
                '• Open bathroom window or use extractor fan when showering',
                '• Open kitchen window when cooking',
                '• Wipe condensation off windows in the morning',
                '• Don\'t dry clothes on radiators (or open a window if you do)'
              ]
            },
            {
              heading: 'Heating Your Home',
              content: [
                '• Keep heating on low rather than blasting it on and off',
                '• Aim for 18-21°C in rooms you use',
                '• Don\'t block radiators with furniture',
                '• Close doors between rooms to keep heat in',
                'Yes, heating costs money, but treating mould and damp costs more.'
              ]
            },
            {
              heading: 'If You Already Have Mould',
              content: [
                '• Small patches: Wipe with mould spray or diluted bleach',
                '• Wear gloves and open windows',
                '• Don\'t just paint over it - it\'ll come back',
                '• Large patches or mould that keeps coming back: Tell your landlord',
                '• It\'s their responsibility to fix structural damp issues'
              ]
            },
            {
              heading: 'Furniture Placement',
              content: [
                '• Leave a gap between furniture and external walls',
                '• Don\'t push beds or sofas right against cold walls',
                '• This lets air circulate and prevents damp',
                '• Even a 5cm gap helps'
              ]
            }
          ]
        }
      },
      {
        id: 'cleaning-3',
        title: 'Deep Cleaning Made Simple',
        description: 'How to tackle bigger cleaning tasks',
        duration: '8 mins',
        content: {
          sections: [
            {
              heading: 'When to Deep Clean',
              content: [
                'You don\'t need to deep clean every week. Once a month or every few months is fine for most things.',
                'Focus on daily tidying and weekly basics first.',
                'Deep cleaning is for when things get properly dirty or you have time and energy.'
              ]
            },
            {
              heading: 'Kitchen Deep Clean',
              content: [
                '• Inside the oven: Use oven cleaner or baking soda paste',
                '• Inside the fridge: Take everything out, wipe shelves',
                '• Behind appliances: Pull out fridge/cooker and sweep',
                '• Inside cupboards: Wipe down shelves',
                '• Extractor fan: Wipe or wash the filter',
                'Do one task at a time - you don\'t have to do it all in one day.'
              ]
            },
            {
              heading: 'Bathroom Deep Clean',
              content: [
                '• Shower head: Soak in vinegar to remove limescale',
                '• Grout: Scrub with old toothbrush and cleaner',
                '• Drain: Pour down baking soda + vinegar to clear gunk',
                '• Behind toilet: Use toilet brush or cloth on a stick',
                '• Bathroom cabinet: Chuck out old products'
              ]
            },
            {
              heading: 'Bedroom Deep Clean',
              content: [
                '• Wash bedding (including duvet and pillows)',
                '• Vacuum under the bed',
                '• Wipe down skirting boards',
                '• Clean inside wardrobe',
                '• Wash curtains or wipe blinds'
              ]
            },
            {
              heading: 'Making It Easier',
              content: [
                '• Put on music or a podcast',
                '• Set a timer for 20 minutes and see what you can do',
                '• Do one room per week instead of everything at once',
                '• Ask a friend to help (make it social)',
                '• Remember: Done is better than perfect'
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'home-security',
    title: 'Home Security',
    description: 'Keep yourself and your home safe',
    icon: '🔒',
    lessons: [
      {
        id: 'security-1',
        title: 'Basic Home Security',
        description: 'Simple steps to keep your home secure',
        duration: '6 mins',
        content: {
          sections: [
            {
              heading: 'Lock Everything',
              content: [
                '• Lock your door every time you leave (even for 5 minutes)',
                '• Lock windows when you go out',
                '• Lock windows at night, especially ground floor',
                '• Don\'t leave keys in the door',
                '• Don\'t hide spare keys under doormats or plant pots (burglars know this trick)'
              ]
            },
            {
              heading: 'When You\'re Home',
              content: [
                '• Keep your door locked even when you\'re in',
                '• Use a door chain if you have one',
                '• Don\'t open the door to strangers',
                '• If someone claims to be from a company, ask for ID',
                '• You can always say "come back later" and call the company to check'
              ]
            },
            {
              heading: 'Make It Look Like You\'re Home',
              content: [
                '• Leave a light on when you go out at night',
                '• Use a timer plug for lamps (cheap from hardware stores)',
                '• Don\'t announce on social media that you\'re away',
                '• Ask a neighbor to collect post if you\'re away for a while',
                '• Cancel milk deliveries if you\'re going away'
              ]
            },
            {
              heading: 'What to Do If You Lose Your Keys',
              content: [
                '• Tell your landlord immediately',
                '• They should change the locks',
                '• Don\'t just get a spare cut - someone might have your keys',
                '• This is a safety issue, not just an inconvenience'
              ]
            }
          ]
        }
      },
      {
        id: 'security-2',
        title: 'Scams & Doorstep Safety',
        description: 'How to spot and avoid common scams',
        duration: '7 mins',
        content: {
          sections: [
            {
              heading: 'Common Doorstep Scams',
              content: [
                '• Fake utility workers (gas, electric, water)',
                '• Fake charity collectors',
                '• "We\'re working in the area" traders',
                '• People claiming you owe money',
                '• Anyone pressuring you to decide immediately'
              ]
            },
            {
              heading: 'How to Protect Yourself',
              content: [
                '• You don\'t have to open the door',
                '• Ask for ID through the door or window',
                '• Real companies won\'t mind you checking',
                '• Call the company using a number you find yourself (not one they give you)',
                '• Never let strangers into your home',
                '• Never give bank details at the door'
              ]
            },
            {
              heading: 'Phone & Online Scams',
              content: [
                '• Banks will NEVER ask for your full PIN or password',
                '• Don\'t click links in texts claiming to be from your bank',
                '• If someone calls saying you owe money, hang up and call back on the official number',
                '• "You\'ve won a prize" = scam',
                '• If it sounds too good to be true, it is'
              ]
            },
            {
              heading: 'If You Think You\'ve Been Scammed',
              content: [
                '• Don\'t be embarrassed - scammers are professionals',
                '• Call your bank immediately if you gave card details',
                '• Report it to Action Fraud (0300 123 2040)',
                '• Tell your landlord if someone came to your door',
                '• Warn neighbors so they don\'t fall for it too'
              ]
            },
            {
              heading: 'Trust Your Gut',
              content: 'If something feels wrong, it probably is. It\'s always okay to say no, close the door, or hang up the phone. You don\'t owe strangers anything.'
            }
          ]
        }
      },
      {
        id: 'security-3',
        title: 'Fire & Carbon Monoxide Safety',
        description: 'Essential safety checks for your home',
        duration: '5 mins',
        content: {
          sections: [
            {
              heading: 'Smoke Alarms',
              content: [
                '• Your landlord must provide working smoke alarms',
                '• Test them monthly (press the button)',
                '• If the battery is low, it will beep - tell your landlord',
                '• Never remove the battery because it\'s annoying',
                '• You should have one on each floor'
              ]
            },
            {
              heading: 'Carbon Monoxide Alarms',
              content: [
                '• You need one if you have gas heating or a gas cooker',
                '• Carbon monoxide is invisible and deadly',
                '• Symptoms: headache, dizziness, feeling sick, tiredness',
                '• If the alarm goes off: Get out, call 999, don\'t go back in',
                '• Your landlord should provide one - ask if you don\'t have one'
              ]
            },
            {
              heading: 'Fire Prevention',
              content: [
                '• Don\'t leave cooking unattended',
                '• Don\'t overload plug sockets',
                '• Unplug things you\'re not using (especially heaters)',
                '• Don\'t charge phones under pillows or on beds',
                '• Keep a fire blanket or extinguisher in the kitchen (optional but good)',
                '• Know where your exits are'
              ]
            },
            {
              heading: 'If There\'s a Fire',
              content: [
                '• Get out immediately',
                '• Don\'t stop to get belongings',
                '• Close doors behind you if safe to do so',
                '• Call 999 once you\'re outside',
                '• Don\'t go back in for any reason',
                'Your life is more important than any possession.'
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'energy-saving',
    title: 'Energy & Money Saving',
    description: 'Reduce your bills without freezing',
    icon: '💡',
    lessons: [
      {
        id: 'energy-1',
        title: 'Understanding Your Energy Bills',
        description: 'What you\'re actually paying for',
        duration: '6 mins',
        content: {
          sections: [
            {
              heading: 'How Energy Bills Work',
              content: [
                'You pay for two things:',
                '1. Standing charge - a daily fee just for being connected (usually 40-60p per day)',
                '2. Unit rate - the cost per kWh (kilowatt hour) of energy you use',
                'You can\'t avoid the standing charge, but you can reduce how much energy you use.'
              ]
            },
            {
              heading: 'Prepayment vs Direct Debit',
              content: [
                'Prepayment meters: You pay before you use energy (usually more expensive)',
                'Direct debit: You pay monthly based on estimated usage (usually cheaper)',
                'If you\'re on prepayment and struggling, ask your supplier about switching to direct debit or getting support.'
              ]
            },
            {
              heading: 'What Uses the Most Energy',
              content: [
                '1. Heating (60% of your bill)',
                '2. Hot water (15%)',
                '3. Appliances like washing machine, tumble dryer, oven (15%)',
                '4. Lighting and gadgets (10%)',
                'Focus on heating and hot water to make the biggest difference.'
              ]
            },
            {
              heading: 'Reading Your Meter',
              content: [
                '• Take a photo of your meter reading every month',
                '• Submit it to your energy company online or by phone',
                '• This stops them estimating (which can be wrong)',
                '• If you\'re on prepayment, check your balance regularly'
              ]
            }
          ]
        }
      },
      {
        id: 'energy-2',
        title: 'Easy Ways to Save Energy',
        description: 'Small changes that make a difference',
        duration: '7 mins',
        content: {
          sections: [
            {
              heading: 'Heating Tips',
              content: [
                '• Turn thermostat down by 1°C (saves about £80/year)',
                '• Heat the rooms you use, not the whole house',
                '• Close doors to keep heat in',
                '• Close curtains at night to keep heat in',
                '• Don\'t block radiators with furniture',
                '• Bleed radiators if they\'re cold at the top'
              ]
            },
            {
              heading: 'Hot Water',
              content: [
                '• Take shorter showers (4 minutes instead of 8)',
                '• Don\'t leave taps running',
                '• Only boil the water you need in the kettle',
                '• Wash clothes at 30°C instead of 40°C',
                '• Only run washing machine when it\'s full'
              ]
            },
            {
              heading: 'Appliances',
              content: [
                '• Turn things off at the plug (standby mode still uses power)',
                '• Don\'t leave phone chargers plugged in',
                '• Use a microwave instead of the oven when possible',
                '• Don\'t use a tumble dryer - hang clothes to dry',
                '• Keep fridge and freezer full (they work more efficiently)'
              ]
            },
            {
              heading: 'Lighting',
              content: [
                '• Switch to LED bulbs (they use 90% less energy)',
                '• Turn lights off when you leave a room',
                '• Use lamps instead of main lights',
                '• Open curtains during the day for natural light'
              ]
            },
            {
              heading: 'Free Insulation',
              content: [
                '• You might be eligible for free insulation',
                '• Check gov.uk/energy-grants-calculator',
                '• Your landlord should insulate the property',
                '• Draught excluders for doors and windows help (cheap from hardware stores)'
              ]
            }
          ]
        }
      },
      {
        id: 'energy-3',
        title: 'Help with Energy Bills',
        description: 'Support available if you\'re struggling',
        duration: '5 mins',
        content: {
          sections: [
            {
              heading: 'If You Can\'t Pay Your Bill',
              content: [
                '• Contact your energy supplier immediately',
                '• They MUST help you - it\'s the law',
                '• They can set up a payment plan',
                '• They can\'t cut you off without warning',
                '• Don\'t ignore bills - they won\'t go away'
              ]
            },
            {
              heading: 'Grants & Support',
              content: [
                '• Warm Home Discount: £150 off winter bills (if you get certain benefits)',
                '• Winter Fuel Payment: £200-300 for pensioners',
                '• Cold Weather Payment: £25 for each week of very cold weather',
                '• Energy company grants: Most suppliers have hardship funds',
                'Check Turn2Us benefits calculator to see what you\'re entitled to.'
              ]
            },
            {
              heading: 'Priority Services Register',
              content: [
                '• Free service from energy companies',
                '• Extra support if you\'re vulnerable',
                '• Advance notice of power cuts',
                '• Password protection for meter readers',
                '• Bills in different formats (large print, braille)',
                'Call your supplier to register - it\'s free.'
              ]
            },
            {
              heading: 'Where to Get Advice',
              content: [
                '• Citizens Advice: Free, confidential advice',
                '• StepChange: Free debt advice',
                '• National Debtline: 0808 808 4000',
                '• Your local council: May have emergency funds',
                'Don\'t struggle alone - help is available.'
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'basic-maintenance',
    title: 'Basic Home Maintenance',
    description: 'Simple fixes you can do yourself',
    icon: '🔧',
    lessons: [
      {
        id: 'maintenance-1',
        title: 'Quick Fixes Anyone Can Do',
        description: 'No tools or skills needed',
        duration: '6 mins',
        content: {
          sections: [
            {
              heading: 'Blocked Sink',
              content: [
                '1. Remove any visible gunk from the plughole',
                '2. Pour down boiling water',
                '3. If still blocked: Pour down baking soda, then vinegar, wait 15 mins, then boiling water',
                '4. If still blocked: Use a plunger',
                '5. Still blocked? Call your landlord - it might be a bigger problem'
              ]
            },
            {
              heading: 'Toilet Won\'t Flush Properly',
              content: [
                '• Check the water is turned on (valve behind toilet)',
                '• Lift the cistern lid and check the float isn\'t stuck',
                '• If it\'s overflowing, turn off the water and call your landlord',
                '• If it\'s blocked, use a plunger',
                '• Never flush anything except toilet paper and human waste'
              ]
            },
            {
              heading: 'Lightbulb Replacement',
              content: [
                '1. Turn off the light switch',
                '2. Wait for the bulb to cool down',
                '3. Twist the old bulb anticlockwise to remove',
                '4. Twist the new bulb clockwise',
                '5. Turn on and test',
                'Take the old bulb to the shop to make sure you buy the right type.'
              ]
            },
            {
              heading: 'Radiator Not Heating',
              content: [
                '• Check the heating is on',
                '• Check the radiator valve is open (turn it anticlockwise)',
                '• If the top is cold but bottom is hot, it needs bleeding',
                '• You need a radiator key (£1 from hardware stores)',
                '• Turn off heating, insert key, turn slightly, let air out until water comes, close it',
                'YouTube has good videos showing how to do this.'
              ]
            }
          ]
        }
      },
      {
        id: 'maintenance-2',
        title: 'When to Call Your Landlord',
        description: 'What\'s their responsibility vs yours',
        duration: '5 mins',
        content: {
          sections: [
            {
              heading: 'Landlord Must Fix (Urgent)',
              content: [
                '• No heating or hot water',
                '• Broken boiler',
                '• Major leaks',
                '• No electricity',
                '• Broken toilet (if it\'s your only one)',
                '• Unsafe electrics (sparks, burning smell)',
                '• Broken locks on external doors',
                'These are emergencies - call immediately.'
              ]
            },
            {
              heading: 'Landlord Must Fix (Non-Urgent)',
              content: [
                '• Damp and mould (if not caused by you)',
                '• Broken windows',
                '• Broken oven or hob',
                '• Dripping taps',
                '• Damaged roof',
                '• Pest infestations',
                'Report these in writing (email or text) so you have proof.'
              ]
            },
            {
              heading: 'You Should Fix',
              content: [
                '• Lightbulbs',
                '• Smoke alarm batteries (sometimes - check your tenancy agreement)',
                '• Minor blockages you caused',
                '• Things you broke',
                '• Cleaning (unless it\'s a professional end-of-tenancy clean)'
              ]
            },
            {
              heading: 'How to Report Problems',
              content: [
                '• Email or text (so you have proof)',
                '• Include photos',
                '• Explain the problem clearly',
                '• Say when it started',
                '• Give your landlord reasonable time to fix it',
                '• If they ignore you, contact Shelter or Citizens Advice'
              ]
            }
          ]
        }
      },
      {
        id: 'maintenance-3',
        title: 'Basic Tool Kit',
        description: 'What to have for simple fixes',
        duration: '4 mins',
        content: {
          sections: [
            {
              heading: 'Essential Tools (Under £20 Total)',
              content: [
                '• Screwdriver set (one with multiple heads)',
                '• Hammer',
                '• Plunger',
                '• Torch',
                '• Duct tape',
                '• Scissors',
                'You can get all of these from Poundland or Wilko.'
              ]
            },
            {
              heading: 'Nice to Have',
              content: [
                '• Radiator key',
                '• Adjustable spanner',
                '• Picture hooks',
                '• Measuring tape',
                '• Super glue',
                'Add these gradually - you don\'t need everything at once.'
              ]
            },
            {
              heading: 'Where to Buy Cheap',
              content: [
                '• Poundland',
                '• Wilko',
                '• B&M',
                '• Screwfix (trade prices)',
                '• Facebook Marketplace (second-hand)',
                'Don\'t buy expensive brands - cheap tools work fine for basic tasks.'
              ]
            },
            {
              heading: 'YouTube is Your Friend',
              content: [
                'Before calling someone out:',
                '• Search "how to fix [problem]" on YouTube',
                '• Watch a couple of videos',
                '• See if it\'s something you can do',
                'You\'ll be surprised how many "repairs" are actually really simple.'
              ]
            }
          ]
        }
      }
    ]
  }
];

const Learning = () => {
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();
  const userId = getUserId();

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const data = await getLearningProgress(userId, 'learning');
    setProgress(data);
    setLoading(false);
  };

  const isLessonCompleted = (lessonId: string) => {
    return progress.some(p => p.lesson_id === lessonId && p.completed);
  };

  const getCourseProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    const completedLessons = course.lessons.filter(l => isLessonCompleted(l.id)).length;
    return Math.round((completedLessons / course.lessons.length) * 100);
  };

  const handleLessonComplete = async (lessonId: string) => {
    const isCompleted = isLessonCompleted(lessonId);
    const isFirstLesson = progress.filter(p => p.completed).length === 0;
    
    await updateLearningProgress(userId, 'learning', lessonId, !isCompleted);
    await loadProgress();
    
    if (!isCompleted) {
      toast({
        title: '🎉 Lesson completed!',
        description: 'You\'re building important life skills.',
      });
      
      // Create a completed task for the first lesson
      if (isFirstLesson) {
        await createCompletedTaskForAction(
          userId,
          'Completed your first learning lesson',
          'Started your learning journey',
          'learning'
        );
      }
      
      // Check for badges after completing a lesson
      await checkAndAwardBadges(userId);
    }
  };

  const openLesson = (course: Course, lesson: Lesson) => {
    setSelectedCourse(course);
    setSelectedLesson(lesson);
  };

  const closeLesson = () => {
    setSelectedLesson(null);
    setSelectedCourse(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center py-6">
        <h1 className="text-4xl font-bold mb-2">Learning Centre</h1>
        <p className="text-muted-foreground text-lg">
          Essential skills for independent living
        </p>
      </div>

      <Card className="card-soft bg-accent">
        <CardContent className="pt-6">
          <p className="text-sm">
            <strong>How it works:</strong> Each course has short lessons (5-10 minutes each). 
            Learn at your own pace. No tests, no pressure. Just practical information to help you live independently.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {courses.map((course) => {
          const courseProgress = getCourseProgress(course.id);
          const completedLessons = course.lessons.filter(l => isLessonCompleted(l.id)).length;
          
          return (
            <Card key={course.id} className="card-soft">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">{course.icon}</span>
                    <div>
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription>{course.description}</CardDescription>
                      <div className="mt-2 text-sm text-muted-foreground">
                        {completedLessons} of {course.lessons.length} lessons completed
                      </div>
                    </div>
                  </div>
                  {courseProgress > 0 && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">{courseProgress}%</div>
                      <div className="text-xs text-muted-foreground">Complete</div>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {course.lessons.map((lesson) => {
                    const completed = isLessonCompleted(lesson.id);
                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => openLesson(course, lesson)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {completed ? (
                            <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{lesson.title}</h4>
                            <p className="text-xs text-muted-foreground">{lesson.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedLesson} onOpenChange={(open) => !open && closeLesson()}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedLesson && selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{selectedCourse.title}</span>
                </div>
                <DialogTitle>{selectedLesson.title}</DialogTitle>
                <DialogDescription>{selectedLesson.description}</DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                {selectedLesson.content.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-lg mb-3">{section.heading}</h3>
                    {Array.isArray(section.content) ? (
                      <ul className="space-y-2">
                        {section.content.map((item, i) => (
                          <li key={i} className="text-sm leading-relaxed">{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm leading-relaxed">{section.content}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-4 border-t">
                <Button
                  variant={isLessonCompleted(selectedLesson.id) ? "outline" : "default"}
                  onClick={() => handleLessonComplete(selectedLesson.id)}
                >
                  {isLessonCompleted(selectedLesson.id) ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    'Mark as Complete'
                  )}
                </Button>
                <Button variant="outline" onClick={closeLesson}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Learning;
