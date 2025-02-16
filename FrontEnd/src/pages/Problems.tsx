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
  const [showTagsFilter, setShowTagsFilter] = useState(false);
  const [availableTags, setAvailableTags] = useState<ProblemTag[]>([]);

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

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg 
                         text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={selectedDifficulty.join(',')}
                onChange={(e) => setSelectedDifficulty(e.target.value.split(','))}
                className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <button
                onClick={() => setShowTagsFilter(!showTagsFilter)}
                className="flex items-center px-4 py-2 bg-gray-800/50 border border-gray-700 
                         rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
              >
                <Tag className="w-4 h-4 mr-2" />
                Tags
              </button>
            </div>
          </div>

          {/* Tags Filter */}
          {showTagsFilter && (
            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.name)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all
                      ${selectedTags.includes(tag.name)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                  >
                    {tag.name}
                    <span className="ml-2 text-xs opacity-70">({tag.count})</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Problems Table */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Difficulty</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Acceptance</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tags</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Frequency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 bg-transparent">
                {filteredProblems.map((problem) => (
                  <tr
                    key={problem.id}
                    onClick={() => handleProblemClick(problem.id)}
                    className="hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`h-3 w-3 rounded-full ${
                        problem.solved ? 'bg-green-500' : 
                        'bg-gray-600 group-hover:bg-gray-500'
                      }`} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-gray-200 font-medium hover:text-indigo-400 transition-colors">
                          {problem.title}
                        </span>
                        {problem.premium && (
                          <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-yellow-500/20 text-yellow-400">
                            Premium
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium
                        ${problem.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                      {problem.acceptance}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {problem.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 rounded-md text-xs font-medium bg-gray-700 text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <TrendingUp className={`w-4 h-4 mr-2 ${
                          problem.frequency > 75 ? 'text-green-400' :
                          problem.frequency > 50 ? 'text-yellow-400' :
                          'text-gray-400'
                        }`} />
                        <span className="text-gray-300">{problem.frequency}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProblems.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">No problems found matching your criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problems;