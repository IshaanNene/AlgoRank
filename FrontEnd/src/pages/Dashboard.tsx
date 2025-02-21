import React, { useState, useEffect } from 'react';
import { Activity, Award, Code, Target, TrendingUp, BookOpen, Calendar } from 'lucide-react';
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

const Dashboard: React.FC = () => {
  const { user } = useUser();
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setActivities([
        { id: '1', type: 'solved', problemId: '101', problemName: 'Two Sum', timestamp: new Date() },
        // Add more mock data
      ]);
      setIsLoading(false);
    }, 1000);
  }, [selectedTimeRange]);

  const stats = [
    { 
      label: 'Problems Solved',
      value: user?.stats?.totalSolved || 0,
      icon: Code,
      color: 'from-green-500 to-emerald-700'
    },
    { 
      label: 'Current Streak',
      value: user?.stats?.streak || 0,
      icon: Calendar,
      color: 'from-yellow-500 to-orange-700'
    },
    // Add more stats...
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <Card variant="gradient" className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-400">
            Track your progress and continue your coding journey
          </p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                  </div>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Add more sections as needed */}
      </motion.div>
    </div>
  );
};

export default Dashboard;