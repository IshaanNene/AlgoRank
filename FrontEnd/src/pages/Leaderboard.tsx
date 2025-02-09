import { useState, useEffect } from 'react';
import { Medal, TrendingUp, Users, Search, Filter, ChevronDown } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface LeaderboardEntry {
  rank: number;
  username: string;
  name: string;
  score: number;
  problems: number;
  streak: number;
  country: string;
  change: number;
}

const Leaderboard = () => {
  const { user } = useUser();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly' | 'allTime'>('weekly');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'problems' | 'streak'>('rank');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8080/leaderboard?timeRange=${timeRange}&sortBy=${sortBy}`
        );
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        }
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeRange, sortBy]);

  const filteredEntries = entries.filter(entry =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Global Leaderboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
            <option value="allTime">All Time</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problems</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredEntries.map((entry) => (
              <tr key={entry.username} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${getMedalColor(entry.rank)}`}>
                    {entry.rank <= 3 ? (
                      <Medal className="h-5 w-5 mr-1" />
                    ) : null}
                    <span className="text-sm">{entry.rank}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">{entry.name[0]}</span>
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{entry.name}</div>
                      <div className="text-sm text-gray-500">@{entry.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.score}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.problems}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.streak} days</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    entry.change > 0 ? 'bg-green-100 text-green-800' : 
                    entry.change < 0 ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    <TrendingUp className={`h-4 w-4 mr-1 ${
                      entry.change > 0 ? 'text-green-500' : 
                      entry.change < 0 ? 'text-red-500' : 
                      'text-gray-500'
                    }`} />
                    {entry.change > 0 ? '+' : ''}{entry.change}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;