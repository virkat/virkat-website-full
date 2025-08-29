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

  // Populate reading time for direct-loaded posts
  const directPostContent = document.querySelector('.blog-post-content');
  if (directPostContent) {
    const text = directPostContent.innerText || directPostContent.textContent || '';
    const minutes = calculateReadingTime(text);
    const rt = document.querySelector('.blog-post-content .reading-time');
    if (rt) rt.textContent = minutes;
  }

  // Reusable share buttons utility
  function renderShareButtons(container, url) {
    if (!container) return;
    const shareUrl = url || container.dataset.shareUrl || window.location.href;
    // Use root-relative paths so they work from any page
    const iconBase = 'assets/images';
    container.innerHTML = `
      <span>Share:</span>
      <a href="https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on X"><img src="/${iconBase}/x-icon.svg" alt="X" /></a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn"><img src="/${iconBase}/linkedin-icon.svg" alt="LinkedIn" /></a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on Facebook"><img src="/${iconBase}/facebook-icon.svg" alt="Facebook" /></a>
      <a href="https://wa.me/?text=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp"><img src="/${iconBase}/whatsapp-icon.svg" alt="WhatsApp" /></a>
    `;
  }

  // Render any share-buttons on regular page load
  document.querySelectorAll('.share-buttons').forEach(el => renderShareButtons(el));

  // Tiny toast utility for user-friendly errors
  function showToast(message, timeout = 2800) {
    try {
      let t = document.querySelector('.toast');
      if (!t) {
        t = document.createElement('div');
        t.className = 'toast';
        document.body.appendChild(t);
      }
      t.textContent = message;
      t.classList.add('show');
      clearTimeout(showToast._timer);
      showToast._timer = setTimeout(() => t.classList.remove('show'), timeout);
    } catch (_) {
      // Fallback
      alert(message);
    }
  }

  // Minimal Markdown to HTML converter (subset)
  function markdownToHtml(md) {
    if (!md) return '';
    // Escape HTML
    md = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Code blocks ```
    md = md.replace(/```([\s\S]*?)```/g, (m, p1) => `<pre><code>${p1.replace(/\n/g, '\n')}</code></pre>`);
    // Inline code `code`
    md = md.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Images ![alt](src)
    md = md.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');
    // Links [text](url)
    md = md.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
    // Headings ####, ###, ##, #
    md = md.replace(/^######\s?(.+)$/gm, '<h6>$1</h6>')
           .replace(/^#####\s?(.+)$/gm, '<h5>$1</h5>')
           .replace(/^####\s?(.+)$/gm, '<h4>$1</h4>')
           .replace(/^###\s?(.+)$/gm, '<h3>$1</h3>')
           .replace(/^##\s?(.+)$/gm, '<h2>$1</h2>')
           .replace(/^#\s?(.+)$/gm, '<h1>$1</h1>');
    // Blockquotes
    md = md.replace(/^>\s?(.+)$/gm, '<blockquote>$1</blockquote>');
    // Unordered lists
    md = md.replace(/^(?:- |\* )(.*(?:\n(?:- |\* ).*)*)/gm, (match) => {
      const items = match.split(/\n/).map(l => l.replace(/^(- |\* )/, '').trim()).filter(Boolean);
      return `<ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
    });
    // Ordered lists
    md = md.replace(/^(?:\d+\. )(.*(?:\n(?:\d+\. ).*)*)/gm, (match) => {
      const items = match.split(/\n/).map(l => l.replace(/^\d+\. /, '').trim()).filter(Boolean);
      return `<ol>${items.map(i => `<li>${i}</li>`).join('')}</ol>`;
    });
    // Paragraphs: wrap lines separated by blank lines
    const blocks = md.split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
    return blocks.map(b => (/^<h\d|^<ul|^<ol|^<pre|^<blockquote|^<img|^<p|^<code|^<hr/.test(b) ? b : `<p>${b.replace(/\n/g, '<br>')}</p>`)).join('\n');
  }

  // Dynamic Blog Post Loading
  const blogPostsContainer = document.getElementById('blog-posts-container');
  const fullBlogPostContainer = document.getElementById('blog-post-container');

  if (blogPostsContainer && fullBlogPostContainer) {
    // Cache-bust blogs.json so updates (like switching to .md) are picked up
    fetch('blogs.json?v=20250830')
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
        <a href="${blog.file}" class="btn read-more-btn"
          data-blog-file="${blog.file}"
          data-blog-title="${blog.title}"
          data-blog-author="${blog.author || 'Virkat Team'}"
          data-blog-date="${blog.date || ''}"
          data-blog-image="${blog.image || ''}"
          data-blog-id="${blog.id || ''}">
          Read More
        </a>
          `;
          blogPostsContainer.appendChild(blogCard);
        });

        // Event delegation for Read More buttons (more robust)
        blogPostsContainer.addEventListener('click', async (e) => {
          const btn = e.target.closest && e.target.closest('.read-more-btn');
          if (!btn) return;
          e.preventDefault();
          const blogFile = btn.dataset.blogFile;
          const blogTitle = btn.dataset.blogTitle;
          const blogAuthor = btn.dataset.blogAuthor || 'Virkat Team';
          const blogDate = btn.dataset.blogDate || '';
          const blogImage = btn.dataset.blogImage || '';
          const blogId = btn.dataset.blogId || '';

          try {
            const response = await fetch(blogFile);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status} for ${blogFile}`);
            }
            const isMarkdown = blogFile.toLowerCase().endsWith('.md');
            let contentToLoad = '';
            if (isMarkdown) {
              const md = await response.text();
              const articleHtml = markdownToHtml(md);
              const hero = blogImage ? `<img src="${blogImage}" alt="${blogTitle}" class="blog-image" loading="lazy" />` : '';
              contentToLoad = `
                <div class="blog-post-content">
                  <div class="section-header">
                    <h2>${blogTitle}</h2>
                    <p class="meta">By ${blogAuthor} • ${blogDate} • <span class="reading-time"></span> min read</p>
                  </div>
                  ${hero}
                  <div>${articleHtml}</div>
                  <div class="share-buttons" data-share-url="${window.location.origin}/blogs.html"></div>
                </div>`;
              } else {
                const html = await response.text();
                // Parse full HTML documents robustly
                try {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(html, 'text/html');
                  const contentNode = doc.querySelector('.blog-post-content') || doc.body || doc.documentElement;
                  contentToLoad = contentNode ? contentNode.innerHTML : html;
                } catch (_) {
                  // Fallback to raw HTML if parsing fails
                  contentToLoad = html || '';
                }
              }

            if (contentToLoad) {
              // Add a back button for better UX
              const backBtn = `<div class="container" style="margin-top:20px;margin-bottom:10px"><button class="btn btn-secondary" id="backToList">← Back to all posts</button></div>`;
              fullBlogPostContainer.innerHTML = backBtn + contentToLoad;
              fullBlogPostContainer.style.display = 'block';

              // Hide the main blog listing section (header + grid) more reliably
              const listingSection = blogPostsContainer.closest('section');
              const listGrid = blogPostsContainer;
              const listHeader = listingSection ? listingSection.querySelector('.section-header') : null;
              if (listGrid) listGrid.style.display = 'none';
              if (listHeader) listHeader.style.display = 'none';

              // Compute and populate reading time for the loaded content
              const dynamicContent = fullBlogPostContainer.querySelector('.blog-post-content') || fullBlogPostContainer;
              const readingTimeEl = dynamicContent.querySelector('.reading-time');
              if (dynamicContent && readingTimeEl) {
                const text = dynamicContent.innerText || dynamicContent.textContent || '';
                const minutes = calculateReadingTime(text);
                readingTimeEl.textContent = minutes;
              }

              // Render share buttons inside the loaded content
              dynamicContent.querySelectorAll('.share-buttons').forEach(el => {
                const deepLink = blogId ? `${window.location.origin}/blogs.html#${encodeURIComponent(blogId)}`
                                        : (window.location.origin + '/' + blogFile.replace(/^\.\/?/, ''));
                const effectiveUrl = el.dataset.shareUrl || deepLink;
                renderShareButtons(el, effectiveUrl);
              });

              // Back button handler
              const backButton = document.getElementById('backToList');
              if (backButton) {
                backButton.addEventListener('click', () => {
                  fullBlogPostContainer.style.display = 'none';
                  if (listGrid) listGrid.style.display = '';
                  if (listHeader) listHeader.style.display = '';
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                });
              }

              // Scroll to the loaded content
              fullBlogPostContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              console.error('Blog post content not found in fetched HTML.');
              showToast('Sorry, couldn\'t load that post. Please try again.');
            }
          } catch (error) {
            console.error('Error fetching blog post:', error);
            showToast('Error loading post. Please check your connection and try again.');
          }
        });
        // If there's a hash like #<id>, auto-open that post
        const hash = (window.location.hash || '').replace(/^#/, '');
        if (hash) {
          // Use a safe selector without CSS.escape dependency
          const buttons = Array.from(document.querySelectorAll('.read-more-btn'));
          const btn = buttons.find(b => (b.dataset.blogId || '') === hash);
          if (btn) btn.click();
        }
      })
      .catch(error => console.error('Error fetching blogs.json:', error));
  }
});