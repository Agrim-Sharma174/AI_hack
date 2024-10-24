import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from textblob import TextBlob
import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Load the Gemini API key from the environment variable
API_KEY = os.getenv("GEMINI_API_KEY")
API_URL = "https://ai.google.dev/gemini-api/v1/analyze"

# Loading the Excel file
file_path = 'amazon_vfl_reviews_1.xlsx'

# Loading the data
df = pd.read_excel(file_path, engine='openpyxl')

# Function to call the GeminiAI API
def call_gemini_api(review_text):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    payload = {
        "prompt": review_text,
        "tasks": [
            "sentiment_analysis",
            "feature_extraction",
            "rating_discrepancy"
        ]
    }
    
    response = requests.post(API_URL, headers=headers, data=json.dumps(payload))
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Display the first few rows of the dataset
print(df.head())

# Check for missing values
print("Missing Values:\n", df.isnull().sum())

# Check data types of each column
print("\nData Types:\n", df.dtypes)

# Drop rows where 'review' or 'rating' are missing
df_cleaned = df.dropna(subset=['review', 'rating'])

# Check if missing values are handled
print("After Cleaning:\n", df_cleaned.isnull().sum())

# Plot a histogram of ratings to see distribution
sns.histplot(df_cleaned['rating'], bins=5, kde=False)
plt.title('Distribution of Ratings')
plt.xlabel('Rating')
plt.ylabel('Count')
plt.show()

# Calculate review length (number of words)
df_cleaned['review_length'] = df_cleaned['review'].apply(lambda x: len(x.split()))

# Plot distribution of review lengths
sns.histplot(df_cleaned['review_length'], bins=50, kde=False)
plt.title('Distribution of Review Lengths')
plt.xlabel('Number of Words')
plt.ylabel('Count')
plt.show()

# Function to get sentiment from review text
def get_sentiment(text):
    analysis = TextBlob(text)
    if analysis.sentiment.polarity > 0:
        return 'Positive'
    elif analysis.sentiment.polarity < 0:
        return 'Negative'
    else:
        return 'Neutral'

# Apply sentiment analysis to each review
df_cleaned['sentiment'] = df_cleaned['review'].apply(get_sentiment)

# Check the sentiment distribution
print(df_cleaned['sentiment'].value_counts())

# Plot the sentiment distribution
sns.countplot(x='sentiment', data=df_cleaned)
plt.title('Sentiment Distribution')
plt.show()

# Function to call the GeminiAI API
def call_gemini_api(review_text):
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    # Structure the request payload
    payload = {
        "prompt": review_text,
        "tasks": [
            "sentiment_analysis",
            "feature_extraction",
            "rating_discrepancy"
        ]
    }
    
    response = requests.post(API_URL, headers=headers, data=json.dumps(payload))
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None

# Testing the API with a single review
sample_review = df_cleaned['review'].iloc[0]  # Here, pick the first review for testing
api_response = call_gemini_api(sample_review)

# Print the API response to see the results
print("GeminiAI Response:", api_response)

# Apply the Gemini API to each review in the dataset
df_cleaned['gemini_insights'] = df_cleaned['review'].apply(call_gemini_api)

# Print the first few rows to verify
print(df_cleaned[['review', 'gemini_insights']].head())

# Extract product features from the Gemini insights
df_cleaned['extracted_features'] = df_cleaned['gemini_insights'].apply(lambda x: x.get('feature_extraction') if x else None)

# Display common product features mentioned
print("Common Product Features:\n", df_cleaned['extracted_features'].value_counts())

# Check for discrepancies in ratings (5-star reviews with negative sentiment)
df_discrepancy = df_cleaned[(df_cleaned['rating'] == 5) & (df_cleaned['sentiment'] == 'Negative')]
print("Rating Discrepancies:\n", df_discrepancy[['review', 'rating']])

df_cleaned['gemini_insights'] = df_cleaned['review_text'].apply(call_gemini_api)

# Print a few rows to verify
print(df_cleaned[['review_text', 'gemini_insights']].head())

df_cleaned['extracted_features'] = df_cleaned['gemini_insights'].apply(lambda x: x.get('feature_extraction') if x else None)
print("Extracted Features:\n", df_cleaned['extracted_features'].value_counts())

df_discrepancy = df_cleaned[(df_cleaned['rating'] == 5) & (df_cleaned['sentiment'] == 'Negative')]
print("Rating Discrepancies:\n", df_discrepancy[['review_text', 'rating']])

# Plot a bar chart for the extracted features
sns.countplot(y='extracted_features', data=df_cleaned, order=df_cleaned['extracted_features'].value_counts().index)
plt.title('Most Common Features Mentioned')
plt.show()
