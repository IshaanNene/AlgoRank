import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Award, Calendar, Activity, Github, Twitter, Linkedin } from 'lucide-react';
import { useUser } from '../context/UserContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { ProblemHistory } from '../components/ProblemHistory';

const Profile: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Problems Solved', value: user?.stats?.solved || 0, icon: Award },
    { label: 'Current Streak', value: user?.stats?.streak || 0, icon: Calendar },
    { label: 'Total Submissions', value: user?.stats?.submissions || 0, icon: Activity },
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <Card className="mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative">
              <img
                src={user?.avatar || 'default-avatar.png'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              <Button
                variant="ghost"
                className="absolute bottom-0 right-0"
                onClick={() => {/* Add avatar update handler */}}
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{user?.name}</h1>
              <p className="text-gray-600 mb-4">{user?.bio || 'No bio added yet'}</p>
              
              <div className="flex gap-4">
                {user?.github && (
                  <a href={user.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {user?.twitter && (
                  <a href={user.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-5 h-5" />
                  </a>
                )}
                {user?.linkedin && (
                  <a href={user.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => {/* Add edit profile handler */}}
            >
              Edit Profile
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <stat.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{stat.value}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card>
          <div className="border-b mb-6">
            <div className="flex gap-4">
              {['overview', 'submissions', 'achievements'].map((tab) => (
                <button
                  key={tab}
                  className={`px-4 py-2 border-b-2 ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'overview' && (
            <ProblemHistory userId={user?.id} />
          )}
          
          {activeTab === 'submissions' && (
            <div>{/* Add submissions component */}</div>
          )}
          
          {activeTab === 'achievements' && (
            <div>{/* Add achievements component */}</div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;