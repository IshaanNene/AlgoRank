import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code, Award, TrendingUp, Calendar, Clock, 
  CheckCircle, XCircle, Activity 
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { ProblemHistory } from '../components/ProblemHistory';
import { ProgressChart } from '../components/ProgressChart';

const Dashboard = () => {
  const { user } = useUser();

  const stats = [
    {
      icon: Code,
      label: 'Problems Solved',
      value: user?.stats?.solved || 0,
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: Calendar,
      label: 'Current Streak',
      value: user?.stats?.streak || 0,
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: Award,
      label: 'Ranking',
      value: user?.stats?.ranking || 'N/A',
      color: 'from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                <h3 className="text-2xl font-bold">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Progress Overview</h2>
          <ProgressChart data={user?.progress || []} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card rounded-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ProblemHistory userId={user?.id} limit={5} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card rounded-xl p-6"
      >
        <h2 className="text-xl font-semibold mb-4">Recommended Problems</h2>
        {/* Add recommended problems component */}
      </motion.div>
    </div>
  );
};

export default Dashboard;