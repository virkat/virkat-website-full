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

## Adding a New Blog Post
Use the provided template and JSON listing to publish new posts consistently.

1) Duplicate the template
- Copy `posts/blog-post-template.html` to `posts/<your-post-file>.html`.
- Update:
   - `<title>` tag
   - `.section-header > h2`
   - `.meta` author and date
   - Optional hero image `src` and `alt`
   - Post content within `.blog-post-content`
   - The `.share-buttons` `data-share-url` to your live URL (e.g., `https://www.virkat.org/posts/<your-post-file>.html`).

2) Add the post to the list
- Edit `blogs.json` and add an object:
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

3) Test locally
- Open `blogs.html`. The post should appear in the list.
- Click “Read More” to load inline. The back button returns to the list.

Notes
- Layout: Posts should follow `blog-post-1.html` structure. The template matches this layout.
- Reading time: Auto-calculated and displayed via `<span class="reading-time"></span>`.
- Share buttons: Any `<div class="share-buttons">` is auto-rendered by `assets/js/script.js`. Prefer setting `data-share-url` for accuracy; if omitted, the current URL is used.

## Deep links and Markdown posts
- Blog cards support deep links. You can link directly to a post using `blogs.html#<id>`, where `<id>` is the `id` field from `blogs.json` (e.g., `blogs.html#understanding-data-cleaning`).
- The blog reader supports Markdown files (`.md`) listed in `blogs.json`. When a Markdown file is used, the loader converts it to HTML and wraps it with the standard post header, meta, hero image, and share buttons.
- For performance, posts are prefetched on hover and a small spinner is shown while loading.
