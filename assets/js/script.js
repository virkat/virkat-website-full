// Dark mode toggle
  const darkToggle = document.getElementById('darkModeToggle');
  const root = document.documentElement;
  function setDarkMode(on) {
    if (on) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'on');
      if (darkToggle) darkToggle.textContent = '☀️';
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'off');
      if (darkToggle) darkToggle.textContent = '🌙';
    }
  }
  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      setDarkMode(!document.body.classList.contains('dark-mode'));
    });
    // On load, set mode from localStorage
    setDarkMode(localStorage.getItem('darkMode') === 'on');
  }
  // Portfolio filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-cards .card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      portfolioCards.forEach(card => {
        const img = card.querySelector('.portfolio-img');
        const type = img ? img.getAttribute('data-type') : '';
        if (filter === 'all' || type === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
  // Set 'All' as default active
  if (filterBtns.length) filterBtns[0].classList.add('active');

  // Portfolio lightbox
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-content') : null;
  const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  document.querySelectorAll('.portfolio-img').forEach(img => {
    img.addEventListener('click', e => {
      e.preventDefault();
      if (lightbox && lightboxImg) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('open');
      }
    });
  });
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
  }
  if (lightbox) {
    lightbox.addEventListener('click', e => {
      if (e.target === lightbox) lightbox.classList.remove('open');
    });
  }
  // Section reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('visible'));
  }
document.addEventListener('DOMContentLoaded', () => {
  // Ripple effect for buttons
  document.querySelectorAll('.btn, .btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - rect.left) + 'px';
      ripple.style.top = (e.clientY - rect.top) + 'px';
      ripple.style.width = ripple.style.height = Math.max(rect.width, rect.height) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Auto highlight current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) {
      a.classList.add('active');
    }
  });

  // Hamburger menu toggle with overlay
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  if (hamburger && navLinks && mobileMenuOverlay) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
      mobileMenuOverlay.classList.toggle('open', isOpen);
    });
    // Close menu on link click (mobile)
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
        mobileMenuOverlay.classList.remove('open');
      });
    });
    // Close menu if overlay is clicked
    mobileMenuOverlay.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      mobileMenuOverlay.classList.remove('open');
    });
  }

  // Navbar scroll shadow effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Team accordions (one open at a time)
  document.querySelectorAll('.accordion-button').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      document.querySelectorAll('.accordion-content').forEach(c => {
        if (c !== content) c.style.display = 'none';
      });
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  });

  // Blogs inline expand (one open at a time)
  document.querySelectorAll('.read-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.blog-card');
      const content = card.querySelector('.blog-content');
      document.querySelectorAll('.blog-content').forEach(c => {
        if (c !== content) c.style.display = 'none';
      });
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
      if (content.style.display === 'block') {
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});