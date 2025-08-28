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
  // Auto highlight current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === 'index.html' && href.startsWith('#'))) {
      a.classList.add('active');
    }
  });

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
    // Close menu on link click (mobile)
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('open');
      });
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