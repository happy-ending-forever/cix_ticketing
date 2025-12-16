import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useStore } from '../context/Store';
import { Ticket as TicketIcon, Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';

export const MyTickets = () => {
  const { user, bookings } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Filter bookings for current user and sort by newest first
  const myBookings = bookings
    .filter(b => b.userId === user.id)
    .sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="w-10 h-10 bg-brand-500 rounded-lg flex items-center justify-center">
          <TicketIcon className="text-white w-6 h-6" />
        </div>
        <h1 className="text-3xl font-bold">My Tickets</h1>
      </div>

      {myBookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-dark-800 rounded-2xl border border-dark-700">
          <TicketIcon className="w-16 h-16 text-dark-600 mb-4" />
          <h2 className="text-xl font-bold text-gray-300 mb-2">No tickets yet</h2>
          <p className="text-gray-500 mb-6">Start exploring movies to book your first ticket.</p>
          <Link to="/" className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 px-6 rounded-full transition-colors">
            Browse Movies
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myBookings.map(booking => (
            <div key={booking.id} className="bg-dark-800 rounded-xl overflow-hidden border border-dark-700 hover:border-brand-500/50 transition-all group">
              <div className="flex">
                {/* Poster Thumbnail */}
                <div className="w-24 h-36 flex-shrink-0">
                  <img 
                    src={booking.movie.Poster} 
                    alt={booking.movie.Title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Ticket Details */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white line-clamp-1 mb-1 group-hover:text-brand-400 transition-colors">
                      {booking.movie.Title}
                    </h3>
                    <div className="text-xs text-gray-400 space-y-1">
                      <p className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {booking.cinema.name}</p>
                      <p className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(booking.date).toLocaleDateString()}</p>
                      <p className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {booking.showtime.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-700">
                    <span className="text-xs font-medium bg-dark-700 px-2 py-1 rounded text-gray-300">
                      {booking.seats.length} Seat{booking.seats.length > 1 ? 's' : ''}
                    </span>
                    <Link 
                      to={`/ticket/${booking.id}`}
                      className="flex items-center text-xs font-bold text-brand-500 hover:text-brand-400"
                    >
                      View Ticket <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};