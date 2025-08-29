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
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle navigation');
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Function to calculate reading time (can be adapted if needed)
  function calculateReadingTime(text) {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = text.trim().split(/\s+/).length;
    const readingTimeMinutes = Math.ceil(wordCount / wordsPerMinute);
    return readingTimeMinutes;
  }

  // Dynamic Blog Post Loading
  const blogPostsContainer = document.getElementById('blog-posts-container');
  const fullBlogPostContainer = document.getElementById('blog-post-container');

  if (blogPostsContainer && fullBlogPostContainer) {
    fetch('blogs.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(blogs => {
  blogs.forEach(blog => {
          const blogCard = document.createElement('div');
          blogCard.classList.add('card', 'blog-card');
          blogCard.innerHTML = `
            <img src="${blog.image}" alt="${blog.title}" class="blog-image" loading="lazy" />
            <h3>${blog.title}</h3>
            <p class="meta">By ${blog.author || 'Virkat Team'} • ${blog.date || 'New Post'}</p>
            <p>${blog.description}</p>
            <a href="#" class="btn read-more-btn" data-blog-file="${blog.file}">Read More</a>
          `;
          blogPostsContainer.appendChild(blogCard);
        });

        // Add event listeners to dynamically created "Read More" buttons
        document.querySelectorAll('.read-more-btn').forEach(button => {
          button.addEventListener('click', async function(e) {
            e.preventDefault();
            const blogFile = this.dataset.blogFile;

            try {
              const response = await fetch(blogFile);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${blogFile}`);
              }
              const html = await response.text();
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = html;

              // Prefer .blog-post-content when present; fallback to body
              const contentNode = tempDiv.querySelector('.blog-post-content') || tempDiv.querySelector('body');
              const contentToLoad = contentNode ? contentNode.innerHTML : '';

              if (contentToLoad) {
                // Add a back button for better UX
                const backBtn = `<div class="container" style="margin-top:20px;margin-bottom:10px"><button class="btn btn-secondary" id="backToList">← Back to all posts</button></div>`;
                fullBlogPostContainer.innerHTML = backBtn + contentToLoad;
                fullBlogPostContainer.style.display = 'block';

                // Hide the main blog listing section
                const listSection = document.querySelector('section .card-grid');
                const listHeader = document.querySelector('section .section-header');
                if (listSection) listSection.style.display = 'none';
                if (listHeader) listHeader.style.display = 'none';

                // Back button handler
                const backButton = document.getElementById('backToList');
                if (backButton) {
                  backButton.addEventListener('click', () => {
                    fullBlogPostContainer.style.display = 'none';
                    if (listSection) listSection.style.display = '';
                    if (listHeader) listHeader.style.display = '';
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  });
                }

                // Scroll to the loaded content
                fullBlogPostContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                console.error('Blog post content not found in fetched HTML.');
              }
            } catch (error) {
              console.error('Error fetching blog post:', error);
            }
          });
        });
      })
      .catch(error => console.error('Error fetching blogs.json:', error));
  }
});