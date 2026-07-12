/* CALIBER service worker.
   Two jobs: cache the shell so the app opens offline, and stay alive so
   notifications can fire when the app isn't the front-most tab.
   Note: this can only ever register over https or localhost — never file://. */
const CACHE = "caliber-v-host-1";
const SHELL = [
  "./",
  "./index.html",
  "./caliber-appicon-dark.svg",
  "./caliber-appicon-gold.svg",
  "./caliber-favicon.svg"
];

self.addEventListener("install", e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).catch(()=>{}));
  self.skipWaiting();
});
self.addEventListener("activate", e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(
    ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

/* Cache-first for our own files; never cache YouTube, feeds or the proxy. */
self.addEventListener("fetch", e=>{
  const url = new URL(e.request.url);
  if(e.request.method!=="GET") return;
  if(url.origin!==location.origin) return;
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res=>{
      const copy=res.clone();
      caches.open(CACHE).then(c=>c.put(e.request, copy)).catch(()=>{});
      return res;
    }).catch(()=>hit))
  );
});


/* ---------- REAL PUSH ----------
   Fired by the server via the browser vendor's push service, even when the
   app has been closed for days. This is the part a service worker alone
   cannot do — the message has to originate from a server signed with VAPID. */
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data && e.data.text() }; }
  const title = d.title || "CALIBER";
  e.waitUntil(self.registration.showNotification(title, {
    body: d.body || "",
    tag: d.tag || "caliber",
    icon: "caliber-appicon-dark.svg",
    badge: "caliber-favicon.svg",
    vibrate: [24, 50, 24, 50, 24, 60, 46],
    data: { url: d.url || "./index.html" },
    renotify: true
  }));
});

/* if the browser rotates the subscription, tell the server the new endpoint */
self.addEventListener("pushsubscriptionchange", e => {
  e.waitUntil((async () => {
    const sub = await self.registration.pushManager.subscribe(e.oldSubscription.options);
    await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub })
    }).catch(() => {});
  })());
});

/* tapping a notification brings the app forward rather than opening a new tab */
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./index.html";
  e.waitUntil(clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
