export interface Recipe {
  id: string;
  name: string;
  prepTime: string;
  cost: string;
  difficulty: 'Easy' | 'Very Easy';
  ingredients: { item: string; amount1: string; amount2: string }[];
  instructions: string[];
  tags: string[];
  searchTerms: string[];
}

export const recipes: Recipe[] = [
  {
    id: 'spaghetti-bolognese',
    name: 'Spaghetti Bolognese',
    prepTime: '30 mins',
    cost: '£4-5',
    difficulty: 'Easy',
    searchTerms: ['spaghetti', 'bolognese', 'spag bol', 'pasta', 'mince', 'meat sauce', 'italian'],
    tags: ['comfort', 'filling'],
    ingredients: [
      { item: 'Spaghetti', amount1: '100g', amount2: '200g' },
      { item: 'Beef mince', amount1: '150g', amount2: '300g' },
      { item: 'Tinned chopped tomatoes', amount1: '1/2 tin', amount2: '1 tin' },
      { item: 'Onion', amount1: '1/2', amount2: '1' },
      { item: 'Garlic cloves', amount1: '1', amount2: '2' },
      { item: 'Mixed herbs', amount1: '1/2 tsp', amount2: '1 tsp' }
    ],
    instructions: [
      'Fry mince until browned',
      'Add chopped onion and garlic',
      'Add tinned tomatoes and herbs',
      'Simmer for 20 minutes',
      'Cook spaghetti according to packet',
      'Serve sauce over spaghetti'
    ]
  },
  {
    id: 'chicken-curry',
    name: 'Simple Chicken Curry',
    prepTime: '35 mins',
    cost: '£4-5',
    difficulty: 'Easy',
    searchTerms: ['curry', 'chicken curry', 'indian', 'rice dish', 'spicy', 'chicken'],
    tags: ['comfort', 'filling'],
    ingredients: [
      { item: 'Chicken breast', amount1: '1', amount2: '2' },
      { item: 'Curry paste or powder', amount1: '2 tbsp', amount2: '4 tbsp' },
      { item: 'Tinned chopped tomatoes', amount1: '1/2 tin', amount2: '1 tin' },
      { item: 'Onion', amount1: '1', amount2: '2' },
      { item: 'Rice', amount1: '100g', amount2: '200g' },
      { item: 'Coconut milk (optional)', amount1: '100ml', amount2: '200ml' }
    ],
    instructions: [
      'Cut chicken into pieces',
      'Fry onion until soft',
      'Add curry paste, fry 1 minute',
      'Add chicken, cook until white',
      'Add tomatoes and coconut milk',
      'Simmer 20 mins, serve with rice'
    ]
  },
  {
    id: 'lasagne',
    name: 'Simple Lasagne',
    prepTime: '60 mins',
    cost: '£5-6',
    difficulty: 'Easy',
    searchTerms: ['lasagne', 'lasagna', 'baked pasta', 'italian', 'oven dish', 'pasta bake'],
    tags: ['comfort', 'filling'],
    ingredients: [
      { item: 'Lasagne sheets', amount1: '6 sheets', amount2: '12 sheets' },
      { item: 'Beef mince', amount1: '200g', amount2: '400g' },
      { item: 'Tinned chopped tomatoes', amount1: '1 tin', amount2: '2 tins' },
      { item: 'Onion', amount1: '1', amount2: '2' },
      { item: 'Grated cheese', amount1: '2 handfuls', amount2: '4 handfuls' },
      { item: 'White sauce (jar)', amount1: '1/2 jar', amount2: '1 jar' }
    ],
    instructions: [
      'Fry mince with onion',
      'Add tomatoes, simmer 15 mins',
      'Layer: meat sauce, pasta, white sauce',
      'Repeat layers',
      'Top with cheese',
      'Bake at 180°C for 35-40 mins'
    ]
  },
  {
    id: 'fish-chips',
    name: 'Fish and Chips',
    prepTime: '40 mins',
    cost: '£4-5',
    difficulty: 'Easy',
    searchTerms: ['fish', 'chips', 'fish and chips', 'british', 'fried fish', 'cod', 'haddock'],
    tags: ['comfort', 'filling'],
    ingredients: [
      { item: 'Fish fillets (cod or haddock)', amount1: '1', amount2: '2' },
      { item: 'Potatoes', amount1: '2 medium', amount2: '4 medium' },
      { item: 'Flour', amount1: '2 tbsp', amount2: '4 tbsp' },
      { item: 'Oil', amount1: '3 tbsp', amount2: '6 tbsp' },
      { item: 'Lemon (optional)', amount1: '1/2', amount2: '1' }
    ],
    instructions: [
      'Cut potatoes into chips',
      'Bake chips at 220°C for 35 mins',
      'Coat fish in flour',
      'Fry fish in oil 3-4 mins each side',
      'Serve together with lemon'
    ]
  },
  {
    id: 'shepherd-pie',
    name: 'Shepherd\'s Pie',
    prepTime: '50 mins',
    cost: '£5-6',
    difficulty: 'Easy',
    searchTerms: ['shepherds pie', 'cottage pie', 'mince', 'potato', 'british', 'comfort', 'pie'],
    tags: ['comfort', 'filling'],
    ingredients: [
      { item: 'Lamb or beef mince', amount1: '200g', amount2: '400g' },
      { item: 'Potatoes', amount1: '3 medium', amount2: '6 medium' },
      { item: 'Onion', amount1: '1', amount2: '2' },
      { item: 'Carrots', amount1: '1', amount2: '2' },
      { item: 'Gravy granules', amount1: '1 tbsp', amount2: '2 tbsp' },
      { item: 'Butter and milk', amount1: 'For mash', amount2: 'For mash' }
    ],
    instructions: [
      'Boil potatoes',
      'Fry mince with onion and carrots',
      'Add gravy, simmer 10 mins',
      'Mash potatoes with butter and milk',
      'Put mince in dish, top with mash',
      'Bake at 180°C for 25 mins'
    ]
  },
  {
    id: 'chili-con-carne',
    name: 'Chili Con Carne',
    prepTime: '40 mins',
    cost: '£4-5',
    difficulty: 'Easy',
    searchTerms: ['chili', 'chilli', 'mince', 'beans', 'spicy', 'mexican', 'rice'],
    tags: ['comfort', 'filling'],
    ingredients: [
      { item: 'Beef mince', amount1: '200g', amount2: '400g' },
      { item: 'Tinned kidney beans', amount1: '1/2 tin', amount2: '1 tin' },
      { item: 'Tinned chopped tomatoes', amount1: '1 tin', amount2: '2 tins' },
      { item: 'Onion', amount1: '1', amount2: '2' },
      { item: 'Chili powder', amount1: '1 tsp', amount2: '2 tsp' },
      { item: 'Rice', amount1: '100g', amount2: '200g' }
    ],
    instructions: [
      'Fry mince with onion',
      'Add chili powder',
      'Add tomatoes and beans',
      'Simmer 30 minutes',
      'Cook rice',
      'Serve chili over rice'
    ]
  },
  {
    id: 'stir-fry',
    name: 'Chicken Stir Fry',
    prepTime: '20 mins',
    cost: '£4-5',
    difficulty: 'Easy',
    searchTerms: ['stir fry', 'chicken', 'chinese', 'asian', 'vegetables', 'wok', 'noodles'],
    tags: ['quick', 'filling'],
    ingredients: [
      { item: 'Chicken breast', amount1: '1', amount2: '2' },
      { item: 'Frozen mixed veg', amount1: '2 handfuls', amount2: '4 handfuls' },
      { item: 'Soy sauce', amount1: '2 tbsp', amount2: '4 tbsp' },
      { item: 'Garlic cloves', amount1: '1', amount2: '2' },
      { item: 'Rice or noodles', amount1: '100g', amount2: '200g' }
    ],
    instructions: [
      'Cut chicken into strips',
      'Cook rice or noodles',
      'Fry chicken until cooked',
      'Add garlic and veg',
      'Stir fry 5 minutes',
      'Add soy sauce, serve with rice'
    ]
  },
  {
    id: 'pizza',
    name: 'Homemade Pizza',
    prepTime: '30 mins',
    cost: '£3-4',
    difficulty: 'Easy',
    searchTerms: ['pizza', 'italian', 'cheese', 'tomato', 'dough', 'flatbread'],
    tags: ['comfort', 'fun'],
    ingredients: [
      { item: 'Pizza base or naan bread', amount1: '1', amount2: '2' },
      { item: 'Tomato puree or pasta sauce', amount1: '3 tbsp', amount2: '6 tbsp' },
      { item: 'Grated cheese', amount1: '3 handfuls', amount2: '6 handfuls' },
      { item: 'Toppings of choice', amount1: 'As desired', amount2: 'As desired' }
    ],
    instructions: [
      'Preheat oven to 220°C',
      'Spread tomato sauce on base',
      'Add cheese and toppings',
      'Bake for 12-15 minutes',
      'Slice and serve'
    ]
  },
  {
    id: 'roast-chicken',
    name: 'Roast Chicken Dinner',
    prepTime: '90 mins',
    cost: '£6-8',
    difficulty: 'Easy',
    searchTerms: ['roast', 'chicken', 'sunday roast', 'dinner', 'british', 'roast dinner'],
    tags: ['special', 'filling'],
    ingredients: [
      { item: 'Whole chicken or chicken pieces', amount1: '500g', amount2: '1kg' },
      { item: 'Potatoes', amount1: '3 medium', amount2: '6 medium' },
      { item: 'Carrots', amount1: '2', amount2: '4' },
      { item: 'Gravy granules', amount1: '1 tbsp', amount2: '2 tbsp' },
      { item: 'Oil', amount1: '2 tbsp', amount2: '4 tbsp' }
    ],
    instructions: [
      'Preheat oven to 200°C',
      'Rub chicken with oil and seasoning',
      'Roast chicken for 60-75 minutes',
      'Parboil potatoes, roast around chicken',
      'Boil carrots',
      'Make gravy, serve together'
    ]
  },
  {
    id: 'burgers',
    name: 'Homemade Burgers',
    prepTime: '25 mins',
    cost: '£4-5',
    difficulty: 'Easy',
    searchTerms: ['burger', 'hamburger', 'beef', 'bun', 'american', 'bbq'],
    tags: ['comfort', 'filling'],
    ingredients: [
      { item: 'Beef mince', amount1: '150g', amount2: '300g' },
      { item: 'Burger buns', amount1: '1', amount2: '2' },
      { item: 'Cheese slices', amount1: '1', amount2: '2' },
      { item: 'Lettuce, tomato (optional)', amount1: 'As desired', amount2: 'As desired' },
      { item: 'Ketchup or mayo', amount1: '1 tbsp', amount2: '2 tbsp' }
    ],
    instructions: [
      'Shape mince into burger patties',
      'Season with salt and pepper',
      'Fry or grill 4-5 mins each side',
      'Add cheese to melt',
      'Toast buns',
      'Assemble with toppings'
    ]
  },
  {
    id: 'fajitas',
    name: 'Chicken Fajitas',
    prepTime: '25 mins',
    cost: '£4-5',
    difficulty: 'Easy',
    searchTerms: ['fajitas', 'mexican', 'chicken', 'wraps', 'tortilla', 'peppers'],
    tags: ['quick', 'fun'],
    ingredients: [
      { item: 'Chicken breast', amount1: '1', amount2: '2' },
      { item: 'Tortilla wraps', amount1: '2', amount2: '4' },
      { item: 'Bell peppers', amount1: '1', amount2: '2' },
      { item: 'Onion', amount1: '1', amount2: '2' },
      { item: 'Fajita seasoning', amount1: '1 tbsp', amount2: '2 tbsp' },
      { item: 'Sour cream (optional)', amount1: '2 tbsp', amount2: '4 tbsp' }
    ],
    instructions: [
      'Slice chicken into strips',
      'Slice peppers and onion',
      'Fry chicken with seasoning',
      'Add peppers and onion',
      'Cook until tender',
      'Serve in warm tortillas'
    ]
  },
  {
    id: 'tacos',
    name: 'Beef Tacos',
    prepTime: '20 mins',
    cost: '£4-5',
    difficulty: 'Easy',
    searchTerms: ['tacos', 'mexican', 'beef', 'mince', 'shells', 'wraps'],
    tags: ['quick', 'fun'],
    ingredients: [
      { item: 'Beef mince', amount1: '150g', amount2: '300g' },
      { item: 'Taco shells or wraps', amount1: '3', amount2: '6' },
      { item: 'Taco seasoning', amount1: '1 tbsp', amount2: '2 tbsp' },
      { item: 'Lettuce, tomato, cheese', amount1: 'As desired', amount2: 'As desired' },
      { item: 'Salsa or sour cream', amount1: '2 tbsp', amount2: '4 tbsp' }
    ],
    instructions: [
      'Fry mince until browned',
      'Add taco seasoning and water',
      'Simmer 5 minutes',
      'Warm taco shells',
      'Fill with mince',
      'Add toppings'
    ]
  }
];
