import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from './context/UserContext';
import { useTheme } from './context/ThemeContext';
import { ProblemsProvider } from './context/ProblemsContext';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AnimatedBackground from './components/AnimatedBackground';
import { ProblemList } from './components/ProblemList';
import { ProblemDetail } from './components/ProblemDetail';

// Pages
import Main from './pages/Main';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';
import CodeEditor from './pages/CodeEditor';
import ForgotPassword from './pages/ForgotPassword';

export default function App() {
  const { user } = useUser();
  const { isDarkMode } = useTheme();

  return (
    <Router>
      <ProblemsProvider>
        <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
          <AnimatedBackground />
          <div className="relative z-10">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Main />
                    </motion.div>
                  } />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Login />
                    </motion.div>
                  } />
                  <Route path="/signup" element={
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Signup />
                    </motion.div>
                  } />
                  <Route path="/forgot-password" element={
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ForgotPassword />
                    </motion.div>
                  } />

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
                  <Route path="/problems/:id" element={
                    <ProtectedRoute>
                      <ProblemDetail />
                    </ProtectedRoute>
                  } />
                  <Route path="/code-editor/:id" element={
                    <ProtectedRoute>
                      <CodeEditor />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  
                  {/* Public Routes */}
                  <Route path="/leaderboard" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Leaderboard />
                    </motion.div>
                  } />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </ProblemsProvider>
    </Router>
  );
}