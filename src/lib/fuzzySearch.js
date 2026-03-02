/**
 * Fuzzy search implementation for project filtering
 * Provides typo-tolerant search with scoring
 */

export class FuzzySearch {
  constructor(items, keys = []) {
    this.items = items;
    this.keys = keys;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Calculate fuzzy match score
   */
  fuzzyScore(query, target) {
    query = query.toLowerCase();
    target = target.toLowerCase();

    // Exact match
    if (target.includes(query)) {
      return 1.0;
    }

    // Calculate distance-based score
    const distance = this.levenshteinDistance(query, target);
    const maxLength = Math.max(query.length, target.length);
    const score = 1 - (distance / maxLength);

    return score;
  }

  /**
   * Search items with fuzzy matching
   */
  search(query, threshold = 0.3) {
    if (!query || query.trim() === '') {
      return this.items;
    }

    const results = this.items
      .map(item => {
        let maxScore = 0;

        // Search across all specified keys
        this.keys.forEach(key => {
          const value = this.getNestedValue(item, key);
          if (value) {
            const score = this.fuzzyScore(query, String(value));
            maxScore = Math.max(maxScore, score);
          }
        });

        return { item, score: maxScore };
      })
      .filter(result => result.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .map(result => result.item);

    return results;
  }

  /**
   * Get nested object value by key path
   */
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }
}

export default FuzzySearch;
