import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CareersPage from './pages/CareersPage';
import NotFound from './pages/NotFound';
import useAuthStore from './store/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
            />
            <Route 
              path="/register" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
            />
            
            {/* Public Careers Page */}
            <Route path="/:slug/careers" element={<CareersPage />} />

            {/* Protected Routes */}
            <Route 
              path="/:slug/edit" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />

            {/* Home redirect */}
            <Route 
              path="/" 
              element={
                isAuthenticated 
                  ? <Navigate to={`/${useAuthStore.getState().user?.companySlug}/edit`} replace />
                  : <Navigate to="/login" replace />
              } 
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;