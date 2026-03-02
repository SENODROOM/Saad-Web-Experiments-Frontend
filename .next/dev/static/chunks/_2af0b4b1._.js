(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/analytics.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Analytics tracking system
 * Tracks user interactions, popular projects, and usage patterns
 */ __turbopack_context__.s([
    "Analytics",
    ()=>Analytics,
    "default",
    ()=>__TURBOPACK__default__export__
]);
class Analytics {
    constructor(){
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
                interactions: []
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
            firstVisit: Date.now()
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
            timestamp: Date.now()
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
            timestamp: Date.now()
        };
        // Remove if already exists
        this.data.recentlyViewed = this.data.recentlyViewed.filter((p)=>p.id !== projectId);
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
        const projects = Object.entries(this.data.projectViews).map(([id, views])=>({
                id,
                views
            })).sort((a, b)=>b.views - a.views).slice(0, limit);
        return projects;
    }
    // Get most opened projects
    getMostOpenedProjects(limit = 10) {
        const projects = Object.entries(this.data.projectOpens).map(([id, opens])=>({
                id,
                opens
            })).sort((a, b)=>b.opens - a.opens).slice(0, limit);
        return projects;
    }
    // Get popular searches
    getPopularSearches(limit = 10) {
        const searchCounts = {};
        this.data.searchQueries.forEach(({ query })=>{
            const normalized = query.toLowerCase();
            searchCounts[normalized] = (searchCounts[normalized] || 0) + 1;
        });
        return Object.entries(searchCounts).map(([query, count])=>({
                query,
                count
            })).sort((a, b)=>b.count - a.count).slice(0, limit);
    }
    // Get filter usage stats
    getFilterStats() {
        return Object.entries(this.data.filterUsage).map(([key, count])=>{
            const [type, value] = key.split(':');
            return {
                type,
                value,
                count
            };
        }).sort((a, b)=>b.count - a.count);
    }
    // Get summary stats
    getSummary() {
        return {
            totalVisits: this.data.totalVisits,
            totalProjectViews: Object.values(this.data.projectViews).reduce((sum, views)=>sum + views, 0),
            totalSearches: this.data.searchQueries.length,
            uniqueProjectsViewed: Object.keys(this.data.projectViews).length,
            firstVisit: this.data.firstVisit,
            lastVisit: this.data.lastVisit,
            sessionViews: this.session?.pageViews || 0
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
            filterStats: this.getFilterStats()
        };
    }
}
const __TURBOPACK__default__export__ = Analytics;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/keyboard.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Keyboard shortcuts manager
 */ __turbopack_context__.s([
    "KeyboardShortcuts",
    ()=>KeyboardShortcuts,
    "default",
    ()=>__TURBOPACK__default__export__,
    "defaultShortcuts",
    ()=>defaultShortcuts
]);
class KeyboardShortcuts {
    constructor(){
        this.shortcuts = new Map();
        this.enabled = true;
        this.init();
    }
    init() {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    /**
   * Register a keyboard shortcut
   */ register(key, callback, options = {}) {
        const { ctrl = false, alt = false, shift = false, meta = false, description = '' } = options;
        const shortcutKey = this.createKey(key, {
            ctrl,
            alt,
            shift,
            meta
        });
        this.shortcuts.set(shortcutKey, {
            callback,
            description,
            key,
            ctrl,
            alt,
            shift,
            meta
        });
    }
    /**
   * Unregister a keyboard shortcut
   */ unregister(key, options = {}) {
        const shortcutKey = this.createKey(key, options);
        this.shortcuts.delete(shortcutKey);
    }
    /**
   * Create unique key for shortcut
   */ createKey(key, { ctrl = false, alt = false, shift = false, meta = false }) {
        const modifiers = [];
        if (ctrl) modifiers.push('ctrl');
        if (alt) modifiers.push('alt');
        if (shift) modifiers.push('shift');
        if (meta) modifiers.push('meta');
        return [
            ...modifiers,
            key.toLowerCase()
        ].join('+');
    }
    /**
   * Handle keydown event
   */ handleKeyDown(event) {
        if (!this.enabled) return;
        // Don't trigger shortcuts when typing in inputs
        const target = event.target;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
            // Allow Escape key even in inputs
            if (event.key !== 'Escape') return;
        }
        const key = this.createKey(event.key, {
            ctrl: event.ctrlKey,
            alt: event.altKey,
            shift: event.shiftKey,
            meta: event.metaKey
        });
        const shortcut = this.shortcuts.get(key);
        if (shortcut) {
            event.preventDefault();
            shortcut.callback(event);
        }
    }
    /**
   * Enable shortcuts
   */ enable() {
        this.enabled = true;
    }
    /**
   * Disable shortcuts
   */ disable() {
        this.enabled = false;
    }
    /**
   * Get all registered shortcuts
   */ getAll() {
        return Array.from(this.shortcuts.values());
    }
    /**
   * Clear all shortcuts
   */ clear() {
        this.shortcuts.clear();
    }
}
const defaultShortcuts = {
    SEARCH: {
        key: '/',
        description: 'Focus search'
    },
    ESCAPE: {
        key: 'Escape',
        description: 'Clear search / Close modal'
    },
    COMMAND_PALETTE: {
        key: 'k',
        ctrl: true,
        description: 'Open command palette'
    },
    DARK_MODE: {
        key: 'd',
        ctrl: true,
        description: 'Toggle dark mode'
    },
    BOOKMARKS: {
        key: 'b',
        ctrl: true,
        description: 'View bookmarks'
    },
    HELP: {
        key: '?',
        shift: true,
        description: 'Show keyboard shortcuts'
    }
};
const __TURBOPACK__default__export__ = KeyboardShortcuts;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/storage.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * LocalStorage wrapper with error handling and type safety
 */ __turbopack_context__.s([
    "Bookmarks",
    ()=>Bookmarks,
    "Preferences",
    ()=>Preferences,
    "RecentlyViewed",
    ()=>RecentlyViewed,
    "Storage",
    ()=>Storage,
    "ViewTracker",
    ()=>ViewTracker,
    "default",
    ()=>__TURBOPACK__default__export__
]);
class Storage {
    /**
   * Get item from localStorage
   */ static get(key, defaultValue = null) {
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
   */ static set(key, value) {
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
   */ static remove(key) {
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
   */ static clear() {
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
   */ static has(key) {
        return localStorage.getItem(key) !== null;
    }
}
class ViewTracker {
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
        return Object.entries(views).sort(([, a], [, b])=>b - a).slice(0, limit).map(([id, count])=>({
                id,
                count
            }));
    }
}
class RecentlyViewed {
    static KEY = 'recentlyViewed';
    static MAX_ITEMS = 20;
    static add(projectId) {
        const recent = Storage.get(this.KEY, []);
        // Remove if already exists
        const filtered = recent.filter((id)=>id !== projectId);
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
class Bookmarks {
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
        const filtered = bookmarks.filter((id)=>id !== projectId);
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
        const blob = new Blob([
            data
        ], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookmarks-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    static import(file) {
        return new Promise((resolve, reject)=>{
            const reader = new FileReader();
            reader.onload = (e)=>{
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
            reader.onerror = ()=>reject(reader.error);
            reader.readAsText(file);
        });
    }
}
class Preferences {
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
const __TURBOPACK__default__export__ = {
    Storage,
    ViewTracker,
    RecentlyViewed,
    Bookmarks,
    Preferences
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Toast.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Toast notification system
 */ __turbopack_context__.s([
    "Toast",
    ()=>Toast,
    "default",
    ()=>__TURBOPACK__default__export__
]);
class Toast {
    static container = null;
    static toasts = [];
    static nextId = 1;
    static init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }
    static show(message, options = {}) {
        this.init();
        const { type = 'info', duration = 3000, position = 'top-right', dismissible = true } = options;
        const id = this.nextId++;
        const toast = this.createToast(id, message, type, dismissible);
        this.container.appendChild(toast);
        this.toasts.push({
            id,
            element: toast
        });
        // Trigger animation
        setTimeout(()=>toast.classList.add('show'), 10);
        // Auto dismiss
        if (duration > 0) {
            setTimeout(()=>this.dismiss(id), duration);
        }
        return id;
    }
    static createToast(id, message, type, dismissible) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.dataset.id = id;
        const icon = this.getIcon(type);
        toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-message">${message}</div>
      ${dismissible ? '<button class="toast-close" aria-label="Close">&times;</button>' : ''}
    `;
        if (dismissible) {
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', ()=>this.dismiss(id));
        }
        return toast;
    }
    static getIcon(type) {
        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };
        return icons[type] || icons.info;
    }
    static dismiss(id) {
        const toastData = this.toasts.find((t)=>t.id === id);
        if (!toastData) return;
        const { element } = toastData;
        element.classList.remove('show');
        element.classList.add('hide');
        setTimeout(()=>{
            element.remove();
            this.toasts = this.toasts.filter((t)=>t.id !== id);
        }, 300);
    }
    static success(message, options = {}) {
        return this.show(message, {
            ...options,
            type: 'success'
        });
    }
    static error(message, options = {}) {
        return this.show(message, {
            ...options,
            type: 'error'
        });
    }
    static warning(message, options = {}) {
        return this.show(message, {
            ...options,
            type: 'warning'
        });
    }
    static info(message, options = {}) {
        return this.show(message, {
            ...options,
            type: 'info'
        });
    }
    static dismissAll() {
        this.toasts.forEach(({ id })=>this.dismiss(id));
    }
}
// Add CSS for toasts
const style = document.createElement('style');
style.textContent = `
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 500px;
    opacity: 0;
    transform: translateX(100%);
    transition: all 0.3s ease;
    pointer-events: auto;
  }

  .toast.show {
    opacity: 1;
    transform: translateX(0);
  }

  .toast.hide {
    opacity: 0;
    transform: translateX(100%);
  }

  .toast-icon {
    font-size: 20px;
    flex-shrink: 0;
  }

  .toast-message {
    flex: 1;
    font-size: 14px;
    line-height: 1.4;
  }

  .toast-close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: background 0.2s;
  }

  .toast-close:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  .toast-success {
    border-left: 4px solid #10b981;
  }

  .toast-success .toast-icon {
    color: #10b981;
  }

  .toast-error {
    border-left: 4px solid #ef4444;
  }

  .toast-error .toast-icon {
    color: #ef4444;
  }

  .toast-warning {
    border-left: 4px solid #f59e0b;
  }

  .toast-warning .toast-icon {
    color: #f59e0b;
  }

  .toast-info {
    border-left: 4px solid #3b82f6;
  }

  .toast-info .toast-icon {
    color: #3b82f6;
  }

  body.dark .toast {
    background: #1f2937;
    color: #f3f4f6;
  }

  body.dark .toast-close:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 640px) {
    .toast-container {
      left: 20px;
      right: 20px;
      top: auto;
      bottom: 20px;
    }

    .toast {
      min-width: auto;
      transform: translateY(100%);
    }

    .toast.show {
      transform: translateY(0);
    }

    .toast.hide {
      transform: translateY(100%);
    }
  }
`;
document.head.appendChild(style);
const __TURBOPACK__default__export__ = Toast;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ProjectTags.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Project tags and multi-filter component
 */ __turbopack_context__.s([
    "ProjectTags",
    ()=>ProjectTags,
    "default",
    ()=>__TURBOPACK__default__export__
]);
class ProjectTags {
    static tagDefinitions = {
        difficulty: {
            beginner: {
                label: 'Beginner',
                color: '#10b981'
            },
            intermediate: {
                label: 'Intermediate',
                color: '#f59e0b'
            },
            advanced: {
                label: 'Advanced',
                color: '#ef4444'
            }
        },
        features: {
            responsive: {
                label: 'Responsive',
                color: '#3b82f6'
            },
            animated: {
                label: 'Animated',
                color: '#8b5cf6'
            },
            interactive: {
                label: 'Interactive',
                color: '#ec4899'
            },
            accessible: {
                label: 'Accessible',
                color: '#06b6d4'
            }
        },
        tech: {
            grid: {
                label: 'CSS Grid',
                color: '#6366f1'
            },
            flexbox: {
                label: 'Flexbox',
                color: '#8b5cf6'
            },
            animations: {
                label: 'Animations',
                color: '#ec4899'
            },
            forms: {
                label: 'Forms',
                color: '#14b8a6'
            },
            api: {
                label: 'API',
                color: '#f59e0b'
            },
            classes: {
                label: 'Classes',
                color: '#ef4444'
            }
        }
    };
    static assignTags(project) {
        const tags = {
            difficulty: [],
            features: [],
            tech: []
        };
        const title = project.title.toLowerCase();
        const description = project.description.toLowerCase();
        const category = project.category.toLowerCase();
        // Assign difficulty based on category and complexity
        if (category === 'html') {
            tags.difficulty.push('beginner');
        } else if (category === 'css') {
            if (title.includes('grid') || title.includes('flexbox') || title.includes('animation')) {
                tags.difficulty.push('intermediate');
            } else {
                tags.difficulty.push('beginner');
            }
        } else if (category === 'javascript') {
            if (title.includes('async') || title.includes('class') || title.includes('api')) {
                tags.difficulty.push('advanced');
            } else {
                tags.difficulty.push('intermediate');
            }
        } else if (category === 'react' || category === 'python') {
            tags.difficulty.push('advanced');
        }
        // Assign feature tags
        if (description.includes('responsive')) {
            tags.features.push('responsive');
        }
        if (description.includes('animation') || description.includes('animated') || title.includes('animation')) {
            tags.features.push('animated');
        }
        if (description.includes('interactive') || category === 'javascript') {
            tags.features.push('interactive');
        }
        if (description.includes('accessible') || title.includes('accessible')) {
            tags.features.push('accessible');
        }
        // Assign tech tags
        if (title.includes('grid') || description.includes('grid')) {
            tags.tech.push('grid');
        }
        if (title.includes('flexbox') || description.includes('flexbox')) {
            tags.tech.push('flexbox');
        }
        if (title.includes('animation') || description.includes('animation')) {
            tags.tech.push('animations');
        }
        if (title.includes('form') || description.includes('form')) {
            tags.tech.push('forms');
        }
        if (title.includes('api') || description.includes('api') || description.includes('fetch')) {
            tags.tech.push('api');
        }
        if (title.includes('class') || description.includes('class')) {
            tags.tech.push('classes');
        }
        return tags;
    }
    static renderTags(tags, container) {
        const tagContainer = document.createElement('div');
        tagContainer.className = 'project-tags';
        Object.entries(tags).forEach(([category, tagList])=>{
            tagList.forEach((tagKey)=>{
                const tagDef = this.tagDefinitions[category]?.[tagKey];
                if (!tagDef) return;
                const tag = document.createElement('span');
                tag.className = 'project-tag';
                tag.textContent = tagDef.label;
                tag.style.background = tagDef.color;
                tag.dataset.category = category;
                tag.dataset.tag = tagKey;
                tagContainer.appendChild(tag);
            });
        });
        container.appendChild(tagContainer);
        return tagContainer;
    }
    static createFilterUI(projects) {
        const filterContainer = document.createElement('div');
        filterContainer.className = 'multi-filter-container';
        // Collect all unique tags from projects
        const allTags = {
            difficulty: new Set(),
            features: new Set(),
            tech: new Set()
        };
        projects.forEach((project)=>{
            if (!project.tags) {
                project.tags = this.assignTags(project);
            }
            Object.entries(project.tags).forEach(([category, tagList])=>{
                tagList.forEach((tag)=>allTags[category].add(tag));
            });
        });
        // Create filter sections
        Object.entries(allTags).forEach(([category, tagSet])=>{
            if (tagSet.size === 0) return;
            const section = document.createElement('div');
            section.className = 'filter-section';
            const title = document.createElement('h3');
            title.className = 'filter-section-title';
            title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            section.appendChild(title);
            const tagContainer = document.createElement('div');
            tagContainer.className = 'filter-tags';
            Array.from(tagSet).forEach((tagKey)=>{
                const tagDef = this.tagDefinitions[category]?.[tagKey];
                if (!tagDef) return;
                const button = document.createElement('button');
                button.className = 'filter-tag-btn';
                button.textContent = tagDef.label;
                button.style.setProperty('--tag-color', tagDef.color);
                button.dataset.category = category;
                button.dataset.tag = tagKey;
                button.addEventListener('click', ()=>{
                    button.classList.toggle('active');
                    this.triggerFilterChange();
                });
                tagContainer.appendChild(button);
            });
            section.appendChild(tagContainer);
            filterContainer.appendChild(section);
        });
        // Add clear filters button
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-filters-btn';
        clearBtn.textContent = 'Clear All Filters';
        clearBtn.addEventListener('click', ()=>{
            filterContainer.querySelectorAll('.filter-tag-btn.active').forEach((btn)=>{
                btn.classList.remove('active');
            });
            this.triggerFilterChange();
        });
        filterContainer.appendChild(clearBtn);
        return filterContainer;
    }
    static getActiveFilters(container) {
        const activeButtons = container.querySelectorAll('.filter-tag-btn.active');
        const filters = {
            difficulty: [],
            features: [],
            tech: []
        };
        activeButtons.forEach((btn)=>{
            const category = btn.dataset.category;
            const tag = btn.dataset.tag;
            if (filters[category]) {
                filters[category].push(tag);
            }
        });
        return filters;
    }
    static filterProjects(projects, activeFilters) {
        if (activeFilters.difficulty.length === 0 && activeFilters.features.length === 0 && activeFilters.tech.length === 0) {
            return projects;
        }
        return projects.filter((project)=>{
            if (!project.tags) {
                project.tags = this.assignTags(project);
            }
            // Check if project matches all active filters (AND logic within category, OR between categories)
            const matchesDifficulty = activeFilters.difficulty.length === 0 || activeFilters.difficulty.some((tag)=>project.tags.difficulty.includes(tag));
            const matchesFeatures = activeFilters.features.length === 0 || activeFilters.features.some((tag)=>project.tags.features.includes(tag));
            const matchesTech = activeFilters.tech.length === 0 || activeFilters.tech.some((tag)=>project.tags.tech.includes(tag));
            return matchesDifficulty && matchesFeatures && matchesTech;
        });
    }
    static triggerFilterChange() {
        const event = new CustomEvent('filtersChanged');
        document.dispatchEvent(event);
    }
}
// Add CSS for tags and filters
const style = document.createElement('style');
style.textContent = `
  .project-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
  }

  .project-tag {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    color: white;
  }

  .multi-filter-container {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .filter-section {
    margin-bottom: 20px;
  }

  .filter-section:last-of-type {
    margin-bottom: 0;
  }

  .filter-section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 10px;
    color: #374151;
  }

  .filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-tag-btn {
    padding: 6px 14px;
    border: 2px solid var(--tag-color);
    background: white;
    color: var(--tag-color);
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .filter-tag-btn:hover {
    background: var(--tag-color);
    color: white;
    transform: translateY(-1px);
  }

  .filter-tag-btn.active {
    background: var(--tag-color);
    color: white;
  }

  .clear-filters-btn {
    width: 100%;
    padding: 10px;
    margin-top: 16px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  }

  .clear-filters-btn:hover {
    background: #dc2626;
  }

  body.dark .multi-filter-container {
    background: #1f2937;
  }

  body.dark .filter-section-title {
    color: #f3f4f6;
  }

  body.dark .filter-tag-btn {
    background: #374151;
    color: white;
  }

  body.dark .filter-tag-btn:hover {
    background: var(--tag-color);
  }

  @media (max-width: 768px) {
    .multi-filter-container {
      padding: 16px;
    }

    .filter-tags {
      gap: 6px;
    }

    .filter-tag-btn {
      padding: 5px 12px;
      font-size: 12px;
    }
  }
`;
document.head.appendChild(style);
const __TURBOPACK__default__export__ = ProjectTags;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/projects.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var projects = [
    // ─── HTML Projects ────────────────────────────────────────────────────────
    {
        category: "HTML",
        title: "Accessible Audio Controller",
        iframeSrc: "HTML/Accessible Audio Controller.html",
        description: "A fully accessible audio player built with semantic HTML. Includes controls for play, pause, and volume adjustments.",
        codeFiles: [
            {
                name: "Accessible Audio Controller.html",
                src: "HTML/Accessible Audio Controller.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Book Catalog Table",
        iframeSrc: "HTML/Book Catalog Table.html",
        description: "Displays a catalog of books in a structured HTML table. Features headings and rows for easy reading.",
        codeFiles: [
            {
                name: "Book Catalog Table.html",
                src: "HTML/Book Catalog Table.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Bookstore Page",
        iframeSrc: "HTML/Bookstore Page.html",
        description: "Homepage for a bookstore highlighting books, categories, and featured items. Designed with clear layout.",
        codeFiles: [
            {
                name: "Bookstore Page.html",
                src: "HTML/Bookstore Page.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Cat Blog Page",
        iframeSrc: "HTML/Cat Blog Page.html",
        description: "A blog page dedicated to cats, showcasing posts, images, and a comments section with a clean layout.",
        codeFiles: [
            {
                name: "Cat Blog Page.html",
                src: "HTML/Cat Blog Page.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Cat Photo App",
        iframeSrc: "HTML/Cat Photo App.html",
        description: "Interactive app for browsing cat images. Features responsive design and user-friendly interface.",
        codeFiles: [
            {
                name: "Cat Photo App.html",
                src: "HTML/Cat Photo App.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Checkout Page",
        iframeSrc: "HTML/Checkout Page.html",
        description: "Complete checkout page with forms and pricing summary for e-commerce users.",
        codeFiles: [
            {
                name: "Checkout Page.html",
                src: "HTML/Checkout Page.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Coding Journey Blog Page",
        iframeSrc: "HTML/Coding Journey Blog Page.html",
        description: "Blog documenting coding tutorials, projects, and learning experiences with clear content structure.",
        codeFiles: [
            {
                name: "Coding Journey Blog Page.html",
                src: "HTML/Coding Journey Blog Page.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Event Hub",
        iframeSrc: "HTML/Event Hub.html",
        description: "Displays upcoming events with schedules and RSVP options, focusing on clarity and usability.",
        codeFiles: [
            {
                name: "Event Hub.html",
                src: "HTML/Event Hub.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Final Exam Table",
        iframeSrc: "HTML/Final Exam Table.html",
        description: "Organized table showing final exam schedules. Easy to read and structured layout.",
        codeFiles: [
            {
                name: "Final Exam Table.html",
                src: "HTML/Final Exam Table.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Heart Icon",
        iframeSrc: "HTML/Heart Icon.html",
        description: "A simple animated heart icon using HTML elements. Demonstrates basic styling and layout.",
        codeFiles: [
            {
                name: "Heart Icon.html",
                src: "HTML/Heart Icon.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Hotel Feedback Form",
        iframeSrc: "HTML/Hotel Feedback Form.html",
        description: "Interactive feedback form for hotel services with semantic HTML inputs.",
        codeFiles: [
            {
                name: "Hotel Feedback Form.html",
                src: "HTML/Hotel Feedback Form.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "HTML Audio and Video Player",
        iframeSrc: "HTML/HTML Audio and Video Player.html",
        description: "Page featuring HTML audio and video players with play, pause, and volume controls.",
        codeFiles: [
            {
                name: "HTML Audio and Video Player.html",
                src: "HTML/HTML Audio and Video Player.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "iframe Video Display",
        iframeSrc: "HTML/iframe Video Display.html",
        description: "Demonstrates embedding multiple videos using iframe with responsive layout.",
        codeFiles: [
            {
                name: "iframe Video Display.html",
                src: "HTML/iframe Video Display.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "List of Major Web Browsers",
        iframeSrc: "HTML/List of Major Web Browsers.html",
        description: "HTML page listing popular web browsers using structured content and headings.",
        codeFiles: [
            {
                name: "List of Major Web Browsers.html",
                src: "HTML/List of Major Web Browsers.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Movie Review Page",
        iframeSrc: "HTML/Movie Review Page.html",
        description: "Page for writing and displaying movie reviews with structured layout for readability.",
        codeFiles: [
            {
                name: "Movie Review Page.html",
                src: "HTML/Movie Review Page.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Multimedia Player",
        iframeSrc: "HTML/Multimedia Player.html",
        description: "Interactive multimedia player supporting audio and video playback with clear controls.",
        codeFiles: [
            {
                name: "Multimedia Player.html",
                src: "HTML/Multimedia Player.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Quincy's Job Tips Page",
        iframeSrc: "HTML/Quincy's Job Tips Page.html",
        description: "Page sharing job tips and career advice with readable layout and structured content.",
        codeFiles: [
            {
                name: "Quincy's Job Tips Page.html",
                src: "HTML/Quincy's Job Tips Page.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Recipe Page",
        iframeSrc: "HTML/Recipe Page.html",
        description: "Displays recipes with ingredients and instructions using clear HTML structure.",
        codeFiles: [
            {
                name: "Recipe Page.html",
                src: "HTML/Recipe Page.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Survey Form",
        iframeSrc: "HTML/Survey Form.html",
        description: "Simple survey form collecting user data using accessible HTML inputs.",
        codeFiles: [
            {
                name: "Survey Form.html",
                src: "HTML/Survey Form.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Tech Conference Schedule Table",
        iframeSrc: "HTML/Tech Conference Schedule Table.html",
        description: "Displays conference schedule in a structured table with session times and speakers.",
        codeFiles: [
            {
                name: "Tech Conference Schedule Table.html",
                src: "HTML/Tech Conference Schedule Table.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Travel Agency Page",
        iframeSrc: "HTML/Travel Agency Page.html",
        description: "Homepage for a travel agency highlighting destinations and services using clear layout.",
        codeFiles: [
            {
                name: "Travel Agency Page.html",
                src: "HTML/Travel Agency Page.html",
                lang: "html"
            }
        ]
    },
    {
        category: "HTML",
        title: "Video Compilation Page",
        iframeSrc: "HTML/Video Compilation Page.html",
        description: "Page compiling multiple videos for preview with responsive iframe layout.",
        codeFiles: [
            {
                name: "Video Compilation Page.html",
                src: "HTML/Video Compilation Page.html",
                lang: "html"
            }
        ]
    },
    // ─── CSS Projects ─────────────────────────────────────────────────────────
    {
        category: "CSS",
        title: "Availability Table",
        iframeSrc: "CSS/Availability Table/index.html",
        description: "Styled availability or calendar table with hover states and responsive design.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Availability Table/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Balance Sheet",
        iframeSrc: "CSS/Balance Sheet/index.html",
        description: "Financial layout styled with CSS featuring responsive columns and clean structure.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Balance Sheet/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Blog Post Card",
        iframeSrc: "CSS/Blog Post Card/index.html",
        description: "Visually appealing blog post card layout using hover and transition effects.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Blog Post Card/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Book Inventory App",
        iframeSrc: "CSS/Book Inventory App/index.html",
        description: "CSS-styled inventory display for books with responsive tables and clean visuals.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Book Inventory App/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Business Card",
        iframeSrc: "CSS/Business Card/index.html",
        description: "Professional business card layout using CSS typography and spacing techniques.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Business Card/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Cafe Menu",
        iframeSrc: "CSS/Cafe Menu/index.html",
        description: "Styled cafe menu with sections for food and drinks, featuring hover effects.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Cafe Menu/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Cat Painting",
        iframeSrc: "CSS/Cat Painting/index.html",
        description: "Creative CSS art project displaying a cat painting using shapes and layering.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Cat Painting/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "City Skyline",
        iframeSrc: "CSS/City Skyline/index.html",
        description: "CSS art project showing a city skyline using gradients, shapes, and responsive design.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/City Skyline/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Confidential Email Page",
        iframeSrc: "CSS/Confidential Email Page/index.html",
        description: "CSS-styled email template emphasizing confidentiality with layout and typography.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Confidential Email Page/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Contact Form",
        iframeSrc: "CSS/Contact Form/index.html",
        description: "Visually styled contact form featuring inputs, buttons, and responsive layout.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Contact Form/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "CSS Color Marker",
        iframeSrc: "CSS/CSS Color Marker/index.html",
        description: "Interactive CSS page for coloring markers with hover and responsive design.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/CSS Color Marker/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Event Flyer Page",
        iframeSrc: "CSS/Event Flyer Page/index.html",
        description: "A CSS-styled event flyer showcasing event details and attractive layout.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Event Flyer Page/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Feature Selection Page",
        iframeSrc: "CSS/Feature Selection Page/index.html",
        description: "Page highlighting product or app features with structured sections and styling.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Feature Selection Page/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Ferris Wheel",
        iframeSrc: "CSS/Ferris Wheel/index.html",
        description: "CSS art project displaying a Ferris wheel using shapes, rotation, and layering techniques.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Ferris Wheel/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Flappy Penguin",
        iframeSrc: "CSS/Flappy Penguin/index.html",
        description: "Interactive game page where a penguin moves through obstacles using CSS animations.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Flappy Penguin/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Flexbox Photo Gallery",
        iframeSrc: "CSS/Flexbox Photo Gallery/index.html",
        description: "Responsive photo gallery using CSS Flexbox with hover and animation effects.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Flexbox Photo Gallery/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Game Setting Panel",
        iframeSrc: "CSS/Game Setting Panel/index.html",
        description: "CSS layout for a game settings panel with organized controls and toggles.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Game Setting Panel/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Greeting Card",
        iframeSrc: "CSS/Greeting Card/index.html",
        description: "CSS-styled greeting card with decorative elements, layout, and hover effects.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Greeting Card/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "House Painting",
        iframeSrc: "CSS/House Painting/index.html",
        description: "Creative CSS project showing a house painting using layering and shapes.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/House Painting/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Job Application Form",
        iframeSrc: "CSS/Job Application Form/index.html",
        description: "CSS-styled form for submitting job applications with responsive fields.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Job Application Form/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Magazine",
        iframeSrc: "CSS/Magazine/index.html",
        description: "Magazine-style layout using CSS grid and typography for organized content.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Magazine/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Moon Orbit",
        iframeSrc: "CSS/Moon Orbit/index.html",
        description: "CSS animation project simulating the orbit of the moon around the earth.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Moon Orbit/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Newspaper Layout",
        iframeSrc: "CSS/Newspaper Layout/index.html",
        description: "CSS grid layout mimicking a newspaper with multiple columns and articles.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Newspaper Layout/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Newspaper Article",
        iframeSrc: "CSS/Newspaper Article/index.html",
        description: "Single newspaper article styled with CSS for readability and layout.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Newspaper Article/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Personal Portfolio",
        iframeSrc: "CSS/Personal Portfolio/index.html",
        description: "Portfolio page showcasing projects, skills, and contact info using CSS layout.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Personal Portfolio/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Piano",
        iframeSrc: "CSS/Piano/index.html",
        description: "Interactive CSS piano layout allowing users to click keys and play notes.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Piano/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Product Landing Page",
        iframeSrc: "CSS/Product Landing Page/index.html",
        description: "Landing page for a product using CSS for layout, images, and call-to-action buttons.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Product Landing Page/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Quiz Webpage",
        iframeSrc: "CSS/Quiz Webpage/index.html",
        description: "Interactive quiz page styled with CSS, showing questions and multiple choice answers.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Quiz Webpage/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Registration Form",
        iframeSrc: "CSS/Registration Form/index.html",
        description: "CSS-styled registration form with inputs, buttons, and responsive layout.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Registration Form/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Set Of Colored Boxes",
        iframeSrc: "CSS/Set Of Colored Boxes/index.html",
        description: "Page displaying colored boxes with CSS layout, hover effects, and responsive design.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Set Of Colored Boxes/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Technical Documentation Page",
        iframeSrc: "CSS/Technical Documentation Page/index.html",
        description: "CSS-styled documentation page showcasing text, code blocks, and clear sectioning.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Technical Documentation Page/index.html",
                lang: "html"
            }
        ]
    },
    {
        category: "CSS",
        title: "Tribute Page",
        iframeSrc: "CSS/Tribute Page/index.html",
        description: "CSS-styled tribute page highlighting a person or event with images and text layout.",
        codeFiles: [
            {
                name: "index.html",
                src: "CSS/Tribute Page/index.html",
                lang: "html"
            }
        ]
    },
    // ─── JavaScript Projects ───────────────────────────────────────────────────
    // DOM Manipulation Events (Web)
    {
        category: "JavaScript",
        title: "Emoji Reactor",
        iframeSrc: "Javascript/DOM Manipulation Events/Emoji Reactor/index.html",
        description: "Interactive app that reacts to user actions with fun emoji animations using DOM events.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/DOM Manipulation Events/Emoji Reactor/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/DOM Manipulation Events/Emoji Reactor/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/DOM Manipulation Events/Emoji Reactor/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Favorite Icon Toggler",
        iframeSrc: "Javascript/DOM Manipulation Events/Favorite Icon Toggler/index.html",
        description: "Toggle favorite icons on items using DOM click events and class manipulation.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/DOM Manipulation Events/Favorite Icon Toggler/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/DOM Manipulation Events/Favorite Icon Toggler/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/DOM Manipulation Events/Favorite Icon Toggler/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Football Team Cards",
        iframeSrc: "Javascript/DOM Manipulation Events/Football Team Cards/index.html",
        description: "Displays football player cards with filtering and DOM manipulation for dynamic content.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/DOM Manipulation Events/Football Team Cards/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/DOM Manipulation Events/Football Team Cards/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/DOM Manipulation Events/Football Team Cards/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "LightBox Viewer",
        iframeSrc: "Javascript/DOM Manipulation Events/LightBox Viewer/index.html",
        description: "Image lightbox viewer that opens full-screen previews on click using DOM events.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/DOM Manipulation Events/LightBox Viewer/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/DOM Manipulation Events/LightBox Viewer/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/DOM Manipulation Events/LightBox Viewer/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Music Instrument Filter",
        iframeSrc: "Javascript/DOM Manipulation Events/Music Instrument Filter/index.html",
        description: "Filter music instruments by category using dynamic DOM manipulation and event listeners.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/DOM Manipulation Events/Music Instrument Filter/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/DOM Manipulation Events/Music Instrument Filter/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/DOM Manipulation Events/Music Instrument Filter/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Real Time Counter",
        iframeSrc: "Javascript/DOM Manipulation Events/Real Time Counter/index.html",
        description: "Real-time counter with increment, decrement, and reset functionality via DOM events.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/DOM Manipulation Events/Real Time Counter/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/DOM Manipulation Events/Real Time Counter/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/DOM Manipulation Events/Real Time Counter/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Rock, Paper, Scissors Game",
        iframeSrc: "Javascript/DOM Manipulation Events/Rock, Paper, Scissors Game/index.html",
        description: "Classic Rock, Paper, Scissors game built with DOM events and game logic in JavaScript.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/DOM Manipulation Events/Rock, Paper, Scissors Game/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/DOM Manipulation Events/Rock, Paper, Scissors Game/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/DOM Manipulation Events/Rock, Paper, Scissors Game/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Story Telling App",
        iframeSrc: "Javascript/DOM Manipulation Events/Story Telling App/index.html",
        description: "Interactive story telling app that builds narratives dynamically through user choices.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/DOM Manipulation Events/Story Telling App/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/DOM Manipulation Events/Story Telling App/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/DOM Manipulation Events/Story Telling App/styles.css",
                lang: "css"
            }
        ]
    },
    // Asynchronous JavaScript (Web)
    {
        category: "JavaScript",
        title: "fCC Authors Page",
        iframeSrc: "Javascript/Asynchronous JavaScript/fCC Authors Page/index.html",
        description: "Fetches and displays freeCodeCamp authors asynchronously using the Fetch API.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Asynchronous JavaScript/fCC Authors Page/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Asynchronous JavaScript/fCC Authors Page/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Asynchronous JavaScript/fCC Authors Page/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "fCC Forum Leaderboard",
        iframeSrc: "Javascript/Asynchronous JavaScript/fCC Forum Leaderboard/index.html",
        description: "Fetches freeCodeCamp forum data and displays a leaderboard asynchronously.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Asynchronous JavaScript/fCC Forum Leaderboard/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Asynchronous JavaScript/fCC Forum Leaderboard/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Asynchronous JavaScript/fCC Forum Leaderboard/styles.css",
                lang: "css"
            }
        ]
    },
    // Regex (Web)
    {
        category: "JavaScript",
        title: "RegEx Sandbox",
        iframeSrc: "Javascript/Basic Regex/RegEx Sandbox/index.html",
        description: "Interactive sandbox for testing regular expressions with live match highlighting.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Basic Regex/RegEx Sandbox/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Basic Regex/RegEx Sandbox/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Basic Regex/RegEx Sandbox/styles.css",
                lang: "css"
            }
        ]
    },
    // Classes (Web)
    {
        category: "JavaScript",
        title: "Shopping Cart",
        iframeSrc: "Javascript/Classes/Shopping Cart/index.html",
        description: "A shopping cart built with JavaScript classes, supporting add, remove, and total calculations.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Classes/Shopping Cart/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Classes/Shopping Cart/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Classes/Shopping Cart/styles.css",
                lang: "css"
            }
        ]
    },
    // Debugging (Web)
    {
        category: "JavaScript",
        title: "Random Background Color Changer",
        iframeSrc: "Javascript/Debugging/Random Background Color Changer/index.html",
        description: "Generates random background colors on button click. Demonstrates debugging techniques.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Debugging/Random Background Color Changer/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Debugging/Random Background Color Changer/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Debugging/Random Background Color Changer/styles.css",
                lang: "css"
            }
        ]
    },
    // Functional Programming (Web)
    {
        category: "JavaScript",
        title: "Recipe Ingredient Convertor",
        iframeSrc: "Javascript/Functional Programming/Recipe Ingredient Convertor/index.html",
        description: "Converts recipe ingredient quantities using functional programming concepts.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Functional Programming/Recipe Ingredient Convertor/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Functional Programming/Recipe Ingredient Convertor/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Functional Programming/Recipe Ingredient Convertor/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Sorting Visualizer",
        iframeSrc: "Javascript/Functional Programming/Sorting Visualizer/index.html",
        description: "Visual representation of sorting algorithms built with functional programming principles.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Functional Programming/Sorting Visualizer/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Functional Programming/Sorting Visualizer/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Functional Programming/Sorting Visualizer/styles.css",
                lang: "css"
            }
        ]
    },
    // JavaScript And Accessibility (Web)
    {
        category: "JavaScript",
        title: "Note Taking App",
        iframeSrc: "Javascript/JavaScript And Accessibility/Note Taking App/index.html",
        description: "Accessible note-taking app with create, edit, and delete functionality using DOM manipulation.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/JavaScript And Accessibility/Note Taking App/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/JavaScript And Accessibility/Note Taking App/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/JavaScript And Accessibility/Note Taking App/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Planet Tablists",
        iframeSrc: "Javascript/JavaScript And Accessibility/Planet Tablists/index.html",
        description: "Tabbed interface displaying planet information with accessible keyboard navigation.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/JavaScript And Accessibility/Planet Tablists/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/JavaScript And Accessibility/Planet Tablists/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/JavaScript And Accessibility/Planet Tablists/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Theme Switcher",
        iframeSrc: "Javascript/JavaScript And Accessibility/Theme Switcher/index.html",
        description: "Accessible theme switcher toggling between light and dark mode with ARIA attributes.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/JavaScript And Accessibility/Theme Switcher/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/JavaScript And Accessibility/Theme Switcher/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/JavaScript And Accessibility/Theme Switcher/styles.css",
                lang: "css"
            }
        ]
    },
    // Misc Web Projects (JavaScript)
    {
        category: "JavaScript",
        title: "Weather App",
        iframeSrc: "Javascript/Weather App/index.html",
        description: "Fetches live weather data from an API and displays current conditions and forecasts.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Weather App/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Weather App/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Weather App/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Drum Machine",
        iframeSrc: "Javascript/Drum Machine/index.html",
        description: "Interactive drum machine with clickable pads and keyboard support for beat creation.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Drum Machine/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Drum Machine/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Drum Machine/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Palindrome Checker",
        iframeSrc: "Javascript/Palindrome Checker/index.html",
        description: "Checks whether a given word or phrase is a palindrome, ignoring spaces and punctuation.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Palindrome Checker/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Palindrome Checker/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Palindrome Checker/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Markdown to HTML Converter",
        iframeSrc: "Javascript/Markdown to HTML Converter/index.html",
        description: "Converts Markdown text to HTML in real time with a live side-by-side preview.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Markdown to HTML Converter/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Markdown to HTML Converter/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Markdown to HTML Converter/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Spam Filter",
        iframeSrc: "Javascript/Spam Filter/index.html",
        description: "Detects and flags spam content in user-submitted messages using regex pattern matching.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Spam Filter/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Spam Filter/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Spam Filter/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Portfolio",
        iframeSrc: "Javascript/Portfolio/index.html",
        description: "Personal developer portfolio page showcasing projects and skills with smooth navigation.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Portfolio/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Portfolio/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Portfolio/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Decimal To Binary Convertor",
        iframeSrc: "Javascript/Recursion/Decimal To Binary Convertor/index.html",
        description: "Converts decimal numbers to binary using recursion with animated call-stack visualization.",
        codeFiles: [
            {
                name: "index.html",
                src: "Javascript/Recursion/Decimal To Binary Convertor/index.html",
                lang: "html"
            },
            {
                name: "script.js",
                src: "Javascript/Recursion/Decimal To Binary Convertor/script.js",
                lang: "javascript"
            },
            {
                name: "styles.css",
                src: "Javascript/Recursion/Decimal To Binary Convertor/styles.css",
                lang: "css"
            }
        ]
    },
    // Code-only JavaScript Projects
    {
        category: "JavaScript",
        title: "Golf Score Translator",
        iframeSrc: null,
        description: "Translates golf scores into their named equivalents (Birdie, Eagle, Bogey, etc.).",
        codeFiles: [
            {
                name: "Golf Score Translator.js",
                src: "Javascript/Arrays/Golf Score Translator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Lunch Picker Program",
        iframeSrc: null,
        description: "Randomly picks a lunch option from a list using array methods.",
        codeFiles: [
            {
                name: "Lunch Picker Program.js",
                src: "Javascript/Arrays/Lunch Picker Program.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Shopping List",
        iframeSrc: null,
        description: "Manages a shopping list with add and remove operations using JavaScript arrays.",
        codeFiles: [
            {
                name: "Shopping List.js",
                src: "Javascript/Arrays/Shopping List.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Bank Account Management Program",
        iframeSrc: null,
        description: "Simulates bank account operations including deposit, withdrawal, and balance tracking.",
        codeFiles: [
            {
                name: "script.js",
                src: "Javascript/Bank Account Management Program/script.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Pig Latin Translator",
        iframeSrc: null,
        description: "Translates English words and sentences into Pig Latin using regex and string manipulation.",
        codeFiles: [
            {
                name: "Pig Latin Translator.js",
                src: "Javascript/Basic Regex/Pig Latin Translator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Smart Word Replacement Function",
        iframeSrc: null,
        description: "Replaces specific words in a string intelligently using regular expressions.",
        codeFiles: [
            {
                name: "Smart Word Replacement Function.js",
                src: "Javascript/Basic Regex/Smart Word Replacement Function.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Spinal Case Convertor",
        iframeSrc: null,
        description: "Converts camelCase and other string formats into spinal-case using regex.",
        codeFiles: [
            {
                name: "Spinal Case Convertor.js",
                src: "Javascript/Basic Regex/Spinal Case Convertor.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Fortune Teller",
        iframeSrc: null,
        description: "Generates random fortune predictions using boolean logic and random number generation.",
        codeFiles: [
            {
                name: "Fortune Teller.js",
                src: "Javascript/Booleans And Numbers/Fortune Teller.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Logic Checker App",
        iframeSrc: null,
        description: "Evaluates logical expressions and returns boolean results with explanations.",
        codeFiles: [
            {
                name: "Logic Checker App.js",
                src: "Javascript/Booleans And Numbers/Logic Checker App.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Mathbot",
        iframeSrc: null,
        description: "A simple math bot that performs arithmetic operations and answers number questions.",
        codeFiles: [
            {
                name: "Mathbot.js",
                src: "Javascript/Booleans And Numbers/Mathbot.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Date Conversion Program",
        iframeSrc: null,
        description: "Converts dates between different formats using the JavaScript Date object.",
        codeFiles: [
            {
                name: "Date Conversion Program.js",
                src: "Javascript/Dates/Date Conversion Program.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Calculator",
        iframeSrc: null,
        description: "A function-based calculator supporting addition, subtraction, multiplication, and division.",
        codeFiles: [
            {
                name: "Calculator.js",
                src: "Javascript/Functions/Calculator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Card Counting Assistant",
        iframeSrc: null,
        description: "Implements a card counting algorithm to track the running count during a card game.",
        codeFiles: [
            {
                name: "Card Counting Assistant.js",
                src: "Javascript/Functions/Card Counting Assistant.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Celsius to Fahrenheit Converter",
        iframeSrc: null,
        description: "Converts temperature values between Celsius and Fahrenheit using a pure function.",
        codeFiles: [
            {
                name: "Celsius to Fahrenheit Converter.js",
                src: "Javascript/Functions/Celsius to Fahrenheit Converter.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Email Masker",
        iframeSrc: null,
        description: "Masks email addresses for privacy by replacing parts of the string with asterisks.",
        codeFiles: [
            {
                name: "Email Masker.js",
                src: "Javascript/Functions/Email Masker.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Leap Year Calculator",
        iframeSrc: null,
        description: "Determines whether a given year is a leap year using conditional logic.",
        codeFiles: [
            {
                name: "Leap Year Calculator.js",
                src: "Javascript/Functions/Leap Year Calculator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Loan Qualification Checker",
        iframeSrc: null,
        description: "Checks whether a person qualifies for a loan based on income, credit score, and debt.",
        codeFiles: [
            {
                name: "Loan Qualification Checker.js",
                src: "Javascript/Functions/Loan Qualification Checker.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Optional Arguments Sum Function",
        iframeSrc: null,
        description: "Implements a curried sum function that accepts optional arguments flexibly.",
        codeFiles: [
            {
                name: "script.js",
                src: "Javascript/Functional Programming/Optional Arguments Sum Function/script.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Library Manager",
        iframeSrc: null,
        description: "Manages a library of books using higher-order functions like map, filter, and reduce.",
        codeFiles: [
            {
                name: "Library Manager.js",
                src: "Javascript/High Order Functions and CallBacks/Library Manager.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Prime Number Sum Calculator",
        iframeSrc: null,
        description: "Calculates the sum of prime numbers in a range using higher-order functions.",
        codeFiles: [
            {
                name: "Prime Number Sum Calculator.js",
                src: "Javascript/High Order Functions and CallBacks/Prime Number Sum Calculator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Caesars Cipher",
        iframeSrc: null,
        description: "Encodes and decodes messages using the Caesar cipher shifting algorithm.",
        codeFiles: [
            {
                name: "Caesars Cipher.js",
                src: "Javascript/JavaScript Algorithms and Data Structures Projects/Caesars Cipher.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Cash Register",
        iframeSrc: null,
        description: "Simulates a cash register that calculates change using available denominations.",
        codeFiles: [
            {
                name: "Cash Register.js",
                src: "Javascript/JavaScript Algorithms and Data Structures Projects/Cash Register.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Roman Numeral Converter",
        iframeSrc: null,
        description: "Converts integers to Roman numeral representation using lookup tables and loops.",
        codeFiles: [
            {
                name: "Roman Numeral Converter.js",
                src: "Javascript/JavaScript Algorithms and Data Structures Projects/Roman Numeral Converter.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Telephone Number Validator",
        iframeSrc: null,
        description: "Validates US telephone numbers using regular expressions and string parsing.",
        codeFiles: [
            {
                name: "Telephone Number Validator.js",
                src: "Javascript/JavaScript Algorithms and Data Structures Projects/Telephone Number Validator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Password Generator App",
        iframeSrc: null,
        description: "Generates secure random passwords with configurable length and character sets.",
        codeFiles: [
            {
                name: "Password Generator App.js",
                src: "Javascript/JavaScript Fundamentals Review/Password Generator App.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Pyramid Generator",
        iframeSrc: null,
        description: "Generates pyramid shapes from characters in the console using loops and string concatenation.",
        codeFiles: [
            {
                name: "Pyramid Generator.js",
                src: "Javascript/JavaScript Fundamentals Review/Pyramid Generator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Gradebook App",
        iframeSrc: null,
        description: "Tracks student grades and calculates averages, letter grades, and class statistics.",
        codeFiles: [
            {
                name: "Gradebook App.js",
                src: "Javascript/JavaScript Fundamentals Review/Gradebook App.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Title Case Converter",
        iframeSrc: null,
        description: "Converts strings to title case by capitalising the first letter of each word.",
        codeFiles: [
            {
                name: "Title Case Converter.js",
                src: "Javascript/JavaScript Fundamentals Review/Title Case Converter.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Counter",
        iframeSrc: null,
        description: "LeetCode challenge: implements a counter function that increments on each call.",
        codeFiles: [
            {
                name: "Counter.js",
                src: "Javascript/Leetcode/Counter.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Memoize",
        iframeSrc: null,
        description: "LeetCode challenge: implements memoization to cache function results for performance.",
        codeFiles: [
            {
                name: "Memoize.js",
                src: "Javascript/Leetcode/Memoize.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Debounce",
        iframeSrc: null,
        description: "LeetCode challenge: implements a debounce function to limit the rate of function calls.",
        codeFiles: [
            {
                name: "Debounce.js",
                src: "Javascript/Leetcode/Debounce.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Flatten Deeply Nested Array",
        iframeSrc: null,
        description: "LeetCode challenge: flattens a nested array to a specified depth using recursion.",
        codeFiles: [
            {
                name: "Flatten Deeply Nested Array.js",
                src: "Javascript/Leetcode/Flatten Deeply Nested Array.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Factorial Calculator",
        iframeSrc: null,
        description: "Calculates the factorial of a number using both iterative and recursive approaches.",
        codeFiles: [
            {
                name: "Factorial Calculator.js",
                src: "Javascript/Loops/Factorial Calculator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Sentence Analyzer",
        iframeSrc: null,
        description: "Analyzes a sentence and returns word count, character count, and longest word.",
        codeFiles: [
            {
                name: "Sentence Analyzer.js",
                src: "Javascript/Loops/Sentence Analyzer.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Quiz Game",
        iframeSrc: null,
        description: "Text-based quiz game using JavaScript objects to store questions, answers, and scores.",
        codeFiles: [
            {
                name: "Quiz Game.js",
                src: "Javascript/Objects/Quiz Game.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Recipe Tracker",
        iframeSrc: null,
        description: "Tracks recipes and their ingredients using JavaScript objects and array methods.",
        codeFiles: [
            {
                name: "Recipe Tracker.js",
                src: "Javascript/Objects/Recipe Tracker.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Permutation Generator",
        iframeSrc: null,
        description: "Generates all permutations of a string or array using recursive backtracking.",
        codeFiles: [
            {
                name: "Permutation Generator.js",
                src: "Javascript/Recursion/Permutation Generator.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Greeting Bot",
        iframeSrc: null,
        description: "A simple chatbot that greets users based on the time of day using string manipulation.",
        codeFiles: [
            {
                name: "Greeting Bot.js",
                src: "Javascript/Variables and Strings/Greeting Bot.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Teacher Chatbot",
        iframeSrc: null,
        description: "A chatbot that answers basic questions using conditional logic and string matching.",
        codeFiles: [
            {
                name: "Teacher Chatbot.js",
                src: "Javascript/Variables and Strings/Teacher Chatbot.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Voting System",
        iframeSrc: null,
        description: "Simulates a voting system that tallies votes and announces the winner.",
        codeFiles: [
            {
                name: "script.js",
                src: "Javascript/Voting System/script.js",
                lang: "javascript"
            }
        ]
    },
    {
        category: "JavaScript",
        title: "Project Idea Board",
        iframeSrc: null,
        description: "Manages project ideas using JavaScript classes with add, remove, and display methods.",
        codeFiles: [
            {
                name: "Project Idea Board.js",
                src: "Javascript/Classes/Project Idea Board.js",
                lang: "javascript"
            }
        ]
    },
    // ─── Python Projects ───────────────────────────────────────────────────────
    {
        category: "Python",
        title: "Budget App",
        iframeSrc: null,
        description: "Tracks income and expenses across spending categories with a visual bar chart summary.",
        codeFiles: [
            {
                name: "Budget App.py",
                src: "Python/Budget App.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Caesar Cipher",
        iframeSrc: null,
        description: "Encrypts and decrypts messages using the Caesar cipher shift algorithm.",
        codeFiles: [
            {
                name: "Caesar Cipher.py",
                src: "Python/Caesar Cipher.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Binary Search Algorithm",
        iframeSrc: null,
        description: "Implements binary search to efficiently find elements in a sorted list.",
        codeFiles: [
            {
                name: "Binary Search Algorithm.py",
                src: "Python/Binary Search Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Merge Sort Algorithm",
        iframeSrc: null,
        description: "Sorts a list using the merge sort divide-and-conquer algorithm.",
        codeFiles: [
            {
                name: "Merge Sort Algorithm.py",
                src: "Python/Merge Sort Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Quicksort Algorithm",
        iframeSrc: null,
        description: "Implements the quicksort algorithm with pivot selection and partitioning.",
        codeFiles: [
            {
                name: "Quicksort Algorithm.py",
                src: "Python/Quicksort Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Breadth-First Search Algorithm",
        iframeSrc: null,
        description: "Traverses a graph level-by-level using a queue-based BFS implementation.",
        codeFiles: [
            {
                name: "Breadth-First Search Algorithm.py",
                src: "Python/Breadth-First Search Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Depth-First Search Algorithm",
        iframeSrc: null,
        description: "Traverses a graph by exploring as far as possible before backtracking using DFS.",
        codeFiles: [
            {
                name: "Depth-First Search Algorithm.py",
                src: "Python/Depth-First Search Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Shortest Path Algorithm",
        iframeSrc: null,
        description: "Finds the shortest path between two nodes in a weighted graph using Dijkstra's algorithm.",
        codeFiles: [
            {
                name: "Shortest Path Algorithm.py",
                src: "Python/Shortest Path Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Linked List",
        iframeSrc: null,
        description: "Implements a singly linked list with insert, delete, and traversal operations.",
        codeFiles: [
            {
                name: "Linked List.py",
                src: "Python/Linked List.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Hash Table",
        iframeSrc: null,
        description: "Implements a hash table with collision handling using chaining.",
        codeFiles: [
            {
                name: "Hash Table.py",
                src: "Python/Hash Table.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Luhn Algorithm",
        iframeSrc: null,
        description: "Validates credit card numbers using the Luhn checksum algorithm.",
        codeFiles: [
            {
                name: "Luhn Algorithm.py",
                src: "Python/Luhn Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Bisection Method",
        iframeSrc: null,
        description: "Finds roots of equations numerically using the bisection method.",
        codeFiles: [
            {
                name: "Bisection Method.py",
                src: "Python/Bisection Method.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Tower of Hanoi Algorithm",
        iframeSrc: null,
        description: "Solves the Tower of Hanoi puzzle recursively and prints each move.",
        codeFiles: [
            {
                name: "Tower of Hanoi Algorithm.py",
                src: "Python/Tower of Hanoi Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "N-Queens Algorithm",
        iframeSrc: null,
        description: "Solves the N-Queens problem using backtracking to place queens on a chessboard.",
        codeFiles: [
            {
                name: "N-Queens Algorithm.py",
                src: "Python/N-Queens Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Polygon Area Calculator",
        iframeSrc: null,
        description: "Calculates the area and perimeter of rectangles and squares using Python classes.",
        codeFiles: [
            {
                name: "Polygon Area Calculator.py",
                src: "Python/Polygon Area Calculator.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Discount Calculator",
        iframeSrc: null,
        description: "Calculates discounted prices based on percentage off and promotional rules.",
        codeFiles: [
            {
                name: "Discount Calculator.py",
                src: "Python/Discount Calculator.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "ISBN Validator",
        iframeSrc: null,
        description: "Validates ISBN-10 and ISBN-13 numbers using checksum verification.",
        codeFiles: [
            {
                name: "ISBN Validator.py",
                src: "Python/ISBN Validator.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Medical Data Validator",
        iframeSrc: null,
        description: "Validates patient medical data fields such as age, blood pressure, and BMI ranges.",
        codeFiles: [
            {
                name: "Medical Data Validator.py",
                src: "Python/Medical Data Validator.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Email Simulator",
        iframeSrc: null,
        description: "Simulates an email inbox with compose, read, and delete operations using OOP.",
        codeFiles: [
            {
                name: "Email Simulator.py",
                src: "Python/Email Simulator.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Game Character Stats Tracker",
        iframeSrc: null,
        description: "Tracks RPG character stats like health, attack, and defense using Python classes.",
        codeFiles: [
            {
                name: "Game Character Stats Tracker.py",
                src: "Python/Game Character Stats Tracker.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Media Catalog",
        iframeSrc: null,
        description: "Catalogues movies, books, and music using inheritance and polymorphism.",
        codeFiles: [
            {
                name: "Media Catalog.py",
                src: "Python/Media Catalog.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Musical Instrument Inventory",
        iframeSrc: null,
        description: "Manages a musical instrument shop inventory with stock and pricing using OOP.",
        codeFiles: [
            {
                name: "Musical Instrument Inventory.py",
                src: "Python/Musical Instrument Inventory.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Salary Tracker",
        iframeSrc: null,
        description: "Tracks employee salaries and calculates totals, averages, and raises.",
        codeFiles: [
            {
                name: "Salary Tracker.py",
                src: "Python/Salary Tracker.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Number Pattern Generator",
        iframeSrc: null,
        description: "Generates numeric patterns and sequences like triangles and Pascal's triangle.",
        codeFiles: [
            {
                name: "Number Pattern Generator.py",
                src: "Python/Number Pattern Generator.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Nth Fibonacci Number Calculator",
        iframeSrc: null,
        description: "Calculates the Nth Fibonacci number using both iterative and memoized recursive methods.",
        codeFiles: [
            {
                name: "Nth Fibonacci Number Calculator.py",
                src: "Python/Nth Fibonacci Number Calculator.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Pin Extractor",
        iframeSrc: null,
        description: "Extracts and validates PIN codes from text input using string parsing techniques.",
        codeFiles: [
            {
                name: "Pin Extractor.py",
                src: "Python/Pin Extractor.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Planet Class",
        iframeSrc: null,
        description: "Models planets with properties like mass, radius, and gravity using Python classes.",
        codeFiles: [
            {
                name: "Planet Class.py",
                src: "Python/Planet Class.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Player Interface",
        iframeSrc: null,
        description: "Defines a player interface for a game with movement, health, and action methods.",
        codeFiles: [
            {
                name: "Player Interface.py",
                src: "Python/Player Interface.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "RPG Character",
        iframeSrc: null,
        description: "Creates an RPG character with stats, leveling, and combat using Python OOP.",
        codeFiles: [
            {
                name: "RPG Character.py",
                src: "Python/RPG Character.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Selection Sort Algorithm",
        iframeSrc: null,
        description: "Sorts a list by repeatedly selecting the minimum element and placing it in order.",
        codeFiles: [
            {
                name: "Selection Sort Algorithm.py",
                src: "Python/Selection Sort Algorithm.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "Adjacency List to Matrix Converter",
        iframeSrc: null,
        description: "Converts a graph represented as an adjacency list into an adjacency matrix.",
        codeFiles: [
            {
                name: "Adjacency List to Matrix Converter.py",
                src: "Python/Adjacency List to Matrix Converter.py",
                lang: "python"
            }
        ]
    },
    {
        category: "Python",
        title: "User Configuration Manager",
        iframeSrc: null,
        description: "Manages user configuration settings with read, write, and reset operations.",
        codeFiles: [
            {
                name: "User Configuration Manager.py",
                src: "Python/User Configuration Manager.py",
                lang: "python"
            }
        ]
    },
    // ─── React Projects ────────────────────────────────────────────────────────
    {
        category: "React",
        title: "Color Picker App",
        iframeSrc: "React/Color Picker App/index.html",
        description: "Interactive color picker built with React hooks that lets users select and preview colors.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Color Picker App/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Color Picker App/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Color Picker App/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Currency Converter",
        iframeSrc: "React/Currency Converter/index.html",
        description: "Converts between currencies in real time using React state management and input handling.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Currency Converter/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Currency Converter/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Currency Converter/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Event RSVP",
        iframeSrc: "React/Event RSVP/index.html",
        description: "Event RSVP form built with React, managing attendee state and confirmation messages.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Event RSVP/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Event RSVP/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Event RSVP/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Fruit Search App",
        iframeSrc: "React/Fruit Search App/index.html",
        description: "Search and filter a list of fruits in real time using React controlled inputs and state.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Fruit Search App/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Fruit Search App/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Fruit Search App/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Mood Board",
        iframeSrc: "React/Mood Board/index.html",
        description: "A mood board app where users can add, move, and remove mood cards using React state.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Mood Board/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Mood Board/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Mood Board/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "One-Time Password Generator",
        iframeSrc: "React/One-Time Password Generator/index.html",
        description: "Generates one-time passwords with a countdown timer using React hooks and state.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/One-Time Password Generator/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/One-Time Password Generator/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/One-Time Password Generator/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Reusable Mega Navbar",
        iframeSrc: "React/Reusable Mega Navbar/index.html",
        description: "A reusable mega navbar component with dropdowns and responsive design built in React.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Reusable Mega Navbar/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Reusable Mega Navbar/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Reusable Mega Navbar/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Reusable Profile Card Component",
        iframeSrc: "React/Reusable Profile Card Component/index.html",
        description: "A reusable profile card React component displaying avatar, name, bio, and social links.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Reusable Profile Card Component/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Reusable Profile Card Component/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Reusable Profile Card Component/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Reusable Footer",
        iframeSrc: "React/Reusable Footer/index.html",
        description: "A configurable reusable footer React component with links, branding, and copyright info.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Reusable Footer/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Reusable Footer/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Reusable Footer/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Shopping List App",
        iframeSrc: "React/Shopping List App/index.html",
        description: "A shopping list React app with add, check-off, and delete item functionality.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Shopping List App/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Shopping List App/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Shopping List App/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "SuperHero Application Form",
        iframeSrc: "React/SuperHero Application Form/index.html",
        description: "A fun superhero registration form built with React controlled components and validation.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/SuperHero Application Form/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/SuperHero Application Form/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/SuperHero Application Form/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Tic-Tac-Toe Game",
        iframeSrc: "React/Tic-Tac-Toe Game/index.html",
        description: "Classic Tic-Tac-Toe game with win detection and restart functionality built in React.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Tic-Tac-Toe Game/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Tic-Tac-Toe Game/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Tic-Tac-Toe Game/styles.css",
                lang: "css"
            }
        ]
    },
    {
        category: "React",
        title: "Toggle Text App",
        iframeSrc: "React/Toggle Text App/index.html",
        description: "Toggles between different text states on button click using React useState hook.",
        codeFiles: [
            {
                name: "index.jsx",
                src: "React/Toggle Text App/index.jsx",
                lang: "jsx"
            },
            {
                name: "index.html",
                src: "React/Toggle Text App/index.html",
                lang: "html"
            },
            {
                name: "styles.css",
                src: "React/Toggle Text App/styles.css",
                lang: "css"
            }
        ]
    }
];
const __TURBOPACK__default__export__ = projects;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Portfolio.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Portfolio
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
// Import existing components (will be migrated to TS later)
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/analytics.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$keyboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/keyboard.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/storage.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Toast.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProjectTags$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ProjectTags.js [app-client] (ecmascript)");
// Import projects data
// @ts-ignore - projects.js is a plain JS file
var __TURBOPACK__imported__module__$5b$project$5d2f$projects$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/projects.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function Portfolio() {
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [projects] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$projects$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Portfolio.useEffect": ()=>{
            setMounted(true);
            // Initialize global instances
            if ("TURBOPACK compile-time truthy", 1) {
                window.analytics = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$analytics$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Analytics"]();
                window.keyboard = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$keyboard$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["KeyboardShortcuts"]();
                window.storage = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$storage$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Storage"];
                window.Toast = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"];
                // Track page view
                window.analytics.trackPageView();
                // Initialize enhanced features
                initializeEnhancedFeatures();
            }
        }
    }["Portfolio.useEffect"], []);
    function initializeEnhancedFeatures() {
        // Setup keyboard shortcuts
        setupKeyboardShortcuts();
        // Setup bookmarks
        setupBookmarks();
        // Assign tags to projects
        projects.forEach((project)=>{
            if (!project.tags) {
                project.tags = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ProjectTags$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ProjectTags"].assignTags(project);
            }
        });
        // Show welcome message
        const summary = window.analytics.getSummary();
        if (summary.totalVisits === 1) {
            setTimeout(()=>{
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"].success('Welcome to Saad Web Experiments! 👋', {
                    duration: 5000
                });
            }, 1000);
        }
        console.log('✨ Enhanced features initialized');
    }
    function setupKeyboardShortcuts() {
        const searchInput = document.getElementById('search-input');
        // Focus search (/)
        window.keyboard.register('/', ()=>{
            searchInput?.focus();
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"].info('Search focused');
        });
        // Clear search (Escape)
        window.keyboard.register('Escape', ()=>{
            if (searchInput?.value) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"].info('Search cleared');
            }
        });
        // Toggle dark mode (Ctrl+D)
        window.keyboard.register('d', ()=>{
            document.getElementById('theme-toggle')?.click();
        }, {
            ctrl: true
        });
        // Show bookmarks (Ctrl+B)
        window.keyboard.register('b', ()=>{
            showBookmarksModal();
        }, {
            ctrl: true
        });
        // Show help (Shift+?)
        window.keyboard.register('?', ()=>{
            showKeyboardShortcutsHelp();
        }, {
            shift: true
        });
    }
    function setupBookmarks() {
        window.bookmarks = {
            add: (projectId, projectTitle)=>{
                const bookmarks = window.storage.get('bookmarks', []);
                if (!bookmarks.find((b)=>b.id === projectId)) {
                    bookmarks.push({
                        id: projectId,
                        title: projectTitle,
                        timestamp: Date.now()
                    });
                    window.storage.set('bookmarks', bookmarks);
                    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"].success('Bookmark added');
                    return true;
                }
                return false;
            },
            remove: (projectId)=>{
                const bookmarks = window.storage.get('bookmarks', []);
                const filtered = bookmarks.filter((b)=>b.id !== projectId);
                window.storage.set('bookmarks', filtered);
                __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"].info('Bookmark removed');
            },
            has: (projectId)=>{
                const bookmarks = window.storage.get('bookmarks', []);
                return bookmarks.some((b)=>b.id === projectId);
            },
            getAll: ()=>window.storage.get('bookmarks', [])
        };
    }
    function showBookmarksModal() {
        // Implementation from index-enhanced.html
        const bookmarks = window.bookmarks.getAll();
        if (bookmarks.length === 0) {
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Toast$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toast"].info('No bookmarks yet. Start bookmarking projects!');
            return;
        }
    // Modal implementation...
    }
    function showKeyboardShortcutsHelp() {
        // Implementation from index-enhanced.html
        const shortcuts = window.keyboard.getAll();
    // Modal implementation...
    }
    if (!mounted) {
        return null;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "site-header",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container header-row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "site-title",
                                    children: "Saad Web Experiments"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Portfolio.tsx",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "lead",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: "Muhammad Saad Amin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Portfolio.tsx",
                                                lineNumber: 151,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 151,
                                            columnNumber: 15
                                        }, this),
                                        ", a passionate ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Software Engineer"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 151,
                                            columnNumber: 74
                                        }, this),
                                        ", created this project during the ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Free Code Camp"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 152,
                                            columnNumber: 47
                                        }, this),
                                        " course while earning the",
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("em", {
                                            children: "Responsive Web Design Certification"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 153,
                                            columnNumber: 15
                                        }, this),
                                        ". This project includes web pages and scripts demonstrating principles of ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "HTML"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 154,
                                            columnNumber: 43
                                        }, this),
                                        ", ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "CSS"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 154,
                                            columnNumber: 66
                                        }, this),
                                        ", ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "JavaScript"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 154,
                                            columnNumber: 88
                                        }, this),
                                        ",",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "Python"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 155,
                                            columnNumber: 15
                                        }, this),
                                        ", and ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: "React"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 155,
                                            columnNumber: 44
                                        }, this),
                                        "."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Portfolio.tsx",
                                    lineNumber: 150,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Portfolio.tsx",
                            lineNumber: 148,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            id: "theme-toggle",
                            className: "theme-toggle",
                            "aria-label": "Toggle dark mode",
                            children: "🌙"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Portfolio.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Portfolio.tsx",
                    lineNumber: 147,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Portfolio.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "search-bar",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    width: "24",
                                    height: "24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2",
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                            cx: "11",
                                            cy: "11",
                                            r: "8"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                                            x1: "21",
                                            y1: "21",
                                            x2: "16.65",
                                            y2: "16.65"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/Portfolio.tsx",
                                            lineNumber: 171,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/Portfolio.tsx",
                                    lineNumber: 168,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                    type: "text",
                                    id: "search-input",
                                    placeholder: "Search projects... (Press / to focus)"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Portfolio.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Portfolio.tsx",
                            lineNumber: 167,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Portfolio.tsx",
                        lineNumber: 166,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "filter-tabs",
                        id: "filter-tabs",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "filter-btn active",
                                "data-filter": "All",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "filter-icon",
                                        children: "🗂️"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Portfolio.tsx",
                                        lineNumber: 180,
                                        columnNumber: 13
                                    }, this),
                                    " All"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Portfolio.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "filter-btn",
                                "data-filter": "HTML",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "filter-icon",
                                        children: "🌐"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Portfolio.tsx",
                                        lineNumber: 183,
                                        columnNumber: 13
                                    }, this),
                                    " HTML"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Portfolio.tsx",
                                lineNumber: 182,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "filter-btn",
                                "data-filter": "CSS",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "filter-icon",
                                        children: "🎨"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Portfolio.tsx",
                                        lineNumber: 186,
                                        columnNumber: 13
                                    }, this),
                                    " CSS"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Portfolio.tsx",
                                lineNumber: 185,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "filter-btn",
                                "data-filter": "JavaScript",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "filter-icon",
                                        children: "⚡"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Portfolio.tsx",
                                        lineNumber: 189,
                                        columnNumber: 13
                                    }, this),
                                    " JavaScript"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Portfolio.tsx",
                                lineNumber: 188,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "filter-btn",
                                "data-filter": "Python",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "filter-icon",
                                        children: "🐍"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Portfolio.tsx",
                                        lineNumber: 192,
                                        columnNumber: 13
                                    }, this),
                                    " Python"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Portfolio.tsx",
                                lineNumber: 191,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                className: "filter-btn",
                                "data-filter": "React",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "filter-icon",
                                        children: "⚛️"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Portfolio.tsx",
                                        lineNumber: 195,
                                        columnNumber: 13
                                    }, this),
                                    " React"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/Portfolio.tsx",
                                lineNumber: 194,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Portfolio.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "results-meta",
                        id: "results-meta"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Portfolio.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        id: "project-container",
                        className: "grid"
                    }, void 0, false, {
                        fileName: "[project]/src/components/Portfolio.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Portfolio.tsx",
                lineNumber: 164,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
                className: "site-footer",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "container",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: [
                                "© ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                    children: "Muhammad Saad Amin"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Portfolio.tsx",
                                    lineNumber: 208,
                                    columnNumber: 16
                                }, this),
                                " — Free Code Camp Projects"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Portfolio.tsx",
                            lineNumber: 208,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "footer-hint",
                            children: [
                                "Press ",
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("kbd", {
                                    children: "?"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Portfolio.tsx",
                                    lineNumber: 209,
                                    columnNumber: 44
                                }, this),
                                " for keyboard shortcuts"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Portfolio.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Portfolio.tsx",
                    lineNumber: 207,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Portfolio.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
                src: "/src/app.js",
                type: "module"
            }, void 0, false, {
                fileName: "[project]/src/components/Portfolio.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_s(Portfolio, "dMwHFEIxnBBb6UaWGBmx4qx7BRU=");
_c = Portfolio;
var _c;
__turbopack_context__.k.register(_c, "Portfolio");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Portfolio.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/components/Portfolio.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=_2af0b4b1._.js.map