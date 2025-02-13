import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import Main from './pages/Main'; // Import the updated Main component
import Login from './pages/Login';
import Signup from './pages/Signup'; // Import the new Signup component
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Problems from './pages/Problems';
import CodeEditor from './pages/CodeEditor';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute'; // Keep the import for ProtectedRoute
import { Navigate } from 'react-router-dom';

// Public Route wrapper component (redirects if user is already logged in)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser();
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { user } = useUser();

  // Effect to handle authentication state
  useEffect(() => {
    // Check for stored auth token and validate it
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Implement token validation logic here
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/problems" element={
            <ProtectedRoute>
              <Problems />
            </ProtectedRoute>
          } />
          <Route path="/problem/:id" element={
            <ProtectedRoute>
              <CodeEditor />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;