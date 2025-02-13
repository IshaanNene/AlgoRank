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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} onClose={() => setError('')} />
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map(({ label, value, icon: Icon, color, trend }) => (
          <Card key={label} hover>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-2xl font-semibold mt-1">{value}</p>
              </div>
              <Icon className={`h-8 w-8 ${color}`} />
            </div>
            <div className="text-sm text-gray-600">
              <span className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                {trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div className="flex space-x-2">
              {['week', 'month', 'year'].map((range) => (
                <Button
                  key={range}
                  variant={selectedTimeRange === range ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeRange(range as 'week' | 'month' | 'year')}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'solved' ? 'bg-green-500' :
                    activity.type === 'attempted' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <span className="text-gray-600">
                    {activity.type === 'solved' ? 'Solved' :
                     activity.type === 'attempted' ? 'Attempted' :
                     'Commented on'} "{activity.problemName}"
                  </span>
                  <span className="text-gray-400 ml-auto">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                No activities found
              </div>
            )}
          </div>
        </Card>

        {/* Progress Overview */}
        <Card>
          <h2 className="text-lg font-semibold mb-6">Progress Overview</h2>
          <div className="space-y-6">
            {[
              { label: 'Easy Problems', value: user?.stats?.easySolved || 0, total: 100, color: 'bg-green-500' },
              { label: 'Medium Problems', value: user?.stats?.mediumSolved || 0, total: 100, color: 'bg-yellow-500' },
              { label: 'Hard Problems', value: user?.stats?.hardSolved || 0, total: 100, color: 'bg-red-500' }
            ].map((category) => (
              <div key={category.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{category.label}</span>
                  <span className="text-gray-900">{category.value}/{category.total}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${category.color} transition-all duration-500`}
                    style={{ width: `${(category.value / category.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;