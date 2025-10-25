// src/components/auth/Login.jsx
import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { Eye, EyeOff, Mail, Lock, Heart, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  
  const darkMode = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

<<<<<<< Updated upstream
    const result = await login(email, password);
    
    if (!result.success) {
      toast.error(result.error);
    } else {
      // Navigation AFTER successful login
      switch (result.user.role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'doctor':
          navigate('/doctor');
          break;
        case 'nurse':
        case 'lab_technician':
        case 'pharmacist':
        case 'ward_boy':
          navigate('/staff');
          break;
        default:
          navigate('/login');
      }
=======
    try {
      const result = await login(email, password);

      if (result.success) {
        toast.success('Login successful!');

        // Redirect based on role
        const role = result.user.role;
        if (role === 'admin') navigate('/admin');
        else if (role === 'doctor') navigate('/doctor');
        else if (role === 'patient') navigate('/patient');
        else if (role === 'nurse') navigate('/nurse');
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
>>>>>>> Stashed changes
    }

    setLoading(false);
  };

  const handleBackToLanding = () => {
    navigate('/');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-100'
    }`}>
      {/* Back Button */}
      <button
        onClick={handleBackToLanding}
        className={`absolute top-6 left-6 flex items-center space-x-2 transition-colors duration-200 ${
          darkMode 
            ? 'text-gray-400 hover:text-white' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-2xl ${
              darkMode ? 'bg-blue-500' : 'bg-blue-600'
            }`}>
              <Heart className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome Back
          </h2>
          <p className={`mt-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to your hospital account
          </p>
        </div>

        {/* Login Card */}
        <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'border-gray-300'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className={`h-5 w-5 ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`} />
                  ) : (
                    <Eye className={`h-5 w-5 ${
                      darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                    }`} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 rounded ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                  }`}
                />
                <label htmlFor="remember-me" className={`ml-2 block text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className={`text-sm font-medium ${
                  darkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
                darkMode 
                  ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-400 focus:ring-offset-gray-800' 
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Don't have an account?{' '}
              <Link
                to="/register"
                className={`font-medium ${
                  darkMode 
                    ? 'text-blue-400 hover:text-blue-300' 
                    : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;