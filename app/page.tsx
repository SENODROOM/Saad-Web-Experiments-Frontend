'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" />

      <header className="site-header">
        <div className="container header-row">
          <div>
            <h1 className="site-title">Saad Web Experiments</h1>
            <p className="lead">
              <em><strong>Muhammad Saad Amin</strong></em>, a passionate <strong>Software Engineer</strong>,
              showcasing 165+ projects in <strong>HTML</strong>, <strong>CSS</strong>, <strong>JavaScript</strong>,
              <strong>Python</strong>, and <strong>React</strong>.
            </p>
          </div>
          <button id="theme-toggle" className="theme-toggle" aria-label="Toggle dark mode">🌙</button>
        </div>
      </header>

      <main className="container">
        <div className="center">
          <div className="search-bar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="search-input" placeholder="Search projects..." />
          </div>
        </div>

        <div className="filter-tabs" id="filter-tabs">
          <button className="filter-btn active" data-filter="All">🗂️ All</button>
          <button className="filter-btn" data-filter="HTML">🌐 HTML</button>
          <button className="filter-btn" data-filter="CSS">🎨 CSS</button>
          <button className="filter-btn" data-filter="JavaScript">⚡ JavaScript</button>
          <button className="filter-btn" data-filter="Python">🐍 Python</button>
          <button className="filter-btn" data-filter="React">⚛️ React</button>
        </div>

        <div className="controls-row">
          <label className="sort-control" htmlFor="sort-select">
            Sort:
            <select id="sort-select" defaultValue="title-asc">
              <option value="title-asc">Title (A-Z)</option>
              <option value="title-desc">Title (Z-A)</option>
              <option value="most-viewed">Most Viewed</option>
              <option value="latest-bookmark">Latest Bookmarked</option>
            </select>
          </label>
          <div className="utility-actions">
            <button id="bookmark-view-toggle" className="utility-btn" type="button">⭐ Bookmarks Only: Off</button>
            <button id="random-project-btn" className="utility-btn" type="button">🎲 Random Project</button>
            <button id="export-bookmarks-btn" className="utility-btn" type="button">⬇ Export Bookmarks</button>
            <button id="clear-analytics-btn" className="utility-btn danger" type="button">🧹 Clear Analytics</button>
          </div>
        </div>

        <div className="results-meta" id="results-meta"></div>
        <div id="project-container" className="grid"></div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© <strong>Muhammad Saad Amin</strong> — Web Development Portfolio</p>
        </div>
      </footer>

      <Script src="/projects.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js" strategy="afterInteractive" />

      <Script id="theme-script" strategy="afterInteractive">{`
        const toggleBtn = document.getElementById("theme-toggle");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (localStorage.theme === "dark" || (!localStorage.theme && prefersDark)) {
          document.body.classList.add("dark");
          toggleBtn.textContent = "☀️";
        }
        toggleBtn?.addEventListener("click", () => {
          document.body.classList.toggle("dark");
          const isDark = document.body.classList.contains("dark");
          toggleBtn.textContent = isDark ? "☀️" : "🌙";
          localStorage.theme = isDark ? "dark" : "light";
        });
      `}</Script>

      <Script id="app-logic" strategy="afterInteractive">{`
        const Toast = {
          container: null,
          init() {
            if (!this.container) {
              this.container = document.createElement('div');
              this.container.className = 'toast-container';
              document.body.appendChild(this.container);
            }
          },
          show(message, type = 'info') {
            this.init();
            const toast = document.createElement('div');
            toast.className = \`toast toast-\${type}\`;
            toast.textContent = message;
            this.container.appendChild(toast);
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
              toast.classList.remove('show');
              setTimeout(() => toast.remove(), 300);
            }, 3000);
          },
          success(msg) { this.show(msg, 'success'); },
          error(msg) { this.show(msg, 'error'); },
          info(msg) { this.show(msg, 'info'); }
        };

        const Storage = {
          get(key, defaultValue = null) {
            try {
              const item = localStorage.getItem(key);
              return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
              return defaultValue;
            }
          },
          set(key, value) {
            try {
              localStorage.setItem(key, JSON.stringify(value));
              return true;
            } catch (e) {
              return false;
            }
          }
        };

        const Analytics = {
          track(event, data = {}) {
            const analytics = Storage.get('analytics', { events: [], views: {}, searches: [] });
            analytics.events.push({ event, data, timestamp: Date.now() });
            if (event === 'project_view') {
              analytics.views[data.projectId] = (analytics.views[data.projectId] || 0) + 1;
            }
            if (event === 'search') {
              analytics.searches.push({ query: data.query, timestamp: Date.now() });
            }
            Storage.set('analytics', analytics);
          }
        };

        const getProjectId = (project) => \`\${project.category}-\${project.title.replace(/\\s+/g, '-')}\`;

        const Bookmarks = {
          add(projectId, projectTitle) {
            const bookmarks = Storage.get('bookmarks', []);
            if (!bookmarks.find(b => b.id === projectId)) {
              bookmarks.push({ id: projectId, title: projectTitle, timestamp: Date.now() });
              Storage.set('bookmarks', bookmarks);
              Toast.success('Bookmark added!');
              return true;
            }
            return false;
          },
          remove(projectId) {
            const bookmarks = Storage.get('bookmarks', []);
            const filtered = bookmarks.filter(b => b.id !== projectId);
            Storage.set('bookmarks', filtered);
            Toast.info('Bookmark removed');
          },
          has(projectId) {
            const bookmarks = Storage.get('bookmarks', []);
            return bookmarks.some(b => b.id === projectId);
          },
          getMap() {
            const bookmarks = Storage.get('bookmarks', []);
            return bookmarks.reduce((acc, item) => {
              acc[item.id] = item;
              return acc;
            }, {});
          }
        };

        function showAnalytics() {
          const analytics = Storage.get('analytics', { events: [], views: {}, searches: [] });
          const bookmarks = Storage.get('bookmarks', []);

          const modal = document.createElement('div');
          modal.className = 'modal-overlay';
          modal.innerHTML = \`
            <div class="modal-content">
              <div class="modal-header">
                <h2>📊 Analytics Dashboard</h2>
                <button class="modal-close">&times;</button>
              </div>
              <div class="modal-body">
                <div class="analytics-section">
                  <h3>📈 Project Views</h3>
                  <p>Total viewed projects: \${Object.keys(analytics.views).length}</p>
                  <ul class="analytics-list">
                    \${Object.entries(analytics.views)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 10)
                      .map(([id, count]) => \`<li>\${id.replace(/-/g, ' ')}: \${count} views</li>\`)
                      .join('') || '<li>No views yet</li>'}
                  </ul>
                </div>
                <div class="analytics-section">
                  <h3>🔍 Recent Searches</h3>
                  <ul class="analytics-list">
                    \${analytics.searches
                      .slice(-10)
                      .reverse()
                      .map(s => \`<li>"\${s.query}" - \${new Date(s.timestamp).toLocaleString()}</li>\`)
                      .join('') || '<li>No searches yet</li>'}
                  </ul>
                </div>
                <div class="analytics-section">
                  <h3>⭐ Bookmarks</h3>
                  <p>Total bookmarks: \${bookmarks.length}</p>
                  <ul class="analytics-list">
                    \${bookmarks.map(b => \`<li>\${b.title}</li>\`).join('') || '<li>No bookmarks yet</li>'}
                  </ul>
                </div>
                <div class="analytics-section">
                  <h3>📊 Total Events</h3>
                  <p>\${analytics.events.length} events tracked</p>
                </div>
              </div>
            </div>
          \`;

          document.body.appendChild(modal);

          const closeModal = () => modal.remove();
          modal.querySelector('.modal-close').addEventListener('click', closeModal);
          modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
          });
        }

        function exportBookmarks() {
          const bookmarks = Storage.get('bookmarks', []);
          if (!bookmarks.length) {
            Toast.info('No bookmarks to export');
            return;
          }

          const blob = new Blob([JSON.stringify(bookmarks, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'saad-bookmarks.json';
          document.body.appendChild(link);
          link.click();
          link.remove();
          URL.revokeObjectURL(url);
          Toast.success('Bookmarks exported');
        }

        function clearAnalytics() {
          const analytics = Storage.get('analytics', { events: [], views: {}, searches: [] });
          if (!analytics.events.length) {
            Toast.info('Analytics already empty');
            return;
          }
          Storage.set('analytics', { events: [], views: {}, searches: [] });
          Toast.success('Analytics cleared');
        }

        // Make analytics accessible from console
        window.showAnalytics = showAnalytics;
        window.getAnalytics = () => Storage.get('analytics', { events: [], views: {}, searches: [] });
        console.log('Tip: Press Ctrl+Shift+A to view analytics dashboard');

        const langMap = { html: 'markup', css: 'css', javascript: 'javascript', python: 'python', jsx: 'jsx' };
        const categoryColors = { HTML: '#e34c26', CSS: '#264de4', JavaScript: '#f7df1e', Python: '#3572A5', React: '#61dafb' };
        const categoryTextColors = { HTML: '#fff', CSS: '#fff', JavaScript: '#333', Python: '#fff', React: '#111' };
        const categories = ['HTML', 'CSS', 'JavaScript', 'Python', 'React'];

        let activeFilter = 'All';
        let searchQuery = '';
        let sortMode = 'title-asc';
        let bookmarksOnly = false;

        const container = document.getElementById('project-container');
        const resultsMeta = document.getElementById('results-meta');
        const sortSelect = document.getElementById('sort-select');
        const bookmarkViewToggle = document.getElementById('bookmark-view-toggle');
        const randomProjectBtn = document.getElementById('random-project-btn');
        const exportBookmarksBtn = document.getElementById('export-bookmarks-btn');
        const clearAnalyticsBtn = document.getElementById('clear-analytics-btn');
        const searchInput = document.getElementById('search-input');

        function getFilteredProjects() {
          const bookmarksMap = Bookmarks.getMap();
          return window.projects.filter(p => {
            const projectId = getProjectId(p);
            const matchCat = activeFilter === 'All' || p.category === activeFilter;
            const matchSearch = !searchQuery
              || p.title.toLowerCase().includes(searchQuery)
              || p.category.toLowerCase().includes(searchQuery)
              || (p.description && p.description.toLowerCase().includes(searchQuery));
            const matchBookmark = !bookmarksOnly || !!bookmarksMap[projectId];
            return matchCat && matchSearch && matchBookmark;
          });
        }

        function sortProjects(projects) {
          const analytics = Storage.get('analytics', { events: [], views: {}, searches: [] });
          const bookmarksMap = Bookmarks.getMap();

          const sorted = [...projects];
          if (sortMode === 'title-asc') {
            sorted.sort((a, b) => a.title.localeCompare(b.title));
          } else if (sortMode === 'title-desc') {
            sorted.sort((a, b) => b.title.localeCompare(a.title));
          } else if (sortMode === 'most-viewed') {
            sorted.sort((a, b) => {
              const aViews = analytics.views[getProjectId(a)] || 0;
              const bViews = analytics.views[getProjectId(b)] || 0;
              return bViews - aViews || a.title.localeCompare(b.title);
            });
          } else if (sortMode === 'latest-bookmark') {
            sorted.sort((a, b) => {
              const aTime = bookmarksMap[getProjectId(a)]?.timestamp || 0;
              const bTime = bookmarksMap[getProjectId(b)]?.timestamp || 0;
              return bTime - aTime || a.title.localeCompare(b.title);
            });
          }

          return sorted;
        }

        function updateControlsUI() {
          bookmarkViewToggle.textContent = \`⭐ Bookmarks Only: \${bookmarksOnly ? 'On' : 'Off'}\`;
          bookmarkViewToggle.classList.toggle('active', bookmarksOnly);
        }

        function buildCard(project) {
          const { title, category, description, iframeSrc, codeFiles } = project;
          const hasPreview = !!iframeSrc;
          const projectId = getProjectId(project);
          const card = document.createElement('article');
          card.className = 'card';
          card.dataset.projectId = projectId;

          const details = document.createElement('details');
          const summary = document.createElement('summary');
          const catColor = categoryColors[category] || '#1282A2';
          const catText = categoryTextColors[category] || '#fff';
          const isBookmarked = Bookmarks.has(projectId);

          summary.innerHTML = \`
            <div class="summary-left"><span class="summary-title">\${title}</span></div>
            <div class="summary-right">
              <button class="bookmark-btn \${isBookmarked ? 'active' : ''}" data-project-id="\${projectId}" data-project-title="\${title}">
                \${isBookmarked ? '★' : '☆'}
              </button>
              <span class="cat-badge" style="background:\${catColor};color:\${catText}">\${category}</span>
              <svg class="chev" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
          \`;
          details.appendChild(summary);

          const bookmarkBtn = summary.querySelector('.bookmark-btn');
          bookmarkBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (Bookmarks.has(projectId)) {
              Bookmarks.remove(projectId);
              bookmarkBtn.classList.remove('active');
              bookmarkBtn.textContent = '☆';
            } else {
              Bookmarks.add(projectId, title);
              bookmarkBtn.classList.add('active');
              bookmarkBtn.textContent = '★';
            }
            if (bookmarksOnly || sortMode === 'latest-bookmark') {
              renderProjects();
            }
          });

          const body = document.createElement('div');
          body.className = 'card-body';
          const desc = document.createElement('p');
          desc.className = 'description';
          desc.textContent = description;
          body.appendChild(desc);

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
          codeTab.className = \`tab-btn\${hasPreview ? '' : ' active'}\`;
          codeTab.textContent = '</> Code';
          codeTab.dataset.tab = 'code';
          tabBar.appendChild(codeTab);
          body.appendChild(tabBar);

          if (hasPreview) {
            const previewPanel = document.createElement('div');
            previewPanel.className = 'panel panel-preview active';
            const previewWrap = document.createElement('div');
            previewWrap.className = 'preview';
            const iframe = document.createElement('iframe');
            iframe.title = \`\${title} live preview\`;
            iframe.loading = 'lazy';
            iframe.src = iframeSrc;
            iframe.style.cssText = 'width:100%;height:260px;border:none';
            previewWrap.appendChild(iframe);
            previewPanel.appendChild(previewWrap);
            const actions = document.createElement('div');
            actions.className = 'actions';
            actions.innerHTML = \`<a class="btn" href="\${iframeSrc}" target="_blank">Open in New Tab ↗</a>\`;
            previewPanel.appendChild(actions);
            body.appendChild(previewPanel);
          }

          const codePanel = document.createElement('div');
          codePanel.className = \`panel panel-code\${hasPreview ? '' : ' active'}\`;

          if (codeFiles && codeFiles.length > 1) {
            const fileTabs = document.createElement('div');
            fileTabs.className = 'file-tabs';
            codeFiles.forEach((f, i) => {
              const ft = document.createElement('button');
              ft.className = \`file-tab-btn\${i === 0 ? ' active' : ''}\`;
              ft.textContent = f.name;
              ft.dataset.fileIndex = i;
              fileTabs.appendChild(ft);
            });
            codePanel.appendChild(fileTabs);
          }

          const toolbar = document.createElement('div');
          toolbar.className = 'ide-toolbar';
          toolbar.innerHTML = \`
            <span class="ide-filename">\${codeFiles[0]?.name || 'code'}</span>
            <div class="ide-actions"><button class="copy-btn">⧉ Copy</button></div>
          \`;
          codePanel.appendChild(toolbar);

          const pre = document.createElement('pre');
          pre.className = 'ide-pre';
          const code = document.createElement('code');
          code.className = \`language-\${langMap[codeFiles[0]?.lang] || 'markup'}\`;
          code.textContent = '// Click to load code...';
          pre.appendChild(code);
          codePanel.appendChild(pre);
          body.appendChild(codePanel);
          details.appendChild(body);
          card.appendChild(details);

          let codeCache = {};
          let activeFileIndex = 0;
          let codeText = '';

          function loadFile(fileIndex) {
            const file = codeFiles[fileIndex];
            if (!file) return;

            toolbar.querySelector('.ide-filename').textContent = file.name;
            code.className = \`language-\${langMap[file.lang] || 'markup'}\`;

            if (codeCache[fileIndex] !== undefined) {
              codeText = codeCache[fileIndex];
              code.textContent = codeText;
              if (window.Prism) window.Prism.highlightElement(code);
              return;
            }

            code.textContent = '// Loading...';
            fetch(file.src).then(r => r.text()).then(text => {
              codeCache[fileIndex] = text;
              codeText = text;
              code.textContent = text;
              if (window.Prism) window.Prism.highlightElement(code);
            }).catch(() => {
              code.textContent = '// Could not load file.';
            });
          }

          toolbar.querySelector('.copy-btn').addEventListener('click', () => {
            if (codeText) {
              navigator.clipboard.writeText(codeText).then(() => Toast.success('Code copied!'));
            }
          });

          const fileTabBtns = codePanel.querySelectorAll('.file-tab-btn');
          fileTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
              fileTabBtns.forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              activeFileIndex = parseInt(btn.dataset.fileIndex);
              loadFile(activeFileIndex);
            });
          });

          details.addEventListener('toggle', () => {
            if (details.open) {
              Analytics.track('project_view', { projectId, title });
              if (!codeCache[activeFileIndex]) {
                loadFile(activeFileIndex);
              }
            }
          });

          tabBar.addEventListener('click', (e) => {
            const btn = e.target.closest('.tab-btn');
            if (!btn) return;
            tabBar.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            body.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
            if (btn.dataset.tab === 'preview') {
              body.querySelector('.panel-preview')?.classList.add('active');
            } else {
              codePanel.classList.add('active');
            }
          });

          return card;
        }

        function renderProjects() {
          container.innerHTML = '';
          if (!window.projects || !window.projects.length) {
            container.innerHTML = '<div class="empty-state">⚠️ No projects found.</div>';
            return [];
          }

          let filtered = getFilteredProjects();
          filtered = sortProjects(filtered);

          resultsMeta.textContent = \`Showing \${filtered.length} project\${filtered.length !== 1 ? 's' : ''} • Sort: \${sortSelect.options[sortSelect.selectedIndex].text}\${bookmarksOnly ? ' • Bookmarks only' : ''}\`;

          if (filtered.length === 0) {
            container.innerHTML = '<div class="empty-state">No projects found.</div>';
            return filtered;
          }

          if (sortMode === 'most-viewed' || sortMode === 'latest-bookmark') {
            const section = document.createElement('section');
            section.className = 'category';
            section.innerHTML = \`<h2 class="cat-heading">All Matching Projects <span class="cat-count">\${filtered.length}</span></h2>\`;
            const cards = document.createElement('div');
            cards.className = 'cards';
            filtered.forEach(p => cards.appendChild(buildCard(p)));
            section.appendChild(cards);
            container.appendChild(section);
            return filtered;
          }

          const groups = {};
          filtered.forEach(p => {
            if (!groups[p.category]) groups[p.category] = [];
            groups[p.category].push(p);
          });

          const orderedCats = activeFilter === 'All' ? categories.filter(c => groups[c]) : [activeFilter];

          orderedCats.forEach(cat => {
            if (!groups[cat]) return;
            const section = document.createElement('section');
            section.className = 'category';
            const catColor = categoryColors[cat] || '#1282A2';
            section.innerHTML = \`
              <h2 class="cat-heading">
                <span class="cat-dot" style="background:\${catColor}"></span>
                \${cat} Projects
                <span class="cat-count">\${groups[cat].length}</span>
              </h2>
            \`;
            const cards = document.createElement('div');
            cards.className = 'cards';
            groups[cat].forEach(p => cards.appendChild(buildCard(p)));
            section.appendChild(cards);
            container.appendChild(section);
          });

          return filtered;
        }

        function openRandomProject() {
          const filtered = getFilteredProjects();
          if (!filtered.length) {
            Toast.info('No matching projects available');
            return;
          }

          const randomProject = filtered[Math.floor(Math.random() * filtered.length)];
          const projectId = getProjectId(randomProject);
          renderProjects();

          const card = container.querySelector(\`[data-project-id="\${projectId}"] details\`);
          if (!card) return;
          card.open = true;
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
          Toast.success(\`Opened: \${randomProject.title}\`);
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            Analytics.track('filter', { category: activeFilter });
            renderProjects();
          });
        });

        sortSelect.addEventListener('change', () => {
          sortMode = sortSelect.value;
          Analytics.track('sort', { mode: sortMode });
          renderProjects();
        });

        bookmarkViewToggle.addEventListener('click', () => {
          bookmarksOnly = !bookmarksOnly;
          updateControlsUI();
          Analytics.track('bookmark_filter', { active: bookmarksOnly });
          renderProjects();
        });

        randomProjectBtn.addEventListener('click', openRandomProject);
        exportBookmarksBtn.addEventListener('click', exportBookmarks);
        clearAnalyticsBtn.addEventListener('click', () => {
          clearAnalytics();
          renderProjects();
        });

        searchInput.addEventListener('input', (e) => {
          searchQuery = e.target.value.toLowerCase().trim();
          if (searchQuery) {
            Analytics.track('search', { query: searchQuery });
          }
          renderProjects();
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === '/' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            searchInput.focus();
          }
          if (e.key === 'Escape') {
            if (searchInput.value) {
              searchInput.value = '';
              searchInput.dispatchEvent(new Event('input'));
            }
          }
          if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            document.getElementById('theme-toggle').click();
          }
          if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            showAnalytics();
          }
          if (e.key.toLowerCase() === 'b' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            bookmarkViewToggle.click();
          }
          if (e.key.toLowerCase() === 'r' && document.activeElement.tagName !== 'INPUT') {
            e.preventDefault();
            openRandomProject();
          }
        });

        updateControlsUI();

        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', renderProjects);
        } else {
          setTimeout(renderProjects, 100);
        }
      `}</Script>
    </>
  );
}
