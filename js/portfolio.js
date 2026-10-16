/**
 * MAISON ÉLYSÉE - PORTFOLIO MODULE
 * Gallery Filters, Search, and Accessible Lightbox Modal
 */

(function () {
  'use strict';

  // Portfolio items data
  const portfolioData = [
    {
      id: 1,
      title: 'The White Dawn',
      category: 'classic',
      categoryLabel: 'Classic & Grand',
      tiers: '4 Tiers (180 Servings)',
      flavors: 'Tahitian Vanilla & Meyer Lemon Curd',
      venue: 'Villa Ephrussi de Rothschild, French Riviera',
      image: 'assets/images/cake-aurore-blanche.jpg',
      description: 'A monument to classical royal pastry. Pristine ivory fondant embellished with hand-piped Renaissance relief garlands, finished with sugar-spun English garden roses.'
    },
    {
      id: 3,
      title: 'The Tuileries Garden',
      category: 'romantic',
      categoryLabel: 'Romantic & Floral',
      tiers: '5 Tiers Cascade (220 Servings)',
      flavors: 'Pistachio Rosewater & Raspberry Compote',
      venue: 'Château de Chantilly, France',
      image: 'assets/images/cake-tuileries.jpg',
      description: 'An ethereal cascading symphony of botanically accurate sugar peonies, sweet peas, and trailing jasmine hand-painted with organic food pigments.'
    },
    {
      id: 5,
      title: 'Botanical Autumn',
      category: 'seasonal',
      categoryLabel: 'Seasonal & Botanical',
      tiers: '4 Tiers Autumnal (150 Servings)',
      flavors: 'Spiced Fig, Salted Caramel & Apple Brandy',
      venue: 'Meadowood Estate, Napa Valley',
      image: 'assets/images/cake-automne.jpg',
      description: 'Deep warm hues, pressed edible wild pansies, dehydrated honey pear crisps, and spun sugar caramel cages celebrating the harvest season.'
    },
    {
      id: 6,
      title: 'Grand Palace Garnier',
      category: 'classic',
      categoryLabel: 'Classic & Grand',
      tiers: '6 Tiers Royal Colonnade (320 Servings)',
      flavors: 'Valrhona 70% Dark Chocolate & Candied Orange',
      venue: 'Opéra Garnier Grand Foyer, Paris',
      image: 'assets/images/cake-opera-monolith.jpg',
      description: 'Colossal European palace wedding cake framed by architectural miniature colonnades, Corinthian sugar pillars, neoclassical cherub reliefs, and gilded balconies.'
    },
    {
      id: 7,
      title: 'Royal Macaron Tower',
      category: 'seasonal',
      categoryLabel: 'Dessert Tables & Towers',
      tiers: '8-Tier Pyramid (350 Macarons)',
      flavors: 'Rose Lychee, Salted Butter Caramel, Matcha White Peach',
      venue: 'Hôtel de Crillon, Paris',
      image: 'assets/images/cake-dessert-table.jpg',
      description: 'An architectural centerpiece of 350 shimmering hand-painted macarons graded in ombre hues from champagne to crushed blackberry.'
    },
    {
      id: 8,
      title: 'Venetian Rococo Palace',
      category: 'classic',
      categoryLabel: 'Classic & Grand',
      tiers: '5 Tiers Royal (240 Servings)',
      flavors: 'Champagne Strawberry & Madagascan Vanilla Bean',
      venue: 'Villa d’Este, Lake Como',
      image: 'assets/images/cake-rococo.jpg',
      description: 'Elaborate Lambeth piped scrolls, overpiped royal icing collars, 24K gold baroque ornaments, and delicate teardrop sugar pearls paying homage to 18th-century Venetian palaces.'
    },
    {
      id: 9,
      title: 'Imperial Porcelain',
      category: 'romantic',
      categoryLabel: 'Romantic & Floral',
      tiers: '4 Tiers Fine Finish (160 Servings)',
      flavors: 'White Peach, Jasmine Infusion & Yuzu Cream',
      venue: 'Hôtel de Crillon Ballroom, Paris',
      image: 'assets/images/cake-porcelaine.jpg',
      description: 'Satin matte white glaze textured like handmade fine porcelain, finished with hand-painted 24-karat gold damask filigree and hyper-realistic sugar cherry blossoms.'
    },
    {
      id: 10,
      title: 'Celestial Winter Radiance',
      category: 'classic',
      categoryLabel: 'Classic & Grand',
      tiers: '4 Grand Tiers (180 Servings)',
      flavors: 'Bourbon Fig, Salted Caramel & White Truffle Cream',
      venue: 'Ritz Paris Grand Salon, Place Vendôme',
      image: 'assets/images/cake-hiver-celeste.jpg',
      description: 'An architectural celestial wedding cake featuring ornate hand-piped gold damask filigree, winter frosted English sugar garden roses, and crystalline sugar snow textures presented beside sterling silver candelabras.'
    },
    {
      id: 11,
      title: 'Rose de Grasse Pavilion',
      category: 'romantic',
      categoryLabel: 'Romantic & Floral',
      tiers: '4 Tiers English Garden (190 Servings)',
      flavors: 'Grasse Rosewater, Wild Strawberry Compote & Whipped Mascarpone',
      venue: 'Château de Villette, France',
      image: 'assets/images/cake-rose-garden.jpg',
      description: 'An enchanting garden romance centerpiece draped in fresh-sculpted blush David Austin roses, creamy gardenias, and fragrant rosewater sponge layered with sun-drenched Provence wild strawberries and light mascarpone velvet cream.'
    }
  ];

  let currentCategory = 'all';
  let searchQuery = '';
  let activeLightboxIndex = 0;

  const galleryGrid = document.getElementById('portfolioGallery');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const searchInput = document.getElementById('portfolioSearch');
  const lightboxBackdrop = document.getElementById('portfolioLightbox');

  function renderGallery() {
    if (!galleryGrid) return;

    const filtered = portfolioData.filter(item => {
      const matchCat = currentCategory === 'all' || item.category === currentCategory;
      const matchSearch = searchQuery === '' || 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.flavors.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.venue.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (filtered.length === 0) {
      galleryGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.25rem; font-family: var(--font-serif-editorial);">No bespoke confections match your selection.</p>
          <button class="btn btn-secondary btn-sm" id="resetFiltersBtn" style="margin-top: 1rem;">Reset Filters</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFiltersBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === 'all'));
          renderGallery();
        });
      }
      return;
    }

    galleryGrid.innerHTML = filtered.map((item, idx) => `
      <article class="portfolio-card card-enter" data-id="${item.id}" tabindex="0" role="button" aria-label="View details for ${item.title}" style="animation-delay: ${(idx % 6) * 0.07}s;">
        <div class="portfolio-img-box">
          <span class="portfolio-tag">${item.categoryLabel}</span>
          <img src="${item.image}" alt="${item.title} wedding cake design" loading="lazy" />
          <button class="portfolio-quick-view" aria-label="Expand photo" tabindex="-1">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </button>
        </div>
        <div class="portfolio-details">
          <h3 class="portfolio-title">${item.title}</h3>
          <p class="portfolio-meta">
            <span>${item.tiers}</span>
            <span>•</span>
            <span>${item.venue.split(',')[0]}</span>
          </p>
        </div>
      </article>
    `).join('');

    // Attach click handlers to cards
    galleryGrid.querySelectorAll('.portfolio-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id, 10);
        openLightboxById(id);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const id = parseInt(card.dataset.id, 10);
          openLightboxById(id);
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
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.filter;
      renderGallery();
    });
  });

  // Search Input
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderGallery();
    });
  }

  // Lightbox Handling
  function openLightboxById(id) {
    const itemIndex = portfolioData.findIndex(item => item.id === id);
    if (itemIndex === -1) return;
    activeLightboxIndex = itemIndex;
    updateLightboxContent();
    if (lightboxBackdrop) {
      lightboxBackdrop.classList.add('active');
      lightboxBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const closeBtn = lightboxBackdrop.querySelector('.lightbox-close');
      if (closeBtn) closeBtn.focus();
    }
  }

  function updateLightboxContent() {
    if (!lightboxBackdrop) return;
    const item = portfolioData[activeLightboxIndex];
    if (!item) return;

    const img = lightboxBackdrop.querySelector('.lightbox-img');
    const title = lightboxBackdrop.querySelector('.lightbox-title');
    const category = lightboxBackdrop.querySelector('.lightbox-category');
    const tiers = lightboxBackdrop.querySelector('.lightbox-tiers');
    const flavors = lightboxBackdrop.querySelector('.lightbox-flavors');
    const venue = lightboxBackdrop.querySelector('.lightbox-venue');
    const desc = lightboxBackdrop.querySelector('.lightbox-desc');
    const inquireLink = lightboxBackdrop.querySelector('.lightbox-inquire-btn');

    if (img) {
      img.src = item.image;
      img.alt = item.title;
    }
    if (title) title.textContent = item.title;
    if (category) category.textContent = item.categoryLabel;
    if (tiers) tiers.textContent = item.tiers;
    if (flavors) flavors.textContent = item.flavors;
    if (venue) venue.textContent = item.venue;
    if (desc) desc.textContent = item.description;
    if (inquireLink) {
      inquireLink.href = `contact.html?design=${encodeURIComponent(item.title)}`;
    }
  }

  function closeLightbox() {
    if (lightboxBackdrop) {
      lightboxBackdrop.classList.remove('active');
      lightboxBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (lightboxBackdrop) {
    const closeBtn = lightboxBackdrop.querySelector('.lightbox-close');
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    lightboxBackdrop.addEventListener('click', (e) => {
      if (e.target === lightboxBackdrop) closeLightbox();
    });

    const prevBtn = lightboxBackdrop.querySelector('.lightbox-prev');
    const nextBtn = lightboxBackdrop.querySelector('.lightbox-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        activeLightboxIndex = (activeLightboxIndex - 1 + portfolioData.length) % portfolioData.length;
        updateLightboxContent();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        activeLightboxIndex = (activeLightboxIndex + 1) % portfolioData.length;
        updateLightboxContent();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!lightboxBackdrop.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') {
        activeLightboxIndex = (activeLightboxIndex - 1 + portfolioData.length) % portfolioData.length;
        updateLightboxContent();
      }
      if (e.key === 'ArrowRight') {
        activeLightboxIndex = (activeLightboxIndex + 1) % portfolioData.length;
        updateLightboxContent();
      }
    });
  }

  // --- Hero Showcase Interactive Switcher & Inspect ---
  const heroCakes = {
    rococo: {
      id: 8,
      title: 'Venetian Rococo Palace',
      sub: '5 Royal Tiers • 24K Gold Relief & Sugar Pearls',
      chip: "Royal Commission • Villa d'Este, Lake Como",
      image: 'assets/images/hero-portfolio.jpg',
      alt: 'Venetian Rococo Palace luxury wedding cake centerpiece with gold baroque reliefs and sugar pearls'
    },
    celeste: {
      id: 10,
      title: 'Celestial Winter Radiance',
      sub: '4 Grand Tiers • Gold Damask & Frosted Florals',
      chip: 'Winter Gala Showcase • Ritz Paris Ballroom',
      image: 'assets/images/cake-hiver-celeste.jpg',
      alt: 'Celestial Winter luxury wedding cake with frosted sugar florals, 24K gold damask, and crystal candelabras'
    },
    dawn: {
      id: 1,
      title: 'The White Dawn',
      sub: '4 Tiers • Renaissance Raised Relief & Garden Roses',
      chip: 'Palatial Wedding • Villa Ephrussi de Rothschild',
      image: 'assets/images/cake-aurore-blanche.jpg',
      alt: 'The White Dawn neoclassical royal relief wedding cake with porcelain sugar roses'
    }
  };

  let currentHeroCakeKey = 'rococo';

  function initHeroShowcase() {
    const heroImg = document.getElementById('portfolioHeroImg');
    const heroTitle = document.getElementById('heroBadgeTitle');
    const heroSub = document.getElementById('heroBadgeSub');
    const heroChip = document.getElementById('heroChipText');
    const switchButtons = document.querySelectorAll('.hero-switch-btn');
    const heroInspectBtn = document.getElementById('heroInspectBtn');
    const heroImageFrame = document.getElementById('heroImageFrame');

    if (!heroImg) return;

    function selectHeroCake(key) {
      const cake = heroCakes[key];
      if (!cake) return;
      currentHeroCakeKey = key;

      heroImg.style.opacity = '0.35';
      heroImg.style.transform = 'scale(0.97)';

      setTimeout(() => {
        heroImg.src = cake.image;
        heroImg.alt = cake.alt;
        if (heroTitle) heroTitle.textContent = cake.title;
        if (heroSub) heroSub.textContent = cake.sub;
        if (heroChip) heroChip.textContent = cake.chip;
        heroImg.style.opacity = '1';
        heroImg.style.transform = 'scale(1)';
      }, 150);

      switchButtons.forEach(btn => {
        const isSelected = btn.dataset.cake === key;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      });
    }

    switchButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectHeroCake(btn.dataset.cake);
      });
    });

    function openHeroInLightbox() {
      const cake = heroCakes[currentHeroCakeKey];
      if (!cake) return;
      openLightboxById(cake.id);
    }

    if (heroInspectBtn) {
      heroInspectBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openHeroInLightbox();
      });
    }

    if (heroImageFrame) {
      heroImageFrame.addEventListener('click', () => {
        openHeroInLightbox();
      });
      heroImageFrame.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openHeroInLightbox();
        }
      });
    }
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    renderGallery();
    initHeroShowcase();
  });
})();
