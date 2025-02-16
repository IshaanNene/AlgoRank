import { Calendar, Github, Mail, MapPin, Twitter, Edit2, Save, X } from 'lucide-react';
import { useUser } from '../context/UserContext'; // Import useUser
import { useEffect, useState } from 'react'; // Import useEffect and useState

// Define the User interface
interface User {
  name: string;
  username: string;
  location: string;
  email: string;
  github: string;
  twitter: string;
  joinDate: string; 
  stats: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    submissions: number;
    acceptanceRate: string;
  };
  bio: string;
  profileCompletion: number;
}

interface EditableField {
  name: string;
  value: string;
  isEditing: boolean;
}

const Profile = () => {
  const { user, setUser } = useUser(); 
  const [userData, setUserData] = useState<User | null>(null);
  const [editableFields, setEditableFields] = useState<Record<string, EditableField>>({
    bio: { name: 'Bio', value: user?.bio || '', isEditing: false },
    location: { name: 'Location', value: user?.location || '', isEditing: false },
    github: { name: 'GitHub', value: user?.github || '', isEditing: false },
    twitter: { name: 'Twitter', value: user?.twitter || '', isEditing: false },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'submissions'>('overview');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const response = await fetch(`http://localhost:8080/user/${user.username}`); 
        if (response.ok) {
          const userData = await response.json();
          setUserData(userData); 
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleEdit = (fieldKey: string) => {
    setEditableFields(prev => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], isEditing: true }
    }));
  };

  const handleSave = async (fieldKey: string) => {
    setIsLoading(true);
    try {
      // API call to update user profile
      const response = await fetch(`http://localhost:8080/user/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          [fieldKey]: editableFields[fieldKey].value
        })
      });

      if (response.ok) {
        setEditableFields(prev => ({
          ...prev,
          [fieldKey]: { ...prev[fieldKey], isEditing: false }
        }));
        // Update user context with new value
        if (user) {
          const updatedUser: User = {
            ...user,
            [fieldKey]: editableFields[fieldKey].value
          };
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Please log in to view your profile</h2>
          <p className="mt-2 text-gray-600">You need to be logged in to access this page.</p>
        </div>  
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 
                            flex items-center justify-center text-4xl font-bold text-white
                            transform group-hover:scale-105 transition-all duration-300">
                {user.name[0].toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 bg-gray-800 p-2 rounded-full 
                               border-4 border-gray-900 text-gray-300 hover:text-white
                               transform hover:scale-110 transition-all duration-300">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                  <p className="text-gray-400">@{user.username}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white 
                                   rounded-lg transition-colors flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* User Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{user.stats.totalSolved}</div>
                  <div className="text-sm text-gray-400">Problems Solved</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{user.stats.submissions}</div>
                  <div className="text-sm text-gray-400">Total Submissions</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-white">{user.stats.acceptanceRate}</div>
                  <div className="text-sm text-gray-400">Acceptance Rate</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-400">{user.profileCompletion}%</div>
                  <div className="text-sm text-gray-400">Profile Completion</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Info */}
          <div className="space-y-8">
            {/* Bio Section */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">About</h2>
              <p className="text-gray-300">{user.bio || 'No bio added yet'}</p>
            </div>

            {/* Contact Info */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-5 h-5 mr-3 text-gray-400" />
                  {user.email}
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  {user.location || 'Location not specified'}
                </div>
                {user.github && (
                  <div className="flex items-center text-gray-300">
                    <Github className="w-5 h-5 mr-3 text-gray-400" />
                    <a href={`https://github.com/${user.github}`} 
                       className="hover:text-indigo-400 transition-colors"
                       target="_blank" rel="noopener noreferrer">
                      {user.github}
                    </a>
                  </div>
                )}
                {user.twitter && (
                  <div className="flex items-center text-gray-300">
                    <Twitter className="w-5 h-5 mr-3 text-gray-400" />
                    <a href={`https://twitter.com/${user.twitter}`}
                       className="hover:text-indigo-400 transition-colors"
                       target="_blank" rel="noopener noreferrer">
                      @{user.twitter}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center and Right Columns - Stats and Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Problem Solving Progress */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-6">Problem Solving Progress</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Easy ({user.stats.easySolved}/100)</span>
                    <span className="text-green-400">{Math.round(user.stats.easySolved)}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${user.stats.easySolved}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Medium ({user.stats.mediumSolved}/100)</span>
                    <span className="text-yellow-400">{Math.round(user.stats.mediumSolved)}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                      style={{ width: `${user.stats.mediumSolved}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Hard ({user.stats.hardSolved}/100)</span>
                    <span className="text-red-400">{Math.round(user.stats.hardSolved)}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${user.stats.hardSolved}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity Calendar */}
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4">Activity Calendar</h2>
              <div className="h-32 flex items-center justify-center text-gray-400">
                <Calendar className="w-6 h-6 mr-2" />
                Activity calendar coming soon...
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;