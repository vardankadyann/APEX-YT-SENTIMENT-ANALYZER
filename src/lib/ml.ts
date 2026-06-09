/**
 * APEX Sentiment Analysis Engine
 * 
 * This module implements a lightweight Machine Learning workflow:
 * 1. Text Preprocessing (Cleaning)
 * 2. Feature Extraction (TF-IDF Simulation)
 * 3. Classification (Logistic Regression Simulation)
 */

export interface AnalysisResult {
  text: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  score: number; // -1 to 1
  isToxic: boolean;
  toxicityScore: number; // 0 to 1
  tokens: string[];
}

// Simple sentiment lexicon for weights simulation
// In a real project, these weights would be learned from a training set
const SENTIMENT_WEIGHTS: Record<string, number> = {
  // Positive
  'good': 0.6, 'great': 0.8, 'awesome': 0.9, 'amazing': 0.95, 'excellent': 0.9,
  'love': 0.85, 'best': 0.8, 'helpful': 0.7, 'thanks': 0.6, 'nice': 0.5,
  'happy': 0.7, 'brilliant': 0.8, 'standard': 0.1, 'perfect': 0.9, 'wow': 0.7,
  'cool': 0.5, 'congrats': 0.6, 'congratulations': 0.7, 'informative': 0.6,
  'subscribe': 0.2, 'like': 0.3,

  // Negative
  'bad': -0.6, 'worst': -0.9, 'terrible': -0.85, 'awful': -0.8, 'horrible': -0.8,
  'hate': -0.9, 'stupid': -0.7, 'useless': -0.7, 'waste': -0.8, 'boring': -0.6,
  'wrong': -0.5, 'poor': -0.6, 'disappointed': -0.7, 'annoying': -0.6,
  'ugly': -0.7, 'fail': -0.7, 'sucks': -0.85, 'dislike': -0.5,

  // Toxic keywords (for toxicity detection)
  'fuck': -0.95, 'shit': -0.85, 'ass': -0.75, 'bitch': -0.9, 'bastard': -0.85,
  'idiot': -0.65, 'dumb': -0.5, 'pathetic': -0.6, 'kill': -0.9, 'death': -0.8,
  'shut': -0.4, 'spam': -0.3, 'scam': -0.9
};

const TOXIC_KEYWORDS = new Set(['fuck', 'shit', 'bitch', 'idiot', 'bastard', 'pathetic', 'kill', 'hate', 'stupid', 'scam']);

/**
 * Preprocesses text: Lowercase, remove special characters, remove extra whitespace
 */
export function preprocessText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, '') // Remove punctuation
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
}

/**
 * Tokenizes text into words
 */
export function tokenize(text: string): string[] {
  return text.split(' ').filter(token => token.length > 0);
}

/**
 * Analyzes a single comment
 */
export function analyzeComment(text: string): AnalysisResult {
  const cleanText = preprocessText(text);
  const tokens = tokenize(cleanText);
  
  let sentimentScore = 0;
  let toxicityScore = 0;
  let hitCount = 0;

  tokens.forEach(token => {
    // Sentiment
    if (SENTIMENT_WEIGHTS[token]) {
      sentimentScore += SENTIMENT_WEIGHTS[token];
      hitCount++;
    }

    // Toxicity
    if (TOXIC_KEYWORDS.has(token)) {
      toxicityScore += 0.25; // Simple additive toxicity
    }
  });

  // Normalize scores
  const normalizedSentiment = hitCount > 0 ? sentimentScore / Math.sqrt(hitCount) : 0;
  const cappedSentiment = Math.max(-1, Math.min(1, normalizedSentiment));
  
  const finalToxicity = Math.min(1, toxicityScore);
  
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (cappedSentiment > 0.15) sentiment = 'positive';
  else if (cappedSentiment < -0.15) sentiment = 'negative';
  else sentiment = 'neutral';

  return {
    text,
    sentiment,
    score: cappedSentiment,
    isToxic: finalToxicity > 0.4,
    toxicityScore: finalToxicity,
    tokens
  };
}

/**
 * Batch analyzes multiple comments
 */
export function analyzeBatch(comments: string[]): AnalysisResult[] {
  return comments.map(comment => analyzeComment(comment));
}
