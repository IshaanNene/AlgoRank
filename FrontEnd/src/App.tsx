import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Main from './pages/Main'; // Import the new Main component
import Login from './pages/Login';
import Signup from './pages/Signup'; // Import the new Signup component
import Dashboard from './pages/Dashboard';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import Problems from './pages/Problems';
import CodeEditor from './pages/CodeEditor';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Main />} /> {/* Main page route */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* Signup route */}
          <Route path="/problem/:id" element={<CodeEditor />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="*"
            element={
              <>
                <Navbar />
                <main className="container mx-auto px-4 py-8">
                  <Routes>
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/problems" element={<Problems />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/dashboard" element={<Navigate to="/" />} /> {/* Redirect to Main */}
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;