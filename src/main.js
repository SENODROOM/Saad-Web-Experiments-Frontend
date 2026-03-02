/**
 * Main application entry point
 * Integrates all components and features
 */

import { Analytics } from './lib/analytics.js';
import { KeyboardShortcuts, defaultShortcuts } from './lib/keyboard.js';
import { FuzzySearch } from './lib/fuzzySearch.js';
import { Storage } from './lib/storage.js';
import { LoadingSkeleton } from './components/LoadingSkeleton.js';
import { Toast } from './components/Toast.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { ShareButtons } from './components/ShareButtons.js';
import { ProjectTags } from './components/ProjectTags.js';

// Initialize global instances
window.analytics = new Analytics();
window.keyboard = new KeyboardShortcuts();
window.storage = new Storage('portfolio');
window.Toast = Toast;

// Track page view
window.analytics.trackPageView();

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeApp();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    ErrorBoundary.showError(error, document.getElementById('project-container'));
  }
});

function initializeApp() {
  // Setup keyboard shortcuts
  setupKeyboardShortcuts();

  // Setup bookmarks
  setupBookmarks();

  // Setup recently viewed
  setupRecentlyViewed();

  // Setup enhanced search
  setupEnhancedSearch();

  // Setup multi-filter
  setupMultiFilter();

  // Show welcome message for first-time visitors
  showWelcomeMessage();

  console.log('✨ Portfolio app initialized successfully');
}

function setupKeyboardShortcuts() {
  const searchInput = document.getElementById('search-input');

  // Focus search
  window.keyboard.register(
    defaultShortcuts.SEARCH.key,
    () => {
      searchInput?.focus();
      Toast.info('Search focused');
    },
    { description: defaultShortcuts.SEARCH.description }
  );

  // Clear search / Close modals
  window.keyboard.register(
    defaultShortcuts.ESCAPE.key,
    () => {
      if (searchInput?.value) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
        Toast.info('Search cleared');
      }
    },
    { description: defaultShortcuts.ESCAPE.description }
  );

  // Toggle dark mode
  window.keyboard.register(
    defaultShortcuts.DARK_MODE.key,
    () => {
      const toggleBtn = document.getElementById('theme-toggle');
      toggleBtn?.click();
    },
    { ctrl: true, description: defaultShortcuts.DARK_MODE.description }
  );

  // Show bookmarks
  window.keyboard.register(
    defaultShortcuts.BOOKMARKS.key,
    () => {
      showBookmarksModal();
    },
    { ctrl: true, description: defaultShortcuts.BOOKMARKS.description }
  );

  // Show help
  window.keyboard.register(
    defaultShortcuts.HELP.key,
    () => {
      showKeyboardShortcutsHelp();
    },
    { shift: true, description: defaultShortcuts.HELP.description }
  );

  console.log('⌨️ Keyboard shortcuts registered');
}

function setupBookmarks() {
  window.bookmarks = {
    add: (projectId, projectTitle) => {
      const bookmarks = window.storage.get('bookmarks', []);
      if (!bookmarks.find((b) => b.id === projectId)) {
        bookmarks.push({ id: projectId, title: projectTitle, timestamp: Date.now() });
        window.storage.set('bookmarks', bookmarks);
        Toast.success('Bookmark added');
        return true;
      }
      return false;
    },

    remove: (projectId) => {
      const bookmarks = window.storage.get('bookmarks', []);
      const filtered = bookmarks.filter((b) => b.id !== projectId);
      window.storage.set('bookmarks', filtered);
      Toast.info('Bookmark removed');
    },

    has: (projectId) => {
      const bookmarks = window.storage.get('bookmarks', []);
      return bookmarks.some((b) => b.id === projectId);
    },

    getAll: () => {
      return window.storage.get('bookmarks', []);
    },
  };

  console.log('🔖 Bookmarks system initialized');
}

function setupRecentlyViewed() {
  // Recently viewed is handled by analytics
  window.recentlyViewed = {
    get: (limit = 10) => {
      return window.analytics.getRecentlyViewed(limit);
    },
  };

  console.log('👁️ Recently viewed tracking initialized');
}

function setupEnhancedSearch() {
  if (!window.projects) return;

  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  // Initialize fuzzy search
  const fuzzySearch = new FuzzySearch(window.projects, [
    'title',
    'category',
    'description',
  ]);

  // Store original search handler
  const originalHandler = searchInput.oninput;

  // Enhanced search with fuzzy matching
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    // Track search
    if (query) {
      window.analytics.trackSearch(query);
    }

    // Use fuzzy search if query is not empty
    if (query) {
      const results = fuzzySearch.search(query, 0.3);
      // Dispatch custom event with results
      document.dispatchEvent(
        new CustomEvent('fuzzySearchResults', { detail: { query, results } })
      );
    } else {
      // Clear search
      document.dispatchEvent(
        new CustomEvent('fuzzySearchResults', { detail: { query: '', results: window.projects } })
      );
    }
  });

  console.log('🔍 Enhanced search initialized');
}

function setupMultiFilter() {
  if (!window.projects) return;

  // Assign tags to all projects
  window.projects.forEach((project) => {
    if (!project.tags) {
      project.tags = ProjectTags.assignTags(project);
    }
  });

  // Create filter UI
  const filterContainer = document.querySelector('.filter-tabs');
  if (!filterContainer) return;

  const multiFilter = ProjectTags.createFilterUI(window.projects);
  filterContainer.parentNode.insertBefore(multiFilter, filterContainer.nextSibling);

  // Listen for filter changes
  document.addEventListener('filtersChanged', () => {
    const activeFilters = ProjectTags.getActiveFilters(multiFilter);
    const filtered = ProjectTags.filterProjects(window.projects, activeFilters);

    // Track filter usage
    Object.entries(activeFilters).forEach(([category, tags]) => {
      tags.forEach((tag) => {
        window.analytics.trackFilter(category, tag);
      });
    });

    // Dispatch custom event with filtered results
    document.dispatchEvent(
      new CustomEvent('multiFilterResults', { detail: { filters: activeFilters, results: filtered } })
    );
  });

  console.log('🏷️ Multi-filter system initialized');
}

function showWelcomeMessage() {
  const summary = window.analytics.getSummary();

  if (summary.totalVisits === 1) {
    setTimeout(() => {
      Toast.success('Welcome to Saad Web Experiments! 👋', { duration: 5000 });
    }, 1000);
  } else if (summary.totalVisits % 10 === 0) {
    setTimeout(() => {
      Toast.info(`You've visited ${summary.totalVisits} times! 🎉`, { duration: 4000 });
    }, 1000);
  }
}

function showBookmarksModal() {
  const bookmarks = window.bookmarks.getAll();

  if (bookmarks.length === 0) {
    Toast.info('No bookmarks yet. Start bookmarking projects!');
    return;
  }

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Bookmarked Projects</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <ul class="bookmarks-list">
          ${bookmarks
            .map(
              (b) => `
            <li class="bookmark-item">
              <span class="bookmark-title">${b.title}</span>
              <button class="bookmark-remove" data-id="${b.id}">Remove</button>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal
  const closeModal = () => {
    modal.remove();
  };

  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Remove bookmark
  modal.querySelectorAll('.bookmark-remove').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      window.bookmarks.remove(id);
      btn.closest('.bookmark-item').remove();

      if (modal.querySelectorAll('.bookmark-item').length === 0) {
        closeModal();
        Toast.info('All bookmarks removed');
      }
    });
  });
}

function showKeyboardShortcutsHelp() {
  const shortcuts = window.keyboard.getAll();

  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Keyboard Shortcuts</h2>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <ul class="shortcuts-list">
          ${shortcuts
            .map(
              (s) => `
            <li class="shortcut-item">
              <span class="shortcut-keys">
                ${s.ctrl ? '<kbd>Ctrl</kbd> + ' : ''}
                ${s.alt ? '<kbd>Alt</kbd> + ' : ''}
                ${s.shift ? '<kbd>Shift</kbd> + ' : ''}
                ${s.meta ? '<kbd>Cmd</kbd> + ' : ''}
                <kbd>${s.key}</kbd>
              </span>
              <span class="shortcut-desc">${s.description}</span>
            </li>
          `
            )
            .join('')}
        </ul>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeModal = () => {
    modal.remove();
  };

  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Add modal styles
const modalStyles = document.createElement('style');
modalStyles.textContent = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    padding: 20px;
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 20px;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: background 0.2s;
  }

  .modal-close:hover {
    background: #f3f4f6;
  }

  .modal-body {
    padding: 20px;
    overflow-y: auto;
  }

  .bookmarks-list,
  .shortcuts-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .bookmark-item,
  .shortcut-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    border-bottom: 1px solid #e5e7eb;
  }

  .bookmark-item:last-child,
  .shortcut-item:last-child {
    border-bottom: none;
  }

  .bookmark-title {
    flex: 1;
  }

  .bookmark-remove {
    padding: 6px 12px;
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
  }

  .bookmark-remove:hover {
    background: #dc2626;
  }

  .shortcut-keys {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .shortcut-keys kbd {
    padding: 4px 8px;
    background: #f3f4f6;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 12px;
    font-family: monospace;
  }

  .shortcut-desc {
    color: #6b7280;
    font-size: 14px;
  }

  body.dark .modal-content {
    background: #1f2937;
    color: #f3f4f6;
  }

  body.dark .modal-header {
    border-bottom-color: #374151;
  }

  body.dark .modal-close:hover {
    background: #374151;
  }

  body.dark .bookmark-item,
  body.dark .shortcut-item {
    border-bottom-color: #374151;
  }

  body.dark .shortcut-keys kbd {
    background: #374151;
    border-color: #4b5563;
    color: #f3f4f6;
  }

  body.dark .shortcut-desc {
    color: #9ca3af;
  }
`;
document.head.appendChild(modalStyles);

export { Analytics, KeyboardShortcuts, FuzzySearch, Storage, LoadingSkeleton, Toast, ErrorBoundary, ShareButtons, ProjectTags };
