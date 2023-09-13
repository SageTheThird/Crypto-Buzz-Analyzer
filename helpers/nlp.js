const Sentiment = require('sentiment');

class NLP {
  constructor() {
    this.sentiment = new Sentiment();
  }

  analyzeText(text, engagementMetrics) {
    try {
      const result = this.sentiment.analyze(text);
      const enhancedScore = this.enhanceScore(
        result.score,
        text,
        engagementMetrics,
      );
      return this.categorizeSentiment(enhancedScore);
    } catch (error) {
      console.error('Error analyzing text:', error);
      return null;
    }
  }

  enhanceScore(score, text, engagementMetrics) {
    const keywordScore = this.analyzeKeywords(text);
    const contextScore = this.analyzeContext(text);
    const engagementScore = this.analyzeEngagementMetrics(engagementMetrics);
    const urlScore = this.analyzeURLs(text);

    return score + keywordScore + contextScore + engagementScore + urlScore;
  }

  analyzeKeywords(text) {
    const positiveKeywords = ['profit', 'bullish', 'gain', 'up'];
    const negativeKeywords = ['loss', 'bearish', 'drop', 'down'];
    const scamKeywords = [
      'giveaway',
      'claim now',
      'double your',
      'official site',
    ];

    let score = 0;
    const lowerCaseText = text.toLowerCase();

    positiveKeywords.forEach(keyword => {
      if (lowerCaseText.includes(keyword.toLowerCase())) score += 1;
    });

    negativeKeywords.forEach(keyword => {
      if (lowerCaseText.includes(keyword.toLowerCase())) score -= 1;
    });

    scamKeywords.forEach(keyword => {
      if (lowerCaseText.includes(keyword.toLowerCase())) score -= 5; // Assign a higher negative score for scam keywords
    });

    return score;
  }

  analyzeContext(text) {
    // contextual analysis here. This might involve more complex NLP techniques
    // to understand the context in which words are used.

    // For now, returning 0 as a placeholder.
    return 0;
  }

  analyzeURLs(text) {
    const urlPattern = /https?:\/\/[^\s]+/g;
    const urls = text.match(urlPattern);
    if (urls && urls.length > 0) {
      return -3; // Assign a negative score if URLs are found
    }
    return 0;
  }

  analyzeEngagementMetrics(engagementMetrics) {
    const { likes, shares, comments, views } = engagementMetrics;

    let score = 0;

    if (views > 1000) score += 1;
    if (likes > 100) score += 1;
    if (shares > 50) score += 1;
    if (comments > 30) score += 1;

    // Consider the ratio of retweets to likes
    if (likes > 0 && shares / likes > 2) {
      score -= 3; // Assign a negative score if the ratio of retweets to likes is high
    }

    return score;
  }

  categorizeSentiment(score) {
    let sentiment = 'neutral';
    if (score > 0) {
      sentiment = 'positive';
    } else if (score < 0) {
      sentiment = 'negative';
    }
    return { score, sentiment };
  }
}

module.exports = NLP;
