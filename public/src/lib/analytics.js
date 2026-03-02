/**
 * Analytics tracking system
 * Tracks user interactions, popular projects, and usage patterns
 */

export class Analytics {
  constructor() {
    this.storageKey = 'portfolio_analytics';
    this.sessionKey = 'portfolio_session';
    this.data = this.load();
    this.session = this.loadSession();
  }

  load() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : this.getDefaultData();
    } catch (error) {
      console.error('Failed to load analytics:', error);
      return this.getDefaultData();
    }
  }

  loadSession() {
    try {
      const session = sessionStorage.getItem(this.sessionKey);
      if (session) return JSON.parse(session);

      const newSession = {
        id: this.generateSessionId(),
        startTime: Date.now(),
        pageViews: 0,
        interactions: [],
      };
      this.saveSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Failed to load session:', error);
      return null;
    }
  }

  getDefaultData() {
    return {
      projectViews: {},
      projectOpens: {},
      searchQueries: [],
      filterUsage: {},
      bookmarks: [],
      recentlyViewed: [],
      totalVisits: 0,
      lastVisit: null,
      firstVisit: Date.now(),
    };
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save analytics:', error);
    }
  }

  saveSession(session = this.session) {
    try {
      sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  }

  generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Track page view
  trackPageView() {
    this.data.totalVisits++;
    this.data.lastVisit = Date.now();
    if (this.session) {
      this.session.pageViews++;
      this.saveSession();
    }
    this.save();
  }

  // Track project view
  trackProjectView(projectId, projectTitle) {
    if (!this.data.projectViews[projectId]) {
      this.data.projectViews[projectId] = 0;
    }
    this.data.projectViews[projectId]++;

    // Add to recently viewed
    this.addToRecentlyViewed(projectId, projectTitle);

    this.save();
  }

  // Track project open (details expanded)
  trackProjectOpen(projectId) {
    if (!this.data.projectOpens[projectId]) {
      this.data.projectOpens[projectId] = 0;
    }
    this.data.projectOpens[projectId]++;
    this.save();
  }

  // Track search query
  trackSearch(query) {
    if (!query || query.trim() === '') return;

    this.data.searchQueries.push({
      query: query.trim(),
      timestamp: Date.now(),
    });

    // Keep only last 100 searches
    if (this.data.searchQueries.length > 100) {
      this.data.searchQueries = this.data.searchQueries.slice(-100);
    }

    this.save();
  }

  // Track filter usage
  trackFilter(filterType, filterValue) {
    const key = `${filterType}:${filterValue}`;
    if (!this.data.filterUsage[key]) {
      this.data.filterUsage[key] = 0;
    }
    this.data.filterUsage[key]++;
    this.save();
  }

  // Add to recently viewed
  addToRecentlyViewed(projectId, projectTitle) {
    const item = {
      id: projectId,
      title: projectTitle,
      timestamp: Date.now(),
    };

    // Remove if already exists
    this.data.recentlyViewed = this.data.recentlyViewed.filter(
      (p) => p.id !== projectId
    );

    // Add to beginning
    this.data.recentlyViewed.unshift(item);

    // Keep only last 20
    if (this.data.recentlyViewed.length > 20) {
      this.data.recentlyViewed = this.data.recentlyViewed.slice(0, 20);
    }
  }

  // Get recently viewed projects
  getRecentlyViewed(limit = 10) {
    return this.data.recentlyViewed.slice(0, limit);
  }

  // Get popular projects
  getPopularProjects(limit = 10) {
    const projects = Object.entries(this.data.projectViews)
      .map(([id, views]) => ({ id, views }))
      .sort((a, b) => b.views - a.views)
      .slice(0, limit);

    return projects;
  }

  // Get most opened projects
  getMostOpenedProjects(limit = 10) {
    const projects = Object.entries(this.data.projectOpens)
      .map(([id, opens]) => ({ id, opens }))
      .sort((a, b) => b.opens - a.opens)
      .slice(0, limit);

    return projects;
  }

  // Get popular searches
  getPopularSearches(limit = 10) {
    const searchCounts = {};

    this.data.searchQueries.forEach(({ query }) => {
      const normalized = query.toLowerCase();
      searchCounts[normalized] = (searchCounts[normalized] || 0) + 1;
    });

    return Object.entries(searchCounts)
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  // Get filter usage stats
  getFilterStats() {
    return Object.entries(this.data.filterUsage)
      .map(([key, count]) => {
        const [type, value] = key.split(':');
        return { type, value, count };
      })
      .sort((a, b) => b.count - a.count);
  }

  // Get summary stats
  getSummary() {
    return {
      totalVisits: this.data.totalVisits,
      totalProjectViews: Object.values(this.data.projectViews).reduce(
        (sum, views) => sum + views,
        0
      ),
      totalSearches: this.data.searchQueries.length,
      uniqueProjectsViewed: Object.keys(this.data.projectViews).length,
      firstVisit: this.data.firstVisit,
      lastVisit: this.data.lastVisit,
      sessionViews: this.session?.pageViews || 0,
    };
  }

  // Clear all analytics data
  clear() {
    this.data = this.getDefaultData();
    this.save();
  }

  // Export analytics data
  export() {
    return {
      ...this.data,
      summary: this.getSummary(),
      popularProjects: this.getPopularProjects(),
      popularSearches: this.getPopularSearches(),
      filterStats: this.getFilterStats(),
    };
  }
}

export default Analytics;
