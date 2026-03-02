/**
 * Toast notification system
 */

export class Toast {
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

    const {
      type = 'info',
      duration = 3000,
      position = 'top-right',
      dismissible = true,
    } = options;

    const id = this.nextId++;
    const toast = this.createToast(id, message, type, dismissible);

    this.container.appendChild(toast);
    this.toasts.push({ id, element: toast });

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto dismiss
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
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
      closeBtn.addEventListener('click', () => this.dismiss(id));
    }

    return toast;
  }

  static getIcon(type) {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠',
      info: 'ℹ',
    };
    return icons[type] || icons.info;
  }

  static dismiss(id) {
    const toastData = this.toasts.find(t => t.id === id);
    if (!toastData) return;

    const { element } = toastData;
    element.classList.remove('show');
    element.classList.add('hide');

    setTimeout(() => {
      element.remove();
      this.toasts = this.toasts.filter(t => t.id !== id);
    }, 300);
  }

  static success(message, options = {}) {
    return this.show(message, { ...options, type: 'success' });
  }

  static error(message, options = {}) {
    return this.show(message, { ...options, type: 'error' });
  }

  static warning(message, options = {}) {
    return this.show(message, { ...options, type: 'warning' });
  }

  static info(message, options = {}) {
    return this.show(message, { ...options, type: 'info' });
  }

  static dismissAll() {
    this.toasts.forEach(({ id }) => this.dismiss(id));
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

export default Toast;
