import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Send, ShieldCheck, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ReviewPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please provide a star rating');
      return;
    }

    const sessionId = new URLSearchParams(window.location.search).get('sessionId');
    const partnerId = new URLSearchParams(window.location.search).get('partnerId');

    if (!sessionId || !partnerId) {
      toast.error('Missing session or partner information');
      return;
    }

    try {
      const response = await api.post('/reviews', {
        sessionId,
        revieweeId: partnerId,
        rating,
        comment
      });

      if (response.data.success) {
        toast.success('Thank you for your feedback! Review submitted.');
        navigate('/sessions');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.error || 'Failed to submit review');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-500">
      <div className="card p-8 md:p-12 text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-yellow-50 rounded-full mb-4">
            <Star className="h-12 w-12 text-yellow-500 fill-current" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">How was your session?</h1>
          <p className="text-gray-500">Your feedback helps partners improve and helps the community grow.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Star Input */}
          <div className="flex flex-col items-center space-y-4">
            <p className="text-sm font-bold text-gray-700 uppercase tracking-wider">Rate your partner</p>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className="focus:outline-none transition-transform hover:scale-125"
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`h-10 w-10 ${
                      star <= (hover || rating) ? 'text-yellow-500 fill-current' : 'text-gray-200'
                    }`} 
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-yellow-600">
              {rating === 5 ? 'Excellent!' : rating === 4 ? 'Great' : rating === 3 ? 'Good' : rating === 2 ? 'Fair' : rating === 1 ? 'Poor' : 'Select a rating'}
            </p>
          </div>

          <div className="space-y-4 text-left">
            <label className="block text-sm font-bold text-gray-700">Detailed Feedback</label>
            <textarea
              className="input-field min-h-[150px]"
              placeholder="What did you learn? Was the partner helpful and clear?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="p-4 bg-primary-50 rounded-xl flex items-start text-left">
            <ShieldCheck className="h-5 w-5 text-primary-600 mr-3 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-primary-800">Private Recognition</p>
              <p className="text-[11px] text-primary-600">This feedback is anonymized before being shared with the partner to ensure honest growth.</p>
            </div>
          </div>

          <div className="flex space-x-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="flex-1 py-3 text-gray-500 font-bold hover:text-gray-900"
            >
              Skip
            </button>
            <button 
              type="submit" 
              className="flex-1 btn btn-primary py-3 flex items-center justify-center"
            >
              <Send className="h-4 w-4 mr-2" /> Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewPage;
