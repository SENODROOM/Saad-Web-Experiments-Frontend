/**
 * Project tags and multi-filter component
 */

export class ProjectTags {
  static tagDefinitions = {
    difficulty: {
      beginner: { label: 'Beginner', color: '#10b981' },
      intermediate: { label: 'Intermediate', color: '#f59e0b' },
      advanced: { label: 'Advanced', color: '#ef4444' },
    },
    features: {
      responsive: { label: 'Responsive', color: '#3b82f6' },
      animated: { label: 'Animated', color: '#8b5cf6' },
      interactive: { label: 'Interactive', color: '#ec4899' },
      accessible: { label: 'Accessible', color: '#06b6d4' },
    },
    tech: {
      grid: { label: 'CSS Grid', color: '#6366f1' },
      flexbox: { label: 'Flexbox', color: '#8b5cf6' },
      animations: { label: 'Animations', color: '#ec4899' },
      forms: { label: 'Forms', color: '#14b8a6' },
      api: { label: 'API', color: '#f59e0b' },
      classes: { label: 'Classes', color: '#ef4444' },
    },
  };

  static assignTags(project) {
    const tags = {
      difficulty: [],
      features: [],
      tech: [],
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

    Object.entries(tags).forEach(([category, tagList]) => {
      tagList.forEach((tagKey) => {
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
      tech: new Set(),
    };

    projects.forEach((project) => {
      if (!project.tags) {
        project.tags = this.assignTags(project);
      }

      Object.entries(project.tags).forEach(([category, tagList]) => {
        tagList.forEach((tag) => allTags[category].add(tag));
      });
    });

    // Create filter sections
    Object.entries(allTags).forEach(([category, tagSet]) => {
      if (tagSet.size === 0) return;

      const section = document.createElement('div');
      section.className = 'filter-section';

      const title = document.createElement('h3');
      title.className = 'filter-section-title';
      title.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      section.appendChild(title);

      const tagContainer = document.createElement('div');
      tagContainer.className = 'filter-tags';

      Array.from(tagSet).forEach((tagKey) => {
        const tagDef = this.tagDefinitions[category]?.[tagKey];
        if (!tagDef) return;

        const button = document.createElement('button');
        button.className = 'filter-tag-btn';
        button.textContent = tagDef.label;
        button.style.setProperty('--tag-color', tagDef.color);
        button.dataset.category = category;
        button.dataset.tag = tagKey;

        button.addEventListener('click', () => {
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
    clearBtn.addEventListener('click', () => {
      filterContainer.querySelectorAll('.filter-tag-btn.active').forEach((btn) => {
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
      tech: [],
    };

    activeButtons.forEach((btn) => {
      const category = btn.dataset.category;
      const tag = btn.dataset.tag;
      if (filters[category]) {
        filters[category].push(tag);
      }
    });

    return filters;
  }

  static filterProjects(projects, activeFilters) {
    if (
      activeFilters.difficulty.length === 0 &&
      activeFilters.features.length === 0 &&
      activeFilters.tech.length === 0
    ) {
      return projects;
    }

    return projects.filter((project) => {
      if (!project.tags) {
        project.tags = this.assignTags(project);
      }

      // Check if project matches all active filters (AND logic within category, OR between categories)
      const matchesDifficulty =
        activeFilters.difficulty.length === 0 ||
        activeFilters.difficulty.some((tag) => project.tags.difficulty.includes(tag));

      const matchesFeatures =
        activeFilters.features.length === 0 ||
        activeFilters.features.some((tag) => project.tags.features.includes(tag));

      const matchesTech =
        activeFilters.tech.length === 0 ||
        activeFilters.tech.some((tag) => project.tags.tech.includes(tag));

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

export default ProjectTags;
