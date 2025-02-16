import { useState, useEffect } from 'react';
import { Medal, TrendingUp, Users, Search, Filter, ChevronDown } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { usersAPI } from '../services/api';

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
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('weekly');
  const [sortBy, setSortBy] = useState('rank');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await usersAPI.getLeaderboard();
        setLeaderboardData(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch leaderboard');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [timeRange, sortBy]);

  const filteredEntries = leaderboardData.filter(entry =>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-4">Global Leaderboard</h1>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg 
                         text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 
                         focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-gray-200 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
              <option value="allTime">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Top 3 Winners Podium */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex justify-center items-end space-x-4 h-48">
          {/* Second Place */}
          <div className="w-32 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 
                          flex items-center justify-center mb-2 border-4 border-gray-700">
              <span className="text-2xl font-bold text-gray-900">2</span>
            </div>
            <div className="h-24 w-full bg-gradient-to-t from-gray-700 to-gray-600 rounded-t-lg 
                          flex flex-col items-center justify-end p-2">
              <span className="text-white font-semibold">{filteredEntries[1]?.username}</span>
              <span className="text-gray-300 text-sm">{filteredEntries[1]?.score} pts</span>
            </div>
          </div>

          {/* First Place */}
          <div className="w-32 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 
                          flex items-center justify-center mb-2 border-4 border-yellow-600 
                          transform hover:scale-110 transition-transform">
              <span className="text-3xl font-bold text-yellow-900">1</span>
            </div>
            <div className="h-32 w-full bg-gradient-to-t from-yellow-700 to-yellow-600 rounded-t-lg 
                          flex flex-col items-center justify-end p-2">
              <span className="text-white font-semibold">{filteredEntries[0]?.username}</span>
              <span className="text-yellow-200 text-sm">{filteredEntries[0]?.score} pts</span>
            </div>
          </div>

          {/* Third Place */}
          <div className="w-32 flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 
                          flex items-center justify-center mb-2 border-4 border-amber-800">
              <span className="text-2xl font-bold text-amber-100">3</span>
            </div>
            <div className="h-20 w-full bg-gradient-to-t from-amber-800 to-amber-700 rounded-t-lg 
                          flex flex-col items-center justify-end p-2">
              <span className="text-white font-semibold">{filteredEntries[2]?.username}</span>
              <span className="text-amber-200 text-sm">{filteredEntries[2]?.score} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Problems</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Streak</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 bg-transparent">
              {filteredEntries.slice(3).map((entry) => (
                <tr key={entry.username} 
                    className="hover:bg-white/5 transition-colors cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300 font-medium">#{entry.rank}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 
                                    flex items-center justify-center">
                        <span className="text-white font-medium">{entry.name[0]}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{entry.name}</div>
                        <div className="text-sm text-gray-400">@{entry.username}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">{entry.score}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">{entry.problems}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-green-400">{entry.streak} days</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${entry.change > 0 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'}`}>
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        entry.change > 0 ? 'text-green-400' : 'text-red-400'
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
    </div>
  );
};

export default Leaderboard;