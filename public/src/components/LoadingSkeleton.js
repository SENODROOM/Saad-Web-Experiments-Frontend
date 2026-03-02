/**
 * Loading skeleton components
 */

export class LoadingSkeleton {
  static createProjectCard() {
    const card = document.createElement('div');
    card.className = 'card skeleton-card';
    card.innerHTML = `
      <div class="skeleton-header">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-badge"></div>
      </div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text short"></div>
      <div class="skeleton-footer">
        <div class="skeleton skeleton-button"></div>
        <div class="skeleton skeleton-button"></div>
      </div>
    `;
    return card;
  }

  static createProjectGrid(count = 6) {
    const grid = document.createElement('div');
    grid.className = 'grid skeleton-grid';

    for (let i = 0; i < count; i++) {
      grid.appendChild(this.createProjectCard());
    }

    return grid;
  }

  static show(container, count = 6) {
    const skeleton = this.createProjectGrid(count);
    container.innerHTML = '';
    container.appendChild(skeleton);
  }

  static hide(container) {
    const skeleton = container.querySelector('.skeleton-grid');
    if (skeleton) {
      skeleton.remove();
    }
  }
}

// Add CSS for skeletons
const style = document.createElement('style');
style.textContent = `
  .skeleton {
    background: linear-gradient(
      90deg,
      #f0f0f0 25%,
      #e0e0e0 50%,
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    border-radius: 4px;
  }

  @keyframes skeleton-loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  .skeleton-card {
    padding: 16px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .skeleton-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }

  .skeleton-title {
    height: 24px;
    width: 60%;
  }

  .skeleton-badge {
    height: 20px;
    width: 80px;
  }

  .skeleton-text {
    height: 16px;
    width: 100%;
    margin-bottom: 8px;
  }

  .skeleton-text.short {
    width: 70%;
  }

  .skeleton-footer {
    display: flex;
    gap: 8px;
    margin-top: 16px;
  }

  .skeleton-button {
    height: 36px;
    width: 100px;
  }

  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  body.dark .skeleton {
    background: linear-gradient(
      90deg,
      #2a2a3d 25%,
      #1e1e2e 50%,
      #2a2a3d 75%
    );
    background-size: 200% 100%;
  }

  body.dark .skeleton-card {
    background: #0f1b33;
  }

  @media (max-width: 768px) {
    .skeleton-grid {
      grid-template-columns: 1fr;
    }
  }
`;
document.head.appendChild(style);

export default LoadingSkeleton;
