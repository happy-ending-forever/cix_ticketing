import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMovieDetail } from '../services/omdbService';
import { Movie, Cinema, Showtime } from '../types';
import { MOCK_CINEMAS, MOCK_SHOWTIMES, CITIES } from '../constants';
import { useStore } from '../context/Store';
import { Clock, Calendar, Star, PlayCircle, MapPin } from 'lucide-react';

export const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setBookingMovie, setBookingCinema, setBookingDate, setBookingShowtime, user } = useStore();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Selection State
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [selectedDate, setSelectedDate] = useState<number>(0); // Index of next 3 days
  const [activeCinema, setActiveCinema] = useState<string | null>(null);

  // Generate next 3 days
  const dates = Array.from({ length: 3 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    if (id) {
      fetchMovieDetail(id).then(data => {
        setMovie(data);
        setLoading(false);
      });
    }
  }, [id]);

  const handleTimeSelect = (cinema: Cinema, time: Showtime) => {
    if (!movie) return;
    if (!user) {
      navigate('/login');
      return;
    }
    setBookingMovie(movie);
    setBookingCinema(cinema);
    setBookingDate(dates[selectedDate]);
    setBookingShowtime(time);
    navigate('/booking');
  };

  if (loading) return <div className="text-center py-20 text-brand-500">Loading details...</div>;
  if (!movie) return <div className="text-center py-20">Movie not found</div>;

  const filteredCinemas = MOCK_CINEMAS.filter(c => c.city === selectedCity);

  return (
    <div>
      {/* Hero Section with Backdrop Blur */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-lg opacity-40 scale-110"
          style={{ backgroundImage: `url(${movie.Poster})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/80 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col md:flex-row items-end pb-12 gap-8">
           <img 
            src={movie.Poster} 
            alt={movie.Title} 
            className="w-48 md:w-64 rounded-xl shadow-2xl shadow-black/50 border border-white/10 hidden md:block"
          />
          <div className="flex-1 mb-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">{movie.Title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mb-4">
              <span className="bg-white/10 px-2 py-1 rounded text-white">{movie.Type || 'Movie'}</span>
              <span>{movie.Year}</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/> {movie.Runtime}</span>
              <span className="flex items-center text-yellow-400"><Star className="w-4 h-4 mr-1 fill-yellow-400"/> {movie.imdbRating}</span>
            </div>
            <p className="text-gray-300 max-w-2xl text-lg leading-relaxed">{movie.Plot}</p>
             <div className="mt-4 flex flex-wrap gap-2">
                {movie.Genre?.split(', ').map(g => (
                  <span key={g} className="px-3 py-1 rounded-full border border-gray-600 text-xs text-gray-300">{g}</span>
                ))}
             </div>
             <div className="mt-6 flex gap-4">
                <a 
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(movie.Title + ' trailer')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  <PlayCircle className="w-5 h-5" /> Watch Trailer
                </a>
             </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-8 border-l-4 border-brand-500 pl-4">Book Tickets</h2>

        {/* Date Selector */}
        <div className="flex space-x-4 mb-8 overflow-x-auto pb-2">
          {dates.map((date, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedDate(idx)}
              className={`flex-shrink-0 w-24 h-24 rounded-xl flex flex-col items-center justify-center border-2 transition-all ${
                selectedDate === idx 
                  ? 'border-brand-500 bg-brand-500/10 text-brand-400 shadow-lg shadow-brand-500/20' 
                  : 'border-dark-700 bg-dark-800 text-gray-400 hover:border-gray-500'
              }`}
            >
              <span className="text-xs font-semibold uppercase">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="text-3xl font-bold">{date.getDate()}</span>
              <span className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</span>
            </button>
          ))}
        </div>

        {/* City Selector */}
        <div className="mb-8">
           <label className="text-sm text-gray-400 mb-2 block">Select City</label>
           <div className="flex flex-wrap gap-2">
             {CITIES.map(city => (
               <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCity === city ? 'bg-white text-dark-900' : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
                }`}
               >
                 {city}
               </button>
             ))}
           </div>
        </div>

        {/* Cinemas & Showtimes */}
        <div className="space-y-4">
          {filteredCinemas.map(cinema => (
             <div key={cinema.id} className="bg-dark-800 rounded-xl p-6 border border-dark-700">
               <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                 <div>
                   <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     {cinema.name}
                   </h3>
                   <p className="text-sm text-gray-400 mt-1 flex items-center"><MapPin className="w-3 h-3 mr-1"/> {cinema.location}</p>
                 </div>
                 <div className="text-xs text-gray-500 mt-2 md:mt-0">IDR 50,000 - 75,000</div>
               </div>
               
               <div className="h-px bg-dark-700 w-full mb-4"></div>

               <div className="flex flex-wrap gap-3">
                 {MOCK_SHOWTIMES.map(time => (
                   <button
                     key={time.id}
                     onClick={() => handleTimeSelect(cinema, time)}
                     className="group relative px-6 py-2 rounded-lg bg-dark-900 border border-dark-600 hover:border-brand-500 hover:bg-brand-500/10 transition-all text-center"
                   >
                     <span className="block font-bold text-white group-hover:text-brand-400">{time.time}</span>
                     <span className="text-[10px] text-gray-500 block">{time.hall}</span>
                   </button>
                 ))}
               </div>
             </div>
          ))}
          {filteredCinemas.length === 0 && (
            <div className="text-center text-gray-500 py-8">No cinemas found in {selectedCity}</div>
          )}
        </div>
      </div>
    </div>
  );
};