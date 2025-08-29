document.addEventListener('DOMContentLoaded', () => {
  // Auto highlight current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) {
      a.classList.add('active');
    }
  });

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Blog "Read More" functionality
  document.querySelectorAll('.blog-card .btn').forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);

      if (targetSection) {
        // Hide all other blog content sections
        document.querySelectorAll('.section[id^="post-"]').forEach(section => {
          if (section.id !== targetId) {
            section.style.display = 'none';
          }
        });

        // Toggle visibility of the target blog content section
        if (targetSection.style.display === 'block') {
          targetSection.style.display = 'none';
        } else {
          targetSection.style.display = 'block';
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});