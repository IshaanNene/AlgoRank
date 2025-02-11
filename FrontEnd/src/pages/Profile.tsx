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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        <div className="px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-full bg-white border-4 border-white -mt-16 overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="ml-4 -mt-16"> 
                <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                <p className="text-gray-500">@{user.username}</p>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                Edit Profile
              </button>
            </div>
          </div>
          
          <div className="mt-6 border-b border-gray-200">
            <nav className="flex space-x-8">
              {['overview', 'solutions', 'submissions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as typeof activeTab)}
                  className={`px-3 py-2 text-sm font-medium ${
                    activeTab === tab
                      ? 'border-b-2 border-indigo-500 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(editableFields).map(([key, field]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {key === 'github' && <Github className="h-5 w-5 text-gray-400" />}
                  {key === 'twitter' && <Twitter className="h-5 w-5 text-gray-400" />}
                  {key === 'location' && <MapPin className="h-5 w-5 text-gray-400" />}
                  <span className="text-gray-600">{field.name}:</span>
                </div>
                <div className="flex items-center space-x-2">
                  {field.isEditing ? (
                    <>
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => setEditableFields(prev => ({
                          ...prev,
                          [key]: { ...prev[key], value: e.target.value }
                        }))}
                        className="px-2 py-1 border rounded"
                      />
                      <button
                        onClick={() => handleSave(key)}
                        disabled={isLoading}
                        className="text-green-500 hover:text-green-600"
                      >
                        <Save className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setEditableFields(prev => ({
                          ...prev,
                          [key]: { ...prev[key], isEditing: false }
                        }))}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-900">{field.value || 'Not set'}</span>
                      <button
                        onClick={() => handleEdit(key)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold mb-4">Problem Solving Statistics</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Easy ({user.stats.easySolved}/100)</span>
              <span className="text-green-600">{Math.round(user.stats.easySolved)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-green-500 rounded-full"
                style={{ width: `${user.stats.easySolved}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Medium ({user.stats.mediumSolved}/100)</span>
              <span className="text-yellow-600">{Math.round(user.stats.mediumSolved)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-yellow-500 rounded-full"
                style={{ width: `${user.stats.mediumSolved}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Hard ({user.stats.hardSolved}/100)</span>
              <span className="text-red-600">{Math.round(user.stats.hardSolved)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-red-500 rounded-full"
                style={{ width: `${user.stats.hardSolved}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-gray-600">{user.bio}</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500">Profile Completion</p>
        <p className="text-2xl font-semibold">{user.profileCompletion}%</p>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${user.profileCompletion}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;