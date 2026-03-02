/**
 * LocalStorage wrapper with error handling and type safety
 */

export class Storage {
  /**
   * Get item from localStorage
   */
  static get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading from localStorage: ${key}`, error);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   */
  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage: ${key}`, error);
      return false;
    }
  }

  /**
   * Clear all localStorage
   */
  static clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error clearing localStorage', error);
      return false;
    }
  }

  /**
   * Check if key exists
   */
  static has(key) {
    return localStorage.getItem(key) !== null;
  }
}

/**
 * Project views tracker
 */
export class ViewTracker {
  static KEY = 'projectViews';

  static track(projectId) {
    const views = Storage.get(this.KEY, {});
    views[projectId] = (views[projectId] || 0) + 1;
    Storage.set(this.KEY, views);
    return views[projectId];
  }

  static getViews(projectId) {
    const views = Storage.get(this.KEY, {});
    return views[projectId] || 0;
  }

  static getAllViews() {
    return Storage.get(this.KEY, {});
  }

  static getMostViewed(limit = 10) {
    const views = this.getAllViews();
    return Object.entries(views)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([id, count]) => ({ id, count }));
  }
}

/**
 * Recently viewed tracker
 */
export class RecentlyViewed {
  static KEY = 'recentlyViewed';
  static MAX_ITEMS = 20;

  static add(projectId) {
    const recent = Storage.get(this.KEY, []);

    // Remove if already exists
    const filtered = recent.filter(id => id !== projectId);

    // Add to beginning
    filtered.unshift(projectId);

    // Limit size
    const limited = filtered.slice(0, this.MAX_ITEMS);

    Storage.set(this.KEY, limited);
    return limited;
  }

  static get(limit = 10) {
    const recent = Storage.get(this.KEY, []);
    return recent.slice(0, limit);
  }

  static clear() {
    Storage.remove(this.KEY);
  }
}

/**
 * Bookmarks manager
 */
export class Bookmarks {
  static KEY = 'bookmarks';

  static add(projectId) {
    const bookmarks = Storage.get(this.KEY, []);
    if (!bookmarks.includes(projectId)) {
      bookmarks.push(projectId);
      Storage.set(this.KEY, bookmarks);
    }
    return bookmarks;
  }

  static remove(projectId) {
    const bookmarks = Storage.get(this.KEY, []);
    const filtered = bookmarks.filter(id => id !== projectId);
    Storage.set(this.KEY, filtered);
    return filtered;
  }

  static toggle(projectId) {
    return this.has(projectId) ? this.remove(projectId) : this.add(projectId);
  }

  static has(projectId) {
    const bookmarks = Storage.get(this.KEY, []);
    return bookmarks.includes(projectId);
  }

  static getAll() {
    return Storage.get(this.KEY, []);
  }

  static clear() {
    Storage.remove(this.KEY);
  }

  static export() {
    const bookmarks = this.getAll();
    const data = JSON.stringify(bookmarks, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `bookmarks-${Date.now()}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  static import(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const bookmarks = JSON.parse(e.target.result);
          if (Array.isArray(bookmarks)) {
            Storage.set(this.KEY, bookmarks);
            resolve(bookmarks);
          } else {
            reject(new Error('Invalid bookmarks format'));
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }
}

/**
 * User preferences
 */
export class Preferences {
  static KEY = 'preferences';

  static get(key, defaultValue = null) {
    const prefs = Storage.get(this.KEY, {});
    return prefs[key] !== undefined ? prefs[key] : defaultValue;
  }

  static set(key, value) {
    const prefs = Storage.get(this.KEY, {});
    prefs[key] = value;
    Storage.set(this.KEY, prefs);
  }

  static getAll() {
    return Storage.get(this.KEY, {});
  }

  static clear() {
    Storage.remove(this.KEY);
  }
}

export default {
  Storage,
  ViewTracker,
  RecentlyViewed,
  Bookmarks,
  Preferences,
};
