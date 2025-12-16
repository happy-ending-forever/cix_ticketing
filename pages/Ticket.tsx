import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useStore } from '../context/Store';
import { Download, Share2, CheckCircle, Home } from 'lucide-react';

export const Ticket = () => {
  const { id } = useParams();
  const { bookings } = useStore();
  const ticket = bookings.find(b => b.id === id);

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-400">Ticket not found</h2>
        <Link to="/" className="mt-4 text-brand-500 hover:underline">Return Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 py-12 px-4 flex justify-center items-start">
       <div className="bg-white text-dark-900 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl relative">
          
          {/* Success Banner */}
          <div className="bg-brand-500 p-6 text-center text-white">
             <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-3">
               <CheckCircle className="w-10 h-10" />
             </div>
             <h2 className="text-2xl font-bold">Booking Successful!</h2>
             <p className="opacity-90 text-sm mt-1">Order ID: {ticket.id}</p>
          </div>

          <div className="p-8">
             {/* Movie Info */}
             <h3 className="text-2xl font-black uppercase leading-tight mb-2">{ticket.movie.Title}</h3>
             <p className="text-gray-500 text-sm mb-6">{ticket.movie.Genre}</p>

             <div className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm mb-8">
                <div>
                   <p className="text-gray-400 uppercase text-xs font-bold tracking-wider">Date</p>
                   <p className="font-bold text-lg">{new Date(ticket.date).toLocaleDateString()}</p>
                </div>
                <div>
                   <p className="text-gray-400 uppercase text-xs font-bold tracking-wider">Time</p>
                   <p className="font-bold text-lg">{ticket.showtime.time}</p>
                </div>
                <div>
                   <p className="text-gray-400 uppercase text-xs font-bold tracking-wider">Cinema</p>
                   <p className="font-semibold">{ticket.cinema.name}</p>
                   <p className="text-xs text-gray-500">{ticket.cinema.location}</p>
                </div>
                 <div>
                   <p className="text-gray-400 uppercase text-xs font-bold tracking-wider">Seats</p>
                   <p className="font-bold text-lg">{ticket.seats.join(', ')}</p>
                </div>
             </div>

             {/* Dashed Line */}
             <div className="relative flex items-center justify-center mb-8">
                <div className="absolute left-0 -ml-12 w-8 h-8 rounded-full bg-dark-900"></div>
                <div className="absolute right-0 -mr-12 w-8 h-8 rounded-full bg-dark-900"></div>
                <div className="w-full border-b-2 border-dashed border-gray-300"></div>
             </div>

             {/* QR Code */}
             <div className="flex flex-col items-center justify-center">
               <QRCodeSVG value={ticket.qrCode} size={150} />
               <p className="mt-4 text-xs text-gray-400 uppercase tracking-widest">Scan at entrance</p>
               <p className="font-mono text-sm font-bold mt-1">{ticket.qrCode}</p>
             </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 p-6 flex justify-between gap-4 border-t border-gray-200">
             <button className="flex-1 flex flex-col items-center gap-1 text-gray-600 hover:text-brand-600">
                <Download className="w-5 h-5" />
                <span className="text-xs font-bold">Save</span>
             </button>
             <button className="flex-1 flex flex-col items-center gap-1 text-gray-600 hover:text-brand-600">
                <Share2 className="w-5 h-5" />
                <span className="text-xs font-bold">Share</span>
             </button>
             <Link to="/" className="flex-1 flex flex-col items-center gap-1 text-gray-600 hover:text-brand-600">
                <Home className="w-5 h-5" />
                <span className="text-xs font-bold">Home</span>
             </Link>
          </div>
       </div>
    </div>
  );
};