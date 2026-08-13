# Siccar — marketing website

A static marketing site for Siccar (Siccar Solutions), an IT & operations
consulting firm. Plain HTML, CSS, and a little vanilla JavaScript — no build
step, no framework. You can open the files directly in a browser and host it by
dragging the folder onto Netlify or GitHub Pages.

## Structure

```
.
├── index.html          Home
├── services.html       What we do
├── about.html          Company story + leadership
├── contact.html        Contact form + details
├── css/styles.css      Single stylesheet (design tokens in :root)
├── js/main.js          Mobile nav toggle, header scroll, contact-form handling
├── assets/             Images (logo, photography, headshots)
└── README.md           This file
```

The header and footer markup is duplicated in each `.html` file (there's no
templating). If you change a nav link or footer detail, update it in all four
pages.

---

## Preview the site locally

**Quick look:** double-click `index.html` (or drag it into a browser). Good
enough for reading and layout checks.

**Proper preview (recommended):** run a tiny local web server so everything —
fonts, relative paths, and the contact form — behaves exactly like production.
From this folder:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Press `Ctrl+C` in the
terminal to stop it. (Any static server works; this one ships with macOS.)

> The contact form submits to Formspree over the network, so test it from
> `http://localhost:...` rather than a `file://` page.

---

## Swap out the headshots

The two leadership photos on the About page live here:

| Person | File shown on the site | Original (kept as a backup) |
|--------|------------------------|-----------------------------|
| Smita  | `assets/smita.jpg`     | `assets/smita.png`          |
| Sam    | `assets/sam.jpg`       | `assets/sam.png`            |

The site displays each photo as a **220 × 220** square. To replace one:

1. Crop the new photo to a **square**. Export it at **440 × 440** (2× so it stays
   sharp on high-resolution screens) as a **JPEG**, and keep it **under ~150 KB**.
2. Save it over the existing file — `assets/smita.jpg` or `assets/sam.jpg` —
   keeping the same filename. (Or use a new filename and update the `src` in
   `about.html`.)
3. If the person changed, update the `alt` text on that `<img>` in `about.html`
   so it still describes who's pictured.
4. Bump the cache-buster (see below) so returning visitors get the new image.

macOS can do the resize without extra software:

```bash
sips -Z 440 assets/smita.jpg      # scales the longest side to 440px, in place
```

---

## Cache-busting when you update files

`index.html` (and the others) load the stylesheet and script with a version
query — `css/styles.css?v=1` and `js/main.js?v=1`. After you edit `styles.css`,
`main.js`, or a headshot, bump that number (`?v=2`, `?v=3`, …) in all four HTML
files so browsers fetch the fresh copy instead of a cached one.

---

## The contact form (Formspree)

The form on `contact.html` posts to Formspree — no server of your own required:

```html
<form id="contact-form" action="https://formspree.io/f/mnpazqkg" ...>
```

Submissions show a success or error message **in the page** (no pop-ups). The
first time a real submission comes through, Formspree emails the account owner
to confirm/activate the form — do that once and messages will flow through
afterward. To change where messages go, edit the form ID in that `action` URL.

---

## Deploy to Netlify (drag-and-drop)

No account setup beyond signing in — this is the "drop a folder" workflow.

1. Go to <https://app.netlify.com> and sign in (or sign up — it's free).
2. On the **Sites** screen, find the **"Deploy manually"** / drag-and-drop area
   (labelled something like *"Want to deploy a new site without connecting to
   Git? Drag and drop your site output folder here"*).
3. Drag **this whole project folder** onto that area.
4. Netlify uploads the files and gives you a live URL like
   `https://random-name-123.netlify.app`. Your site is live.
5. (Optional) **Site configuration → Change site name** to pick a friendlier
   subdomain, e.g. `siccar.netlify.app`.

To publish an update later, drag the folder onto the site's **Deploys** tab
again — each drop creates a new deploy.

---

## Point your GoDaddy domain (siccarsolutions.com) at Netlify

First, tell Netlify about the domain:

1. In Netlify: **Site configuration → Domain management → Add a domain**.
2. Enter `siccarsolutions.com` and add it. Netlify will also offer to add
   `www.siccarsolutions.com` — add both.
3. Netlify then shows you how to point DNS. Pick **one** of the two options
   below.

### Option A — Let Netlify run DNS (recommended, simplest)

This hands DNS to Netlify, which sets up the apex domain, `www`, and HTTPS
automatically.

1. In Netlify's domain panel, choose **"Set up Netlify DNS"** for
   `siccarsolutions.com`. Netlify shows **4 nameservers**, e.g.
   `dns1.p0X.nzone.net` … `dns4.p0X.nzone.net` (yours will be specific to your
   account — copy the exact ones Netlify shows).
2. Sign in at <https://dcc.godaddy.com> → **My Products** → next to
   `siccarsolutions.com` click **DNS** (or **Manage DNS**).
3. Find **Nameservers** → **Change** → **Enter my own nameservers (custom)**.
4. Replace GoDaddy's nameservers with the 4 from Netlify. Save.
5. Wait for propagation (usually well under an hour, up to 24–48h). Netlify
   auto-provisions a free Let's Encrypt HTTPS certificate once DNS resolves.

> Changing nameservers moves **all** DNS for the domain to Netlify. If you use
> GoDaddy for email or other records on this domain, recreate those records in
> Netlify's DNS panel, or use Option B instead.

### Option B — Keep DNS at GoDaddy (records only)

Leave GoDaddy's nameservers as-is and add two records. In GoDaddy's **DNS**
page for `siccarsolutions.com`:

1. **Apex domain** (`siccarsolutions.com`) — add/edit an **A** record:
   - **Type:** A
   - **Name:** `@`
   - **Value:** `75.2.60.5`  *(Netlify's load-balancer IP — confirm against the
     value Netlify shows you)*
   - **TTL:** default (1 hour)
2. **www** — add a **CNAME** record:
   - **Type:** CNAME
   - **Name:** `www`
   - **Value:** `your-site-name.netlify.app.`  *(your Netlify subdomain, with a
     trailing dot)*
   - **TTL:** default
3. Delete any old/parked A records for `@` that GoDaddy added by default, and
   any conflicting `www` CNAME, so only the two above remain.
4. Back in Netlify, once it detects the records it issues the HTTPS certificate
   automatically. In **Domain management**, set the primary domain (apex or
   `www`) and enable **"Force HTTPS"**.

> Netlify's apex IP is `75.2.60.5` at the time of writing — always use the exact
> value shown in your Netlify domain panel in case it has changed.

### After DNS resolves

- Visit `https://siccarsolutions.com` and `https://www.siccarsolutions.com` —
  both should load the site over HTTPS, one redirecting to the other.
- The site's canonical URLs, Open Graph tags, and structured data already use
  `https://siccarsolutions.com`, so shared links and search previews will match.

---

## License / credits

Photography is from Unsplash (free license). Fonts (Archivo, Newsreader,
IBM Plex Mono) are served from Google Fonts.
