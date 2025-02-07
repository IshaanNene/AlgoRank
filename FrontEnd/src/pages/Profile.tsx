import { Calendar, Github, Mail, MapPin, Twitter } from 'lucide-react';

const Profile = ({ user }) => {
  // Check if user is defined
  if (!user) {
    return <div className="text-red-500">User data is not available.</div>;
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
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{user.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-5 w-5" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Github className="h-5 w-5" />
                <span>{user.github}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Twitter className="h-5 w-5" />
                <span>{user.twitter}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Calendar className="h-5 w-5" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Total Solved</p>
                <p className="text-2xl font-semibold">{user.stats.totalSolved}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Acceptance Rate</p>
                <p className="text-2xl font-semibold">{user.stats.acceptanceRate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Submissions</p>
                <p className="text-2xl font-semibold">{user.stats.submissions}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Current Streak</p>
                <p className="text-2xl font-semibold">7 days</p>
              </div>
            </div>
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