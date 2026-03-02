/**
 * Error boundary for graceful error handling
 */

export class ErrorBoundary {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      fallback: this.defaultFallback.bind(this),
      onError: null,
      ...options,
    };

    this.init();
  }

  init() {
    // Global error handler
    window.addEventListener('error', this.handleError.bind(this));
    window.addEventListener('unhandledrejection', this.handleRejection.bind(this));
  }

  handleError(event) {
    console.error('Error caught by boundary:', event.error);

    if (this.options.onError) {
      this.options.onError(event.error);
    }

    this.showFallback(event.error);
  }

  handleRejection(event) {
    console.error('Promise rejection caught:', event.reason);

    if (this.options.onError) {
      this.options.onError(event.reason);
    }

    this.showFallback(event.reason);
  }

  showFallback(error) {
    const fallbackElement = this.options.fallback(error);

    if (this.container && fallbackElement) {
      this.container.innerHTML = '';
      this.container.appendChild(fallbackElement);
    }
  }

  defaultFallback(error) {
    const fallback = document.createElement('div');
    fallback.className = 'error-boundary';
    fallback.innerHTML = `
      <div class="error-boundary-content">
        <div class="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p>We're sorry, but something unexpected happened.</p>
        <details class="error-details">
          <summary>Error details</summary>
          <pre>${error.message || error}</pre>
          ${error.stack ? `<pre class="error-stack">${error.stack}</pre>` : ''}
        </details>
        <div class="error-actions">
          <button onclick="location.reload()" class="btn">Reload Page</button>
          <button onclick="history.back()" class="btn btn-outline">Go Back</button>
        </div>
      </div>
    `;
    return fallback;
  }

  static wrap(fn, errorHandler) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        console.error('Error in wrapped function:', error);
        if (errorHandler) {
          errorHandler(error);
        }
        throw error;
      }
    };
  }
}

// Add CSS for error boundary
const style = document.createElement('style');
style.textContent = `
  .error-boundary {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    padding: 40px 20px;
  }

  .error-boundary-content {
    max-width: 600px;
    text-align: center;
  }

  .error-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  .error-boundary h2 {
    font-size: 24px;
    margin-bottom: 12px;
    color: var(--blue-900);
  }

  .error-boundary p {
    font-size: 16px;
    color: var(--muted);
    margin-bottom: 24px;
  }

  .error-details {
    text-align: left;
    margin: 24px 0;
    padding: 16px;
    background: #f5f5f5;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
  }

  .error-details summary {
    cursor: pointer;
    font-weight: 600;
    margin-bottom: 12px;
    user-select: none;
  }

  .error-details pre {
    margin: 8px 0;
    padding: 12px;
    background: white;
    border-radius: 4px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 1.5;
  }

  .error-stack {
    max-height: 200px;
    overflow-y: auto;
  }

  .error-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
  }

  body.dark .error-boundary h2 {
    color: var(--blue-100);
  }

  body.dark .error-details {
    background: #1e1e2e;
    border-color: #2a2a3d;
  }

  body.dark .error-details pre {
    background: #0f1b33;
    color: #cdd6f4;
  }
`;
document.head.appendChild(style);

export default ErrorBoundary;
