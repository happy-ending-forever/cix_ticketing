import { Cinema, Seat, SeatStatus } from './types';

// NOTE: using a public test key. In production, use process.env.REACT_APP_OMDB_API_KEY
export const OMDB_API_KEY = 'b9bd48a6'; 
export const OMDB_BASE_URL = 'https://www.omdbapi.com/';

// Initial movies to populate "Now Showing" since OMDB is search-based
export const INITIAL_SEARCH_TERMS = ['Dune: Part Two', 'Civil War', 'Furiosa', 'Challengers'];
export const COMING_SOON_TERMS = ['Deadpool', 'Alien', 'Gladiator'];

export const CITIES = ['Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Medan'];

export const MOCK_CINEMAS: Cinema[] = [
  { id: 'c1', name: 'CIX Grand Indonesia', location: 'Grand Indonesia Mall, Lv 8', city: 'Jakarta' },
  { id: 'c2', name: 'CIX Central Park', location: 'Central Park Mall', city: 'Jakarta' },
  { id: 'c3', name: 'CIX Paris Van Java', location: 'PVJ Mall', city: 'Bandung' },
  { id: 'c4', name: 'CIX Tunjungan', location: 'Tunjungan Plaza 5', city: 'Surabaya' },
  { id: 'c5', name: 'CIX Beachwalk', location: 'Beachwalk Kuta', city: 'Bali' },
];

export const MOCK_SHOWTIMES = [
  { id: 't1', time: '10:30', price: 50000, hall: 'Hall 1' },
  { id: 't2', time: '13:00', price: 50000, hall: 'Hall 1' },
  { id: 't3', time: '15:30', price: 60000, hall: 'Hall 2 (Dolby)' },
  { id: 't4', time: '18:30', price: 75000, hall: 'Hall 1' },
  { id: 't5', time: '21:00', price: 75000, hall: 'Hall 3 (IMAX)' },
];

export const generateSeats = (): Seat[] => {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seats: Seat[] = [];
  
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= 10; i++) {
      let status = SeatStatus.AVAILABLE;
      // Randomly book some seats
      if (Math.random() < 0.2) status = SeatStatus.BOOKED;

      let priceModifier = 0;
      if (rowIndex >= 6) { // Back rows are premium
        // status = Math.random() < 0.2 ? SeatStatus.BOOKED : SeatStatus.PREMIUM;
        priceModifier = 15000;
      }

      seats.push({
        id: `${row}${i}`,
        row,
        number: i,
        status,
        priceModifier
      });
    }
  });
  return seats;
};