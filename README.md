# GuerillaFi VSL page

Live: https://guerillafi-vsl-draft.netlify.app

This is the whole page: three files and a folder of images. No build step, no framework.

| File | What it is |
|---|---|
| `index.html` | All the words on the page. Edit text here. |
| `styles.css` | Colors, fonts, spacing. |
| `app.js` | The video player, the flywheel tabs and the calendar embed. You rarely need this. |
| `assets/` | Logo, icons, the real Uni K Wax ad clips. |

## How to edit (2 minutes)

1. Open `index.html` on GitHub, click the pencil (Edit), change the words, click **Commit changes**.
2. Wait about 1 minute, then refresh the live site. Netlify watches this repo and publishes every commit to `main` by itself.

That is it. Every commit to `main` deploys by itself.

Prefer an editor? Open this repo in Replit, VS Code or GitHub Codespaces (green **Code** button, Codespaces tab): same files, same rule, commit to `main` and it deploys.

## The two things people change most

- **The video:** in `index.html` find `data-video-src=""` and paste the YouTube, Vimeo or Loom link between the quotes.
- **The calendar:** in `index.html` find `data-calendar-url="..."` on the `<section class="book"` line. It is Daylon's GoHighLevel calendar today.

## Rules for the copy

- No em dashes or en dashes anywhere (use a period, colon or comma).
- Every number keeps its date window. Do not add a number that was not measured.
- No prices on the page.
- Keep `<meta name="robots" content="noindex">` while it is a draft. Remove it at launch.

## Deploy details

Netlify (site `guerillafi-vsl-draft`) is linked to this repository through the Netlify GitHub app: every push to `main`
publishes the folder as is, with no build command. Nobody needs a Netlify login to publish. Deploy history and rollbacks
live in the Netlify dashboard (Jay's team).
