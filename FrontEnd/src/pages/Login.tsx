import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Lock, Eye, Monitor, User, Globe } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Switch from '../components/Switch';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Monitor },
    { id: 'privacy', label: 'Privacy', icon: Eye },
    { id: 'language', label: 'Language', icon: Globe },
  ];

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          <Card className="h-fit">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg ${
                    activeSection === section.id
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveSection(section.id)}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                </button>
              ))}
            </nav>
          </Card>

          <Card>
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <Button variant="primary">Save Changes</Button>
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-500">
                        Receive notifications about your activity
                      </p>
                    </div>
                    <Switch />
                  </div>
                  {/* Add more notification settings */}
                </div>
              </div>
            )}

            {/* Add other section contents */}
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;