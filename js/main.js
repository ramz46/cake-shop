/**
 * MAISON ÉLYSÉE - CORE JAVASCRIPT
 * Theme, RTL, Typography Aesthetics, Mobile Menu, Scroll Reveal, Toast & Common Utilities
 */

(function () {
  'use strict';

  // --- Scroll Restoration & Reload Stability ---
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // Ensure browser starts at top on reload to prevent home jumping above navbar
  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
  });

  // Early apply saved theme and direction to prevent layout flash
  try {
    const savedDir = localStorage.getItem('maison_elysee_dir');
    if (savedDir) document.documentElement.setAttribute('dir', savedDir);
    const savedTheme = localStorage.getItem('maison_elysee_theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  } catch (e) {}

  // --- 0. Brand Preloader & Loading Area Handler ---
  function initPreloader() {
    const preloader = document.getElementById('sitePreloader');
    if (!preloader) return;

    let isDismissed = false;
    function hidePreloader() {
      if (isDismissed) return;
      isDismissed = true;
      preloader.classList.add('loaded');
      setTimeout(() => {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 550);
    }

    const startTime = Date.now();
    const minDisplay = 450;

    if (document.readyState === 'complete') {
      setTimeout(hidePreloader, minDisplay);
    } else {
      window.addEventListener('load', () => {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, minDisplay - elapsed);
        setTimeout(hidePreloader, delay);
      });
    }

    // Safety timeout: ensure preloader never gets stuck
    setTimeout(hidePreloader, 1200);
  }
  initPreloader();

  // --- 0b. Ultra-Smooth Buttery Scrolling Engine (Lenis) ---
  function initLenisSmoothScroll() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof window.Lenis === 'undefined') {
      return;
    }

    try {
      const lenis = new window.Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Exponential luxury easeOutExpo
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
        smoothTouch: false, // Maintain native snappy responsiveness on touch devices
        infinite: false
      });

      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      window.lenisInstance = lenis;
    } catch (err) {
      console.warn('Lenis smooth scrolling not active:', err);
    }
  }

  // --- 1. Theme Management (Light / Dark) ---
  const THEME_KEY = 'maison_elysee_theme';
  const themeToggleBtns = document.querySelectorAll('[data-action="toggle-theme"]');

  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      const label = btn.querySelector('.theme-label');
      if (theme === 'dark') {
        if (icon) icon.textContent = '🌙';
        if (label) label.textContent = 'Dark';
        btn.setAttribute('aria-label', 'Dark mode active. Click to switch to Light mode');
        btn.setAttribute('title', 'Dark mode active. Click to switch to Light mode');
      } else {
        if (icon) icon.textContent = '☀️';
        if (label) label.textContent = 'Light';
        btn.setAttribute('aria-label', 'Light mode active. Click to switch to Dark mode');
        btn.setAttribute('title', 'Light mode active. Click to switch to Dark mode');
      }
    });
  }

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  });

  // --- 2. Layout Direction Management (LTR / RTL Mode) ---
  const DIR_KEY = 'maison_elysee_dir';
  const dirToggleBtns = document.querySelectorAll('[data-action="toggle-direction"]');

  function initDirection() {
    const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
    setDirection(savedDir);
  }

  function setDirection(dir) {
    const targetDir = dir === 'rtl' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', targetDir);
    localStorage.setItem(DIR_KEY, targetDir);

    // Provide smooth, graceful transition between LTR and RTL
    document.body.classList.add('direction-transitioning');
    setTimeout(() => {
      document.body.classList.remove('direction-transitioning');
    }, 450);

    dirToggleBtns.forEach(btn => {
      const icon = btn.querySelector('.dir-icon');
      const label = btn.querySelector('.dir-label');
      if (targetDir === 'rtl') {
        if (icon) {
          icon.classList.add('rtl-active');
        }
        if (label) label.textContent = 'RTL';
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'RTL mode active. Click to switch to LTR mode');
        btn.setAttribute('title', 'RTL mode active. Click to switch to LTR mode');
      } else {
        if (icon) {
          icon.classList.remove('rtl-active');
        }
        if (label) label.textContent = 'LTR';
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'LTR mode active. Click to switch to RTL mode');
        btn.setAttribute('title', 'LTR mode active. Click to switch to RTL mode');
      }
    });
  }

  dirToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('dir') || 'ltr';
      setDirection(current === 'rtl' ? 'ltr' : 'rtl');
    });
  });

  // --- 2b. Language: Enforce English Only ---
  function initLanguage() {
    try {
      localStorage.removeItem('maison_elysee_lang');
    } catch (e) {}
    document.documentElement.setAttribute('lang', 'en');
  }

  // --- 3. Interactive Typography Aesthetic Switcher ---
  const FONT_AESTHETIC_KEY = 'maison_elysee_font_style';
  const fontSelectors = document.querySelectorAll('[data-action="change-font-aesthetic"]');

  function initFontAesthetic() {
    const saved = localStorage.getItem(FONT_AESTHETIC_KEY) || 'haute-editorial';
    setFontAesthetic(saved);
    fontSelectors.forEach(select => {
      select.value = saved;
    });
  }

  function setFontAesthetic(style) {
    document.body.setAttribute('data-font-style', style);
    localStorage.setItem(FONT_AESTHETIC_KEY, style);
  }

  fontSelectors.forEach(select => {
    select.addEventListener('change', (e) => {
      setFontAesthetic(e.target.value);
      showToast(`Typography aesthetic changed to: ${e.target.options[e.target.selectedIndex].text}`, 'info');
    });
  });

  // --- 4. Smooth Scroll Progress, Header Blur & Scroll-To-Top ---
  const header = document.querySelector('.site-header');

  function initScrollProgressAndControls() {
    // Inject Progress Bar if not present
    let progressBar = document.getElementById('scrollProgressBar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scrollProgressBar';
      progressBar.className = 'scroll-progress-bar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    // Inject Scroll-To-Top Button if not present
    let scrollTopBtn = document.getElementById('scrollToTopBtn');
    if (!scrollTopBtn) {
      scrollTopBtn = document.createElement('button');
      scrollTopBtn.id = 'scrollToTopBtn';
      scrollTopBtn.className = 'scroll-to-top';
      scrollTopBtn.setAttribute('aria-label', 'Return to top of page');
      scrollTopBtn.setAttribute('title', 'Scroll to top');
      scrollTopBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 15l-6-6-6 6"/>
        </svg>
      `;
      document.body.appendChild(scrollTopBtn);

      scrollTopBtn.addEventListener('click', () => {
        if (window.lenisInstance) {
          window.lenisInstance.scrollTo(0, { duration: 1.15 });
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      });
    }

    // High performance RAF scroll listener
    let ticking = false;
    function onScroll() {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

      // Update progress bar
      if (progressBar) {
        progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
      }

      // Update header scrolled state
      if (header) {
        if (scrollY > 35) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Update scroll-to-top button visibility
      if (scrollTopBtn) {
        if (scrollY > 320) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    if (window.lenisInstance) {
      window.lenisInstance.on('scroll', onScroll);
    }

    // Initial check
    onScroll();
  }

  // --- 5. Mobile Navigation Drawer ---
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');

  function openDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (window.lenisInstance) window.lenisInstance.stop();
      if (drawerClose) drawerClose.focus();
    }
  }

  function closeDrawer() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.lenisInstance) window.lenisInstance.start();
      if (menuToggle) menuToggle.focus();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', openDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        closeDrawer();
      }
    });

    mobileDrawer.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // --- 6. Cinematic Scroll-Reveal Observer & Grid Stagger System ---
  let revealObserver = null;

  function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Target below-the-fold content cards and explicit reveal elements (keeps Hero stable)
    const autoCandidates = document.querySelectorAll(`
      .portfolio-card,
      .service-card,
      .card-luxury,
      .testimonial-card,
      .stat-item:not(.hero-stats-row .stat-item),
      .faq-item,
      .customizer-box,
      .monogram-studio-card,
      .portion-calculator,
      .editorial-ribbon,
      .reveal-on-scroll,
      .reveal-fade-up,
      .reveal-fade-in,
      .reveal-scale,
      .reveal-slide-left,
      .reveal-slide-right
    `);

    autoCandidates.forEach(el => {
      if (!el.classList.contains('reveal-on-scroll') && 
          !el.classList.contains('reveal-fade-up') &&
          !el.classList.contains('reveal-fade-in') &&
          !el.classList.contains('reveal-scale') &&
          !el.classList.contains('reveal-slide-left') &&
          !el.classList.contains('reveal-slide-right')) {
        el.classList.add('reveal-fade-up');
      }
    });

    // Auto-stagger children inside multi-item grids
    const staggerContainers = document.querySelectorAll('.grid-2, .grid-3, .grid-4, .faq-list');
    staggerContainers.forEach(container => {
      const children = Array.from(container.children);
      children.forEach((child, idx) => {
        if (!child.style.transitionDelay) {
          child.style.transitionDelay = `${(idx % 4) * 0.09}s`;
        }
      });
    });

    const elementsToObserve = document.querySelectorAll(`
      .reveal-on-scroll,
      .reveal-fade-up,
      .reveal-fade-in,
      .reveal-scale,
      .reveal-slide-left,
      .reveal-slide-right
    `);

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elementsToObserve.forEach(el => el.classList.add('revealed'));
      return;
    }

    if (revealObserver) {
      revealObserver.disconnect();
    }

    revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    elementsToObserve.forEach(el => revealObserver.observe(el));
  }

  window.refreshScrollReveal = function () {
    initScrollReveal();
  };

  // --- 7. Desktop Interactive 2.5D Optical Parallax for Hero & Cards ---
  function initHeroParallax() {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const heroWrappers = document.querySelectorAll('.hero-image-wrapper, .page-hero-image-wrapper');
    heroWrappers.forEach(wrapper => {
      const img = wrapper.querySelector('img');
      if (!img) return;

      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        img.style.transform = `scale(1.06) translate(${x * 6}px, ${y * 6}px)`;
      });

      wrapper.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1) translate(0px, 0px)';
      });
    });
  }

  // --- 8. Tactile Ripple Effect on Luxury CTA Buttons ---
  function initButtonTactileEffect() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.className = 'btn-ripple-wave';
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        btn.appendChild(ripple);

        setTimeout(() => {
          if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
        }, 600);
      });
    });
  }

  // --- 9. Smooth In-Page Anchor Navigation & Home Return ---
  function initSmoothAnchors() {
    // Smooth scroll for all hash anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        if (targetId === '#main-content') {
          e.preventDefault();
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(0, { duration: 1.15 });
          } else {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
          return;
        }
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const siteHeader = document.querySelector('.site-header');
          const headerOffset = (siteHeader ? siteHeader.offsetHeight : 80) + 12;

          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(targetEl, { offset: -headerOffset, duration: 1.15 });
          } else {
            const elementPosition = targetEl.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    // Smooth return to top when clicking Home link or logo while on Home page
    const homeLinks = document.querySelectorAll('a[href="index.html"], a[href="./"], a.brand-logo');
    homeLinks.forEach(link => {
      link.addEventListener('click', function (e) {
        const pathname = window.location.pathname;
        const isHomePage = pathname.endsWith('index.html') || pathname.endsWith('/') || pathname === '';
        if (isHomePage && !this.getAttribute('href').includes('#')) {
          e.preventDefault();
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(0, { duration: 1.15 });
          } else {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }
          if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname);
          }
        }
      });
    });
  }

  // --- 10. FAQs Accordion ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(other => {
          other.classList.remove('active');
          const btn = other.querySelector('.faq-question');
          if (btn) btn.setAttribute('aria-expanded', 'false');
        });
        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }
  });

  // --- 11. Interactive Portion Calculator (if present on page) ---
  const guestSlider = document.getElementById('guestSlider');
  const guestCountDisplay = document.getElementById('guestCountDisplay');
  const recommendedTiersDisplay = document.getElementById('recommendedTiers');
  const recommendedHeightDisplay = document.getElementById('recommendedHeight');
  const recommendedServingsDisplay = document.getElementById('recommendedServings');

  if (guestSlider) {
    function updatePortionGuide(val) {
      const guests = parseInt(val, 10);
      if (guestCountDisplay) guestCountDisplay.textContent = guests;
      if (recommendedServingsDisplay) recommendedServingsDisplay.textContent = `${guests} dessert portions`;

      let tiers = '2 Tiers (6" + 8")';
      let height = '~12-14 inches';
      if (guests < 50) {
        tiers = '2 Tiers Petite (5" + 7")';
        height = '~10-12 inches';
      } else if (guests <= 85) {
        tiers = '2-3 Tiers Classic (6" + 8" + optional 4")';
        height = '~14-16 inches';
      } else if (guests <= 140) {
        tiers = '3 Tiers Grand (6" + 8" + 10")';
        height = '~18-20 inches';
      } else if (guests <= 220) {
        tiers = '4 Tiers Sculptural (6" + 8" + 10" + 12")';
        height = '~24-26 inches';
      } else {
        tiers = '5-6 Tiers Monumental (with kitchen cutting tiers)';
        height = '30+ inches statement';
      }

      if (recommendedTiersDisplay) recommendedTiersDisplay.textContent = tiers;
      if (recommendedHeightDisplay) recommendedHeightDisplay.textContent = height;
    }

    guestSlider.addEventListener('input', (e) => {
      updatePortionGuide(e.target.value);
    });
    updatePortionGuide(guestSlider.value);
  }

  // --- 12. Toast Notification System ---
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }

  window.showToast = function (message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>✨</span> <div>${message}</div>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 350);
    }, 4500);
  };

  // --- 14. Animated Count-Up Numbers ---
  function initAnimatedCounters() {
    const counterElements = document.querySelectorAll('.stat-number[data-target]');
    if (!counterElements.length) return;

    function startCounter(el) {
      if (el.dataset.counterStarted === 'true') return;
      el.dataset.counterStarted = 'true';

      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800; // ms
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        // Ease out cubic
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * target);

        el.textContent = `${current}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = `${target}${suffix}`;
        }
      }

      requestAnimationFrame(update);
    }

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });

      counterElements.forEach(el => counterObserver.observe(el));
    } else {
      counterElements.forEach(el => startCounter(el));
    }
  }

  // --- 15. Hero Floating Gold Dust Particle Generator ---
  function initHeroGoldDust() {
    const dustContainers = document.querySelectorAll('.hero-dust-container');
    if (!dustContainers.length) return;

    dustContainers.forEach(dustContainer => {
      dustContainer.innerHTML = '';
      const particleCount = 20;

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'hero-dust-particle';
        const left = Math.random() * 100;
        const top = 15 + Math.random() * 80;
        const size = 3 + Math.random() * 4;
        const delay = Math.random() * 12;
        const duration = 10 + Math.random() * 8;

        particle.style.left = `${left}%`;
        particle.style.top = `${top}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;

        dustContainer.appendChild(particle);
      }
    });
  }

  // --- 16. Interactive Seasonal Flavor Journey Switcher ---
  const seasonFlavorData = {
    spring: {
      seasonBadge: 'Spring Radiance • Spring Garden',
      title: 'Tahitian Vanilla & Wild Alpine Blackberry',
      desc: 'Double-fold organic Tahitian vanilla bean chiffon soaked in alpine elderflower syrup, filled with wild mountain blackberry compote and whipped champagne mousse.',
      image: 'assets/images/cake-aurore-blanche.jpg',
      alt: 'Spring signature Tahitian vanilla and alpine blackberry wedding cake',
      pairing: 'Sommelier: Laurent-Perrier Cuvée Rosé Brut Champagne',
      sweetness: '65%',
      botanical: '92%',
      citrus: '70%',
      cocoa: '15%'
    },
    summer: {
      seasonBadge: 'Summer Solstice • Summer Blossoms',
      title: 'Pistachio Rosewater & Summer Raspberry',
      desc: 'Sicilian Bronte pistachio flour genovese infused with Bulgarian rose essence, layered with crushed summer raspberries and white peach cream.',
      image: 'assets/images/cake-tuileries.jpg',
      alt: 'Summer floral pistachio rosewater wedding cake with sugar peonies',
      pairing: 'Sommelier: Billecart-Salmon Brut Blanc de Blancs or Wild Jasmine Spritz',
      sweetness: '60%',
      botanical: '95%',
      citrus: '85%',
      cocoa: '10%'
    },
    autumn: {
      seasonBadge: 'Autumn Splendor • Golden Harvest',
      title: 'Valrhona 70% Guanaja & Blood Orange',
      desc: 'Single-origin 70% dark chocolate sponge with hazelnut gianduja crunch, layered with Sicilian blood orange curd and 24-karat Florentine gold leaf.',
      image: 'assets/images/cake-vendange-doree.jpg',
      alt: 'Luxury autumn wedding cake with 24K Florentine gold leaf, Valrhona dark chocolate, and autumn sugar floristry',
      pairing: 'Sommelier: 2018 Château d’Yquem Sauternes or Vintage Tawny Port',
      sweetness: '70%',
      botanical: '50%',
      citrus: '75%',
      cocoa: '95%'
    },
    winter: {
      seasonBadge: 'Winter Radiance • Celestial Winter',
      title: 'Bourbon Fig & Salted Normandy Butter Caramel',
      desc: 'Spiced walnut chiffon soaked in Kentucky single-barrel bourbon essence, layered with roasted black mission fig preserves and sea salt caramel.',
      image: 'assets/images/cake-hiver-celeste.jpg',
      alt: 'Celestial winter wedding cake with frosted sugar florals, 24K gold damask, and crystalline sugar textures',
      pairing: 'Sommelier: Dom Ruinart Millésimé Champagne or Aged Grand Marnier',
      sweetness: '75%',
      botanical: '45%',
      citrus: '35%',
      cocoa: '78%'
    }
  };

  function initSeasonalFlavorJourney() {
    const seasonButtons = document.querySelectorAll('[data-season-btn]');
    const card = document.getElementById('seasonalFlavorCard');
    if (!seasonButtons.length || !card) return;

    const badge = card.querySelector('#flavorSeasonBadge');
    const title = card.querySelector('#flavorSeasonTitle');
    const desc = card.querySelector('#flavorSeasonDesc');
    const img = card.querySelector('#flavorSeasonImg');
    const pairing = card.querySelector('#flavorSeasonPairing');
    const barSweetness = card.querySelector('#barSweetness');
    const barBotanical = card.querySelector('#barBotanical');
    const barCitrus = card.querySelector('#barCitrus');
    const barCocoa = card.querySelector('#barCocoa');

    seasonButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        seasonButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const seasonKey = btn.dataset.seasonBtn;
        const data = seasonFlavorData[seasonKey];
        if (!data) return;

        // Smooth crossfade animation
        card.style.opacity = '0.5';
        card.style.transform = 'translateY(6px)';

        setTimeout(() => {
          if (badge) badge.textContent = data.seasonBadge;
          if (title) title.textContent = data.title;
          if (desc) desc.textContent = data.desc;
          if (pairing) pairing.textContent = data.pairing;
          if (img) {
            img.src = data.image;
            img.alt = data.alt;
          }

          if (barSweetness) barSweetness.style.width = data.sweetness;
          if (barBotanical) barBotanical.style.width = data.botanical;
          if (barCitrus) barCitrus.style.width = data.citrus;
          if (barCocoa) barCocoa.style.width = data.cocoa;

          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 220);
      });
    });
  }

  // --- 17. Home Gallery Filter ---
  function initHomeGalleryFilter() {
    const filterBtns = document.querySelectorAll('.home-filter-btn');
    const galleryCards = document.querySelectorAll('#homeGalleryGrid .portfolio-card');
    if (!filterBtns.length || !galleryCards.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.dataset.homeFilter;
        let visibleCount = 0;

        galleryCards.forEach((card) => {
          const cardCat = card.dataset.category;
          const match = cat === 'all' || cardCat === cat;

          if (match) {
            card.style.display = 'flex';
            card.classList.remove('card-enter');
            // Trigger reflow to restart CSS animation
            void card.offsetWidth;
            card.style.animationDelay = `${(visibleCount % 6) * 0.08}s`;
            card.classList.add('card-enter');
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 18. Home Gallery Interactive Lightbox ---
  function initHomeLightbox() {
    const lightbox = document.getElementById('homeLightbox');
    if (!lightbox) return;

    const closeBtn = document.getElementById('homeLightboxClose');
    const imgEl = document.getElementById('homeLightboxImg');
    const catEl = document.getElementById('homeLightboxCategory');
    const titleEl = document.getElementById('homeLightboxTitle');
    const descEl = document.getElementById('homeLightboxDesc');
    const tiersEl = document.getElementById('homeLightboxTiers');
    const flavorsEl = document.getElementById('homeLightboxFlavors');
    const venueEl = document.getElementById('homeLightboxVenue');
    const inquireBtn = document.getElementById('homeLightboxInquireBtn');
    const cards = document.querySelectorAll('#homeGalleryGrid .portfolio-card');

    let lastFocusedElement = null;

    function openModal(card) {
      if (!card) return;
      lastFocusedElement = document.activeElement;

      const title = card.dataset.title || card.querySelector('.portfolio-title')?.textContent || '';
      const category = card.querySelector('.portfolio-tag')?.textContent || 'Signature Confection';
      const imageSrc = card.dataset.image || card.querySelector('img')?.src || '';
      const desc = card.dataset.desc || card.querySelector('.portfolio-desc')?.textContent || '';
      const tiers = card.dataset.tiers || card.querySelector('.portfolio-tier-badge')?.textContent || '';
      const flavors = card.dataset.flavors || card.querySelector('.portfolio-flavor-note')?.textContent || '';
      const venue = card.dataset.venue || card.querySelector('.portfolio-venue-badge')?.textContent || '';

      if (imgEl) {
        imgEl.src = imageSrc;
        imgEl.alt = `${title} bespoke architectural wedding cake design`;
      }
      if (catEl) catEl.textContent = category;
      if (titleEl) titleEl.textContent = title;
      if (descEl) descEl.textContent = desc;
      if (tiersEl) tiersEl.textContent = tiers;
      if (flavorsEl) flavorsEl.textContent = flavors;
      if (venueEl) venueEl.textContent = venue;
      if (inquireBtn) {
        inquireBtn.href = `contact.html?inquiry=${encodeURIComponent(title)}`;
      }

      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (window.lenisInstance) window.lenisInstance.stop();
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      lightbox.classList.remove('active');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.lenisInstance) window.lenisInstance.start();
      if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
        lastFocusedElement.focus();
      }
    }

    cards.forEach(card => {
      // Click on Inspect Details button
      const quickBtn = card.querySelector('.portfolio-quick-view');
      if (quickBtn) {
        quickBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          openModal(card);
        });
      }

      // Click on the image box
      const imgBox = card.querySelector('.portfolio-img-box');
      if (imgBox) {
        imgBox.style.cursor = 'pointer';
        imgBox.addEventListener('click', () => {
          openModal(card);
        });
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- Hero Interactive Showcase & Cake Switcher ---
  function initHeroShowcaseSwitcher() {
    const heroImg = document.getElementById('heroCakeImg');
    const heroFrame = document.getElementById('heroCakeFrame');
    const titleEl = document.getElementById('heroShowcaseTitle');
    const metaEl = document.getElementById('heroShowcaseMeta');
    const tiersEl = document.getElementById('heroShowcaseTiers');
    const metric1El = document.getElementById('heroMetric1');
    const metric2El = document.getElementById('heroMetric2');
    const metric3El = document.getElementById('heroMetric3');
    const flavorEl = document.getElementById('heroShowcaseFlavor');
    const switchBtns = document.querySelectorAll('.showcase-switch-btn');

    if (!heroImg || !switchBtns.length) return;

    const cakeData = {
      dawn: {
        img: 'assets/images/cake-aurore-blanche.jpg',
        alt: 'The White Dawn classical 5-tier royal relief wedding cake',
        tiers: '5 Couture Tiers',
        title: 'The White Dawn',
        meta: 'Renaissance Raised Relief & Scented Sugar Peonies',
        m1: 'Neoclassical',
        m2: '240+ Petals',
        m3: '48 Hours',
        flavor: 'Tahitian Vanilla Bean, Champagne Jelly & Alpine Peach Compote'
      },
      rococo: {
        img: 'assets/images/cake-rococo.jpg',
        alt: 'Venetian Rococo Palace 5-tier luxury Lambeth piped wedding cake',
        tiers: '5 Tiers • 240 Servings',
        title: 'Venetian Rococo Palace',
        meta: 'Lambeth Royal Overpiping & 24K Baroque Gold Leaf',
        m1: 'Royal Lambeth',
        m2: 'Pure 24K Gold',
        m3: '56 Hours',
        flavor: 'Champagne Brut Jelly, Wild Strawberries & Whipped Vanilla Cream'
      },
      tuileries: {
        img: 'assets/images/cake-tuileries.jpg',
        alt: 'The Tuileries Garden romantic botanical sugar floristry wedding cake',
        tiers: '4 Tiers • 190 Servings',
        title: 'The Tuileries Garden',
        meta: 'Cascading Garden Roses, Sweet Peas & Spun Gold Glaze',
        m1: 'Estate Orangery',
        m2: '320+ Flowers',
        m3: '42 Hours',
        flavor: 'Pistachio Praline, Rosewater Blossom Curd & Raspberry Reduction'
      }
    };

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-cake');
        const data = cakeData[key];
        if (!data) return;

        switchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Smooth crossfade animation on the cake image
        heroImg.classList.add('fade-out');

        setTimeout(() => {
          heroImg.src = data.img;
          heroImg.alt = data.alt;
          if (titleEl) titleEl.textContent = data.title;
          if (metaEl) metaEl.textContent = data.meta;
          if (tiersEl) tiersEl.textContent = data.tiers;
          if (metric1El) metric1El.textContent = data.m1;
          if (metric2El) metric2El.textContent = data.m2;
          if (metric3El) metric3El.textContent = data.m3;
          if (flavorEl) flavorEl.textContent = data.flavor;

          heroImg.classList.remove('fade-out');
          heroImg.classList.add('fade-in');
          setTimeout(() => {
            heroImg.classList.remove('fade-in');
          }, 350);
        }, 220);
      });
    });
  }

  // --- 18b. About Hero Showcase & Interactive Cake Switcher ---
  function initAboutHeroShowcase() {
    const heroImg = document.getElementById('aboutHeroImg');
    const heroTitle = document.getElementById('aboutHeroBadgeTitle');
    const heroSub = document.getElementById('aboutHeroBadgeSub');
    const heroChip = document.getElementById('aboutHeroChipText');
    const heroLinkBtn = document.getElementById('aboutHeroLinkBtn');
    const switchBtns = document.querySelectorAll('.about-cake-switcher .hero-switch-btn');

    if (!heroImg || !switchBtns.length) return;

    const aboutCakes = {
      aurore: {
        image: 'assets/images/hero-about.jpg',
        title: "L'Aurore Blanche &bull; G&amp;E Crest",
        sub: 'Chef Genevi&egrave;ve Moreau &bull; 4-Tier Neoclassical Pure Ivory',
        chip: 'Parisian Atelier • Commissioned Heritage',
        alt: "L'Aurore Blanche 4-tier Neoclassical G&E crest wedding cake by Chef Geneviève Moreau",
        link: 'portfolio.html'
      },
      tuileries: {
        image: 'assets/images/cake-tuileries.jpg',
        title: 'Jardin des Tuileries Botanical',
        sub: 'Hand-Sculpted Sugar Florals &amp; Bas-Relief Vines',
        chip: 'Haute Pâtisserie • Botanical Sculpture',
        alt: 'Jardin des Tuileries luxury botanical wedding cake',
        link: 'portfolio.html'
      },
      rococo: {
        image: 'assets/images/cake-rococo.jpg',
        title: 'Venetian Rococo Palace',
        sub: '24K Gold Leaf Filigree &amp; Heritage Architecture',
        chip: 'Architectural Wonder • Royal Commission',
        alt: 'Venetian Rococo Palace luxury wedding cake centerpiece',
        link: 'portfolio.html'
      }
    };

    switchBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const key = btn.dataset.cake;
        const cake = aboutCakes[key];
        if (!cake) return;

        heroImg.style.opacity = '0.35';
        heroImg.style.transform = 'scale(0.97)';

        setTimeout(() => {
          heroImg.src = cake.image;
          heroImg.alt = cake.alt;
          if (heroTitle) heroTitle.innerHTML = cake.title;
          if (heroSub) heroSub.innerHTML = cake.sub;
          if (heroChip) heroChip.textContent = cake.chip;
          if (heroLinkBtn) heroLinkBtn.href = cake.link;
          heroImg.style.opacity = '1';
          heroImg.style.transform = 'scale(1)';
        }, 150);

        switchBtns.forEach(b => {
          const isSelected = b.dataset.cake === key;
          b.classList.toggle('active', isSelected);
          b.setAttribute('aria-selected', isSelected ? 'true' : 'false');
        });
      });
    });
  }

  // --- 19. High-End Magnetic Button Kinematics ---
  function initMagneticButtons() {
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        // Dampened magnetic pull strength
        const deltaX = (e.clientX - centerX) * 0.32;
        const deltaY = (e.clientY - centerY) * 0.32;

        btn.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`;
      });

      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1), box-shadow 0.28s ease';
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transition = 'transform 0.45s cubic-bezier(0.2, 1, 0.3, 1), box-shadow 0.28s ease';
        btn.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // --- 20. 3D Interactive Card Tilt with Cursor Specular Glare ---
  function init3DCardTilt() {
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const tiltElements = document.querySelectorAll(`
      [data-tilt="true"],
      .interactive-3d-tilt,
      .portfolio-card,
      .service-card,
      .card-luxury,
      .testimonial-card,
      .page-hero-image-frame,
      .floating-badge,
      .monogram-studio-card
    `);

    tiltElements.forEach(el => {
      let rafId = null;

      el.addEventListener('mousemove', (e) => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const nx = x / rect.width;
          const ny = y / rect.height;

          // Subtle, elegant tilt angles (max ~6 degrees for premium restraint)
          const rotateX = (0.5 - ny) * 7;
          const rotateY = (nx - 0.5) * 7;

          el.style.setProperty('--mouse-x', `${(nx * 100).toFixed(1)}%`);
          el.style.setProperty('--mouse-y', `${(ny * 100).toFixed(1)}%`);
          el.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`;
        });
      });

      el.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        el.style.setProperty('--mouse-x', '50%');
        el.style.setProperty('--mouse-y', '50%');
      });
    });
  }

  window.refresh3DCardTilt = function () {
    init3DCardTilt();
  };

  // --- 21. Ambient Luxury Cursor Spotlight Aura ---
  function initLuxuryCursorAura() {
    const aura = document.getElementById('luxuryCursorAura');
    if (!aura) return;

    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      aura.style.display = 'none';
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let auraX = mouseX;
    let auraY = mouseY;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        aura.classList.add('visible');
      }
    }, { passive: true });

    document.documentElement.addEventListener('mouseleave', () => {
      isVisible = false;
      aura.classList.remove('visible');
    });

    // Detect hover on interactive controls to enlarge aura
    const interactiveSelectors = 'a, button, input, select, textarea, .portfolio-card, [role="button"]';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        aura.classList.add('hovering');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        aura.classList.remove('hovering');
      }
    });

    // Silky smooth lerp rendering loop
    function updateAura() {
      if (isVisible) {
        auraX += (mouseX - auraX) * 0.12;
        auraY += (mouseY - auraY) * 0.12;
        aura.style.transform = `translate3d(${auraX.toFixed(1)}px, ${auraY.toFixed(1)}px, 0)`;
      }
      requestAnimationFrame(updateAura);
    }
    requestAnimationFrame(updateAura);
  }

  // --- 22. Dynamic Sensory Radar Bar Fill Observer ---
  function initSensoryRadarFill() {
    const sensoryCard = document.getElementById('seasonalFlavorCard');
    if (!sensoryCard) return;

    const bars = sensoryCard.querySelectorAll('.sensory-bar-fill');
    if (!bars.length) return;

    // Cache initial intended widths
    bars.forEach(bar => {
      if (!bar.dataset.targetWidth) {
        bar.dataset.targetWidth = bar.style.width || '50%';
        bar.style.width = '0%';
      }
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          bars.forEach((bar, idx) => {
            setTimeout(() => {
              bar.style.width = bar.dataset.targetWidth;
            }, 120 + idx * 90);
          });
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(sensoryCard);
  }

  // --- Initialize All Modules on DOMContentLoaded ---
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure page opens cleanly at top on initial load/reload
    if (!window.location.hash || window.location.hash === '#main-content') {
      window.scrollTo(0, 0);
    }

    initLenisSmoothScroll();
    initTheme();
    initDirection();
    initLanguage();
    initFontAesthetic();
    initScrollProgressAndControls();
    initScrollReveal();
    initHeroParallax();
    initMagneticButtons();
    init3DCardTilt();
    initLuxuryCursorAura();
    initSensoryRadarFill();
    initButtonTactileEffect();
    initSmoothAnchors();
    initAnimatedCounters();
    initHeroGoldDust();
    initSeasonalFlavorJourney();
    initHomeGalleryFilter();
    initHomeLightbox();
    initHeroShowcaseSwitcher();
    initAboutHeroShowcase();
  });
})();
