export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Genre?: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  imdbRating?: string;
  Type?: string;
}

export interface Cinema {
  id: string;
  name: string;
  location: string;
  city: string;
}

export interface Showtime {
  id: string;
  time: string;
  price: number;
  hall: string;
}

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
  SELECTED = 'SELECTED',
  PREMIUM = 'PREMIUM' // Costs extra
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  priceModifier: number;
}

export interface Booking {
  id: string;
  userId: string;
  movie: Movie;
  cinema: Cinema;
  showtime: Showtime;
  date: string;
  seats: string[];
  totalPrice: number;
  qrCode: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}