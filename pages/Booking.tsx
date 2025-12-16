import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/Store';
import { generateSeats } from '../constants';
import { Seat, SeatStatus, Booking as BookingType } from '../types';
import { Check, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';

// Steps: 0 = Seat Selection, 1 = Payment, 2 = Success
const STEPS = ['Choose Seats', 'Payment', 'Processing'];

export const Booking = () => {
  const navigate = useNavigate();
  const { currentBooking, toggleSeat, resetBooking, addBooking, user } = useStore();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [step, setStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Initialize seats on mount
  useEffect(() => {
    if (!currentBooking.movie) {
      navigate('/');
      return;
    }
    setSeats(generateSeats());
  }, [currentBooking.movie, navigate]);

  // Handle local seat selection UI state
  const handleSeatClick = (seat: Seat) => {
    if (seat.status === SeatStatus.BOOKED) return;
    
    // Toggle in global state
    toggleSeat(seat.id);

    // Toggle visual state locally (though normally we'd sync entirely from props)
    setSeats(prev => prev.map(s => {
      if (s.id === seat.id) {
        if (s.status === SeatStatus.SELECTED) return { ...s, status: SeatStatus.AVAILABLE }; // Naive toggle back to available
        // Actually, better to determine status based on global "selectedSeats" array, 
        // but for this mock, we'll just toggle purely.
        return { ...s, status: s.status === SeatStatus.SELECTED ? SeatStatus.AVAILABLE : SeatStatus.SELECTED };
      }
      return s;
    }));
  };

  // Sync seats with global selection
  useEffect(() => {
    setSeats(prev => prev.map(s => ({
      ...s,
      status: currentBooking.selectedSeats.includes(s.id) 
        ? SeatStatus.SELECTED 
        : (s.status === SeatStatus.SELECTED ? SeatStatus.AVAILABLE : s.status)
    })));
  }, [currentBooking.selectedSeats]);

  const basePrice = currentBooking.showtime?.price || 0;
  
  const calculateTotal = () => {
    return currentBooking.selectedSeats.reduce((acc, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return acc + basePrice + (seat?.priceModifier || 0);
    }, 0);
  };

  const totalPrice = calculateTotal();
  const bookingFee = 5000;
  const grandTotal = totalPrice + bookingFee;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      const newBooking: BookingType = {
        id: 'B-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        userId: user?.id || 'guest',
        movie: currentBooking.movie!,
        cinema: currentBooking.cinema!,
        showtime: currentBooking.showtime!,
        date: currentBooking.date!.toISOString(),
        seats: currentBooking.selectedSeats,
        totalPrice: grandTotal,
        qrCode: `CIX-${Date.now()}`,
        timestamp: Date.now()
      };
      
      addBooking(newBooking);
      resetBooking();
      navigate(`/ticket/${newBooking.id}`);
    }, 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8 px-8">
        {STEPS.map((label, idx) => (
           <div key={label} className="flex flex-col items-center">
             <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-2 ${
               step >= idx ? 'bg-brand-500 text-white' : 'bg-dark-700 text-gray-500'
             }`}>
               {idx + 1}
             </div>
             <span className={`text-xs ${step >= idx ? 'text-brand-400' : 'text-gray-600'}`}>{label}</span>
           </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {step === 0 && (
            <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700">
               <div className="w-full h-2 bg-gray-600 rounded-full mb-12 relative shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  <div className="absolute -top-6 w-full text-center text-xs text-gray-400 uppercase tracking-widest">Screen</div>
               </div>

               <div className="grid grid-cols-10 gap-2 mb-8 mx-auto max-w-sm sm:max-w-md">
                 {seats.map(seat => (
                   <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === SeatStatus.BOOKED}
                    className={`
                      aspect-square rounded-t-lg rounded-b-md text-[10px] font-medium transition-all
                      ${seat.status === SeatStatus.AVAILABLE ? 'bg-dark-600 hover:bg-brand-500/50 text-white' : ''}
                      ${seat.status === SeatStatus.BOOKED ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : ''}
                      ${seat.status === SeatStatus.SELECTED ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40 transform scale-110' : ''}
                      ${seat.status === SeatStatus.PREMIUM && seat.status !== SeatStatus.SELECTED && seat.status !== SeatStatus.BOOKED ? 'bg-purple-900 border border-purple-500/30' : ''}
                    `}
                   >
                     {seat.row}{seat.number}
                   </button>
                 ))}
               </div>

               <div className="flex justify-center gap-6 text-xs text-gray-400">
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-dark-600 rounded"></div> Available</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-brand-500 rounded"></div> Selected</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-gray-800 rounded"></div> Booked</div>
                  <div className="flex items-center gap-2"><div className="w-4 h-4 bg-purple-900 rounded"></div> Premium</div>
               </div>
            </div>
          )}

          {step === 1 && (
             <form id="payment-form" onSubmit={handlePayment} className="bg-dark-800 rounded-2xl p-6 border border-dark-700 space-y-6">
                <h3 className="text-xl font-bold">Payment Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center p-4 border border-brand-500/30 bg-brand-500/5 rounded-xl cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      checked={paymentMethod === 'card'} 
                      onChange={() => setPaymentMethod('card')}
                      className="text-brand-500 focus:ring-brand-500 bg-dark-900 border-dark-600"
                    />
                    <div className="ml-4 flex-1">
                      <span className="block font-medium text-white">Credit / Debit Card</span>
                      <span className="text-sm text-gray-400">Visa, Mastercard, JCB</span>
                    </div>
                    <CreditCard className="text-brand-500" />
                  </div>
                  
                  <div className="flex items-center p-4 border border-dark-600 rounded-xl opacity-60">
                    <input type="radio" name="payment" disabled className="text-brand-500 bg-dark-900 border-dark-600"/>
                    <div className="ml-4 flex-1">
                      <span className="block font-medium text-white">E-Wallet (Coming Soon)</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Card Number</label>
                    <input type="text" placeholder="4242 4242 4242 4242" className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Name on Card</label>
                    <input type="text" placeholder="JOHN DOE" className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-sm" required />
                  </div>
                  <div>
                     <label className="block text-xs text-gray-400 mb-1">Expiry</label>
                    <input type="text" placeholder="MM/YY" className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-sm" required />
                  </div>
                  <div>
                     <label className="block text-xs text-gray-400 mb-1">CVV</label>
                    <input type="text" placeholder="123" className="w-full bg-dark-900 border border-dark-600 rounded-lg p-2.5 text-sm" required />
                  </div>
                </div>
             </form>
          )}

          {step === 2 && (
             <div className="bg-dark-800 rounded-2xl p-12 border border-dark-700 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-16 h-16 text-brand-500 animate-spin mb-6" />
                <h3 className="text-2xl font-bold text-white mb-2">Processing Payment</h3>
                <p className="text-gray-400">Please do not close this window...</p>
             </div>
          )}

        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
           <div className="bg-dark-800 rounded-2xl p-6 border border-dark-700 sticky top-24">
              <h3 className="text-lg font-bold mb-4">Order Summary</h3>
              <div className="flex gap-4 mb-4">
                 <img src={currentBooking.movie?.Poster} alt="Poster" className="w-16 h-24 object-cover rounded bg-dark-900" />
                 <div>
                    <h4 className="font-bold line-clamp-2">{currentBooking.movie?.Title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{currentBooking.cinema?.name}</p>
                    <p className="text-xs text-gray-400">{currentBooking.date?.toLocaleDateString()} • {currentBooking.showtime?.time}</p>
                 </div>
              </div>
              
              <div className="space-y-2 border-t border-dark-600 pt-4 mb-4 text-sm">
                 <div className="flex justify-between">
                    <span className="text-gray-400">Tickets ({currentBooking.selectedSeats.length})</span>
                    <span>IDR {totalPrice.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Seats</span>
                    <span className="text-right max-w-[120px] truncate">{currentBooking.selectedSeats.join(', ')}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-gray-400">Booking Fee</span>
                    <span>IDR {bookingFee.toLocaleString()}</span>
                 </div>
              </div>
              
              <div className="border-t border-dashed border-dark-600 pt-4 mb-6">
                 <div className="flex justify-between items-end">
                    <span className="text-gray-400 font-medium">Total</span>
                    <span className="text-xl font-bold text-brand-400">IDR {grandTotal.toLocaleString()}</span>
                 </div>
              </div>

              {step === 0 && (
                <button 
                  onClick={() => setStep(1)}
                  disabled={currentBooking.selectedSeats.length === 0}
                  className="w-full bg-brand-600 hover:bg-brand-500 disabled:bg-dark-600 disabled:text-gray-500 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  Proceed to Payment
                </button>
              )}
              {step === 1 && (
                 <button 
                  form="payment-form"
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 rounded-xl transition-colors"
                 >
                   Pay IDR {grandTotal.toLocaleString()}
                 </button>
              )}
               {step > 0 && step < 2 && (
                 <button onClick={() => setStep(step - 1)} className="w-full mt-2 text-sm text-gray-400 hover:text-white">
                    Cancel
                 </button>
               )}
           </div>
        </div>
      </div>
    </div>
  );
};