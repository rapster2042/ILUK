import Home from './components/pages/Home';
import Budgeting from './components/pages/Budgeting';
import Bills from './components/pages/Bills';
import Housing from './components/pages/Housing';
import Benefits from './components/pages/Benefits';
import Housework from './components/pages/Housework';
import Shopping from './components/pages/Shopping';
import MealPlans from './components/pages/MealPlans';
import Learning from './components/pages/Learning';
import Progress from './components/pages/Progress';
import Settings from './components/pages/Settings';
import Support from './components/pages/Support';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />
  },
  {
    name: 'Budgeting',
    path: '/budgeting',
    element: <Budgeting />
  },
  {
    name: 'Bills & Payments',
    path: '/bills',
    element: <Bills />
  },
  {
    name: 'Rent & Housing',
    path: '/housing',
    element: <Housing />
  },
  {
    name: 'Benefits',
    path: '/benefits',
    element: <Benefits />
  },
  {
    name: 'Housework',
    path: '/housework',
    element: <Housework />
  },
  {
    name: 'Shopping & Food',
    path: '/shopping',
    element: <Shopping />
  },
  {
    name: 'Meal Plans',
    path: '/meal-plans',
    element: <MealPlans />
  },
  {
    name: 'Learning',
    path: '/learning',
    element: <Learning />
  },
  {
    name: 'Progress',
    path: '/progress',
    element: <Progress />
  },
  {
    name: 'Support',
    path: '/support',
    element: <Support />,
    visible: false
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <Settings />,
    visible: false
  }
];

export default routes;
