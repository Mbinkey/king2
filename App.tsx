import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Inventory } from './pages/Inventory';
import { CarDetail } from './pages/CarDetail';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthContext, getSession, setSession, clearSession } from './lib/auth';
import { db } from './lib/database';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">{children}</main>
      {!isAdmin && <Footer />}
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useContext(AuthContext);
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
}

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(getSession());

  const login = async (u: string, p: string) => {
    const success = await db.auth.login(u, p);
    if (success) {
      setIsAuthenticated(true);
      setSession();
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/car/:id" element={<CarDetail />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

