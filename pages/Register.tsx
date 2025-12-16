import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/Store';
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (name && email && password) {
      const { error } = await register(name, email, password);
      if (!error) {
        // Supabase often logs in automatically after sign up, or requires email verification.
        // For this demo, we assume auto-login or redirect.
        navigate('/');
      } else {
        setError(error.message || 'Registration failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="bg-dark-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-dark-700">
        <div className="flex flex-col items-center mb-8">
           <div className="w-12 h-12 bg-brand-500 rounded-xl flex items-center justify-center mb-4">
                <UserPlus className="text-white w-7 h-7" />
           </div>
           <h1 className="text-2xl font-bold text-white">Create Account</h1>
           <p className="text-gray-400 text-sm mt-2">Join CIX.ID to book tickets easily.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 mb-4 flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-dark-900 border border-dark-600 rounded-lg p-3 text-white focus:border-brand-500 focus:outline-none"
              placeholder="John Doe"
              required
            />
          </div>
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
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-brand-900 disabled:text-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
           <p>Already have an account? <Link to="/login" className="text-white cursor-pointer hover:underline">Sign In</Link></p>
        </div>
      </div>
    </div>
  );
};