import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
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
      // Handle successful signup (e.g., redirect or show a message)
    } catch (error) {
      console.error('Error signing up:', error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="email" onChange={handleChange} placeholder="Email" />
      <input type="password" name="password" onChange={handleChange} placeholder="Password" />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;