import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';
import useAuth from './hooks/useAuth';
import './assets/styles/global.css';

// Subcomponent to manage layout structure based on authentication state
const MainLayout = () => {
  const { authenticated, loading } = useAuth();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0b0f19' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: '1', position: 'relative' }}>
        {authenticated && !loading && <Sidebar />}
        
        <main style={{
          flex: '1',
          padding: '32px 24px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          minWidth: '0'
        }}>
          <AppRoutes />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="bg-glow glow-top-right"></div>
        <div className="bg-glow glow-bottom-left"></div>
        <MainLayout />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
