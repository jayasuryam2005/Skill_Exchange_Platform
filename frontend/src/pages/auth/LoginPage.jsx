import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Mail, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (email && password) {
      const result = await login(email, password);
      if (result.success) {
        toast.success(`Welcome back!`);
        navigate('/dashboard');
      } else {
        toast.error(result.error);
      }
    } else {
      toast.error('Please fill in all fields');
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-white">SkillSwap</h2>
          <p className="mt-2 text-indigo-100">Exchange skills, grow together</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field pl-10 bg-white/90 border-transparent"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="input-field pl-10 bg-white/90 border-transparent"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-indigo-100 hover:text-white">Forgot password?</a>
            </div>
          </div>

          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-primary-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all transform hover:-translate-y-0.5">
            <LogIn className="h-5 w-5 mr-2" /> Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-indigo-100">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-white hover:underline">Register now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
