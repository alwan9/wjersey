/**
 * RFDM Apparel - Clean Minimalist Interactive Script
 * RFDM Full House Production
 */

import productsData from '../products_data.json';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNavSpy();
  initPortfolioFilter();
  initPortfolioModal();
  initFaqAccordion();
  initHeroJerseySwitcher();
  initBackToTop();
  initHistoryClearShortcut();
});

/* -------------------------------------------------------------------------
   1. Mobile & Offcanvas Sidebar Drawer Navigation
   ------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu-drawer');
  const mobileOverlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!mobileMenu) return;

  function openMenu() {
    if (mobileOverlay) {
      mobileOverlay.classList.remove('hidden');
      mobileOverlay.style.pointerEvents = 'auto';
      requestAnimationFrame(() => {
        mobileOverlay.classList.remove('opacity-0');
        mobileOverlay.classList.add('opacity-100');
      });
    }
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('translate-x-0');
    mobileMenu.classList.add('translate-x-full');
    if (mobileOverlay) {
      mobileOverlay.style.pointerEvents = 'none';
      mobileOverlay.classList.remove('opacity-100');
      mobileOverlay.classList.add('opacity-0');
      setTimeout(() => {
        mobileOverlay.classList.add('hidden');
      }, 300);
    }
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openMenu();
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* -------------------------------------------------------------------------
   2. Active Navigation Link Spy on Scroll
   ------------------------------------------------------------------------- */
function initActiveNavSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sidebarLinks = document.querySelectorAll('.mobile-nav-link[data-target]');
  const navbar = document.getElementById('main-navbar');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    // Toggle navbar shadow
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('shadow-clean-sm', 'bg-white/95');
        navbar.classList.remove('bg-white/80');
      } else {
        navbar.classList.remove('shadow-clean-sm', 'bg-white/95');
        navbar.classList.add('bg-white/80');
      }
    }

    // Active Section Detection
    let currentId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute('id');
      }
    });

    // Update Desktop Nav Links
    navLinks.forEach(link => {
      link.classList.remove('text-slate-900', 'font-bold', 'bg-white/80');
      link.classList.add('text-slate-600');
      const href = link.getAttribute('href');
      if (href === `#${currentId}`) {
        link.classList.remove('text-slate-600');
        link.classList.add('text-slate-900', 'font-bold', 'bg-white/80');
      }
    });

    // Update Sidebar Nav Links
    sidebarLinks.forEach(link => {
      const target = link.getAttribute('data-target');
      if (target === currentId) {
        link.classList.add('bg-sky-50', 'text-sky-700', 'font-bold');
        link.classList.remove('text-slate-700');
      } else {
        link.classList.remove('bg-sky-50', 'text-sky-700', 'font-bold');
        link.classList.add('text-slate-700');
      }
    });
  });
}

/* -------------------------------------------------------------------------
   3. Portfolio & Catalog Category Filtering
   ------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const sidebarCategoryPills = document.querySelectorAll('.sidebar-category-pill');
  const items = document.querySelectorAll('.portfolio-item');

  function applyFilter(category) {
    items.forEach(item => {
      const itemCat = item.getAttribute('data-category');
      if (category === 'all' || itemCat === category) {
        item.style.display = '';
        item.classList.remove('hidden');
      } else {
        item.style.display = 'none';
        item.classList.add('hidden');
      }
    });

    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.className = 'portfolio-filter-btn px-4 py-1.5 rounded-full bg-slate-900 text-white shadow-sm transition-all';
      } else {
        btn.className = 'portfolio-filter-btn px-4 py-1.5 rounded-full bg-white/70 text-slate-600 hover:bg-white transition-all border border-slate-200/80';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      applyFilter(cat);
    });
  });

  sidebarCategoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const cat = pill.getAttribute('data-filter');
      applyFilter(cat);
      const productsSection = document.getElementById('products');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* -------------------------------------------------------------------------
   3b. Portfolio Lightbox Modal
   ------------------------------------------------------------------------- */
function initPortfolioModal() {
  const modal = document.getElementById('portfolio-modal');
  if (!modal) return;

  const modalClose = document.getElementById('modal-close');
  const modalImg = document.getElementById('modal-img');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalSubtitle = document.getElementById('modal-subtitle');
  const modalPrice = document.getElementById('modal-price');
  const modalPriceDetail = document.getElementById('modal-price-detail');
  const modalDesc = document.getElementById('modal-desc');
  const modalOrderBtn = document.getElementById('modal-order-btn');
  const switchContainer = document.getElementById('modal-switch-container');
  const btnFront = document.getElementById('modal-btn-front');
  const btnBack = document.getElementById('modal-btn-back');

  const items = document.querySelectorAll('.portfolio-item');

  let currentProduct = null;

  function openModal(index) {
    const p = productsData[index];
    if (!p) return;
    currentProduct = p;

    modalImg.src = p.img;
    modalImg.alt = `${p.name} - ${p.subtitle}`;
    modalCategory.textContent = `${p.subCat} | ${p.categoryLabel}`;
    modalTitle.textContent = p.name;
    modalSubtitle.textContent = p.subtitle;
    modalPrice.textContent = `${p.price}`;
    modalPriceDetail.textContent = p.priceDetail;
    modalDesc.textContent = p.desc;

    const waText = encodeURIComponent(`Halo RFDM Apparel, saya tertarik dan ingin memesan produk katalog ${p.name} (${p.categoryLabel})`);
    modalOrderBtn.href = `https://wa.me/6281213903166?text=${waText}`;

    // Handle 2-sided views
    if (p.imgBack) {
      switchContainer.classList.remove('hidden');
      switchContainer.classList.add('flex');
      btnFront.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-sky-600 transition-all';
      btnBack.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 hover:text-white transition-all';
    } else {
      switchContainer.classList.add('hidden');
      switchContainer.classList.remove('flex');
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (btnFront && btnBack) {
    btnFront.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentProduct) return;
      modalImg.src = currentProduct.img;
      btnFront.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-sky-600 transition-all';
      btnBack.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 hover:text-white transition-all';
    });

    btnBack.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!currentProduct || !currentProduct.imgBack) return;
      modalImg.src = currentProduct.imgBack;
      btnBack.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-sky-600 transition-all';
      btnFront.className = 'px-2.5 py-1 rounded-full text-[10px] font-bold text-slate-300 hover:text-white transition-all';
    });
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.getAttribute('data-index'), 10);
      if (!isNaN(idx)) {
        openModal(idx);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/* -------------------------------------------------------------------------
   4. FAQ Accordion
   ------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!header || !content) return;

    header.addEventListener('click', () => {
      const isOpen = !content.classList.contains('hidden');

      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          const otherContent = otherItem.querySelector('.faq-content');
          const otherIcon = otherItem.querySelector('.faq-icon');
          const otherHeader = otherItem.querySelector('.faq-header');
          if (otherContent) otherContent.classList.add('hidden');
          if (otherIcon) otherIcon.classList.remove('rotate-180', 'text-sky-500');
          if (otherHeader) otherHeader.classList.remove('text-sky-600');
        }
      });

      // Toggle current FAQ
      if (isOpen) {
        content.classList.add('hidden');
        if (icon) icon.classList.remove('rotate-180', 'text-sky-500');
        header.classList.remove('text-sky-600');
      } else {
        content.classList.remove('hidden');
        if (icon) icon.classList.add('rotate-180', 'text-sky-500');
        header.classList.add('text-sky-600');
      }
    });
  });
}

/* -------------------------------------------------------------------------
   4. Hero Jersey Interactive Switcher (Models & 2-Color Swatch Switcher)
   ------------------------------------------------------------------------- */
function initHeroJerseySwitcher() {
  const jerseyData = {
    voltex: {
      name: "Voltex Pro Match Kit",
      price: "Rp119.000",
      originalPrice: "Rp149.000",
      colors: [
        {
          id: "white",
          name: "Home (Pearl White & Gold)",
          img: "./assets/images/hero/voltex-black (2).png",
          bgGradient: "from-white via-slate-50 to-amber-200",
          borderCol: "border-amber-400"
        },
        {
          id: "black",
          name: "Away (Obsidian Black & Gold)",
          img: "./assets/images/hero/voltex-black (1).png",
          bgGradient: "from-slate-900 via-slate-800 to-amber-500",
          borderCol: "border-amber-400"
        }
      ]
    },
    runner: {
      name: "Aeroflow X-Speed",
      price: "Rp129.000",
      originalPrice: "Rp159.000",
      colors: [
        {
          id: "cyan",
          name: "Electric Cyan & Volt Lime",
          img: "./assets/images/hero/runner-cyan (2).png",
          bgGradient: "from-cyan-400 via-sky-400 to-lime-400",
          borderCol: "border-cyan-400"
        },
        {
          id: "magenta",
          name: "Cosmic Magenta & Violet",
          img: "./assets/images/hero/runner-cyan (1).png",
          bgGradient: "from-fuchsia-500 via-purple-500 to-violet-600",
          borderCol: "border-fuchsia-400"
        }
      ]
    },
    raijin: {
      name: "Raijin Cyber Streetwear",
      price: "Rp139.000",
      originalPrice: "Rp169.000",
      colors: [
        {
          id: "crimson",
          name: "Cyber Crimson & Neon Teal",
          img: "./assets/images/hero/raijin-crimson (1).png",
          bgGradient: "from-rose-600 via-red-500 to-cyan-400",
          borderCol: "border-rose-400"
        },
        {
          id: "violet",
          name: "Tokyo Neo Violet & Gold",
          img: "./assets/images/hero/raijin-crimson (2).png",
          bgGradient: "from-purple-600 via-indigo-600 to-amber-400",
          borderCol: "border-purple-400"
        }
      ]
    }
  };

  let currentModel = 'voltex';
  let currentColorIdx = 0;

  const jerseyImg = document.getElementById('hero-jersey-img');
  const jerseyTitle = document.getElementById('hero-jersey-title');
  const jerseyPrice = document.getElementById('hero-jersey-price');
  const jerseyOriginal = document.getElementById('hero-jersey-original');
  const modelBtns = document.querySelectorAll('.hero-model-btn');
  const colorBtns = document.querySelectorAll('.hero-color-btn');

  if (!jerseyImg) return;

  function updateDisplay(animate = true) {
    const model = jerseyData[currentModel];
    if (!model) return;
    const color = model.colors[currentColorIdx];
    if (!color) return;

    if (animate) {
      jerseyImg.style.opacity = '0.3';
      jerseyImg.style.transform = 'scale(0.95)';
      setTimeout(() => {
        jerseyImg.src = color.img;
        jerseyImg.alt = `${model.name} - ${color.name}`;
        jerseyImg.style.opacity = '1';
        jerseyImg.style.transform = 'scale(1)';
      }, 150);
    } else {
      jerseyImg.src = color.img;
      jerseyImg.alt = `${model.name} - ${color.name}`;
      jerseyImg.style.opacity = '1';
      jerseyImg.style.transform = 'scale(1)';
    }

    if (jerseyTitle) jerseyTitle.textContent = model.name;
    if (jerseyPrice) jerseyPrice.textContent = model.price;
    if (jerseyOriginal && model.originalPrice) jerseyOriginal.textContent = model.originalPrice;

    // Update model buttons
    modelBtns.forEach(btn => {
      const isCurrent = btn.dataset.model === currentModel;
      if (isCurrent) {
        btn.className = 'hero-model-btn flex-1 py-2 px-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-slate-900 text-white shadow-sm flex items-center justify-center gap-1.5 active:scale-95';
      } else {
        btn.className = 'hero-model-btn flex-1 py-2 px-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-2xs flex items-center justify-center gap-1.5 active:scale-95';
      }
    });

    // Update color swatches
    colorBtns.forEach((btn, idx) => {
      const c = model.colors[idx];
      if (c) {
        btn.title = c.name;
        const isActive = idx === currentColorIdx;
        btn.className = `hero-color-btn relative w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all duration-200 cursor-pointer shadow-xs bg-gradient-to-br ${c.bgGradient} border-2 ${isActive ? 'ring-4 ring-sky-300 scale-110 ' + c.borderCol : 'border-white hover:scale-105'}`;
      }
    });
  }

  // Bind model buttons click
  modelBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const model = btn.dataset.model;
      if (model && model !== currentModel) {
        currentModel = model;
        currentColorIdx = 0; // reset to primary color
        updateDisplay(true);
      }
    });
  });

  // Bind color swatch buttons click
  colorBtns.forEach((btn, idx) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (idx !== currentColorIdx) {
        currentColorIdx = idx;
        updateDisplay(true);
      }
    });
  });

  // Initialize display
  updateDisplay(false);
}

/* -------------------------------------------------------------------------
   5. Back to Top Button
   ------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.add('opacity-100', 'translate-y-0');
    } else {
      backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------------------------------------------------------
   6. Shortcut Ctrl + 1: Hapus Semua History, Storage & Cache Web
   ------------------------------------------------------------------------- */
function initHistoryClearShortcut() {
  document.addEventListener('keydown', (e) => {
    // Check if Ctrl + 1 or Cmd + 1 is pressed
    if ((e.ctrlKey || e.metaKey) && (e.key === '1' || e.code === 'Digit1')) {
      e.preventDefault();

      // 1. Bersihkan LocalStorage & SessionStorage
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (err) {
        console.warn('Storage clear error:', err);
      }

      // 2. Bersihkan accessible cookies
      try {
        document.cookie.split(';').forEach((cookie) => {
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
        });
      } catch (err) {
        console.warn('Cookie clear error:', err);
      }

      // 3. Bersihkan Cache Storage API (Service Worker / PWA Caches)
      if ('caches' in window) {
        try {
          caches.keys().then((names) => {
            names.forEach((name) => caches.delete(name));
          });
        } catch (err) {
          console.warn('Caches API clear error:', err);
        }
      }

      // 4. Reset URL state & history hash
      try {
        window.history.replaceState(null, '', window.location.pathname);
      } catch (err) {
        console.warn('History replaceState error:', err);
      }

      // 5. Tampilkan notifikasi toast elegan
      showClearToast();

      // 6. Reload halaman secara bersih
      setTimeout(() => {
        window.location.replace(window.location.origin + window.location.pathname);
      }, 700);
    }
  });

  function showClearToast() {
    let toast = document.getElementById('clear-history-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'clear-history-toast';
      toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-2xl bg-slate-900/95 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide shadow-2xl border border-sky-400/40 flex items-center gap-3 transition-all duration-300 scale-90 opacity-0 pointer-events-none';
      toast.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0"></span>
        <div class="flex flex-col">
          <span class="font-bold text-white text-xs sm:text-sm">History & Cache Berhasil Dihapus! (Ctrl + 1)</span>
          <span class="text-[11px] text-slate-300">LocalStorage, Session, Cookies & State web telah direset.</span>
        </div>
      `;
      document.body.appendChild(toast);
    }

    requestAnimationFrame(() => {
      toast.classList.remove('scale-90', 'opacity-0');
      toast.classList.add('scale-100', 'opacity-100');
    });
  }
}

