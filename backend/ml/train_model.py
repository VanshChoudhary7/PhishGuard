import pandas as pd
import numpy as np
import joblib
import os
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from feature_extractor import extract_features, FEATURE_NAMES

# ── 1. Load Dataset ──────────────────────────────────────────
print("Loading dataset...")
df = pd.read_csv('../Datafiles/phishing.csv')

URL_COL   = 'url'
LABEL_COL = 'status'

df[LABEL_COL] = df[LABEL_COL].map({
    'legitimate': 0,
    'phishing': 1
})

df = df.dropna(subset=[URL_COL, LABEL_COL])
print(f"Dataset loaded: {len(df)} rows")
print(df[LABEL_COL].value_counts())

# ── 2. Extract Features ──────────────────────────────────────
print("\nExtracting features...")
X = []
y = []

for _, row in df.iterrows():
    try:
        features = extract_features(str(row[URL_COL]))
        X.append(features)
        y.append(int(row[LABEL_COL]))
    except Exception as e:
        continue

X = np.array(X)
y = np.array(y)
print(f"Feature matrix shape: {X.shape}")

# ── 3. Train/Test Split ──────────────────────────────────────
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── 4. Train with GradientBoosting (more accurate than RandomForest) ──
print("\nTraining Gradient Boosting model...")
model = GradientBoostingClassifier(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)
model.fit(X_train, y_train)

# ── 5. Evaluate ──────────────────────────────────────────────
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nAccuracy: {accuracy * 100:.2f}%")
print(classification_report(y_test, y_pred,
      target_names=['Legitimate', 'Phishing']))

# ── 6. Save Model ────────────────────────────────────────────
joblib.dump(model, 'model.pkl')
print("\nModel saved to backend/ml/model.pkl")