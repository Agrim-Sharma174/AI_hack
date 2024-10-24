import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_BASE_URL = 'http://localhost:5000';

const Dashboard = () => {
  const [sentimentData, setSentimentData] = useState({});
  const [featuresData, setFeaturesData] = useState({});
  const [discrepanciesData, setDiscrepanciesData] = useState([]);
  const [ratingSummary, setRatingSummary] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);

        const [sentimentResponse, featuresResponse, discrepanciesResponse, ratingSummaryResponse] =
          await Promise.all([
            axios.get(`${API_BASE_URL}/sentiment-distribution`),
            axios.get(`${API_BASE_URL}/extracted-features`),
            axios.get(`${API_BASE_URL}/rating-discrepancies`),
            axios.get(`${API_BASE_URL}/rating-summary`)
          ]);

        setSentimentData(sentimentResponse.data);
        setFeaturesData(featuresResponse.data);
        setDiscrepanciesData(discrepanciesResponse.data);
        setRatingSummary(ratingSummaryResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please ensure the API server is running on port 5000.');
      }
    };

    fetchData();
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  const sentimentChartData = {
    labels: Object.keys(sentimentData),
    datasets: [
      {
        label: 'Sentiment Distribution',
        data: Object.values(sentimentData),
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
      },
    ],
  };

  const featuresChartData = {
    labels: Object.keys(featuresData),
    datasets: [
      {
        label: 'Extracted Features',
        data: Object.values(featuresData),
        backgroundColor: ['#03a9f4', '#673ab7', '#ffeb3b'],
      },
    ],
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">Reviews Analysis</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Distribution */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Sentiment Distribution</h2>
          <div className="h-[300px]">
            <Bar
              data={sentimentChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Extracted Features */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Most Common Features Mentioned</h2>
          <div className="h-[300px]">
            <Bar
              data={featuresChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Rating Summary</h2>
          <div className="space-y-3">
            <p className="text-lg"><span className="font-semibold text-gray-600">Total Reviews:</span> {ratingSummary.total_reviews}</p>
            <p className="text-lg"><span className="font-semibold text-gray-600">Average Rating:</span> {ratingSummary.average_rating}</p>
            <p className="font-semibold text-gray-600">Sentiment Breakdown:</p>
            <ul className="list-disc list-inside text-gray-600">
              {Object.entries(ratingSummary.sentiment_counts || {}).map(([key, value]) => (
                <li key={key} className="text-gray-700">{key}: {value}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Rating Discrepancies */}
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Rating Discrepancies</h2>
          <p className="text-sm text-gray-600 mb-4">Reviews with unexpected ratings</p>
          <div className="h-[300px] overflow-y-auto pr-4">
            <ul className="space-y-4">
              {discrepanciesData.map((discrepancy, index) => (
                <li key={index} className="border-b pb-2">
                  <p className="font-semibold text-gray-700">Rating: {discrepancy.rating}</p>
                  <p className="text-sm text-gray-600">{discrepancy.review}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
