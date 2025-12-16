import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Booking, Cinema, Showtime, Movie } from '../types';
import { supabase } from '../lib/supabase';

interface StoreContextType {
  user: User | null;
  loadingAuth: boolean;
  login: (email: string, password: string) => Promise<{ error: any }>;
  register: (name: string, email: string, password: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  
  // Booking Flow State
  currentBooking: {
    movie: Movie | null;
    cinema: Cinema | null;
    date: Date | null;
    showtime: Showtime | null;
    selectedSeats: string[];
  };
  setBookingMovie: (movie: Movie) => void;
  setBookingCinema: (cinema: Cinema) => void;
  setBookingDate: (date: Date) => void;
  setBookingShowtime: (time: Showtime) => void;
  toggleSeat: (seatId: string) => void;
  resetBooking: () => void;
  
  // Completed Bookings
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Initialize Supabase Auth Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = (sbUser: any) => {
    setUser({
      id: sbUser.id,
      email: sbUser.email,
      name: sbUser.user_metadata?.name || sbUser.email.split('@')[0],
      isAdmin: sbUser.email.includes('admin')
    });
  };

  // Booking Flow
  const [currentBooking, setCurrentBooking] = useState({
    movie: null as Movie | null,
    cinema: null as Cinema | null,
    date: null as Date | null,
    showtime: null as Showtime | null,
    selectedSeats: [] as string[],
  });

  // History - Persist bookings (still local for now, but linked to Supabase User ID)
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('cix_bookings');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cix_bookings', JSON.stringify(bookings));
  }, [bookings]);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const register = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });
    return { error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const setBookingMovie = (movie: Movie) => setCurrentBooking(prev => ({ ...prev, movie, cinema: null, showtime: null, selectedSeats: [] }));
  const setBookingCinema = (cinema: Cinema) => setCurrentBooking(prev => ({ ...prev, cinema }));
  const setBookingDate = (date: Date) => setCurrentBooking(prev => ({ ...prev, date }));
  const setBookingShowtime = (showtime: Showtime) => setCurrentBooking(prev => ({ ...prev, showtime }));
  
  const toggleSeat = (seatId: string) => {
    setCurrentBooking(prev => {
      const isSelected = prev.selectedSeats.includes(seatId);
      if (isSelected) {
        return { ...prev, selectedSeats: prev.selectedSeats.filter(id => id !== seatId) };
      } else {
        return { ...prev, selectedSeats: [...prev.selectedSeats, seatId] };
      }
    });
  };

  const resetBooking = () => {
    setCurrentBooking({
      movie: null,
      cinema: null,
      date: null,
      showtime: null,
      selectedSeats: []
    });
  };

  const addBooking = (booking: Booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  return (
    <StoreContext.Provider value={{
      user, loadingAuth, login, register, logout,
      currentBooking, setBookingMovie, setBookingCinema, setBookingDate, setBookingShowtime, toggleSeat, resetBooking,
      bookings, addBooking
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};