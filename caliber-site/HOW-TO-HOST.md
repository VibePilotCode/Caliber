# CALIBER — putting it online

Everything in this folder is the site. There's no build step, no dependencies,
no server code. Drag the folder somewhere that serves static files and it works.

---

## The fastest way — Cloudflare Pages (about 60 seconds, free)

1. Go to **https://pages.cloudflare.com** and sign in (free account).
2. Choose **Create a project → Upload assets**.
3. Drag this whole `site` folder in.
4. It gives you a URL like `caliber-abc.pages.dev`. Send that to your friend.

No card, no CLI, no repo. Updates are another drag-and-drop.

## Alternatives, all free

- **Netlify Drop** — https://app.netlify.com/drop — drag the folder, get a URL.
- **GitHub Pages** — push the folder to a repo, Settings → Pages → deploy from
  `main`. Slower to set up, but a proper home if this becomes real.
- **Vercel** — `npx vercel` inside this folder if you have Node.

---

## What's in here

| File | What it is |
|---|---|
| `index.html` | The whole app. One file. This is the thing. |
| `stage.html` | The self-driving demo: desktop and phone side by side, tours itself. Good for recording. |
| `sw.js` + `manifest.webmanifest` | Makes it installable to a phone home screen and work offline. |
| `icon.svg`, `favicon.svg` | The Stamp. |

Send your friend the plain URL. Send a *client* `…/stage.html`, then don't touch
anything — it drives itself.

---

## Two things to know before you send the link

**1. This is a public URL.** Anyone with it can open it. That's fine for a friend.
It is a different proposition from a private demo, because the app currently
displays maison logos, which are trademarks we don't own. For a friend: no
practical risk. If it's going anywhere wider — posted publicly, sent to a
company, indexed by Google — use the stripped build (`caliber-pitch.html`)
instead, which renders every house in CALIBER's own type and carries nothing
borrowed.

To keep it from being indexed, add a file called `_headers` containing:

```
/*
  X-Robots-Tag: noindex
```

**2. Everything is stored in the visitor's own browser.** There is no account, no
database, no server. Your friend's collection is theirs and never leaves their
machine — which is a feature, but it also means their box won't appear on your
screen, and clearing their browser data wipes it.

---

## What now works that didn't from a double-click

Hosting it over `https` switches on the things a browser refuses to allow on a
file opened from disk:

- YouTube plays inline (reviews, maison films, the manufacture tours)
- The Journal and the News wire can fetch feeds
- The weather and "what should I wear today" can ask for location
- It installs to a phone home screen and works offline afterwards

Which is the whole reason to host it rather than emailing an HTML file.
