import { Medal, TrendingUp, Users } from 'lucide-react';

const Leaderboard = () => {
  const users = [
    { rank: 1, name: 'Alex Johnson', score: 2840, problems: 245, streak: 15 },
    { rank: 2, name: 'Sarah Chen', score: 2750, problems: 232, streak: 12 },
    { rank: 3, name: 'Mike Smith', score: 2680, problems: 228, streak: 8 },
    { rank: 4, name: 'Emma Davis', score: 2590, problems: 215, streak: 10 },
    { rank: 5, name: 'James Wilson', score: 2510, problems: 208, streak: 5 },
  ];

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-400';
      case 2: return 'text-gray-400';
      case 3: return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-100">Global Rankings</p>
              <p className="text-2xl font-bold mt-1">10,234</p>
              <p className="text-sm text-indigo-200 mt-1">Active Users</p>
            </div>
            <Users className="h-10 w-10 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Your Position</p>
              <p className="text-2xl font-bold mt-1">#234</p>
              <p className="text-sm text-green-200 mt-1">Top 5%</p>
            </div>
            <TrendingUp className="h-10 w-10 opacity-75" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Weekly Change</p>
              <p className="text-2xl font-bold mt-1">+12</p>
              <p className="text-sm text-orange-200 mt-1">Positions</p>
            </div>
            <Medal className="h-10 w-10 opacity-75" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problems Solved</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.rank} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`flex items-center ${getMedalColor(user.rank)}`}>
                    {user.rank <= 3 ? (
                      <Medal className="h-5 w-5 mr-1" />
                    ) : null}
                    <span className="text-sm">{user.rank}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.score}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.problems}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.streak} days</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard