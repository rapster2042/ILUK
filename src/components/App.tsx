import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/common/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import { PWAUpdatePrompt } from './components/common/PWAUpdatePrompt';
import { PWAInstallPrompt } from './components/common/PWAInstallPrompt';
import routes from './routes';

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      <PWAUpdatePrompt />
      <PWAInstallPrompt />
    </Router>
  );
};

export default App;
