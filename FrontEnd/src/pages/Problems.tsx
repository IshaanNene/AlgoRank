import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Tag, TrendingUp, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

interface ProblemTag {
  id: string;
  name: string;
  count: number;
}

interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  acceptance: string;
  frequency: number;
  tags: string[];
  solved: boolean;
  premium: boolean;
  likes: number;
  dislikes: number;
}

const Problems = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'frequency' | 'acceptance' | 'difficulty'>('frequency');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showSolvedOnly, setShowSolvedOnly] = useState(false);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    return problems
      .filter(problem => {
        const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTags = selectedTags.length === 0 || 
          selectedTags.every(tag => problem.tags.includes(tag));
        const matchesDifficulty = selectedDifficulty.length === 0 || 
          selectedDifficulty.includes(problem.difficulty);
        const matchesPremium = !showPremiumOnly || problem.premium;
        const matchesSolved = !showSolvedOnly || problem.solved;
        
        return matchesSearch && matchesTags && matchesDifficulty && 
               matchesPremium && matchesSolved;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'frequency':
            return b.frequency - a.frequency;
          case 'acceptance':
            return parseFloat(b.acceptance) - parseFloat(a.acceptance);
          case 'difficulty':
            return ['Easy', 'Medium', 'Hard'].indexOf(a.difficulty) -
                   ['Easy', 'Medium', 'Hard'].indexOf(b.difficulty);
          default:
            return 0;
        }
      });
  }, [problems, searchQuery, selectedTags, selectedDifficulty, showPremiumOnly, 
      showSolvedOnly, sortBy]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleProblemClick = (id: string) => {
    navigate(`/problem/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search problems..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          <Filter className="h-5 w-5 text-gray-500" />
          <span>Filter</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acceptance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProblems.map((problem) => (
              <tr
                key={problem.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleProblemClick(problem.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`h-2 w-2 rounded-full ${problem.solved ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {problem.acceptance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Problems;