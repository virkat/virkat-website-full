document.addEventListener('DOMContentLoaded', () => {
  // Auto highlight current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current || (current === 'index.html' && href.startsWith('#'))) {
      a.classList.add('active');
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