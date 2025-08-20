import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { UserContext } from '../../providers/UserProvider';
import axiosInstance from '@/utils/axios';
import DatePickerWithRange from './DatePickerWithRange';
import CheckInOutCard from './CheckInOutCard';
import PaymentForm from './PaymentForm';

const BookingWidget = ({ place }) => {
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [bookingData, setBookingData] = useState({
    noOfGuests: 1,
    name: '',
    phone: '',
  });
  const [redirect, setRedirect] = useState('');
  const [paymentClientSecret, setPaymentClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const auth = useContext(UserContext);
  const { user } = auth;

  const { noOfGuests, name, phone } = bookingData;
  const { _id: id, price } = place;

  useEffect(() => {
    if (user) {
      setBookingData({ ...bookingData, name: user.name });
    }
  }, [user]);

  const numberOfNights =
    dateRange.from && dateRange.to
      ? differenceInDays(
          new Date(dateRange.to).setHours(0, 0, 0, 0),
          new Date(dateRange.from).setHours(0, 0, 0, 0),
        )
      : 0;

  // handle booking form
  const handleBookingData = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBooking = async () => {
    // User must be signed in to book place
    if (!user) {
      return setRedirect(`/login`);
    }

    // BOOKING DATA VALIDATION
    if (numberOfNights < 1) {
      return toast.error('Please select valid dates');
    } else if (noOfGuests < 1) {
      return toast.error("No. of guests can't be less than 1");
    } else if (noOfGuests > place.maxGuests) {
      return toast.error(`Allowed max. no. of guests: ${place.maxGuests}`);
    } else if (name.trim() === '') {
      return toast.error("Name can't be empty");
    } else if (phone.trim() === '') {
      return toast.error("Phone can't be empty");
    }

    try {
      // Step 1: Create a PaymentIntent for this booking
      setIsPaying(true);
      const piRes = await axiosInstance.post('/payments/create-intent', {
        placeId: id,
        checkIn: dateRange.from,
        checkOut: dateRange.to,
        guests: Number(noOfGuests)
      });
      const { clientSecret, paymentIntentId: pid } = piRes.data?.data || {};
      if (!clientSecret || !pid) {
        setIsPaying(false);
        return toast.error('Failed to start payment');
      }
      setPaymentClientSecret(clientSecret);
      setPaymentIntentId(pid);
      // Stripe form will render; on success we'll call confirm endpoint to create booking
    } catch (error) {
      setIsPaying(false);
      toast.error(error?.response?.data?.message || 'Failed to start payment');
      console.log('Payment intent error: ', error);
    }
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    try {
      // Step 2: Confirm on backend and create booking
      const response = await axiosInstance.post('/payments/confirm', {
        paymentIntentId,
        name,
        phone
      });
      const bookingId = response.data?.data?.booking?._id;
      if (bookingId) {
        toast('Payment successful! Booking confirmed.');
        setRedirect(`/account/bookings/${bookingId}`);
      } else {
        toast.error('Booking confirmation failed');
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to confirm booking');
      console.log('Confirm booking error: ', e);
    } finally {
      setIsPaying(false);
      setPaymentClientSecret('');
      setPaymentIntentId('');
    }
  };

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <div className="text-center text-xl">
        Price: <span className="font-semibold">₹{place.price}</span> / per night
      </div>
      <div className="mt-4 rounded-2xl border">
        <div className="flex w-full ">
          <DatePickerWithRange setDateRange={setDateRange} />
        </div>
        <div className="border-t py-3 px-4">
          <label>Number of guests: </label>
          <input
            type="number"
            name="noOfGuests"
            placeholder={`Max. guests: ${place.maxGuests}`}
            min={1}
            max={place.maxGuests}
            value={noOfGuests}
            onChange={handleBookingData}
          />
        </div>
        <div className="border-t py-3 px-4">
          <label>Your full name: </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={handleBookingData}
          />
          <label>Phone number: </label>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={handleBookingData}
          />
        </div>
          <div className="border-t py-3 px-4">
            <CheckInOutCard
              checkIn={dateRange.from}
              checkOut={dateRange.to}
              guests={Number(noOfGuests) || 1}
              pricePerNight={place.price}
              nights={numberOfNights}
              currencySymbol="₹"
            />
          </div>
      </div>
      {!paymentClientSecret ? (
        <button onClick={handleBooking} className="primary mt-4">
          {isPaying ? 'Starting payment…' : 'Book this place'}
          {numberOfNights > 0 && <span> ₹{numberOfNights * place.price}</span>}
        </button>
      ) : (
        <div className="mt-4">
          <PaymentForm clientSecret={paymentClientSecret} onSuccess={handlePaymentSuccess} />
        </div>
      )}
    </div>
  );
};

export default BookingWidget;
