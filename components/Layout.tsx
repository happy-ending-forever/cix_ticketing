import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/Store';
import { Menu, X, User as UserIcon, LogOut, Ticket, Settings, Search, List } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setSearchQuery(''); // clear after search or keep it? Let's clear for cleaner UI
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-900 text-slate-100">
      <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center mr-2">
                <Ticket className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-2xl tracking-tighter">CIX<span className="text-brand-500">.ID</span></span>
            </div>

            {/* Desktop Search */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search movies..."
                  className="w-full bg-dark-800 border border-dark-700 rounded-full py-1.5 px-4 pl-10 focus:outline-none focus:border-brand-500 transition-colors text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2 text-gray-400 w-4 h-4" />
              </form>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className={`hover:text-brand-500 transition-colors ${location.pathname === '/' ? 'text-brand-500' : ''}`}>Movies</Link>
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{user.name}</span>
                    <div className="h-4 w-px bg-gray-700 mx-2"></div>
                    <Link to="/my-tickets" className="text-sm hover:text-brand-500 transition-colors flex items-center" title="My Tickets">
                        <List className="w-4 h-4 mr-1"/> My Tickets
                    </Link>
                    {user.isAdmin && (
                       <Link to="/admin" className="p-1.5 bg-dark-800 rounded-md hover:text-brand-500 ml-2" title="Admin">
                         <Settings className="w-4 h-4" />
                       </Link>
                    )}
                  </div>
                  <button onClick={() => logout()} className="p-2 hover:text-red-400" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-1.5 rounded-full text-sm font-medium transition-colors">
                  Login
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-white p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark-800 border-b border-dark-700 px-4 pt-2 pb-4 space-y-4">
             <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg py-2 px-4 pl-10 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </form>
              <div className="flex flex-col space-y-2">
                <Link to="/" className="block py-2 hover:text-brand-500" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                {user ? (
                  <>
                    <div className="py-2 border-t border-dark-700 mt-2">
                      <p className="text-xs text-gray-500 mb-1">Signed in as</p>
                      <p className="font-semibold">{user.name}</p>
                    </div>
                    <Link to="/my-tickets" className="block py-2 hover:text-brand-500" onClick={() => setMobileMenuOpen(false)}>My Tickets</Link>
                    {user.isAdmin && (
                      <Link to="/admin" className="block py-2 hover:text-brand-500" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
                    )}
                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-left w-full py-2 text-red-400">Sign Out</button>
                  </>
                ) : (
                  <Link to="/login" className="block py-2 text-brand-500 font-bold" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
                )}
              </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-dark-950 border-t border-dark-800 py-8 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CIX.ID. All rights reserved.</p>
        <p className="mt-2 text-xs">Powered by OMDB API.</p>
      </footer>
    </div>
  );
};