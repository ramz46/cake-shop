/**
 * MAISON ÉLYSÉE - JOURNAL / BLOG MODULE
 * Category filter, article search, reading time calculation, and share triggers
 */

(function () {
  'use strict';

  const articles = [
    {
      id: 1,
      slug: 'architectural-wedding-cake-trends-2026',
      title: 'Architectural Centerpieces & Sugar Lace: 2026 Wedding Cake Trends',
      category: 'design',
      categoryLabel: 'Design Inspiration',
      date: 'May 14, 2026',
      readTime: '6 min read',
      image: 'assets/images/hero-blog-post.jpg',
      excerpt: 'Explore how top luxury pastry chefs are shifting from rustic drip cakes toward modern geometric structures, raw crystal fissures, and micro-piped Renaissance relief work.'
    },
    {
      id: 2,
      slug: 'the-art-of-bespoke-flavor-pairings',
      title: 'Beyond Vanilla: Curating an Indulgent Wedding Flavor Palette',
      category: 'flavors',
      categoryLabel: 'Flavor Trends',
      date: 'April 28, 2026',
      readTime: '8 min read',
      image: 'assets/images/ingredients-organic.jpg',
      excerpt: 'From Tahitian vanilla steeped in aged champagne to Sicilian pistachio with blood orange cream, discover how we architect multi-layered sensorial journeys for wedding guests.'
    },
    {
      id: 3,
      slug: 'wedding-cake-portion-and-tier-guide',
      title: 'The Essential Wedding Cake Size & Portion Guide',
      category: 'planning',
      categoryLabel: 'Wedding Planning',
      date: 'April 10, 2026',
      readTime: '5 min read',
      image: 'assets/images/cake-portion-guide.jpg',
      objectPosition: 'center top',
      excerpt: 'How to calculate the ideal number of tiers for 75 to 300+ guests, balancing visual grandeur with realistic dessert consumption and late-night sweet tables.'
    },
    {
      id: 4,
      slug: 'curating-an-unforgettable-dessert-table',
      title: 'Styling an Opulent Wedding Dessert Table & Pastries',
      category: 'design',
      categoryLabel: 'Design Inspiration',
      date: 'March 22, 2026',
      readTime: '7 min read',
      image: 'assets/images/cake-dessert-table.jpg',
      excerpt: 'Macaron towers, gold-leaf pastries, fruit tartlets, and crisp cream puffs: how we harmonize textures, pedestal heights, and botanical florals into an unforgettable reception centerpiece.'
    },
    {
      id: 5,
      slug: 'outdoor-summer-wedding-cake-logistics',
      title: 'White-Glove Summer Delivery: Protecting Cakes Against Heat & Humidity',
      category: 'planning',
      categoryLabel: 'Wedding Planning',
      date: 'March 05, 2026',
      readTime: '4 min read',
      image: 'assets/images/delivery-setup.jpg',
      excerpt: 'A behind-the-scenes look at refrigerated transit, structural food-grade doweling, and how our master decorators assemble delicate sugar florals on-site.'
    },
    {
      id: 6,
      slug: 'history-of-royal-royal-icing',
      title: 'The Lost Art of Lambeth & Royal Icing Embroidery',
      category: 'flavors',
      categoryLabel: 'Pastry Craft',
      date: 'February 18, 2026',
      readTime: '9 min read',
      image: 'assets/images/cake-rococo.jpg',
      excerpt: 'Reviving Victorian piping methodologies where sugar lacework is layered millimetre by millimetre over three days of intense hand precision.'
    }
  ];

  let currentCategory = 'all';
  let searchQuery = '';

  const blogGrid = document.getElementById('blogGrid');
  const filterBtns = document.querySelectorAll('.blog-filter-btn');
  const heroTopicBtns = document.querySelectorAll('.hero-topic-btn');
  const searchInput = document.getElementById('blogSearchInput');
  const heroImageFrame = document.getElementById('journalHeroImageFrame');

  function setCategory(category, smoothScroll = false) {
    currentCategory = category;

    // Sync main filter bar
    filterBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === currentCategory);
    });

    // Sync hero topic buttons
    heroTopicBtns.forEach(btn => {
      const isActive = btn.dataset.category === currentCategory;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    renderBlog();

    if (smoothScroll && blogGrid) {
      const headerOffset = 90;
      const elementPosition = blogGrid.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  function renderBlog() {
    if (!blogGrid) return;

    const filtered = articles.filter(art => {
      const matchCat = currentCategory === 'all' || art.category === currentCategory;
      const matchSearch = searchQuery === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      blogGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.25rem; font-family: var(--font-serif-editorial);">No journal entries found matching your query.</p>
        </div>
      `;
      return;
    }

    blogGrid.innerHTML = filtered.map(item => `
      <article class="card-luxury reveal-fade-up interactive-3d-tilt" data-tilt="true" style="padding: 0; overflow: hidden;">
        <div style="position: relative; aspect-ratio: 16 / 10; overflow: hidden; background: var(--bg-secondary);">
          <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; ${item.objectPosition ? 'object-position: ' + item.objectPosition + ';' : ''} transition: transform 0.5s ease;" loading="eager">
          <span class="portfolio-tag">${item.categoryLabel}</span>
        </div>
        <div style="padding: 1.85rem; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; gap: 0.75rem; font-size: 0.75rem; color: var(--accent-gold); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; margin-bottom: 0.65rem;">
            <span>${item.date}</span>
            <span>•</span>
            <span>${item.readTime}</span>
          </div>
          <h3 style="font-size: 1.35rem; margin-bottom: 0.85rem; line-height: 1.3;">
            <a href="blog-post.html?slug=${item.slug}" style="text-decoration: none; color: inherit;">${item.title}</a>
          </h3>
          <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem; flex-grow: 1;">${item.excerpt}</p>
          <div style="border-top: 1px solid var(--border-hairline); padding-top: 1rem; display: flex; align-items: center; justify-content: space-between;">
            <a href="blog-post.html?slug=${item.slug}" class="btn-ghost" style="font-size: 0.825rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.4rem; padding: 0;">
              Read Full Article <span>→</span>
            </a>
            <button class="btn-ghost share-article-btn" data-title="${item.title}" data-slug="${item.slug}" aria-label="Share article" style="padding: 0; color: var(--text-muted);">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');

    // Attach share triggers
    blogGrid.querySelectorAll('.share-article-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const title = btn.dataset.title;
        if (navigator.share) {
          navigator.share({
            title: title,
            url: window.location.href
          }).catch(() => {});
        } else {
          navigator.clipboard.writeText(window.location.href);
          if (window.showToast) {
            window.showToast(`Link to "${title}" copied to clipboard!`, 'success');
          }
        }
      });
    });

    if (typeof window.refreshScrollReveal === 'function') {
      window.refreshScrollReveal();
    }
    if (typeof window.refresh3DCardTilt === 'function') {
      window.refresh3DCardTilt();
    }
  }

  // Filter Buttons
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.category, false);
    });
  });

  // Hero Quick-Topic Buttons
  heroTopicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      setCategory(btn.dataset.category, true);
    });
  });

  // Hero Image Frame click to lead story
  if (heroImageFrame) {
    heroImageFrame.addEventListener('click', () => {
      window.location.href = 'blog-post.html?slug=architectural-wedding-cake-trends-2026';
    });
    heroImageFrame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        window.location.href = 'blog-post.html?slug=architectural-wedding-cake-trends-2026';
      }
    });
  }

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderBlog();
    });
  }

  document.addEventListener('DOMContentLoaded', renderBlog);
})();
