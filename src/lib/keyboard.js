/**
 * Keyboard shortcuts manager
 */

export class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map();
    this.enabled = true;
    this.init();
  }

  init() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  /**
   * Register a keyboard shortcut
   */
  register(key, callback, options = {}) {
    const {
      ctrl = false,
      alt = false,
      shift = false,
      meta = false,
      description = '',
    } = options;

    const shortcutKey = this.createKey(key, { ctrl, alt, shift, meta });

    this.shortcuts.set(shortcutKey, {
      callback,
      description,
      key,
      ctrl,
      alt,
      shift,
      meta,
    });
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(key, options = {}) {
    const shortcutKey = this.createKey(key, options);
    this.shortcuts.delete(shortcutKey);
  }

  /**
   * Create unique key for shortcut
   */
  createKey(key, { ctrl = false, alt = false, shift = false, meta = false }) {
    const modifiers = [];
    if (ctrl) modifiers.push('ctrl');
    if (alt) modifiers.push('alt');
    if (shift) modifiers.push('shift');
    if (meta) modifiers.push('meta');

    return [...modifiers, key.toLowerCase()].join('+');
  }

  /**
   * Handle keydown event
   */
  handleKeyDown(event) {
    if (!this.enabled) return;

    // Don't trigger shortcuts when typing in inputs
    const target = event.target;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.isContentEditable
    ) {
      // Allow Escape key even in inputs
      if (event.key !== 'Escape') return;
    }

    const key = this.createKey(event.key, {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
    });

    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      event.preventDefault();
      shortcut.callback(event);
    }
  }

  /**
   * Enable shortcuts
   */
  enable() {
    this.enabled = true;
  }

  /**
   * Disable shortcuts
   */
  disable() {
    this.enabled = false;
  }

  /**
   * Get all registered shortcuts
   */
  getAll() {
    return Array.from(this.shortcuts.values());
  }

  /**
   * Clear all shortcuts
   */
  clear() {
    this.shortcuts.clear();
  }
}

/**
 * Default shortcuts configuration
 */
export const defaultShortcuts = {
  SEARCH: { key: '/', description: 'Focus search' },
  ESCAPE: { key: 'Escape', description: 'Clear search / Close modal' },
  COMMAND_PALETTE: { key: 'k', ctrl: true, description: 'Open command palette' },
  DARK_MODE: { key: 'd', ctrl: true, description: 'Toggle dark mode' },
  BOOKMARKS: { key: 'b', ctrl: true, description: 'View bookmarks' },
  HELP: { key: '?', shift: true, description: 'Show keyboard shortcuts' },
};

export default KeyboardShortcuts;
