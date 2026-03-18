import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const SchedulePage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const times = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

  // Mock days for the current month
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  const handleConfirm = async () => {
    if (selectedDate && selectedTime) {
      const requestId = new URLSearchParams(window.location.search).get('requestId');
      
      if (!requestId) {
        toast.error('No request ID provided');
        return;
      }

      try {
        // Construct ISO date string
        const dateTime = new Date(2026, 2, selectedDate); // March (month 2)
        const [timeStr, period] = selectedTime.split(' ');
        let [hours, minutes] = timeStr.split(':');
        hours = parseInt(hours);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        dateTime.setHours(hours, parseInt(minutes));

        const response = await api.post('/sessions', {
          requestId,
          dateTime: dateTime.toISOString(),
          details: `Session scheduled for March ${selectedDate} at ${selectedTime}`
        });

        if (response.data.success) {
          toast.success(`Session scheduled successfully!`);
          navigate('/sessions');
        }
      } catch (error) {
        console.error('Error scheduling session:', error);
        toast.error(error.response?.data?.error || 'Failed to schedule session');
      }
    } else {
      toast.error('Please select both date and time');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-gray-900">Schedule a Session</h1>
        <p className="text-gray-500">Pick a time that works for both of you for the skill exchange.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Date Picker Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">March 2026</h3>
            <div className="flex space-x-2">
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="h-5 w-5 text-gray-500" /></button>
              <button className="p-1 hover:bg-gray-100 rounded"><ChevronRight className="h-5 w-5 text-gray-500" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {days.map(day => <span key={day} className="text-[10px] font-bold text-gray-400 uppercase">{day}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {/* Empty slots for start of month alignment (simulated) */}
            <div className="h-10"></div>
            {dates.map(date => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`h-10 rounded-lg text-sm font-medium transition-all ${
                  selectedDate === date 
                    ? 'bg-primary-600 text-white shadow-md' 
                    : 'hover:bg-primary-50 text-gray-700'
                }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        {/* Time Picker Card */}
        <div className="card p-6 flex flex-col">
          <h3 className="font-bold text-gray-900 mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary-600" /> Available Times
          </h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            {times.map(time => (
              <button
                key={time}
                onClick={() => setSelectedTime(time)}
                className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                  selectedTime === time 
                    ? 'bg-primary-50 border-primary-600 text-primary-700' 
                    : 'bg-white border-gray-200 text-gray-600 hover:border-primary-300'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm">
                <p className="text-gray-500">Selected Slot</p>
                <p className="font-bold text-gray-900">
                  {selectedDate ? `March ${selectedDate}` : 'Not selected'} {selectedTime ? `at ${selectedTime}` : ''}
                </p>
              </div>
              {selectedDate && selectedTime && <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Check className="h-5 w-5" /></div>}
            </div>
            <button 
              onClick={handleConfirm}
              className="w-full btn btn-primary py-3"
            >
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
