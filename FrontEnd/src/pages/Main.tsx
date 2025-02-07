import { Link } from 'react-router-dom';

const Main = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
      <h1 className="text-4xl font-bold text-white mb-6">Welcome to Our App</h1>
      <div className="space-x-4">
        <Link to="/login">
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-200">
            Login
          </button>
        </Link>
        <Link to="/signup">
          <button className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-gray-200">
            Sign Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Main;