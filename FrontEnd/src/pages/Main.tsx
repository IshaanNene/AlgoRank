import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Brain, Target, Users, ChevronRight, Github, Search, Code2 } from 'lucide-react';

const Main = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Smart Problem Selection",
      description: "AI-powered algorithm to suggest problems based on your skill level"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Personalized Learning Path",
      description: "Custom-tailored roadmap to improve your algorithmic skills"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Driven",
      description: "Learn and grow with fellow developers worldwide"
    }
  ];

  const popularProblems = [
    { title: "Two Sum", difficulty: "Easy", category: "Arrays" },
    { title: "Valid Parentheses", difficulty: "Medium", category: "Stacks" },
    { title: "Merge K Sorted Lists", difficulty: "Hard", category: "Linked Lists" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <h1 className="text-4xl font-bold text-white mb-6">Welcome to Our App</h1>
      <div className="space-x-4 mb-8">
        <Link to="/login">
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-200">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-200">
            Sign Up
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-6xl font-bold text-white mb-6">
          Master Algorithms with
          <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500"> AlgoRank</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your personalized journey to becoming an algorithmic master. Practice, learn, and climb the ranks with AI-powered problem recommendations.
        </p>
        <div className="relative w-full max-w-2xl mb-12">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for problems, topics, or concepts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-xl hover:transform hover:scale-105 transition duration-300">
                <div className="text-yellow-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular Problems Section */}
      <div id="problems" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-white mb-8">Popular Problems</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularProblems.map((problem, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-6 hover:bg-gray-600 transition cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{problem.title}</h3>
                  <span className="text-sm text-gray-300">{problem.category}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {problem.difficulty}
                </span>
              </div>
              <div className="flex items-center text-yellow-500 hover:text-yellow-400">
                <span>Solve Now</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Main;