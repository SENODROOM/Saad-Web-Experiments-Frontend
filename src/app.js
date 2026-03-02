/**
 * Main application logic for project rendering
 * This file contains the core rendering and interaction logic
 */

export function initializeProjectRendering() {
  const langMap = {
    html: 'markup',
    css: 'css',
    javascript: 'javascript',
    python: 'python',
    jsx: 'jsx',
  };

  const categoryColors = {
    HTML: '#e34c26',
    CSS: '#264de4',
    JavaScript: '#f7df1e',
    Python: '#3572A5',
    React: '#61dafb',
  };

  const categoryTextColors = {
    HTML: '#fff',
    CSS: '#fff',
    JavaScript: '#333',
    Python: '#fff',
    React: '#111',
  };

  let activeFilter = 'All';
  let searchQuery = '';
  let activeTagFilters = { difficulty: [], features: [], tech: [] };

  // Build a single project card
  function buildCard(project) {
    const { title, category, description, iframeSrc, codeFiles } = project;
    const hasPreview = !!iframeSrc;
    const projectId = `${category}-${title.replace(/\s+/g, '-')}`;

    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.category = category;
    card.dataset.title = title.toLowerCase();
    card.dataset.projectId = projectId;

    const details = document.createElement('details');
    const summary = document.createElement('summary');
    summary.className = 'card-summary';

    const catColor = categoryColors[category] || '#1282A2';
    const catText = categoryTextColors[category] || '#fff';

    // Check if bookmarked
    const isBookmarked = window.bookmarks?.has(projectId);

    summary.innerHTML = `
      <div class="summary-left">
        <span class="summary-title">${title}</span>
      </div>
      <div class="summary-right">
        <button class="bookmark-btn ${isBookmarked ? 'active' : ''}" data-project-id="${projectId}" data-project-title="${title}" aria-label="Bookmark project">
          ${isBookmarked ? '★' : '☆'}
        </button>
        <span class="cat-badge" style="background:${catColor};color:${catText}">${category}</span>
        <svg class="chev" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    `;
    details.appendChild(summary);

    // Add bookmark functionality
    const bookmarkBtn = summary.querySelector('.bookmark-btn');
    bookmarkBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isCurrentlyBookmarked = window.bookmarks.has(projectId);
      if (isCurrentlyBookmarked) {
        window.bookmarks.remove(projectId);
        bookmarkBtn.classList.remove('active');
        bookmarkBtn.textContent = '☆';
      } else {
        window.bookmarks.add(projectId, title);
        bookmarkBtn.classList.add('active');
        bookmarkBtn.textContent = '★';
      }
    });

    // Card Body
    const body = document.createElement('div');
    body.className = 'card-body';

    // Description
    const desc = document.createElement('p');
    desc.className = 'description';
    desc.textContent = description;
    body.appendChild(desc);

    // Add project tags
    if (project.tags && window.ProjectTags) {
      window.ProjectTags.renderTags(project.tags, body);
    }

    // Tab bar
    const tabBar = document.createElement('div');
    tabBar.className = 'tab-bar';

    if (hasPreview) {
      const previewTab = document.createElement('button');
      previewTab.className = 'tab-btn active';
      previewTab.textContent = '▶ Live Preview';
      previewTab.dataset.tab = 'preview';
      tabBar.appendChild(previewTab);
    }

    const codeTab = document.createElement('button');
    codeTab.className = `tab-btn${hasPreview ? '' : ' active'}`;
    codeTab.textContent = '</> Code';
    codeTab.dataset.tab = 'code';
    tabBar.appendChild(codeTab);
    body.appendChild(tabBar);

    // Preview Panel
    if (hasPreview) {
      const previewPanel = document.createElement('div');
      previewPanel.className = 'panel panel-preview active';

      const previewWrap = document.createElement('div');
      previewWrap.className = 'preview';

      const iframe = document.createElement('iframe');
      iframe.title = `${title} live preview`;
      iframe.loading = 'lazy';
      iframe.dataset.src = iframeSrc;

      previewWrap.appendChild(iframe);
      previewPanel.appendChild(previewWrap);

      // Action buttons with share
      const actions = document.createElement('div');
      actions.className = 'actions';
      actions.innerHTML = `
        <a class="btn" href="${iframeSrc}" target="_blank" rel="noopener">Open in New Tab ↗</a>
        <a class="btn btn-outline" href="${iframeSrc}" download="${title}">⬇ Download</a>
      `;

      // Add share button
      if (window.ShareButtons) {
        window.ShareButtons.createShareButton(project, actions);
      }

      previewPanel.appendChild(actions);
      body.appendChild(previewPanel);
    }

    // Code Panel
    const codePanel = document.createElement('div');
    codePanel.className = `panel panel-code${hasPreview ? '' : ' active'}`;

    // File tabs (for multi-file projects)
    if (codeFiles && codeFiles.length > 1) {
      const fileTabs = document.createElement('div');
      fileTabs.className = 'file-tabs';
      codeFiles.forEach((f, i) => {
        const ft = document.createElement('button');
        ft.className = `file-tab-btn${i === 0 ? ' active' : ''}`;
        ft.textContent = f.name;
        ft.dataset.fileIndex = i;
        fileTabs.appendChild(ft);
      });
      codePanel.appendChild(fileTabs);
    }

    // IDE toolbar
    const ideToolbar = document.createElement('div');
    ideToolbar.className = 'ide-toolbar';
    const fileNameSpan = document.createElement('span');
    fileNameSpan.className = 'ide-filename';
    fileNameSpan.textContent = codeFiles && codeFiles[0] ? codeFiles[0].name : '';
    const ideActions = document.createElement('div');
    ideActions.className = 'ide-actions';
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = '⧉ Copy';
    const downloadCodeBtn = document.createElement('a');
    downloadCodeBtn.className = 'copy-btn ide-download-btn';
    downloadCodeBtn.innerHTML = '⬇ Download';
    downloadCodeBtn.href = codeFiles && codeFiles[0] ? encodeURI(codeFiles[0].src) : '#';
    downloadCodeBtn.download = codeFiles && codeFiles[0] ? codeFiles[0].name : '';
    ideActions.appendChild(copyBtn);
    ideActions.appendChild(downloadCodeBtn);
    ideToolbar.appendChild(fileNameSpan);
    ideToolbar.appendChild(ideActions);
    codePanel.appendChild(ideToolbar);

    // Code block
    const pre = document.createElement('pre');
    pre.className = 'line-numbers ide-pre';
    const code = document.createElement('code');
    code.className = `language-${langMap[codeFiles[0]?.lang] || 'markup'}`;
    code.textContent = '// Loading...';
    pre.appendChild(code);
    codePanel.appendChild(pre);
    body.appendChild(codePanel);

    details.appendChild(body);
    card.appendChild(details);

    // State for this card
    let codeCache = {};
    let activeFileIndex = 0;
    let previewLoaded = false;

    function loadFile(fileIndex) {
      const file = codeFiles[fileIndex];
      if (!file) return;
      fileNameSpan.textContent = file.name;
      code.className = `language-${langMap[file.lang] || 'markup'}`;

      downloadCodeBtn.href = encodeURI(file.src);
      downloadCodeBtn.download = file.name;

      if (codeCache[fileIndex] !== undefined) {
        code.textContent = codeCache[fileIndex];
        Prism.highlightElement(code);
        return;
      }

      code.textContent = '// Loading...';
      fetch(encodeURI(file.src))
        .then((r) => {
          if (!r.ok) throw new Error('Not found');
          return r.text();
        })
        .then((text) => {
          codeCache[fileIndex] = text;
          code.textContent = text;
          Prism.highlightElement(code);
        })
        .catch(() => {
          code.textContent =
            '// Could not load file.\n// Note: open this page through a local server (not file://) for code loading to work.';
          Prism.highlightElement(code);
        });
    }

    // Copy button
    copyBtn.addEventListener('click', () => {
      const text = codeCache[activeFileIndex];
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.innerHTML = '✓ Copied!';
        if (window.Toast) {
          window.Toast.success('Code copied to clipboard');
        }
        setTimeout(() => {
          copyBtn.innerHTML = '⧉ Copy';
        }, 1800);
      });
    });

    // File tab switching
    const fileTabBtns = codePanel.querySelectorAll('.file-tab-btn');
    fileTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        fileTabBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeFileIndex = parseInt(btn.dataset.fileIndex);
        loadFile(activeFileIndex);
      });
    });

    // Preview / Code tab switching
    tabBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      tabBar.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const tab = btn.dataset.tab;
      body.querySelectorAll('.panel').forEach((p) => p.classList.remove('active'));

      if (tab === 'preview') {
        body.querySelector('.panel-preview')?.classList.add('active');
        if (!previewLoaded) {
          const iframeEl = body.querySelector('iframe');
          if (iframeEl && iframeEl.dataset.src) {
            // Add loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'iframe-loading';
            loadingDiv.textContent = 'Loading preview...';
            loadingDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #666; z-index: 10;';
            previewWrap.style.position = 'relative';
            previewWrap.appendChild(loadingDiv);

            iframeEl.src = encodeURI(iframeEl.dataset.src);

            iframeEl.onload = () => {
              if (loadingDiv.parentNode) loadingDiv.remove();
              previewLoaded = true;
            };

            iframeEl.onerror = () => {
              loadingDiv.textContent = '⚠️ Preview failed to load. Try opening in new tab.';
              loadingDiv.style.color = '#ef4444';
            };

            setTimeout(() => {
              if (loadingDiv.parentNode) loadingDiv.remove();
              previewLoaded = true;
            }, 5000);
          }
        }
      } else {
        codePanel.classList.add('active');
        if (!codeCache[activeFileIndex]) loadFile(activeFileIndex);
      }
    });

    // Load code + preview when details opens
    details.addEventListener('toggle', () => {
      if (details.open) {
        // Track project open
        if (window.analytics) {
          window.analytics.trackProjectOpen(projectId);
          window.analytics.trackProjectView(projectId, title);
        }

        const activeTab = tabBar.querySelector('.tab-btn.active')?.dataset.tab;

        if (hasPreview && !previewLoaded && activeTab === 'preview') {
          const iframeEl = body.querySelector('iframe');
          if (iframeEl && iframeEl.dataset.src) {
            // Add loading indicator
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'iframe-loading';
            loadingDiv.textContent = 'Loading preview...';
            loadingDiv.style.cssText = 'position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #666;';
            previewWrap.style.position = 'relative';
            previewWrap.appendChild(loadingDiv);

            // Set iframe src
            iframeEl.src = encodeURI(iframeEl.dataset.src);

            // Handle iframe load
            iframeEl.onload = () => {
              loadingDiv.remove();
              previewLoaded = true;
            };

            // Handle iframe error
            iframeEl.onerror = () => {
              loadingDiv.textContent = '⚠️ Preview failed to load. Try opening in new tab.';
              loadingDiv.style.color = '#ef4444';
            };

            // Timeout fallback
            setTimeout(() => {
              if (loadingDiv.parentNode) {
                loadingDiv.remove();
              }
              previewLoaded = true;
            }, 5000);
          }
        }

        if (activeTab === 'code' || !hasPreview) {
          if (!codeCache[activeFileIndex]) loadFile(activeFileIndex);
        }
      }
    });

    return card;
  }

  // Render projects
  const container = document.getElementById('project-container');
  const resultsMeta = document.getElementById('results-meta');
  const categories = ['HTML', 'CSS', 'JavaScript', 'Python', 'React'];

  function renderProjects() {
    container.innerHTML = '';

    let filtered = window.projects.filter((p) => {
      const matchCat = activeFilter === 'All' || p.category === activeFilter;
      const matchSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery) ||
        p.category.toLowerCase().includes(searchQuery) ||
        (p.description && p.description.toLowerCase().includes(searchQuery));
      return matchCat && matchSearch;
    });

    // Apply tag filters
    if (window.ProjectTags) {
      filtered = window.ProjectTags.filterProjects(filtered, activeTagFilters);
    }

    // Update meta
    resultsMeta.textContent = `Showing ${filtered.length} project${filtered.length !== 1 ? 's' : ''}`;

    if (filtered.length === 0) {
      container.innerHTML =
        '<div class="empty-state">No projects found. Try a different search or filter.</div>';
      return;
    }

    // Group by category
    const groups = {};
    filtered.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });

    const orderedCats =
      activeFilter === 'All' ? categories.filter((c) => groups[c]) : [activeFilter];

    orderedCats.forEach((cat) => {
      if (!groups[cat]) return;

      const section = document.createElement('section');
      section.className = 'category';

      const catColor = categoryColors[cat] || '#1282A2';
      section.innerHTML = `
        <h2 class="cat-heading">
          <span class="cat-dot" style="background:${catColor}"></span>
          ${cat} Projects
          <span class="cat-count">${groups[cat].length}</span>
        </h2>
      `;

      const cards = document.createElement('div');
      cards.className = 'cards';
      groups[cat].forEach((p) => cards.appendChild(buildCard(p)));
      section.appendChild(cards);
      container.appendChild(section);
    });
  }

  // Filter tabs
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.dataset.filter;

      // Track filter usage
      if (window.analytics) {
        window.analytics.trackFilter('category', activeFilter);
      }

      renderProjects();
    });
  });

  // Search
  document.getElementById('search-input').addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase().trim();

    // Track search
    if (searchQuery && window.analytics) {
      window.analytics.trackSearch(searchQuery);
    }

    renderProjects();
  });

  // Listen for multi-filter changes
  document.addEventListener('filtersChanged', () => {
    if (window.ProjectTags) {
      const multiFilter = document.querySelector('.multi-filter-container');
      if (multiFilter) {
        activeTagFilters = window.ProjectTags.getActiveFilters(multiFilter);
        renderProjects();
      }
    }
  });

  // Initial render
  renderProjects();
}
