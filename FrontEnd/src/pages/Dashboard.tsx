import { useState, useEffect } from 'react';
import { Activity, Award, Code, Target, TrendingUp, BookOpen } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

interface ActivityItem {
  id: string;
  type: 'solved' | 'attempted' | 'commented';
  problemId: string;
  problemName: string;
  timestamp: Date;
}

const Dashboard = () => {
  const { user } = useUser();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const totalSolved = user?.stats?.totalSolved || 0;
  const streak = user?.stats?.streak || 0;
  const ranking = user?.stats?.ranking || 0;
  const acceptanceRate = user?.stats?.acceptanceRate || '0%';

  const stats = [
    { label: 'Problems Solved', value: totalSolved, total: 100, color: 'bg-green-500' },
    { label: 'Current Streak', value: streak, total: 30, color: 'bg-yellow-500' },
    { label: 'Ranking', value: ranking, total: 1000, color: 'bg-red-500' },
    { label: 'Acceptance Rate', value: acceptanceRate, total: 100, color: 'bg-blue-500' }
  ];

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setActivities([
        { id: '1', type: 'solved', problemId: '101', problemName: 'Two Sum', timestamp: new Date() },
        { id: '2', type: 'attempted', problemId: '102', problemName: 'Binary Search', timestamp: new Date() }
      ]);
      setIsLoading(false);
    }, 1500);
  }, [selectedTimeRange]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-6">
      <motion.div 
        className="max-w-7xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 animate-gradient" />
          
          <h1 className="text-3xl font-bold mb-2 relative">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400 relative">
            Track your progress and continue your coding journey
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-400" />
            Progress Overview
          </h2>
          <div className="space-y-6">
            {stats.map((category, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{category.label}</span>
                  <span>{category.value}</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                  <div
                    className={`${category.color} h-2.5 rounded-full`}
                    style={{ width: `${(Number(category.value) / category.total) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-indigo-400" />
            Recent Activity
          </h2>
          <div className="flex justify-between items-center mb-6">
            {['week', 'month', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedTimeRange(range as 'week' | 'month' | 'year')}
                className={`px-3 py-1 rounded-lg text-sm transition-colors duration-200 ${
                  selectedTimeRange === range ? 'bg-indigo-500 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <LoadingSpinner size="lg" />
            </div>
          ) : activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex justify-between items-center p-4 bg-gray-800 rounded-md">
                  <div>
                    <p className="font-medium">{activity.problemName}</p>
                    <p className="text-sm text-gray-400">{activity.type}</p>
                  </div>
                  <span className="text-sm text-gray-400">{new Date(activity.timestamp).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No activities found</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;