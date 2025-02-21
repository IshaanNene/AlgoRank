import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext';
import Navbar from './components/Navbar';
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import CodeEditor from './pages/CodeEditor';
import ForgotPassword from './pages/ForgotPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedBackground from './components/AnimatedBackground';
import { ProblemsProvider } from './context/ProblemsContext';
import { ProblemList } from './components/ProblemList';
import { ProblemDetail } from './components/ProblemDetail';

// Remove any other default exports and keep only this one
export default function App() {
  const { user } = useUser();

  return (
    <Router>
      <ProblemsProvider>
        <div className="min-h-screen relative overflow-hidden">
          {/* Animated background rendered with a fixed position and -z-10 */}
          <AnimatedBackground />
          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/problems" 
                element={
                  <ProtectedRoute>
                    <Problems />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route 
                path="/code-editor/:id" 
                element={
                  <ProtectedRoute>
                    <CodeEditor />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/problems/:id" 
                element={
                  <ProtectedRoute>
                    <ProblemDetail />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </div>
      </ProblemsProvider>
    </Router>
  );
}