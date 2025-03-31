import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Trophy, Users, ArrowRight } from 'lucide-react';

const Main = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Code,
      title: 'Practice Problems',
      description: 'Solve algorithmic challenges and improve your coding skills',
    },
    {
      icon: Trophy,
      title: 'Compete',
      description: 'Join contests and compete with other developers',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Learn from others and share your solutions',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)]">
      <motion.div 
        className="text-center py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-bold mb-6 animate-gradient-text">
          Master Algorithms & Data Structures
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Practice coding problems, prepare for interviews, and improve your programming skills
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg
                     font-semibold shadow-lg hover:shadow-xl transition-all duration-300
                     flex items-center gap-2 mx-auto"
          onClick={() => navigate('/problems')}
        >
          Start Coding
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 py-12">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="glass-card p-6 rounded-xl"
          >
            <feature.icon className="w-12 h-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-6xl mx-auto px-4 py-12"
      >
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose AlgoRank?</h2>
        {/* Add more content here */}
      </motion.div>
    </div>
  );
};

export default Main;