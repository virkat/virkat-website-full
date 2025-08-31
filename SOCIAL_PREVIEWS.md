Social media previews (Open Graph/Twitter) for blogs

How it works
- A generator reads blogs.json and creates share/<id>.html with proper OG/Twitter meta tags and a redirect to reader.html?id=<id>.
- The website prefers these share URLs for social buttons to ensure consistent previews.

Configuration
- Domain: set SITE_BASE_URL in GitHub Actions secrets (e.g., https://www.virkat.org). If not set, the generator uses CNAME or defaults to https://www.virkat.org.
- Twitter handle: set SITE_TWITTER_HANDLE (e.g., @virkat) to annotate tweets.
- Image size: override SOCIAL_IMAGE_WIDTH and SOCIAL_IMAGE_HEIGHT if your images aren’t 1200x630.

Workflow
1) Add a new .md under posts/.
2) Add an entry to blogs.json with: id, title, description, image (absolute path under repo), file.
3) Push to main. CI will generate share/<id>.html and commit it.

Manual overrides
- Add <!-- SHARE_LOCK --> near the top of any share/<id>.html to prevent the generator from overwriting your edits.

Troubleshooting previews
- Use platform debuggers to refresh cache:
  - X/Twitter: https://cards-dev.twitter.com/validator
  - Facebook: https://developers.facebook.com/tools/debug/
- Ensure images resolve publicly with HTTPS and are at least 1200x630 for summary_large_image.
