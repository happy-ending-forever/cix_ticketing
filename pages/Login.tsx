import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/Store';
import { Ticket, AlertCircle, Loader2 } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (email && password) {
      const { error } = await login(email, password);
      if (!error) {
        navigate(-1); // Go back to previous page
      } else {
        setError(error.message || 'Invalid email or password.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="bg-dark-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-dark-700">
        <div className="flex flex-col items-center mb-8">
           <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mb-4">
                <Ticket className="text-white w-7 h-7" />
           </div>
           <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
           <p className="text-gray-400 text-sm mt-2">Login to manage bookings and view tickets.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-500 focus:outline-none"
              placeholder="user@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-brand-900 disabled:text-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center"
          >
             {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
           <p className="mt-2">Don't have an account? <Link to="/register" className="text-white cursor-pointer hover:underline">Register</Link></p>
        </div>
      </div>
    </div>
  );
};