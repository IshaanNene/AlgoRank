import { useState, useEffect } from 'react';
import { Medal, TrendingUp, Users } from 'lucide-react';
import { useUser } from '../context/UserContext';
import usersAPI from '../api/users';

interface LeaderboardEntry {
  username: string;
  score: number;
  rank?: number;
}

const Leaderboard = () => {
  const { user } = useUser();
  const currentUser = user || { username: "johndoe" };

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await usersAPI.getLeaderboard({ timeRange: "week", page: 1, limit: 10 });
        setLeaderboard(data);
      } catch (err) {
        setError("Failed to fetch leaderboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length > 0 ? (
                leaderboard.map((entry, index) => (
                  <tr key={entry.username} className="border-t hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${getMedalColor(index + 1)} font-bold`}>{index + 1}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{entry.score}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No leaderboard data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;