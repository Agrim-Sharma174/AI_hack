import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const endpoints = {
          'positive': 'http://127.0.0.1:5000/reviews?sentiment=positive',
          'negative': 'http://127.0.0.1:5000/reviews?sentiment=negative',
          'neutral': 'http://127.0.0.1:5000/reviews?sentiment=neutral',
          'slang': 'http://127.0.0.1:5000/reviews?has_slang=true',
          'discrepancies': 'http://127.0.0.1:5000/rating-discrepancies',
          'all': 'http://127.0.0.1:5000/reviews'
        };

        const response = await axios.get(endpoints[filter] || endpoints.all);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-4xl font-bold text-gray-800">Product Reviews</h1>

        {/* Filter Dropdown */}
        <div className="w-full max-w-xs">
          <select
            value={filter}
            onChange={handleFilterChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Reviews</option>
            <option value="positive">Positive Reviews</option>
            <option value="negative">Negative Reviews</option>
            <option value="neutral">Neutral Reviews</option>
            <option value="slang">Reviews with Slang</option>
            <option value="discrepancies">Rating Discrepancies</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Rating: {review.rating}★</p>
                    {review.sentiment && (
                      <span className={`text-xs px-2 py-1 rounded-full ${review.sentiment === 'Positive' ? 'bg-green-100 text-green-800' :
                        review.sentiment === 'Negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                        {review.sentiment}
                      </span>
                    )}
                  </div>
                  {review.slang_words?.length > 0 && (
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Contains Slang
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600">{review.review}</p>
                {review.slang_words?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Identified slang words:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {review.slang_words.map((word, idx) => (
                        <span key={idx} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsPage;