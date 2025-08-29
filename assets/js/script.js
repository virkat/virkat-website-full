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

  // Function to calculate reading time
  function calculateReadingTime(text) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = text.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return readingTimeMinutes;
  }

  // Blog "Read More" functionality
  document.querySelectorAll('.read-more-btn').forEach(button => {
    button.addEventListener('click', async function(e) {
      e.preventDefault();
      const blogUrl = this.getAttribute('href');
      const blogPostContainer = document.getElementById('blog-post-container');

      try {
        const response = await fetch(blogUrl);
        const html = await response.text();

        // Create a temporary div to parse the fetched HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        // Extract the content from the blog-post-content div
        const contentToLoad = tempDiv.querySelector('.blog-post-content');

        if (contentToLoad) {
          // Clear previous content and append new content
          blogPostContainer.innerHTML = '';
          blogPostContainer.appendChild(contentToLoad);
          blogPostContainer.style.display = 'block'; // Show the container

          // Calculate and display reading time
          const blogText = contentToLoad.innerText;
          const readingTime = calculateReadingTime(blogText);
          const readingTimeSpan = blogPostContainer.querySelector('.reading-time');
          if (readingTimeSpan) {
            readingTimeSpan.textContent = readingTime;
          }

          // Scroll to the loaded content
          blogPostContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          console.error('Blog post content not found in fetched HTML.');
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      }
    });
  });
});
