import { useState, useEffect } from 'react';
import { Activity, Award, Code, Target, Calendar, TrendingUp, BookOpen } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const [error, setError] = useState('');

  // Check if user stats are available before accessing them
  const totalSolved = user?.stats?.totalSolved || 0;
  const streak = user?.stats?.streak || 0;
  const ranking = user?.stats?.ranking || 0;
  const acceptanceRate = user?.stats?.acceptanceRate || '0%';

  const stats = [
    { 
      label: 'Problems Solved', 
      value: totalSolved, 
      icon: Code, 
      color: 'text-blue-600',
      trend: '+5 this week'
    },
    { 
      label: 'Current Streak', 
      value: `${streak} days`, 
      icon: Activity, 
      color: 'text-green-600',
      trend: 'Personal best!'
    },
    { 
      label: 'Global Rank', 
      value: `#${ranking}`, 
      icon: Award, 
      color: 'text-yellow-600',
      trend: 'Top 5%'
    },
    { 
      label: 'Success Rate', 
      value: acceptanceRate, 
      icon: Target, 
      color: 'text-purple-600',
      trend: '+2.5% vs last month'
    },
  ];

  // Fetch user activities
  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/user/activities?range=${selectedTimeRange}`);
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivities(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch activities');
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [user?.username, selectedTimeRange]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white p-6">
      {/* Welcome Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400">
            Track your progress and continue your coding journey
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 
                       transform hover:scale-105 transition-all duration-300"
          >
            <div className={`flex items-center justify-between mb-4`}>
              <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                {<stat.icon className={`w-6 h-6 ${stat.color}`} />}
              </div>
              <span className="text-xs font-medium text-gray-400">{stat.trend}</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Progress Overview */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-400" />
            Progress Overview
          </h2>
          <div className="space-y-6">
            {[
              { label: 'Easy Problems', value: user?.stats?.easySolved || 0, total: 100, color: 'bg-green-500' },
              { label: 'Medium Problems', value: user?.stats?.mediumSolved || 0, total: 100, color: 'bg-yellow-500' },
              { label: 'Hard Problems', value: user?.stats?.hardSolved || 0, total: 100, color: 'bg-red-500' }
            ].map((category) => (
              <div key={category.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">{category.label}</span>
                  <span className="text-white">{category.value}/{category.total}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${category.color} transition-all duration-500 rounded-full`}
                    style={{ width: `${(category.value / category.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Activity className="w-5 h-5 mr-2 text-indigo-400" />
              Recent Activity
            </h2>
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range as 'week' | 'month' | 'year')}
                  className={`px-3 py-1 rounded-lg text-sm transition-all duration-200 ${
                    selectedTimeRange === range 
                      ? 'bg-indigo-500 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'solved' ? 'bg-green-500' :
                    activity.type === 'attempted' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-gray-300 flex-1">
                    {activity.type === 'solved' ? 'Solved' :
                     activity.type === 'attempted' ? 'Attempted' :
                     'Commented on'} "{activity.problemName}"
                  </span>
                  <span className="text-gray-500 text-sm">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No activities found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;