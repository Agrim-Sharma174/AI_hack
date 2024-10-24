# Amazon Reviews Analysis Project

This project analyzes Amazon reviews by combining a Flask-based backend for data processing and API creation with a React-based frontend for visualization. The project includes sentiment analysis, feature extraction, rating discrepancies detection, and visualization of insights using interactive charts. Here's an overview of the approach:

## 1. **Data Processing in Python (Backend - `dataa.py`)**
   - **Loading and Cleaning Data**: 
     - The project uses pandas to load an Excel file (`amazon_vfl_reviews_1.xlsx`) containing reviews and ratings. Missing values are handled by dropping rows where reviews or ratings are absent.

   - **Exploratory Data Analysis**: 
     - Seaborn and Matplotlib are used to visualize the distribution of ratings and review lengths, providing insights into the dataset.

   - **Sentiment Analysis**: 
     - `TextBlob` is applied to classify reviews into Positive, Negative, or Neutral sentiments.

   - **Calling External API (GeminiAI)**: 
     - The project integrates the Google Gemini API to enhance reviews by adding sentiment analysis, feature extraction, and identifying rating discrepancies.

   - **Rating Discrepancy Detection**: 
     - It detects inconsistencies where a 5-star rating is associated with a negative sentiment.

   - **Product Feature Extraction**: 
     - Common product features are extracted from the reviews, providing insights into frequently discussed aspects of the product.

   - **Final Data Preparation**: 
     - The cleaned and enriched dataset, including review text, sentiment, slang words, and extracted features, is prepared for further analysis.

## 2. **Flask API (Backend - `app.py`)**
   - A Flask application serves the processed review data through various endpoints:
     - **`/reviews`**: Fetches reviews filtered by sentiment or slang word usage.
     - **`/sentiment-distribution`**: Provides the distribution of Positive, Neutral, and Negative reviews.
     - **`/extracted-features`**: Returns the count of common product features extracted from the reviews.
     - **`/rating-discrepancies`**: Identifies and returns reviews with mismatched ratings and sentiments.
     - **`/rating-summary`**: Summarizes the total reviews, average rating, and sentiment distribution.

## 3. **Frontend React Dashboard (Frontend - `Dashboard.js`)**
   - **Data Fetching**: 
     - The React frontend fetches data from the Flask backend using Axios, including sentiment distribution, extracted features, rating discrepancies, and rating summaries.

   - **Visualization (Charts)**: 
     - `Chart.js` is used for visualizing:
       - **Sentiment Distribution**: A bar chart displaying the number of positive, neutral, and negative reviews.
       - **Extracted Features**: Another bar chart showcasing the most frequently mentioned product features in the reviews.

   - **Error Handling**: 
     - If there’s an API failure (e.g., the Flask server isn’t running), an error message is displayed, ensuring a smooth user experience.

## 4. **Frontend-Backend Integration**
   - The Flask backend functions as an API that powers the React frontend, enabling seamless interaction between Python’s data processing and the user interface in React.
   - The frontend dynamically updates visualizations based on the latest API responses.

## Key Functionalities Implemented:
   - **Sentiment Analysis & Visualization**: Visualizing the distribution of review sentiments (positive, neutral, negative).
   - **Feature Extraction**: Identifying and showcasing common product features mentioned in the reviews.
   - **Rating Discrepancies Detection**: Highlighting inconsistencies between review ratings and sentiments.
   - **API Integration**: Implementing a robust connection between the Flask backend and the React frontend using REST APIs.
   - **Data Visualization**: Using charts and graphs to make review insights easy to understand.

## Final Note
This project leverages data analysis, machine learning, API integration, and a user-friendly interface to analyze Amazon reviews. Through sentiment analysis, feature extraction, and rating discrepancy detection, users can gain valuable insights into product reviews.
