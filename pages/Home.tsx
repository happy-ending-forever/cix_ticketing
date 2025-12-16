import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { fetchMovieByTitle, searchMovies } from '../services/omdbService';
import { INITIAL_SEARCH_TERMS, COMING_SOON_TERMS } from '../constants';
import { Movie } from '../types';
import { Star } from 'lucide-react';

const MovieCard: React.FC<{ movie: Movie; comingSoon?: boolean }> = ({ movie, comingSoon = false }) => (
  <Link to={`/movie/${movie.imdbID}`} className="group relative block bg-dark-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:-translate-y-1 hover:shadow-brand-500/20">
    <div className="aspect-[2/3] overflow-hidden">
      <img 
        src={movie.Poster !== 'N/A' ? movie.Poster : 'https://picsum.photos/300/450?text=No+Poster'} 
        alt={movie.Title} 
        className="w-full h-full object-cover transition-opacity group-hover:opacity-80"
        loading="lazy"
      />
      {!comingSoon && (
        <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-1 rounded-md flex items-center space-x-1">
          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          <span className="text-xs font-bold text-white">{movie.imdbRating || 'N/A'}</span>
        </div>
      )}
    </div>
    <div className="p-4">
      <h3 className="font-bold text-white truncate group-hover:text-brand-400 transition-colors">{movie.Title}</h3>
      <p className="text-sm text-gray-400 mt-1">{movie.Year} • {movie.Genre ? movie.Genre.split(',')[0] : 'Movie'}</p>
      {comingSoon && <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider bg-brand-900 text-brand-300 px-2 py-0.5 rounded">Coming Soon</span>}
    </div>
  </Link>
);

export const Home = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search');

  const [nowShowing, setNowShowing] = useState<Movie[]>([]);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      
      if (query) {
        const results = await searchMovies(query);
        setSearchResults(results);
      } else {
        // Fetch specific popular movies for "Now Showing" to simulate a curated list
        const nsPromises = INITIAL_SEARCH_TERMS.map(term => fetchMovieByTitle(term));
        const nsResults = await Promise.all(nsPromises);
        setNowShowing(nsResults.filter((m): m is Movie => m !== null));

        const csPromises = COMING_SOON_TERMS.map(term => fetchMovieByTitle(term));
        const csResults = await Promise.all(csPromises);
        setComingSoon(csResults.filter((m): m is Movie => m !== null));
      }
      
      setLoading(false);
    };

    loadInitialData();
  }, [query]);

  const scrollToMovies = () => {
    const element = document.getElementById('now-showing');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Promo Banner - Only on main view */}
      {!query && (
        <div className="relative rounded-2xl overflow-hidden h-64 md:h-96 bg-gradient-to-r from-dark-800 to-dark-900">
           {/* Fallback banner content */}
           <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 z-10">
              <span className="text-brand-400 font-bold tracking-widest uppercase text-sm mb-2">New Release</span>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white max-w-lg mb-4">Experience the Magic of Cinema</h1>
              <p className="text-gray-300 max-w-md mb-6">Book your tickets now for the latest blockbusters in immersive IMAX and Dolby Atmos.</p>
              <button 
                onClick={scrollToMovies}
                className="bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-8 rounded-full w-max transition-all shadow-lg shadow-brand-500/30 cursor-pointer"
              >
                Book Now
              </button>
           </div>
           <div className="absolute inset-0 bg-black/40 z-0"></div>
           <img 
              src="https://picsum.photos/1200/600?grayscale&blur=2" 
              alt="Banner" 
              className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
        </div>
      )}

      {query ? (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="w-1 h-6 bg-brand-500 mr-3 rounded-full"></span>
            Search Results for "{query}"
          </h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {searchResults.map(movie => <MovieCard key={movie.imdbID} movie={movie} />)}
            </div>
          ) : (
             <div className="text-center py-12 text-gray-400">No movies found matching your search.</div>
          )}
        </section>
      ) : (
        <>
          <section id="now-showing">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold flex items-center">
                <span className="w-1 h-6 bg-brand-500 mr-3 rounded-full"></span>
                Now Showing
              </h2>
              <Link to="/?search=movie" className="text-sm text-brand-400 hover:text-brand-300">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {nowShowing.map(movie => <MovieCard key={movie.imdbID} movie={movie} />)}
            </div>
          </section>

          <section>
             <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="w-1 h-6 bg-brand-500 mr-3 rounded-full"></span>
                Coming Soon
              </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {comingSoon.map(movie => <MovieCard key={movie.imdbID} movie={movie} comingSoon />)}
            </div>
          </section>
        </>
      )}
    </div>
  );
};