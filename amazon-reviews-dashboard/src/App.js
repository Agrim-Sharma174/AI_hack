import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ReviewsPage from './components/ReviewsPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm mb-8">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-gray-900">Dashboard</Link>
              <Link to="/reviews" className="text-gray-700 hover:text-gray-900">Reviews</Link>
            </div>
          </div>
        </nav>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;