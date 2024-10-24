from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

# Loading and cleaning data
try:
    file_path = 'amazon_vfl_reviews_1.xlsx'
    df = pd.read_excel(file_path, engine='openpyxl')
    df_cleaned = df.dropna(subset=['review', 'rating'])
except Exception as e:
    print(f"Error loading data: {e}")
    df_cleaned = pd.DataFrame()

# Sentiment analysis function
def get_sentiment(text):
    analysis = TextBlob(str(text))
    if analysis.sentiment.polarity > 0:
        return 'Positive'
    elif analysis.sentiment.polarity < 0:
        return 'Negative'
    else:
        return 'Neutral'

# Initialize sentiment column
df_cleaned['sentiment'] = df_cleaned['review'].apply(get_sentiment)

# Slang words list
slang_words = ["crap", "sucks", "hell", "damn", "wtf"]

def identify_slang(text):
    words = str(text).lower().split()
    return [word for word in words if word in slang_words]

df_cleaned['slang_words'] = df_cleaned['review'].apply(identify_slang)
df_cleaned['cleaned_review'] = df_cleaned['review'].apply(
    lambda x: ' '.join([word for word in str(x).split() if word.lower() not in slang_words])
)

def extract_features(text):
    features = ["battery", "durability", "design", "performance", "price"]
    return [feature for feature in features if feature in str(text).lower()]

df_cleaned['extracted_features'] = df_cleaned['review'].apply(extract_features)

@app.route('/')
def index():
    return jsonify({'status': 'success', 'message': 'Welcome to the Amazon Reviews Analysis API!'})

@app.route('/reviews', methods=['GET'])
def get_reviews():
    try:
        sentiment = request.args.get('sentiment', '').capitalize()
        has_slang = request.args.get('has_slang', '').lower() == 'true'
        
        filtered_df = df_cleaned.copy()
        
        if sentiment in ['Positive', 'Negative', 'Neutral']:
            filtered_df = filtered_df[filtered_df['sentiment'] == sentiment]
        elif has_slang:
            filtered_df = filtered_df[filtered_df['slang_words'].apply(len) > 0]
            
        reviews = filtered_df[['review', 'rating', 'sentiment', 'slang_words']].to_dict(orient='records')
        return jsonify(reviews)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/sentiment-distribution', methods=['GET'])
def sentiment_distribution():
    try:
        sentiment_counts = df_cleaned['sentiment'].value_counts().to_dict()
        return jsonify(sentiment_counts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/extracted-features', methods=['GET'])
def extracted_features():
    try:
        features_list = []
        for features in df_cleaned['extracted_features']:
            features_list.extend(features)
        feature_counts = pd.Series(features_list).value_counts().to_dict()
        return jsonify(feature_counts)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/rating-discrepancies', methods=['GET'])
def rating_discrepancies():
    try:
        df_discrepancy = df_cleaned[(df_cleaned['rating'] == 5) & (df_cleaned['sentiment'] == 'Negative')]
        discrepancies = df_discrepancy[['review', 'rating']].to_dict(orient='records')
        return jsonify(discrepancies)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/rating-summary', methods=['GET'])
def rating_summary():
    try:
        summary = {
            "total_reviews": int(df_cleaned.shape[0]),
            "average_rating": float(df_cleaned['rating'].mean()),
            "sentiment_counts": df_cleaned['sentiment'].value_counts().to_dict()
        }
        return jsonify(summary)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)