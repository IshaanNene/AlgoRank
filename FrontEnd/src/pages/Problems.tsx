import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SortDesc, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
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
      case 'easy': return 'text-green-500 bg-green-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'hard': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search problems..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
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
              <Dropdown
                icon={<SortDesc className="w-4 h-4" />}
                options={[
                  { label: 'ID', value: 'id' },
                  { label: 'Difficulty', value: 'difficulty' }
                ]}
                value={sortBy}
                onChange={(value) => setSortBy(value as string)}
              />
            </div>
          </div>
        </Card>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid gap-4">
            {filteredProblems.map((problem) => (
              <motion.div
                key={problem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ scale: 1.01 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/problems/${problem.id}`)}
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
                        <span className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-600">
                          {problem.category}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editor/${problem.id}`);
                      }}
                    >
                      Solve
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Problems;