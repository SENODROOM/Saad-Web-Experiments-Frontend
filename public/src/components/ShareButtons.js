/**
 * Share buttons component
 * Provides social sharing functionality
 */

export class ShareButtons {
  static share(project, platform = 'native') {
    const url = window.location.href;
    const title = `Check out ${project.title} - ${project.category} Project`;
    const text = project.description;

    const shareData = {
      title,
      text,
      url,
    };

    switch (platform) {
      case 'native':
        return this.nativeShare(shareData);
      case 'twitter':
        return this.shareToTwitter(shareData);
      case 'linkedin':
        return this.shareToLinkedIn(shareData);
      case 'facebook':
        return this.shareToFacebook(shareData);
      case 'email':
        return this.shareViaEmail(shareData);
      case 'copy':
        return this.copyLink(url);
      default:
        return this.nativeShare(shareData);
    }
  }

  static async nativeShare(data) {
    if (navigator.share) {
      try {
        await navigator.share(data);
        return { success: true, message: 'Shared successfully' };
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Share failed:', error);
          return { success: false, error: error.message };
        }
        return { success: false, error: 'Share cancelled' };
      }
    } else {
      return this.copyLink(data.url);
    }
  }

  static shareToTwitter(data) {
    const params = new URLSearchParams({
      text: `${data.title}\n${data.text}`,
      url: data.url,
    });
    window.open(`https://twitter.com/intent/tweet?${params}`, '_blank');
    return { success: true, message: 'Opening Twitter' };
  }

  static shareToLinkedIn(data) {
    const params = new URLSearchParams({
      url: data.url,
    });
    window.open(`https://www.linkedin.com/sharing/share-offsite/?${params}`, '_blank');
    return { success: true, message: 'Opening LinkedIn' };
  }

  static shareToFacebook(data) {
    const params = new URLSearchParams({
      u: data.url,
    });
    window.open(`https://www.facebook.com/sharer/sharer.php?${params}`, '_blank');
    return { success: true, message: 'Opening Facebook' };
  }

  static shareViaEmail(data) {
    const subject = encodeURIComponent(data.title);
    const body = encodeURIComponent(`${data.text}\n\n${data.url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    return { success: true, message: 'Opening email client' };
  }

  static async copyLink(url) {
    try {
      await navigator.clipboard.writeText(url);
      return { success: true, message: 'Link copied to clipboard' };
    } catch (error) {
      console.error('Copy failed:', error);
      return { success: false, error: 'Failed to copy link' };
    }
  }

  static createShareButton(project, container) {
    const button = document.createElement('button');
    button.className = 'share-btn';
    button.innerHTML = '↗ Share';
    button.setAttribute('aria-label', 'Share project');

    const menu = document.createElement('div');
    menu.className = 'share-menu';
    menu.innerHTML = `
      <button class="share-option" data-platform="twitter">
        <span class="share-icon">🐦</span> Twitter
      </button>
      <button class="share-option" data-platform="linkedin">
        <span class="share-icon">💼</span> LinkedIn
      </button>
      <button class="share-option" data-platform="facebook">
        <span class="share-icon">📘</span> Facebook
      </button>
      <button class="share-option" data-platform="email">
        <span class="share-icon">✉️</span> Email
      </button>
      <button class="share-option" data-platform="copy">
        <span class="share-icon">📋</span> Copy Link
      </button>
    `;

    let isOpen = false;

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen = !isOpen;
      menu.classList.toggle('show', isOpen);
    });

    menu.addEventListener('click', async (e) => {
      const option = e.target.closest('.share-option');
      if (!option) return;

      const platform = option.dataset.platform;
      const result = await this.share(project, platform);

      if (result.success && result.message) {
        // Show toast notification (if available)
        if (window.Toast) {
          window.Toast.success(result.message);
        }
      } else if (!result.success && result.error) {
        if (window.Toast) {
          window.Toast.error(result.error);
        }
      }

      menu.classList.remove('show');
      isOpen = false;
    });

    // Close menu when clicking outside
    document.addEventListener('click', () => {
      if (isOpen) {
        menu.classList.remove('show');
        isOpen = false;
      }
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'share-wrapper';
    wrapper.appendChild(button);
    wrapper.appendChild(menu);

    container.appendChild(wrapper);
    return wrapper;
  }
}

// Add CSS for share buttons
const style = document.createElement('style');
style.textContent = `
  .share-wrapper {
    position: relative;
    display: inline-block;
  }

  .share-btn {
    padding: 8px 16px;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }

  .share-btn:hover {
    background: #2563eb;
  }

  .share-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 8px;
    min-width: 180px;
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.2s;
    z-index: 1000;
  }

  .share-menu.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .share-option {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 10px 12px;
    background: none;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    text-align: left;
    transition: background 0.2s;
  }

  .share-option:hover {
    background: #f3f4f6;
  }

  .share-icon {
    font-size: 18px;
  }

  body.dark .share-menu {
    background: #1f2937;
    color: #f3f4f6;
  }

  body.dark .share-option:hover {
    background: #374151;
  }
`;
document.head.appendChild(style);

export default ShareButtons;
