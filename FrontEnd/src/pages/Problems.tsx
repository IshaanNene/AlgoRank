import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortDesc, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProblems } from '../context/ProblemsContext';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import Dropdown from '../components/Dropdown';

const Problems: React.FC = () => {
  const navigate = useNavigate();
  const { problems, loading } = useProblems();
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('all');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('id');

  const filteredProblems = problems
    .filter(problem => {
      const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = difficulty === 'all' || problem.difficulty.toLowerCase() === difficulty;
      const matchesCategory = category === 'all' || problem.category === category;
      return matchesSearch && matchesDifficulty && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'id') return a.id - b.id;
      if (sortBy === 'difficulty') {
        const order = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return order[a.difficulty as keyof typeof order] - order[b.difficulty as keyof typeof order];
      }
      return 0;
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'medium': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30';
      case 'hard': return 'text-red-500 bg-red-100 dark:bg-red-900/30';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-xl"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems..."
              className="w-full pl-10 pr-4 py-2 glass-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <Dropdown
              icon={<Filter className="w-4 h-4" />}
              options={[
                { label: 'All Difficulties', value: 'all' },
                { label: 'Easy', value: 'easy' },
                { label: 'Medium', value: 'medium' },
                { label: 'Hard', value: 'hard' }
              ]}
              value={difficulty}
              onChange={(value) => setDifficulty(value as string)}
            />
            <Dropdown
              icon={<Tag className="w-4 h-4" />}
              options={[
                { label: 'All Categories', value: 'all' },
                { label: 'Arrays', value: 'arrays' },
                { label: 'Strings', value: 'strings' },
                { label: 'Dynamic Programming', value: 'dp' }
              ]}
              value={category}
              onChange={(value) => setCategory(value as string)}
            />
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredProblems.map((problem, index) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-6 rounded-xl hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {problem.id}. {problem.title}
                    </h3>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${getDifficultyColor(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                      <span className="px-2 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800">
                        {problem.category}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-lg"
                    onClick={() => navigate(`/problems/${problem.id}`)}
                  >
                    Solve
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Problems;