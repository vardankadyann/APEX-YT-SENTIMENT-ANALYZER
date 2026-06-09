# 🚀 YouTube Comment Sentiment & Toxicity Analyzer

An end-to-end **Machine Learning + NLP web application** that analyzes YouTube comments to classify **sentiment (Positive, Negative, Neutral)** and detect **toxic content** in real-time.

🔗 **Live Demo:** https://apex-yt-comment-sentiment-analyser.vercel.app/

---

## 📌 Overview

With the massive growth of user-generated content on YouTube, analyzing comments manually is inefficient. This project provides an **automated solution** using Machine Learning to:

* 📊 Understand audience sentiment
* ⚠️ Detect harmful/toxic comments
* 📈 Provide actionable insights via dashboard

---

## ✨ Features

* 🔍 **Sentiment Classification** (Positive / Negative / Neutral)
* 🚫 **Toxicity Detection** (Toxic / Non-Toxic)
* 📊 **Interactive Dashboard**

  * Pie charts (sentiment distribution)
  * Bar graphs (category counts)
  * Word clouds (frequent terms)
* ⚡ Fast processing (1000+ comments in seconds)
* 🌐 Deployed web application

---

## 🧠 Machine Learning Pipeline

```
CSV Input
   ↓
Text Preprocessing
   ↓
TF-IDF Feature Extraction
   ↓
Logistic Regression Models
   ↓
Sentiment + Toxicity Output
   ↓
Analytics Dashboard
```

---

## 🛠️ Tech Stack

### 👨‍💻 Backend / ML

* Python
* Scikit-learn
* NLTK
* Pandas, NumPy

### 🎨 Frontend

* React + TypeScript
* Tailwind CSS

### ☁️ Deployment

* Vercel

---

## ⚙️ Methodology

### 🔹 Data Preprocessing

* Lowercasing
* URL & HTML removal
* Tokenization
* Stop-word removal
* Stemming (Porter Stemmer)

### 🔹 Feature Engineering

* TF-IDF Vectorization
* N-grams (1,2)
* Max features: 10,000

### 🔹 Models Used

* Logistic Regression (Sentiment - Multi-class)
* Logistic Regression (Toxicity - Binary)

---

## 📊 Results

### 🎯 Sentiment Classification

* **Accuracy:** 84.6%
* **F1 Score:** 0.82

### ⚠️ Toxicity Detection

* **Accuracy:** 94.3%

### 🏆 Model Comparison

| Model             | Accuracy  |
| ----------------- | --------- |
| Naive Bayes       | 78.2%     |
| Decision Tree     | 73.5%     |
| Random Forest     | 82.1%     |
| SVM               | 83.9%     |
| **Logistic Reg.** | **84.6%** |

---

## 📂 Project Structure

```
├── src/                # Frontend (React)
├── ml/                 # ML models & preprocessing
├── public/
├── .env.example
├── README.md
└── package.json
```

---

## 🚀 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/yt-comment-sentiment-analyzer.git
cd yt-comment-sentiment-analyzer
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup environment variables

Create a `.env.local` file:

```env
GEMINI_API_KEY=your_api_key_here
```

### 4️⃣ Run the project

```bash
npm run dev
```

---

## 📸 Screenshots

> Add UI screenshots here (dashboard, results, input page)

---

## ⚠️ Limitations

* Does not handle sarcasm or deep context
* Works only on English comments
* Requires CSV input (no live YouTube API yet)

---

## 🔮 Future Improvements

* 🤖 Integrate BERT / Transformer models
* 🔗 Add YouTube API for live comment fetching
* 🌍 Multilingual support
* 📱 Mobile app version
* 📊 Advanced analytics dashboard

---

## 👨‍💻 Author-

* Vardan Kadyan


---

## 📌 Acknowledgements

* Kaggle Datasets (YouTube Comments & Toxicity)
* Scikit-learn & NLTK libraries

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!

---
