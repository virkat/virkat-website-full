# Virkat Website

This is the source code for the official website of Virkat (www.virkat.org), a data and analytics consultancy.

## Features
- Modern, professional, and responsive design
- Enhanced user experience with improved layout, spacing, subtle animations, and micro-interactions
- Team, Blogs, Services, and Projects & Case Studies sections with interactive accordions and cards
- Downloadable resumes for team members
- Social media share buttons (X, LinkedIn, Facebook, WhatsApp) on blogs and projects for easy sharing
- Badges for team members (Google Data Analytics, etc.) displayed with images
- Custom SVG logo and branding
- Dark mode toggle for accessibility
- Contact section with email link
- Clean, accessible code using HTML, CSS, and JavaScript (no frameworks)
- Static assets (images, resumes, badges, icons, etc.)
- Deployed via GitHub Pages with custom domain support

## Project Structure
```
virkat-website-full/
├── index.html
├── blogs.html
├── services.html
├── team.html
├── CNAME
├── context.md
├── ROADMAP.md
├── assets/
│   ├── css/
│   │   └── style.css
│   ├── images/
│   │   ├── asad.jpg
│   │   ├── banner.jpg
│   │   ├── blog1.jpg
│   │   ├── blog2.jpg
│   │   ├── kisa.jpg
│   │   ├── Asad-Raza-Virk-Badge.jpg
│   │   ├── Kisa-Fatima-Badge.jpg
│   │   ├── logo.svg
│   │   ├── x-icon.svg
│   │   ├── linkedin-icon.svg
│   │   ├── facebook-icon.svg
│   │   └── whatsapp-icon.svg
│   ├── js/
│   │   └── script.js
│   └── resumes/
│       ├── Asad-Raza-Virk-Resume.pdf
│       └── Kisa-Fatima-Resume.pdf
```

## How to Run Locally
1. Clone the repository:
   ```sh
   git clone https://github.com/virkat/virkat-website-full.git
   ```
2. Open the folder in your code editor.
3. Open `index.html` in your browser to view the site locally.

## Design & UX
- Modern color palette, rounded corners, and soft shadows for a premium look
- Responsive grid layouts for all sections and pages
- Smooth transitions, hover effects, and ripple micro-interactions for interactivity
- Mobile-first design for excellent usability on all devices
- Accessible navigation, color contrast, and keyboard support
## Social Sharing
Share buttons are available on all blog posts and project/case study cards. Visitors can share content directly to X (Twitter), LinkedIn, Facebook, and WhatsApp.

## Badges
Team member badges (e.g., Google Data Analytics) are displayed using image files. Ensure badge images are present in `assets/images/` and referenced with the correct filename in the HTML.

## Logo
The site uses a custom SVG logo for crisp display on all backgrounds. The logo is located at `assets/images/logo.svg`.

## Troubleshooting
- If images (badges, photos, icons) do not appear on the live site, check that the filenames and paths in the HTML match exactly (case-sensitive) and that the files are committed and pushed to GitHub.
- For DNS or deployment issues, verify your GitHub Pages settings and custom domain configuration.


## Deployment
- The site is deployed using GitHub Pages from the `main` branch.


## License
© 2025 Virkat. All rights reserved.

## Adding a New Blog Post (Markdown preferred)
Use Markdown files for the fastest authoring workflow. The blog page converts Markdown to HTML automatically and wraps it with title, author/date, hero image, share buttons, and reading time.

### 1) Prepare assets (optional)
- Save your hero image to `assets/images/` (e.g., `assets/images/blog3.jpg`). Recommended size: 1200×630 (landscape), JPG or PNG.

### 2) Create the Markdown file
- Create `posts/<your-post-slug>.md` (use a short, hyphenated slug, e.g., `data-cleaning-checklist.md`).
- Start with content, not a top-level `# Title` (the page title is taken from `blogs.json`).
- Example Markdown:
```
Intro paragraph that sets the context.

## Section heading
Explain your topic. Use lists and emphasis:
- **Bold term:** quick definition
- _Italic note_ for nuance

> Optional quote to add depth.

Include images when useful:
![Alt text](assets/images/blog3.jpg)
```

### 3) Add the post to `blogs.json`
Add a new object to the array with your metadata and the `.md` file path.
```
{
   "id": "data-cleaning-checklist",
   "title": "A Clean Data Checklist",
   "image": "assets/images/blog3.jpg",
   "description": "A practical checklist to keep your datasets analysis-ready.",
   "author": "Your Name",
   "date": "September 05, 2025",
   "file": "posts/data-cleaning-checklist.md"
}
```
- id: unique, lowercase, hyphenated. Used for deep links: `blogs.html#data-cleaning-checklist`.
- image: shown on the card and at the top of the post.
- file: points to your Markdown file in `posts/`.

### 4) Preview
- Open `blogs.html` and hard refresh (Ctrl+F5) to bypass cache.
- You should see the new card. Click “Read More” to view inline.
- Deep link works: `blogs.html#data-cleaning-checklist`.

### Notes
- Reading time is automatic based on content length.
- Share buttons are injected automatically and use a stable deep link.
- Markdown supported: headings, lists, bold/italic, links, images, code blocks (```), quotes.

### Troubleshooting
- Post doesn’t appear: ensure `blogs.json` is valid JSON (trailing commas) and the `file` path exists.
- “Read More” does nothing: hard refresh `blogs.html` (Ctrl+F5). Check browser console for any fetch errors.
- Images not showing: confirm the path (e.g., `assets/images/...`) and that the file is committed.
- Styling oddities (e.g., literal asterisks showing): hard refresh to load the latest script; the converter supports **bold** and _italic_.

---

## Alternative: HTML post template
If you prefer writing raw HTML, duplicate the template and point `blogs.json` to the `.html` file.

1) Duplicate the template
- Copy `posts/blog-post-template.html` to `posts/<your-post-file>.html`.
- Update the `<title>`, the `.section-header > h2`, the `.meta` author and date, the optional hero image, and the content within `.blog-post-content`.

2) Add to `blogs.json`
```
{
   "id": "unique-slug",
   "title": "Post Title",
   "image": "assets/images/your-image.jpg",
   "description": "One or two sentence summary for the card.",
   "author": "Your Name",
   "date": "Month DD, YYYY",
   "file": "posts/<your-post-file>.html"
}
```

3) Preview as above (open `blogs.html`, “Read More”, deep link check).

---

## Deep links and Markdown posts
- Link directly to a post via `blogs.html#<id>` (the `id` from `blogs.json`).
- Posts listed with `.md` files are converted client-side and wrapped with consistent blog UI.
- To improve UX, the reader shows a loading spinner and prefetches Markdown on hover.

## Deep links and Markdown posts
- Blog cards support deep links. You can link directly to a post using `blogs.html#<id>`, where `<id>` is the `id` field from `blogs.json` (e.g., `blogs.html#understanding-data-cleaning`).
- The blog reader supports Markdown files (`.md`) listed in `blogs.json`. When a Markdown file is used, the loader converts it to HTML and wraps it with the standard post header, meta, hero image, and share buttons.
- For performance, posts are prefetched on hover and a small spinner is shown while loading.
