'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Portfolio() {
  const [mounted, setMounted] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScriptsLoad = () => {
    setScriptsLoaded(true);

    // Initialize app after all scripts are loaded
    if (typeof window !== 'undefined' && (window as any).initializeProjectRendering) {
      (window as any).initializeProjectRendering();
      console.log('✨ Portfolio initialized');
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Prism CSS */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.css"
      />

      <header className="site-header">
        <div className="container header-row">
          <div>
            <h1 className="site-title">Saad Web Experiments</h1>
            <p className="lead">
              <em><strong>Muhammad Saad Amin</strong></em>, a passionate <strong>Software Engineer</strong>,
              created this project during the <strong>Free Code Camp</strong> course while earning the{' '}
              <em>Responsive Web Design Certification</em>. This project includes web pages and scripts
              demonstrating principles of <strong>HTML</strong>, <strong>CSS</strong>, <strong>JavaScript</strong>,
              <strong>Python</strong>, and <strong>React</strong>.
            </p>
          </div>
          <button id="theme-toggle" className="theme-toggle" aria-label="Toggle dark mode">
            🌙
          </button>
        </div>
      </header>

      <main className="container">
        {/* Search */}
        <div className="center">
          <div className="search-bar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="text" id="search-input" placeholder="Search projects... (Press / to focus)" />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="filter-tabs" id="filter-tabs">
          <button className="filter-btn active" data-filter="All">
            <span className="filter-icon">🗂️</span> All
          </button>
          <button className="filter-btn" data-filter="HTML">
            <span className="filter-icon">🌐</span> HTML
          </button>
          <button className="filter-btn" data-filter="CSS">
            <span className="filter-icon">🎨</span> CSS
          </button>
          <button className="filter-btn" data-filter="JavaScript">
            <span className="filter-icon">⚡</span> JavaScript
          </button>
          <button className="filter-btn" data-filter="Python">
            <span className="filter-icon">🐍</span> Python
          </button>
          <button className="filter-btn" data-filter="React">
            <span className="filter-icon">⚛️</span> React
          </button>
        </div>

        {/* Project Count Badge */}
        <div className="results-meta" id="results-meta"></div>

        {/* Project Container */}
        <div id="project-container" className="grid"></div>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© <strong>Muhammad Saad Amin</strong> — Free Code Camp Projects</p>
          <p className="footer-hint">Press <kbd>?</kbd> for keyboard shortcuts</p>
        </div>
      </footer>

      {/* Load Prism.js */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/line-numbers/prism-line-numbers.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-css.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-markup.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-jsx.min.js"
        strategy="afterInteractive"
        onLoad={handleScriptsLoad}
      />

      {/* Theme Toggle Script */}
      <Script id="theme-toggle" strategy="afterInteractive">
        {`
          const toggleBtn = document.getElementById("theme-toggle");
          const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
          if (localStorage.theme === "dark" || (!localStorage.theme && prefersDark)) {
            document.body.classList.add("dark");
            toggleBtn.textContent = "☀️";
          }
          toggleBtn?.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark = document.body.classList.contains("dark");
            localStorage.theme = isDark ? "dark" : "light";
            toggleBtn.textContent = isDark ? "☀️" : "🌙";
          });
        `}
      </Script>
    </>
  );
}
