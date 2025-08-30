document.addEventListener('DOMContentLoaded', () => {
  // Helpers (trimmed copies from main script)
  const __cb = Date.now().toString();
  function withCacheBust(url) { if (!url) return url; const sep = url.includes('?') ? '&' : '?'; return `${url}${sep}v=${__cb}`; }
  const FALLBACK_IMG = 'assets/images/blog1.jpg';
  function showToast(message, timeout = 2800) { try { let t = document.querySelector('.toast'); if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t);} t.textContent = message; t.classList.add('show'); clearTimeout(showToast._timer); showToast._timer = setTimeout(() => t.classList.remove('show'), timeout);} catch(_) { alert(message);} }
  function addCacheBustToImages(html) { if (!html) return html; return html.replace(/src="((?:assets\/images|posts)\/[^"\?]+)(\?[^"']*)?"/g, (m, p1) => `src="${withCacheBust(p1)}"`); }
  function markdownToHtml(md) {
    if (!md) return '';
    md = md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    md = md.replace(/```([\s\S]*?)```/g, (m,p1)=>`<pre><code>${p1.replace(/\n/g,'\n')}</code></pre>`);
    md = md.replace(/`([^`]+)`/g,'<code>$1</code>');
    md = md.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    md = md.replace(/__([^_]+)__/g,'<strong>$1</strong>');
    md = md.replace(/\*([^*]+)\*/g,'<em>$1</em>');
    md = md.replace(/_([^_]+)_/g,'<em>$1</em>');
    md = md.replace(/!\[([^\]]*)\]\s*\(([^\)]+)\)/g,'<img src="$2" alt="$1" loading="lazy" decoding="async" fetchpriority="low" />');
    md = md.replace(/\[([^\]]+)\]\s*\(([^\)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
    md = md.replace(/(?<!["'=])(https?:\/\/[^\s<>)]+[\w\/#-])/g,'<a href="$1" target="_blank" rel="noopener">$1</a>');
    md = md.replace(/^######\s?(.*)$/gm,'<h6>$1<\/h6>')
           .replace(/^#####\s?(.*)$/gm,'<h5>$1<\/h5>')
           .replace(/^####\s?(.*)$/gm,'<h4>$1<\/h4>')
           .replace(/^###\s?(.*)$/gm,'<h3>$1<\/h3>')
           .replace(/^##\s?(.*)$/gm,'<h2>$1<\/h2>')
           .replace(/^#\s?(.*)$/gm,'<h1>$1<\/h1>');
    md = md.replace(/^>\s?(.*)$/gm,'<blockquote>$1<\/blockquote>');
    md = md.replace(/^(?:- |\* )(.*(?:\n(?:- |\* ).*)*)/gm,(match)=>{const items=match.split(/\n/).map(l=>l.replace(/^(- |\* )/,'').trim()).filter(Boolean);return `<ul>${items.map(i=>`<li>${i}<\/li>`).join('')}<\/ul>`;});
    md = md.replace(/^(?:\d+\. )(.*(?:\n(?:\d+\. ).*)*)/gm,(match)=>{const items=match.split(/\n/).map(l=>l.replace(/^\d+\. /,'').trim()).filter(Boolean);return `<ol>${items.map(i=>`<li>${i}<\/li>`).join('')}<\/ol>`;});
    const blocks = md.split(/\n{2,}/).map(b=>b.trim()).filter(Boolean);
    return blocks.map(b => (/^<h\d|^<ul|^<ol|^<pre|^<blockquote|^<img|^<p|^<code|^<hr/.test(b)?b:`<p>${b.replace(/\n/g,'<br>')}<\/p>`)).join('\n');
  }
  function calculateReadingTime(text){const wordsPerMinute=200;const wordCount=(text||'').trim().split(/\s+/).length;return Math.ceil(wordCount/wordsPerMinute);}  
  function renderShareButtons(container, url) {
    if (!container) return; const shareUrl = url || window.location.href; const shareTitle = document.title || 'Virkat Blog'; const iconBase = 'assets/images'; const tweetText = `${shareTitle}`; const waText = `${shareTitle} — ${shareUrl}`;
    container.innerHTML = `<span>Share:</span>
      <a href="https://x.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on X"><img src="/${iconBase}/x-icon.svg" alt="X" /><\/a>
      <a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on LinkedIn"><img src="/${iconBase}/linkedin-icon.svg" alt="LinkedIn" /><\/a>
      <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener" aria-label="Share on Facebook"><img src="/${iconBase}/facebook-icon.svg" alt="Facebook" /><\/a>
      <a href="https://wa.me/?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener" aria-label="Share on WhatsApp"><img src="/${iconBase}/whatsapp-icon.svg" alt="WhatsApp" /><\/a>`;
  }

  function getQueryParam(name){const params=new URLSearchParams(window.location.search);return params.get(name);}  

  // Highlight current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => { const href = (a.getAttribute('href')||'').split('/').pop(); if (href === current) a.classList.add('active'); });

  // Mobile nav basic toggle (overlay menu)
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks){
    if (!navLinks.id) navLinks.id = 'primary-navigation';
    hamburger.setAttribute('role','button');
    hamburger.setAttribute('tabindex','0');
    hamburger.setAttribute('aria-controls', navLinks.id);
    hamburger.setAttribute('aria-expanded','false');
    if (!hamburger.getAttribute('aria-label')) hamburger.setAttribute('aria-label','Open menu');
  let backdrop = null; // no backdrop used for overlay menu
    // Focus helpers
    const FOCUSABLE_SELECTOR = 'a[href]:not([tabindex="-1"]):not([aria-disabled="true"]), button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])';
    let previouslyFocusedEl = null;
    function isVisible(el){ if(!el) return false; const s = window.getComputedStyle(el); return s.visibility !== 'hidden' && s.display !== 'none'; }
    function focusFirst(){ const els = Array.from(navLinks.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisible); if (els.length) els[0].focus(); else { navLinks.setAttribute('tabindex','-1'); navLinks.focus(); } }
    function trapFocus(e){ if(!navLinks.classList.contains('open')) return; if(e.key!=='Tab') return; const els = Array.from(navLinks.querySelectorAll(FOCUSABLE_SELECTOR)).filter(isVisible); if(!els.length){ e.preventDefault(); navLinks.focus(); return;} const first = els[0]; const last = els[els.length-1]; if(e.shiftKey){ if(document.activeElement===first || !navLinks.contains(document.activeElement)){ e.preventDefault(); last.focus(); } } else { if(document.activeElement===last || !navLinks.contains(document.activeElement)){ e.preventDefault(); first.focus(); } } }
  const pageMain = document.querySelector('main');
  const pageFooter = document.querySelector('footer');
  function setPageInert(on){ [pageMain, pageFooter].forEach(el=>{ if(!el) return; try{ if(on){ el.classList.add('no-interact'); el.setAttribute('aria-hidden','true'); } else { el.classList.remove('no-interact'); el.removeAttribute('aria-hidden'); } }catch(_){}}); }
  const open=()=>{navLinks.classList.add('open'); hamburger.classList.add('active'); document.body.classList.add('no-scroll'); document.body.classList.add('menu-open'); hamburger.setAttribute('aria-expanded','true'); hamburger.setAttribute('aria-label','Close menu'); setPageInert(true); previouslyFocusedEl = document.activeElement; setTimeout(focusFirst, 0); document.addEventListener('keydown', trapFocus, true);}; 
  const close=()=>{navLinks.classList.remove('open'); hamburger.classList.remove('active'); document.body.classList.remove('no-scroll'); document.body.classList.remove('menu-open'); hamburger.setAttribute('aria-expanded','false'); hamburger.setAttribute('aria-label','Open menu'); setPageInert(false); document.removeEventListener('keydown', trapFocus, true); setTimeout(()=>{ if(previouslyFocusedEl&&previouslyFocusedEl.focus) previouslyFocusedEl.focus(); else if(hamburger&&hamburger.focus) hamburger.focus(); },0);}; 
  hamburger.addEventListener('click', (e)=>{e.preventDefault(); navLinks.classList.contains('open')?close():open();}); 
  hamburger.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); navLinks.classList.contains('open')?close():open(); }});
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') close();}); 
    // Close menu on nav activation; let default navigation proceed
    function handleNavActivate(e){
      const a=e.target.closest&&e.target.closest('.nav-link');
      if(!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (href.startsWith('#')){
        e.preventDefault();
        if (navLinks.classList.contains('open')) close();
        const target = document.querySelector(href);
        if (target) { target.scrollIntoView({behavior:'smooth'}); }
        return;
      }
      if (navLinks.classList.contains('open')) setTimeout(close, 0);
    }
    navLinks.addEventListener('click', handleNavActivate, { passive: false });
  // iOS fallback: force navigation at capture phase if menu is open
    function forceNavOnCapture(e){
      const a = e.target.closest && e.target.closest('.nav-links .nav-link');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (!href || href.startsWith('#')) return;
      if (!navLinks.classList.contains('open')) return;
      try { window.location.href = a.href; } catch(_) { window.location.assign(href); }
    }
  document.addEventListener('click', forceNavOnCapture, true);
  document.addEventListener('touchend', forceNavOnCapture, true);
  // Close when clicking outside
  document.addEventListener('click', (e)=>{ if(!navLinks.classList.contains('open')) return; const inside = navLinks.contains(e.target); const onHamb = hamburger.contains(e.target); if(!inside && !onHamb) close(); });
  }

  // Standalone reader flow
  const id = getQueryParam('id');
  const container = document.getElementById('standalone-post-container');
  if (!id || !container) {
    // If no id, go to blogs page
    window.location.replace('/blogs.html');
    return;
  }

  container.innerHTML = '<div class="container"><div class="spinner" aria-label="Loading"></div></div>';

  fetch(withCacheBust('blogs.json'))
    .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then(blogs => {
      const blog = (blogs || []).find(b => (b.id||'') === id);
      if (!blog) throw new Error('Post not found');
      return blog;
    })
    .then(async (blog) => {
      const blogFile = blog.file || '';
      const blogTitle = blog.title || 'Blog';
      const blogAuthor = blog.author || 'Virkat Team';
      const blogDate = blog.date || '';
      const heroImg = blog.image ? withCacheBust(blog.image) : '';

      let contentToLoad = '';
      if (blogFile.toLowerCase().endsWith('.md')) {
        const resp = await fetch(withCacheBust(blogFile));
        if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${blogFile}`);
        const md = await resp.text();
        let articleHtml = markdownToHtml(md);
        const baseDir = blogFile.replace(/[^\/]+$/, '');
        articleHtml = articleHtml.replace(/src="(?!https?:|\/|assets\/images\/|posts\/)([^"]+)"/g, (m, p1) => `src="${baseDir}${p1}"`);
        articleHtml = addCacheBustToImages(articleHtml);
        const hero = heroImg ? `<img src="${heroImg}" alt="${blogTitle}" class="blog-image" loading="lazy" />` : '';
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
        const resp = await fetch(withCacheBust(blogFile));
        if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${blogFile}`);
        const html = await resp.text();
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          doc.querySelectorAll('img').forEach(img => { const src = img.getAttribute('src')||''; if (src.startsWith('assets/images/') || src.includes('/assets/images/')) img.setAttribute('src', withCacheBust(src)); });
          const contentNode = doc.querySelector('.blog-post-content') || doc.body || doc.documentElement;
          contentToLoad = contentNode ? contentNode.innerHTML : html;
        } catch (_) {
          contentToLoad = addCacheBustToImages(html || '');
        }
      }

      if (!contentToLoad) throw new Error('No content');

      const backBtn = `<div class="container" style="margin-top:20px;margin-bottom:10px"><a class="btn btn-secondary" href="/blogs.html">← Back to all posts</a></div>`;
      container.innerHTML = backBtn + contentToLoad;

      const dynamicContent = container.querySelector('.blog-post-content') || container;
      const readingTimeEl = dynamicContent.querySelector('.reading-time');
      if (readingTimeEl) {
        const text = dynamicContent.innerText || dynamicContent.textContent || '';
        readingTimeEl.textContent = calculateReadingTime(text);
      }

      dynamicContent.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', () => { img.src = withCacheBust(FALLBACK_IMG); }, { once: true });
      });

      dynamicContent.querySelectorAll('.share-buttons').forEach(el => {
        el.classList.add('compact');
        renderShareButtons(el, window.location.href);
      });

      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      document.title = `${blogTitle} — Virkat`;
    })
    .catch(err => {
      console.error(err);
      showToast('Could not load the post. Redirecting to blogs…');
      setTimeout(() => window.location.replace('/blogs.html'), 1200);
    });
});
