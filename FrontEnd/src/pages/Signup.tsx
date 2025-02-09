import React, { useState } from 'react';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const { setUser } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    username: '',
    location: '',
    github: '',
    twitter: '',
    bio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/signup', formData);
      console.log('User signed up:', response.data);
      setUser(response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error signing up:', error);
      if (axios.isAxiosError(error)) {
        alert(`Signup failed: ${error.response?.data?.message || 'An error occurred'}`);
      } else {
        alert('Signup failed. Please try again later.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Account</h2>
        <p className="text-center text-gray-600 mb-4">Join us and start your journey!</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              placeholder="Create a password"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              className="w-full p-2 border border-gray-300 rounded"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">GitHub</label>
            <input
              type="text"
              name="github"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Twitter</label>
            <input
              type="text"
              name="twitter"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Bio</label>
            <input
              type="text"
              name="bio"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition duration-200 transform hover:scale-105">
            Sign Up
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;