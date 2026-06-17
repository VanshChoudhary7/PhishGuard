from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import urlparse
import joblib
import pandas as pd
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'ml'))
from feature_extractor import extract_features

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Load model and datasets
print("Loading model...")
model = joblib.load(os.path.join(os.path.dirname(__file__), 'ml', 'model.pkl'))

print("Loading datasets...")
legit_df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'Datafiles', 'legitimateurls.csv'))
phish_df = pd.read_csv(os.path.join(os.path.dirname(__file__), 'Datafiles', 'phishurls.csv'))

TRUSTED_DOMAINS = [
    'google.com', 'youtube.com', 'facebook.com', 'instagram.com',
    'twitter.com', 'x.com', 'github.com', 'microsoft.com', 'apple.com',
    'amazon.com', 'wikipedia.org', 'linkedin.com', 'reddit.com',
    'netflix.com', 'spotify.com', 'discord.com', 'whatsapp.com',
    'stackoverflow.com', 'openai.com', 'anthropic.com', 'gmail.com',
    'outlook.com', 'yahoo.com', 'bing.com', 'wordpress.com',
    'dropbox.com', 'adobe.com', 'zoom.us', 'slack.com', 'notion.so',
    'figma.com', 'canva.com', 'shopify.com', 'paypal.com', 'ebay.com'
]

@app.route('/')
def home():
    return jsonify({"status": "PhishGuard API running"})

@app.route('/api/check-url', methods=['POST'])
def check_url():
    data = request.get_json()
    url = data.get('url', '').strip()

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    # Step 0: Parse domain
    try:
        parsed = urlparse(url if url.startswith('http') else 'http://' + url)
        domain = parsed.netloc.lower().replace('www.', '')
    except:
        domain = ''

    # Step 1: Trusted whitelist check
    if domain in TRUSTED_DOMAINS:
        return jsonify({
            "url": url,
            "result": "legitimate",
            "confidence": 99.0,
            "source": "trusted_whitelist"
        })

    # Step 2: Exact match in datasets
    try:
        if url in phish_df.iloc[:, 0].values:
            return jsonify({
                "url": url,
                "result": "phishing",
                "confidence": 99.0,
                "source": "dataset"
            })
        if url in legit_df.iloc[:, 0].values:
            return jsonify({
                "url": url,
                "result": "legitimate",
                "confidence": 99.0,
                "source": "dataset"
            })
    except Exception:
        pass

    # Step 3: ML model prediction
    try:
        features = extract_features(url)
        proba = model.predict_proba([features])[0]
        phishing_prob = float(proba[1])

        if phishing_prob >= 0.5:
            result = "phishing"
        elif phishing_prob >= 0.3:
            result = "suspicious"
        else:
            result = "legitimate"

        score = round(phishing_prob * 100, 2)

        return jsonify({
            "url": url,
            "result": result,
            "confidence": score,
            "source": "ml_model"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)