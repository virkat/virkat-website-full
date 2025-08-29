document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded fired.');

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

  console.log('blogPostsContainer:', blogPostsContainer);
  console.log('fullBlogPostContainer:', fullBlogPostContainer);

  if (blogPostsContainer && fullBlogPostContainer) {
    fetch('blogs.json')
      .then(response => {
        console.log('blogs.json fetch response:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(blogs => {
        console.log('blogs.json parsed data:', blogs);
        if (blogs.length === 0) {
          console.log('No blog posts found in blogs.json.');
        }
        blogs.forEach(blog => {
          console.log('Creating card for blog:', blog.title);
          const blogCard = document.createElement('div');
          blogCard.classList.add('card', 'blog-card');
          blogCard.innerHTML = `
            <img src="${blog.image}" alt="${blog.title}" class="blog-image" />
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
            console.log('Read More clicked for:', blogFile);

            try {
              const response = await fetch(blogFile);
              console.log('Blog post fetch response:', response);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${blogFile}`);
              }
              const html = await response.text();
              console.log('Fetched blog post HTML:', html.substring(0, 200) + '...'); // Log first 200 chars

              // Create a temporary div to parse the fetched HTML
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = html;

              // Extract the content from the <body> tag
              const contentToLoad = tempDiv.querySelector('body').innerHTML;
              console.log('Content to load length:', contentToLoad.length);

              if (contentToLoad) {
                // Clear previous content and append new content
                fullBlogPostContainer.innerHTML = contentToLoad;
                fullBlogPostContainer.style.display = 'block'; // Show the container

                // Hide the main blog listing section
                const mainCardGrid = document.querySelector('section .card-grid');
                const mainSectionHeader = document.querySelector('section .section-header');
                if (mainCardGrid) mainCardGrid.style.display = 'none';
                if (mainSectionHeader) mainSectionHeader.style.display = 'none';

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