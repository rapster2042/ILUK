# Requirements Document

## 1. Application Overview

### 1.1 Application Name
Independent Life UK

### 1.2 Application Description
A mobile-first web application designed to teach vital independent-living skills to 18-25 year olds in the UK with mental health challenges or neurodivergent conditions (ADHD, autism, anxiety, depression). The app provides step-by-step guidance on budgeting, bill payments, shopping, housework, rent management, council tax, and benefits claims in a simple, non-judgmental, and accessible way.

### 1.3 Target Users
Young adults aged 18-25 in the UK with mental health challenges or neurodivergent conditions requiring support for independent living.

## 2. Core Design Principles

- Break everything into micro-steps
- Use plain English only (no jargon)
- Provide optional voice narration for all content
- Use visual checklists instead of long text
- No punishment or streak pressure
- Gentle encouragement without productivity guilt
- Crisis-aware but not alarmist
- Low cognitive load and visually calm interface

## 3. Core Features

### 3.1 Life Skills Dashboard
- Display main page with quick access cards to all core modules:
  - **Budgeting Module** (icon: piggy bank or wallet)
  - **Bills & Payments** (icon: document with pound sign)
  - **Rent, Housing & Council Tax** (icon: house)
  - **Benefits & Financial Help** (icon: helping hand or support symbol)
  - **Housework & Maintenance** (icon: broom or cleaning spray)
  - **Shopping & Food Survival** (icon: shopping basket)
  - **Meal Plans** (icon: plate with fork and knife)
  - **Learning Centre** (icon: book or graduation cap)
  - **Progress Tracking** (icon: chart or trophy)
  - **Reminders System** (icon: bell or clock)
  - **Mental Health Safety & Support** (icon: heart or lifebuoy)
- All cards use consistent styling:
  - Rounded corners with soft shadows
  - Card background in calming colors (soft blues, greens, warm neutrals)
  - Large, clear icons centered at top of each card
  - Module name in bold, readable text below icon
  - Brief one-line description in smaller text
  - Minimum touch target size of 44x44px
  - Gentle hover/tap state with subtle color change
  - Grid layout with generous spacing between cards
- Display 'Today's Small Wins' section with 3 optional daily tasks that users can check off
- **Small Wins Task Database**:
  - Database contains 1000 unique small win tasks covering all life skill areas
  - Tasks rotate on a 24-hour cycle, ensuring users see different tasks each day
  - Rotation resets at midnight UK time
  - Task categories include:
    - Financial tasks (e.g., 'Check your bank balance', 'Review one bill due date', 'Set aside £2 for savings')
    - Housework tasks (e.g., 'Wash 5 items of clothing', 'Wipe down kitchen counter', 'Take out one bag of rubbish', 'Make your bed')
    - Food tasks (e.g., 'Plan tomorrow's breakfast', 'Check fridge for expired items', 'Drink a glass of water')
    - Learning tasks (e.g., 'Watch a 2-minute budgeting tip video', 'Read one lesson in Learning Centre', 'Complete one quiz question')
    - Self-care tasks (e.g., 'Open a window for fresh air', 'Stretch for 1 minute', 'Write down one thing you did today')
    - Admin tasks (e.g., 'Open one piece of post', 'Reply to one message', 'Check one appointment')
  - System randomly selects 3 tasks from the database each day, weighted to ensure variety across categories
  - Users never see the same combination of 3 tasks within a 30-day period
  - Tasks are presented as checkboxes with no pressure to complete all items
- Include optional mood check-in for mood-aware task suggestions
- Tasks are presented as checkboxes with no pressure to complete all items

### 3.2 Budgeting Module
- 'Money Buckets' system with categories: Rent, Food, Bills, Fun
- Visual sliders for budget allocation
- Weekly spending view (default, not monthly)
- 'Am I okay?' button for simple financial feedback
- Explain concepts using diagrams and real UK examples
- **'Understanding Budgeting' link** on Money Buckets page that opens a budgeting guide dialog containing:
  - Clear, neurodivergent-friendly advice on budgeting basics
  - Visual explanations of income vs expenses
  - Step-by-step guide on how to use the Money Buckets system
  - Common budgeting mistakes and how to avoid them (in supportive, non-judgmental language)
  - Real-life UK examples with typical costs
  - 'Explain it another way' option for alternative explanations
  - Optional voice narration
  - Printable summary option

### 3.3 Bills & Payments (UK-Specific)
- Educational content covering:
  - Gas & electric
  - Water
  - Internet
  - Council Tax
  - TV Licence
- For each bill type, explain: what it is, who pays it, when it's due, consequences of non-payment (gentle tone)
- Built-in UK support contacts:
  - Citizens Advice
  - Local council lookup
  - StepChange
  - National Debtline

### 3.4 Rent, Housing & Council Tax
- Interactive lessons on:
  - Reading tenancy agreements (with highlighted sections)
  - Understanding deposits
  - Landlord rights and responsibilities
  - Council Tax discounts (student, single person)
- Simple flowcharts: 'Do I need to pay council tax?' with yes/no branches

### 3.5 Benefits & Financial Help (UK)
- Educational modules for:
  - Universal Credit
  - PIP (overview)
  - Housing Benefit (legacy information)
  - Council Tax Reduction
- 'Do I need this?' quiz with yes/no questions
- Claim preparation checklists
- Honest explanation of waiting times
- Direct links to official gov.uk pages

### 3.6 Housework & Maintenance
- '5-minute clean' mode for low energy days
- Room-by-room visual guides
- No deep clean pressure
- Practical guides:
  - 'Kitchen reset in 7 minutes'
  - 'What to do when mould appears'
  - 'Who fixes what: tenant vs landlord'

### 3.7 Shopping & Food Survival
- Meal planning for low motivation
- Budget supermarket swaps
- Reading expiry dates guide
- Freezer basics
- '3 meals, 5 ingredients' plans
- ADHD-friendly shopping lists
- UK supermarket examples

### 3.8 Meal Plans Section
- User-driven meal library where users can add any meal they want to cook
- **Recipe Search & Import Feature**:
  - Search bar for finding meals by name or ingredient
  - When user searches for a meal, system queries recipe API or performs web search to find matching recipes online
  - Display search results with preview images, prep time, and difficulty level
  - User can select a recipe to automatically import into their meal library
  - Imported recipe includes: meal name, description, step-by-step instructions, ingredient list, preparation time, difficulty level
  - **AI Recipe Generation Fallback**:
    - If no recipe is found via API or web search, system uses Cookery Aware AI to generate a recipe based on the user's search query
    - Display clear warning banner before showing AI-generated recipe: 'This recipe was created by AI. Please verify cooking instructions, temperatures, and timings before use. If you have allergies or dietary restrictions, double-check all ingredients.'
    - Warning uses gentle, supportive tone without creating alarm
    - AI-generated recipes are clearly marked with an 'AI Generated' badge in the meal library
    - User can choose to accept or decline the AI-generated recipe
    - If accepted, recipe is added to meal library with persistent AI badge
  - Shopping list automatically updates with ingredients from imported recipe
  - User can edit imported recipe details after adding to library
- For each meal added (manually or via search), users can:
  - Input meal name and basic description
  - Request or input recipe with step-by-step instructions
  - Generate corresponding shopping list automatically
  - Add preparation time and difficulty level
  - Tag dietary preferences or restrictions
- Pre-loaded starter collection of easy-to-prepare recipes designed for low energy and minimal cooking skills
- Each recipe includes:
  - Preparation time (maximum 20 minutes for starter recipes)
  - Step-by-step instructions with visual aids
  - Ingredient list with UK supermarket examples
  - Corresponding shopping list
  - Difficulty level indicator (Easy/Very Easy)
- 'Shared Ingredients' feature:
  - Recipes are tagged to show which meals use the same core ingredients
  - Visual indicator showing 'Make 3 meals with these 8 ingredients'
  - Suggested recipe combinations to minimize shopping trips and reduce food waste
- Recipe categories:
  - One-pot meals
  - No-cook options
  - Microwave-friendly
  - Batch cooking for freezing
  - User-created custom categories
- Shopping list generator:
  - Automatically creates combined shopping list when multiple recipes are selected
  - Groups items by supermarket section
  - Shows estimated total cost using budget supermarket prices
  - Printable and shareable format
- 'Recipe of the Week' suggestion based on seasonal ingredients and budget
- Substitution suggestions for common allergens or dietary preferences
- Search and filter functionality to find meals by ingredient, prep time, or difficulty

### 3.9 Learning Centre
- Comprehensive library of mini-courses covering essential independent living skills
- Course categories:
  - **Food Safety**: Safe food storage, understanding use-by vs best-before dates, preventing food poisoning, kitchen hygiene basics, defrosting safely
  - **Cleaning Best Practices**: Daily cleaning routines, deep cleaning schedules, choosing cleaning products, eco-friendly alternatives, dealing with stubborn stains, bathroom hygiene, preventing mould
  - **Home Security**: Locking doors and windows, what to do if you lose your keys, recognizing scams (doorstep, phone, online), fire safety basics, carbon monoxide awareness, who to let into your home
  - **Laundry Skills**: Reading clothing labels, sorting clothes, washing machine basics, hand washing, drying methods, ironing essentials, stain removal
  - **Basic Home Repairs**: Changing light bulbs, unblocking sinks, resetting fuse boxes, bleeding radiators, when to call a professional
  - **Energy Saving**: Reducing heating costs, understanding meters, switching suppliers, insulation basics, energy-efficient habits
  - **Personal Safety**: Staying safe online, protecting personal information, recognizing financial scams, emergency contacts, what to do in a gas leak
  - **Waste Management**: Recycling rules in the UK, bin collection schedules, disposing of hazardous waste, reducing household waste
  - **Neighbor Relations**: Dealing with noise complaints, understanding shared spaces, resolving disputes calmly, building community
  - **Health at Home**: First aid basics, building a medicine cabinet, when to see a GP vs A&E, managing prescriptions, mental health self-care
- Each mini-course includes:
  - 5-10 minute bite-sized lessons
  - Step-by-step visual guides with illustrations or photos
  - Simple quizzes to check understanding (no pressure, can retake)
  - Downloadable checklists and quick reference cards
  - Real UK examples and scenarios
  - Optional voice narration
  - 'Explain it another way' option for alternative explanations
- **Learning Progress Tracking**:
  - Visual progress bar for each course showing percentage completed
  - 'Courses Started' and 'Courses Completed' counters
  - Skill badges earned upon course completion (e.g., 'Food Safety Champion', 'Cleaning Confident', 'Security Savvy')
  - Learning history showing all completed lessons with dates
  - 'Continue Learning' section on dashboard showing in-progress courses
  - Optional learning reminders ('You're halfway through Food Safety - want to finish it today?')
  - Certificate of completion for each course (printable, shareable)
  - Overall learning level indicator (Beginner/Developing/Confident/Independent)
- Course recommendations based on:
  - User's current skill gaps
  - Seasonal relevance (e.g., energy saving in winter)
  - Commonly accessed topics
- 'Ask a Question' feature for each course topic linking to relevant support resources
- Bookmark favorite lessons for quick access
- Share completed courses with support workers or family (optional)

### 3.10 Mental Health Safety & Support
- Always-visible Crisis Mode Button with contacts:
  - NHS 111
  - Samaritans
  - Shout (text service)
  - Local NHS crisis teams (location-based)
- Supportive tone: 'You're not in trouble. Help is available.'

### 3.11 Progress Tracking
- Visualize learning journey with completed tasks and skill milestones
- **Learning Section**:
  - Display all mini-courses from Learning Centre with progress indicators
  - Show completed courses with earned badges and certificates
  - Track total learning time and lessons completed
  - Visual learning path showing skill development across all course categories
  - 'Skills Mastered' section highlighting completed course areas
  - Learning streak tracker (optional, can be disabled)
  - Suggested next courses based on progress
- 'Skills learned' system instead of points
- Non-competitive badges:
  - 'Paid my first bill'
  - 'Asked for help'
  - 'Cooked my first meal'
  - Course completion badges (e.g., 'Food Safety Champion', 'Cleaning Confident')
- No leaderboards or streak loss

### 3.12 Reminders System
- Built-in reminders for:
  - Bill payment dates
  - Household maintenance schedules
  - Important tasks
  - Learning course continuations (optional)
- Soft, gentle language for notifications
- Optional (user can enable/disable)

### 3.13 Interactive Learning Elements
- Simple quizzes for each life skill area
- Step-by-step guides
- 'Explain it another way' button for alternative explanations
- Save progress mid-lesson
- No time limits on activities

## 4. Accessibility Features

- Adjustable text size
- High/low contrast toggle
- Reduced motion mode
- Optional voice narration for all content
- WCAG 2.2 AA compliant
- Mobile-first responsive design
- PWA installable on all platforms
- Optional anonymous mode
- Offline mode support with maximum content availability
- Printable checklists

## 5. Technical Requirements

### 5.1 Tech Stack
- Frontend: React / Next.js
- Backend: Node.js + Express
- Database: PostgreSQL
- Authentication: Email + optional anonymous mode
- UK locale default
- Recipe API integration (e.g., Spoonacular, Edamam, or similar recipe database API)
- Web scraping capability as fallback for recipe search
- Cookery Aware AI integration for recipe generation when search yields no results
- Learning progress tracking system with course completion data storage
- **Small Wins Task Management System**:
  - Database table storing 1000 unique small win tasks with fields: task_id, task_text, category, difficulty_level, created_date
  - Daily task rotation algorithm that selects 3 tasks at midnight UK time
  - Task selection logic ensures category diversity and prevents repetition within 30-day window
  - Cron job or scheduled task to trigger daily rotation at 00:00 UK time
  - User-specific task completion tracking (optional, does not affect rotation)
  - Admin interface for adding, editing, or removing tasks from the database

### 5.2 PWA Configuration for Cross-Platform Installation
- **App Icons**:
  - All app icons, including all sizes and formats, must be generated exclusively from the provided source image
  - Source image file name: launchericon-512x512.png
  - Source image link: https://miaoda-conversation-file.s3cdn.medo.dev/user-7qva2z1n4i68/conv-8a0fiym6u1a8/20260327/file-aj7b6wdnoveo.png
  - All generated icon files must be served directly from the application's own origin (same domain as the app) to ensure they are publicly accessible without cross-origin restrictions
  - Icon files must not be served from any external CDN, S3 bucket, or third-party storage that may apply access controls, authentication, or firewall rules that block external crawlers or validators such as PWABuilder
  - All icon src paths in the manifest must use relative paths (e.g., /icons/icon-192x192.png) pointing to files hosted within the application itself
  - Generate the following icon sizes from this source image:
    - 48x48px PNG
    - 72x72px PNG
    - 96x96px PNG
    - 128x128px PNG
    - 144x144px PNG
    - 152x152px PNG (Apple touch icon)
    - 180x180px PNG (Apple touch icon, primary)
    - 192x192px PNG (standard PWA icon)
    - 256x256px PNG
    - 384x384px PNG
    - 512x512px PNG (standard PWA icon)
    - 512x512px maskable PNG (Android adaptive icon)
  - Do not generate or include any .ico file
  - Do not include any screenshots in the manifest
  - Remove all previously defined icons and screenshots from the manifest
- **Manifest Configuration**:
  - App name: 'Independent Life UK'
  - Short name: 'IndependentLife'
  - Start URL: https://app-8a0fiym6u1a9.appmedo.com
  - Scope: https://app-8a0fiym6u1a9.appmedo.com/
  - Display mode: 'standalone' (borderless webview)
  - Orientation: 'portrait-primary' with support for landscape
  - Theme color and background color matching app design (soft blues/greens)
  - Icons array in manifest must include all generated sizes listed above, each entry specifying:
    - src: relative path to the generated icon file hosted within the application (e.g., /icons/icon-192x192.png)
    - sizes: corresponding pixel dimensions (e.g., '192x192')
    - type: 'image/png'
    - purpose: 'any' for standard icons; 'maskable' for the maskable 512x512 variant
  - All icon links in the HTML must be updated to reference the newly generated icon files using relative paths
  - Apple touch icon link tags in HTML must reference the 180x180px generated icon using a relative path
  - No screenshots field in the manifest
  - Categories: ['lifestyle', 'education', 'health']
- **Service Worker Implementation**:
  - **Caching Strategy**:
    - Cache-first strategy for all static assets (HTML, CSS, JS, images, fonts, icons)
    - Network-first strategy for dynamic/API content with graceful offline fallback
    - Stale-while-revalidate strategy for semi-static content (Learning Centre articles, guides)
  - **Offline Copy of App**:
    - On first visit (or after install), the service worker pre-caches the complete application shell including all HTML, CSS, JS bundles, fonts, and core icons
    - All Learning Centre course content, budgeting tools, housework guides, bill payment guides, and checklists are pre-cached in full during the install event
    - User's saved meal plans, recipes, and shopping lists are cached on creation/update and remain fully accessible offline
    - Crisis contact information (NHS 111, Samaritans, Shout, local NHS crisis teams) is always cached and available offline without any network dependency
    - User progress data (badges, completed lessons, task completions) is stored locally via IndexedDB and synced to the server when connectivity is restored
    - Background sync queues any data writes (e.g., task completions, progress updates) made while offline and replays them automatically when the network is available
  - **Backup Offline Page**:
    - A dedicated offline fallback page (offline.html) is pre-cached during service worker installation
    - The offline page is served automatically when the user navigates to any uncached route while offline
    - Offline page content includes:
      - Clear, friendly message: 'You're offline right now. Don't worry - most of the app still works!'
      - List of features available offline (Learning Centre, Budgeting tools, Meal Plans, Crisis contacts, Checklists)
      - Quick-access buttons linking directly to the cached sections of the app
      - Crisis contact information displayed prominently on the offline page itself (NHS 111, Samaritans, Shout) so help is always reachable
      - Soft, calming visual design consistent with the main app (muted blues/greens, rounded corners)
      - Auto-reload prompt when connectivity is detected: 'You're back online - tap to continue'
    - Offline page is fully self-contained with no external dependencies (no CDN calls, no external fonts)
  - **Service Worker Lifecycle**:
    - Service worker registers on first app load
    - On activation, old caches from previous versions are cleared automatically
    - New service worker versions wait until all tabs are closed before activating, or user can accept an in-app prompt to update immediately
    - Non-intrusive update notification banner: 'A new version is available - tap to update'
  - Push notification support for reminders (optional, user-controlled)
- **Offline Content Strategy**:
  - All Learning Centre courses cached for offline access
  - Budgeting tools and calculators fully functional offline
  - User's saved meal plans, recipes, and shopping lists available offline
  - Bill payment guides and checklists cached
  - Crisis contact information always available offline
  - User progress data stored locally with sync when online
  - Educational content and visual guides pre-cached on first visit
  - Offline indicator banner displayed at top of screen with clear messaging when network is unavailable
- **Platform-Specific Optimizations**:
  - iOS: Add to Home Screen prompt with custom instructions
  - Android: WebAPK generation for native-like installation
  - Desktop: Install prompt for Chrome, Edge, and other supporting browsers
  - Splash screens for all platforms matching app branding
- **Installation Prompts**:
  - Smart install banner appearing after user engagement (not on first visit)
  - Dismissible with option to show again later
  - Clear benefits messaging: 'Install for offline access and faster loading'
- **Update Strategy**:
  - Automatic service worker updates with user notification
  - Non-intrusive update prompts
  - Seamless background updates without disrupting user experience

### 5.3 Additional Features
- Optional 'Support worker' read-only access
- Clear data privacy explanations in plain English
- No data sold policy

## 6. Design Style

- **Color Scheme**: Soft, calming colors with muted blues and greens as primary tones, paired with warm neutrals (beige, light grey) to create a non-threatening, supportive atmosphere
- **Visual Details**: Rounded corners throughout for a friendly feel, subtle shadows for depth without harshness, clear borders to define sections, simple line-based icons, minimal animations with reduced motion option
- **Layout**: Card-based layout with generous white space to reduce visual overwhelm, clear visual hierarchy with large headings and bite-sized content blocks, single-column mobile layout for easy scrolling
- **Typography**: Large, readable sans-serif font (minimum 16px body text), high contrast text on backgrounds, clear visual separation between sections
- **Interactive Elements**: Large touch targets (minimum 44x44px), clear button states with gentle color changes, progress indicators that celebrate completion without pressure

## 7. Content Tone

- Simple and clear language
- Non-judgmental and supportive
- Practical and actionable
- Crisis-aware but not alarmist
- Encouraging without creating guilt
- UK-specific terminology and examples

## 8. Acceptance Criteria

- All app icons across all required sizes are generated solely from the provided source image (launchericon-512x512.png)
- All generated icon files are hosted and served directly from the application's own origin using relative paths; no icon is fetched from an external CDN, S3 bucket, or third-party URL
- All manifest icon src values use relative paths (e.g., /icons/icon-192x192.png) and resolve correctly within the application's scope
- Icon files return HTTP 200 with correct Content-Type (image/png) when fetched by any external validator or crawler, including PWABuilder, without requiring authentication or whitelisting
- No .ico file is present anywhere in the project
- No screenshots are included in the PWA manifest
- The manifest icons array contains entries for all specified sizes (48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512px) with correct src, sizes, type, and purpose fields
- The maskable 512x512 icon entry has purpose set to 'maskable'
- All HTML link tags for icons reference the newly generated icon files only using relative paths; no legacy, external, or previously defined icon references remain
- Apple touch icon link tag references the 180x180px generated icon via a relative path
- Service worker registers successfully on first app load across Chrome, Safari, Firefox, and Edge
- Complete application shell (HTML, CSS, JS, fonts, icons) is pre-cached during service worker install event
- All Learning Centre courses, budgeting tools, bill guides, housework guides, and checklists are accessible in full with no network connection
- User's saved meal plans, recipes, and shopping lists are retrievable offline
- Crisis contact information (NHS 111, Samaritans, Shout) is displayed and accessible with no network connection
- Navigating to any uncached route while offline serves the backup offline.html fallback page
- Offline fallback page displays quick-access links to all cached app sections
- Offline fallback page displays crisis contacts directly without requiring navigation
- Offline indicator banner appears within 2 seconds of network loss
- Auto-reload prompt appears when network connectivity is restored
- Background sync successfully replays queued data writes (progress, task completions) upon reconnection
- Old caches are cleared automatically when a new service worker version activates
- In-app update notification banner appears when a new service worker version is available
- Offline page is fully self-contained with no external CDN or font dependencies
- PWA installs successfully on iOS (Add to Home Screen), Android (WebAPK), and desktop (Chrome/Edge)
- All offline and PWA functionality meets WCAG 2.2 AA accessibility standards

## 9. Out of Scope for This Release

- Server-side rendering or edge caching beyond the service worker layer
- Peer-to-peer offline data sharing between users
- Offline recipe search or AI recipe generation (requires network; graceful error message shown when offline)
- Real-time collaborative features
- Native mobile app (iOS App Store / Google Play) packaging

## 10. Reference Files

1. Source icon image file name: launchericon-512x512.png
   File link: https://miaoda-conversation-file.s3cdn.medo.dev/user-7qva2z1n4i68/conv-8a0fiym6u1a8/20260327/file-aj7b6wdnoveo.png
   Usage: Master source image for generating all PWA and app store icons across all required sizes and formats