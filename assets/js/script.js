document.addEventListener('DOMContentLoaded', () => {
  // Auto highlight current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === current) {
      a.classList.add('active');
    }
  });

  // Mobile hamburger menu - simplified and bulletproof
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (hamburger && navLinks) {
    // Create backdrop if it doesn't exist
    let backdrop = document.querySelector('.mobile-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-backdrop';
      document.body.appendChild(backdrop);
    }

    // Focus management helpers
    const FOCUSABLE_SELECTOR = 'a[href]:not([tabindex="-1"]):not([aria-disabled="true"]), button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
    let previouslyFocusedEl = null;
    function isVisible(el){
      if (!el) return false;
      const style = window.getComputedStyle(el);
      return style.visibility !== 'hidden' && style.display !== 'none';
    }
    function focusFirstInMenu(){
      const focusables = Array.from(navLinks.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisible);
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        navLinks.setAttribute('tabindex','-1');
        navLinks.focus();
      }
    }
    function trapFocus(e){
      if (!navLinks.classList.contains('open')) return;
      if (e.key !== 'Tab') return;
      const focusables = Array.from(navLinks.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisible);
      if (focusables.length === 0) {
        e.preventDefault();
        navLinks.focus();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first || !navLinks.contains(document.activeElement)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last || !navLinks.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    // Simple function to close menu
    function closeMenu() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.classList.remove('no-scroll');
      backdrop.classList.remove('show');
      hamburger.setAttribute('aria-expanded', 'false');
      document.removeEventListener('keydown', trapFocus, true);
      // Restore focus
      setTimeout(() => {
        if (previouslyFocusedEl && previouslyFocusedEl.focus) {
          previouslyFocusedEl.focus();
        } else if (hamburger && hamburger.focus) {
          hamburger.focus();
        }
      }, 0);
    }

    // Simple function to open menu
    function openMenu() {
      navLinks.classList.add('open');
      hamburger.classList.add('active');
      document.body.classList.add('no-scroll');
      backdrop.classList.add('show');
      hamburger.setAttribute('aria-expanded', 'true');
      previouslyFocusedEl = document.activeElement;
      // Defer focusing to ensure layout is updated
      setTimeout(() => {
        focusFirstInMenu();
      }, 0);
      // Trap focus within the drawer
      document.addEventListener('keydown', trapFocus, true);
    }

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (navLinks.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Handle navigation link taps/clicks: close drawer if open, let browser navigate normally
    function handleNavActivate(e) {
      const a = e.target.closest && e.target.closest('.nav-link');
      if (!a) return;
      if (navLinks.classList.contains('open')) {
        // Close the drawer but do not block default navigation
        setTimeout(closeMenu, 0);
      }
    }
    navLinks.addEventListener('click', handleNavActivate, { passive: true });
    navLinks.addEventListener('touchend', handleNavActivate, { passive: true });

    // Close menu when clicking backdrop
    backdrop.addEventListener('click', closeMenu);

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (navLinks.classList.contains('open')) {
        if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
          closeMenu();
        }
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
      }
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
    const shareTitle = container.dataset.shareTitle || document.title || 'Virkat Blog';
    // Use root-relative paths so they work from any page
    const iconBase = 'assets/images';
    const tweetText = `${shareTitle}`;
    const waText = `${shareTitle} — ${shareUrl}`;
    container.innerHTML = `
      <span>Share:</span>
      <a href="https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on X"><img src="/${iconBase}/x-icon.svg" alt="X" /></a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn"><img src="/${iconBase}/linkedin-icon.svg" alt="LinkedIn" /></a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on Facebook"><img src="/${iconBase}/facebook-icon.svg" alt="Facebook" /></a>
      <a href="https://wa.me/?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp"><img src="/${iconBase}/whatsapp-icon.svg" alt="WhatsApp" /></a>
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

  // Intercept any disabled links and show a friendly notice
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[aria-disabled="true"]');
    if (!a) return;
    e.preventDefault();
    const msg = a.getAttribute('data-disabled-message') || a.getAttribute('title') || 'This action is temporarily unavailable.';
    showToast(msg);
  });

  // Cache-bust helper for static assets like images (unique per page load)
  const __cb = Date.now().toString();
  function withCacheBust(url) {
    if (!url) return url;
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}v=${__cb}`;
  }
  const FALLBACK_IMG = 'assets/images/blog1.jpg';

  // Add cache-busting to image src attributes inside an HTML string
  function addCacheBustToImages(html) {
    if (!html) return html;
  return html.replace(/src="((?:assets\/images|posts)\/[^"\?]+)(\?[^"']*)?"/g, (m, p1) => `src="${withCacheBust(p1)}"`);
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
  // Emphasis and strong
  // Strong (bold) first to avoid interfering with italic parsing
  md = md.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  md = md.replace(/__([^_]+)__/g, '<strong>$1</strong>');
  // Italic (simple)
  md = md.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  md = md.replace(/_([^_]+)_/g, '<em>$1</em>');
  // Images ![alt](src) (allow optional space before parenthesis)
  md = md.replace(/!\[([^\]]*)\]\s*\(([^\)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" decoding="async" fetchpriority="low" />');
  // Links [text](url) (allow optional space before parenthesis)
  md = md.replace(/\[([^\]]+)\]\s*\(([^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  // Autolink bare URLs to ensure clickability even if markdown syntax fails
  md = md.replace(/(?<!["\'=])(https?:\/\/[^\s<>)]+[\w\/#-])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    // Headings ####, ###, ##, #
    md = md.replace(/^######\s?(.*)$/gm, '<h6>$1</h6>')
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
  // Cache-bust blogs.json so updates are picked up immediately
  fetch(`blogs.json?v=${__cb}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(blogs => {
        // Sort by date descending so latest posts appear first
        try {
          blogs.sort((a, b) => {
            const da = Date.parse(a.date || '') || 0;
            const db = Date.parse(b.date || '') || 0;
            return db - da;
          });
        } catch (_) {}
        // Helper to open a blog post directly (used for hash deep-link)
        async function openBlog(meta) {
          if (!meta) return;
          const blogFile = meta.file;
          const blogTitle = meta.title;
          const blogAuthor = meta.author || 'Virkat Team';
          const blogDate = meta.date || '';
          const blogImage = withCacheBust(meta.image || '');
          const blogId = meta.id || '';

          // Spinner and show container early
          fullBlogPostContainer.innerHTML = '<div class="container"><div class="spinner" aria-label="Loading"></div></div>';
          fullBlogPostContainer.style.display = 'block';

          try {
            let response = null;
            const isMarkdown = blogFile.toLowerCase().endsWith('.md');
            const mdUrl = isMarkdown ? `${blogFile}?v=${__cb}` : blogFile;
            response = await fetch(mdUrl);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status} for ${blogFile}`);

            let contentToLoad = '';
            if (isMarkdown) {
              const md = await response.text();
              let articleHtml = markdownToHtml(md);
              const baseDir = blogFile.replace(/[^\/]+$/, '');
              articleHtml = articleHtml.replace(/src="(?!https?:|\/|assets\/images\/|posts\/)([^"]+)"/g, (m, p1) => `src="${baseDir}${p1}"`);
              articleHtml = addCacheBustToImages(articleHtml);
              const hero = blogImage ? `<img src="${blogImage}" alt="${blogTitle}" class="blog-image" loading="lazy" />` : '';
              contentToLoad = `
                <div class="blog-post-content">
                  <div class="section-header">
                    <h2>${blogTitle}</h2>
                    <p class="meta">By ${blogAuthor} • ${blogDate} • <span class="reading-time"></span> min read</p>
                  </div>
                  ${hero}
                  <div>${articleHtml}</div>
                  <div class="share-buttons compact"></div>
                </div>`;
            } else {
              const html = await response.text();
              try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                doc.querySelectorAll('img').forEach(img => {
                  try {
                    const src = img.getAttribute('src') || '';
                    if (src.startsWith('assets/images/') || src.includes('/assets/images/')) {
                      img.setAttribute('src', withCacheBust(src));
                    }
                  } catch (_) {}
                });
                const contentNode = doc.querySelector('.blog-post-content') || doc.body || doc.documentElement;
                contentToLoad = contentNode ? contentNode.innerHTML : html;
              } catch (_) {
                contentToLoad = addCacheBustToImages(html || '');
              }
            }

            if (contentToLoad) {
              const backBtn = `<div class="container" style="margin-top:20px;margin-bottom:10px"><button class="btn btn-secondary" id="backToList">← Back to all posts</button></div>`;
              fullBlogPostContainer.innerHTML = backBtn + contentToLoad;
              fullBlogPostContainer.style.display = 'block';

              // Hide listing immediately
              const listingSection = blogPostsContainer.closest('section');
              const listGrid = blogPostsContainer;
              const listHeader = listingSection ? listingSection.querySelector('.section-header') : null;
              if (listGrid) listGrid.style.display = 'none';
              if (listHeader) listHeader.style.display = 'none';

              const dynamicContent = fullBlogPostContainer.querySelector('.blog-post-content') || fullBlogPostContainer;
              const readingTimeEl = dynamicContent.querySelector('.reading-time');
              if (dynamicContent && readingTimeEl) {
                const text = dynamicContent.innerText || dynamicContent.textContent || '';
                const minutes = calculateReadingTime(text);
                readingTimeEl.textContent = minutes;
              }

              dynamicContent.querySelectorAll('img').forEach(img => {
                img.addEventListener('error', () => {
                  img.src = withCacheBust(FALLBACK_IMG);
                }, { once: true });
              });

              dynamicContent.querySelectorAll('.share-buttons').forEach(el => {
                el.classList.add('compact');
                const sharePage = blogId ? `${window.location.origin}/share/${encodeURIComponent(blogId)}.html` : `${window.location.origin}/blogs.html`;
                renderShareButtons(el, sharePage);
              });

              fullBlogPostContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
              showToast('Sorry, couldn\'t load that post. Please try again.');
            }
          } catch (error) {
            console.error('Error opening blog via hash:', error);
            showToast('Error loading post. Please check your connection and try again.');
            fullBlogPostContainer.style.display = 'none';
            fullBlogPostContainer.innerHTML = '';
          }
        }

        // If deep-linked via hash, open immediately before rendering cards
        let openedByHash = false;
        const initialHash = (window.location.hash || '').replace(/^#/, '');
        if (initialHash) {
          const match = blogs.find(b => (b.id || '') === initialHash);
          if (match) {
            openedByHash = true;
            openBlog(match);
          }
        }

        blogs.forEach(blog => {
          const blogCard = document.createElement('div');
          blogCard.classList.add('card', 'blog-card');
      const cardImg = withCacheBust(blog.image);
      const heroImg = withCacheBust(blog.image || '');
       blogCard.innerHTML = `
            <img src="${cardImg}" alt="${blog.title}" class="blog-image" loading="lazy" />
            <h3>${blog.title}</h3>
            <p class="meta">By ${blog.author || 'Virkat Team'} • ${blog.date || 'New Post'}</p>
            <p>${blog.description}</p>
        <a href="${blog.file}" class="btn read-more-btn"
          data-blog-file="${blog.file}"
          data-blog-title="${blog.title}"
          data-blog-author="${blog.author || 'Virkat Team'}"
          data-blog-date="${blog.date || ''}"
          data-blog-image="${heroImg}"
          data-blog-id="${blog.id || ''}">
          Read More
        </a>
          `;
          blogPostsContainer.appendChild(blogCard);
          // Attach image error fallback for card image
          const imgEl = blogCard.querySelector('img.blog-image');
          if (imgEl) {
            imgEl.addEventListener('error', () => {
              console.warn('Card image failed to load:', imgEl.src);
              showToast('Could not load blog image. Showing fallback.');
              imgEl.src = withCacheBust(FALLBACK_IMG);
            }, { once: true });
          }
        });

        // Simple in-memory cache for prefetched posts
        const postCache = new Map(); // key: file path, value: string content

        // Prefetch on hover for instant open (Markdown only)
        blogPostsContainer.addEventListener('mouseover', (e) => {
          const btn = e.target.closest && e.target.closest('.read-more-btn');
          if (!btn) return;
          const blogFile = btn.dataset.blogFile;
          if (!blogFile || !blogFile.toLowerCase().endsWith('.md')) return;
          if (postCache.has(blogFile)) return;
          // Best-effort fetch; ignore errors
          fetch(blogFile).then(r => r.ok ? r.text() : Promise.reject()).then(txt => {
            postCache.set(blogFile, txt);
          }).catch(() => {});
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

          // Show a temporary spinner in the full post container
          fullBlogPostContainer.innerHTML = '<div class="container"><div class="spinner" aria-label="Loading"></div></div>';
          fullBlogPostContainer.style.display = 'block';

          try {
            let fetchedText = null;
            if (postCache.has(blogFile)) {
              fetchedText = postCache.get(blogFile);
            }
            let response = null;
            if (!fetchedText) {
              const mdUrl = blogFile.toLowerCase().endsWith('.md') ? `${blogFile}?v=${__cb}` : blogFile;
              response = await fetch(mdUrl);
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} for ${blogFile}`);
              }
            }
            const isMarkdown = blogFile.toLowerCase().endsWith('.md');
            let contentToLoad = '';
            if (isMarkdown) {
              const md = fetchedText != null ? fetchedText : await response.text();
              let articleHtml = markdownToHtml(md);
              // Resolve relative image paths (like image.png) to the post directory
              const baseDir = blogFile.replace(/[^\/]+$/, '');
              articleHtml = articleHtml.replace(/src="(?!https?:|\/|assets\/images\/|posts\/)([^"]+)"/g, (m, p1) => `src="${baseDir}${p1}"`);
              // Ensure inline images from assets/images get cache-busted
              articleHtml = addCacheBustToImages(articleHtml);
              const hero = blogImage ? `<img src="${blogImage}" alt="${blogTitle}" class="blog-image" loading="lazy" />` : '';
        contentToLoad = `
                <div class="blog-post-content">
                  <div class="section-header">
                    <h2>${blogTitle}</h2>
                    <p class="meta">By ${blogAuthor} • ${blogDate} • <span class="reading-time"></span> min read</p>
                  </div>
                  ${hero}
                  <div>${articleHtml}</div>
          <div class="share-buttons compact"></div>
                </div>`;
              } else {
                const html = await response.text();
                // Parse full HTML documents robustly
                try {
                  const parser = new DOMParser();
                  const doc = parser.parseFromString(html, 'text/html');
                  // Cache-bust images inside the HTML if they point to our assets/images
                  doc.querySelectorAll('img').forEach(img => {
                    try {
                      const src = img.getAttribute('src') || '';
                      if (src.startsWith('assets/images/') || src.includes('/assets/images/')) {
                        img.setAttribute('src', withCacheBust(src));
                      }
                    } catch (_) {}
                  });
                  const contentNode = doc.querySelector('.blog-post-content') || doc.body || doc.documentElement;
                  contentToLoad = contentNode ? contentNode.innerHTML : html;
                } catch (_) {
                  // Fallback to raw HTML if parsing fails
                  contentToLoad = addCacheBustToImages(html || '');
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

              // Add error fallbacks for images in the loaded content (hero + inline)
              dynamicContent.querySelectorAll('img').forEach(img => {
                img.addEventListener('error', () => {
                  console.warn('Post image failed to load:', img.src);
                  showToast('Could not load an image in the post. Showing fallback.');
                  img.src = withCacheBust(FALLBACK_IMG);
                }, { once: true });
              });

              // Render share buttons inside the loaded content
              dynamicContent.querySelectorAll('.share-buttons').forEach(el => {
                // Use compact variant for dynamically rendered posts
                el.classList.add('compact');
                // Prefer static share pages with Open Graph tags so platforms can render title/image
                const sharePage = blogId ? `${window.location.origin}/share/${encodeURIComponent(blogId)}.html`
                                         : `${window.location.origin}/blogs.html`;
                const effectiveUrl = sharePage;
                el.dataset.shareTitle = blogTitle;
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
          } finally {
            // Spinner will be replaced by content if success; hide container if still only spinner
            const hasContent = !!fullBlogPostContainer.querySelector('.blog-post-content');
            if (!hasContent) {
              fullBlogPostContainer.style.display = 'none';
              fullBlogPostContainer.innerHTML = '';
            }
          }
        });
        // If not already opened by hash, support old behavior (no-op when opened)
        if (!openedByHash) {
          const hash = (window.location.hash || '').replace(/^#/, '');
          if (hash) {
            const buttons = Array.from(document.querySelectorAll('.read-more-btn'));
            const btn = buttons.find(b => (b.dataset.blogId || '') === hash);
            if (btn) btn.click();
          }
        }
      })
      .catch(error => console.error('Error fetching blogs.json:', error));
  }
});