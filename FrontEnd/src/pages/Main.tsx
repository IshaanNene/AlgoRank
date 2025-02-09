import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Target, Users, ChevronRight, Search, Code, Award, TrendingUp } from 'lucide-react';
import { useUser } from '../context/UserContext';

const Main = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();

  const features = [
    {
      icon: <Brain className="w-12 h-12 text-indigo-500" />,
      title: "Smart Problem Selection",
      description: "AI-powered algorithm suggests problems based on your skill level and learning pace"
    },
    {
      icon: <Target className="w-12 h-12 text-green-500" />,
      title: "Personalized Learning Path",
      description: "Custom-tailored roadmap to improve your algorithmic skills systematically"
    },
    {
      icon: <Users className="w-12 h-12 text-blue-500" />,
      title: "Community Driven",
      description: "Learn and grow with fellow developers worldwide through discussions and solutions"
    }
  ];

  const popularProblems = [
    { 
      title: "Two Sum", 
      difficulty: "Easy", 
      category: "Arrays",
      acceptance: "45%",
      submissions: "2.5M"
    },
    { 
      title: "Valid Parentheses", 
      difficulty: "Medium", 
      category: "Stacks",
      acceptance: "38%",
      submissions: "1.8M"
    },
    { 
      title: "Merge K Sorted Lists", 
      difficulty: "Hard", 
      category: "Linked Lists",
      acceptance: "32%",
      submissions: "1.2M"
    }
  ];

  const stats = [
    { number: "100K+", label: "Active Users" },
    { number: "5000+", label: "Problems" },
    { number: "50M+", label: "Submissions" },
    { number: "95%", label: "Success Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-32">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master Your Coding Skills with
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500"> AI-Powered</span> Learning
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Practice coding problems, track your progress, and improve your algorithmic thinking with our intelligent learning platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={user ? "/problems" : "/signup"}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center"
            >
              {user ? "Start Coding" : "Get Started"} 
              <ChevronRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/problems"
              className="px-8 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Browse Problems
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Problems Section */}
      <div id="problems" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">Popular Problems</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {popularProblems.map((problem, index) => (
            <div key={index} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                  <span className="text-sm text-gray-400">{problem.category}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-4">
                <span>Acceptance: {problem.acceptance}</span>
                <span>Submissions: {problem.submissions}</span>
              </div>
              <Link
                to={`/problem/${index + 1}`}
                className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <span>Solve Now</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Coding Journey?</h2>
          <p className="text-lg text-indigo-100 mb-8">Join thousands of developers who are improving their skills every day.</p>
          <Link
            to={user ? "/problems" : "/signup"}
            className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {user ? "Start Practicing" : "Sign Up Now"}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main;