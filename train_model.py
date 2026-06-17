import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import LabelEncoder
import pickle
import re
import urllib.parse

# ─── Feature Extraction from URL ───────────────────────────────
def extract_features(url):
    try:
        parsed = urllib.parse.urlparse(url if url.startswith('http') else 'http://' + url)
        hostname = parsed.netloc
        path = parsed.path

        return {
            'length_url': len(url),
            'length_hostname': len(hostname),
            'nb_dots': url.count('.'),
            'nb_hyphens': url.count('-'),
            'nb_at': url.count('@'),
            'nb_qm': url.count('?'),
            'nb_and': url.count('&'),
            'nb_eq': url.count('='),
            'nb_underscore': url.count('_'),
            'nb_slash': url.count('/'),
            'nb_colon': url.count(':'),
            'nb_percent': url.count('%'),
            'nb_digits': sum(c.isdigit() for c in url),
            'has_ip': 1 if re.match(r'\d+\.\d+\.\d+\.\d+', hostname) else 0,
            'has_https': 1 if parsed.scheme == 'https' else 0,
            'has_http': 1 if parsed.scheme == 'http' else 0,
            'length_path': len(path),
            'nb_subdomains': len(hostname.split('.')) - 2 if len(hostname.split('.')) > 2 else 0,
            'has_suspicious_words': 1 if any(w in url.lower() for w in [
                'login', 'verify', 'secure', 'account', 'update',
                'banking', 'confirm', 'paypal', 'signin', 'password'
            ]) else 0,
        }
    except:
        return {k: 0 for k in [
            'length_url','length_hostname','nb_dots','nb_hyphens','nb_at',
            'nb_qm','nb_and','nb_eq','nb_underscore','nb_slash','nb_colon',
            'nb_percent','nb_digits','has_ip','has_https','has_http',
            'length_path','nb_subdomains','has_suspicious_words'
        ]}

# ─── Load & Combine Datasets ───────────────────────────────────
print("Loading datasets...")

# Dataset 1 — phishing.csv (has URL + status)
df1 = pd.read_csv("Datafiles/phishing.csv", usecols=['url', 'status'])
df1.columns = ['url', 'label']
df1['label'] = df1['label'].map({'legitimate': 0, 'phishing': 1})

# Dataset 2 — phishing_site_urls.csv (has URL + Label)
df2 = pd.read_csv("Datafiles/phishing_site_urls.csv", usecols=['URL', 'Label'])
df2.columns = ['url', 'label']
df2['label'] = df2['label'].map({'good': 0, 'bad': 1})

# Dataset 3 — phishurls.csv (all phishing)
df3 = pd.read_csv("Datafiles/phishurls.csv")
df3.columns = ['url']
df3['label'] = 1  # all phishing

# Dataset 4 — legitimateurls.csv (all legitimate)
df4 = pd.read_csv("Datafiles/legitimateurls.csv", header=None, names=['url'])
df4['label'] = 0  # all legitimate

# Combine all
df = pd.concat([df1, df2, df3, df4], ignore_index=True)
df = df.dropna(subset=['url', 'label'])
df['label'] = df['label'].astype(int)

print(f"Total samples: {len(df)}")
print(f"Phishing: {df['label'].sum()} | Legitimate: {(df['label']==0).sum()}")

# ─── Extract Features ────────────────────────────────────────