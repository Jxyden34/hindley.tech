# hindley.tech portfolio

The live portfolio is served from this `v9` directory's contents. The numbered directory name is historical; URLs on the site use `/`, `/about`, `/skills`, `/project`, `/security`, `/contact` and `/projects/<case-study>`.

## Site structure

- The six main pages share `css/style.css`, the finishing layer `css/design.css`, `js/common.js` and the portfolio guide interface in `js/chatbot.js`.
- `skills.html` uses native buttons and a native `<dialog>`. `js/skills.js` provides selection, dismissal and focus restoration.
- `project.html` has explicit categories used by `js/projects.js`; the three featured case studies live in `projects/`.
- Contact opens an email draft in the visitor's mail client. It does not claim to deliver a message directly from the website.
- `API/app.py` is the Flask portfolio guide. It answers from public portfolio information, reads skill descriptions from `skills.html`, and makes no AI-provider requests. No API key is needed.
- `.htaccess` preserves clean URLs and proxies `/api/chat` to `127.0.0.1:5000`.
- The telemetry collector separately updates `API/fail2ban_stats.json`. Preserve the collector, its cache/data files and its scheduled job when deploying.

## Deployment

The existing host uses Apache, `/var/www/hindley.tech` and `chatbot.service`. Back up the live tree outside the document root before updating it. Preserve the server's data files, environment configuration, unrelated services and Git index. Copy only the changed site files and validate Apache configuration with `apache2ctl configtest`.

The guide uses the host's installed Flask dependency. It can run with `python3 API/app.py`, bound to localhost port 5000. Restart `chatbot.service` when changing the backend. Its request contract is `POST /api/chat` with JSON `{ "message": "What projects has Jayden built?" }`; responses contain `reply`, `links` and `mode: "portfolio-guide"`. Invalid or oversized input produces a 400/413 response without exposing exception details.

Styles and scripts are versioned in page URLs. HTML uses `Cache-Control: no-cache` to revalidate updates. Visitors with an older cached page may need to refresh once after the first rollout.

## Verification

Check the live homepage and all navigation paths, the three case studies, the project filters and their announced counts, contact subject prefill, the guide's suggested questions, keyboard focus and Escape restoration on Skills, and the Security dashboard's live counts and Europe/London timestamp.

The October 2026 update was checked on desktop, 390px and 320px layouts; the staged guide passed content and invalid-input checks. See `DESIGN.md` for the design roles, contrast calculations and layout rationale. Current job title and role dates require confirmation from the site owner before modifying the published career history.
