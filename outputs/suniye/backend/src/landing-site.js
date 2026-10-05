import {readFile} from 'node:fs/promises';

// Exact public paths only: no request-supplied filesystem path or wildcard.
export const landingFiles = Object.freeze({
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/caregiver': ['caregiver.html', 'text/html; charset=utf-8'],
  '/caregiver.css': ['caregiver.css', 'text/css; charset=utf-8'],
  '/caregiver.js': ['caregiver.js', 'application/javascript; charset=utf-8'],
  '/style.css': ['style.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'application/javascript; charset=utf-8'],
  '/assets/mark.svg': ['assets/mark.svg', 'image/svg+xml'],
  '/assets/android-home.png': ['assets/android-home.png', 'image/png'],
  '/assets/android-reading.png': ['assets/android-reading.png', 'image/png'],
  '/assets/raju-bill-sample.mp3': ['assets/raju-bill-sample.mp3', 'audio/mpeg'],
  '/assets/manrope-latin.woff2': ['assets/manrope-latin.woff2', 'font/woff2'],
  '/assets/MANROPE-OFL.txt': ['assets/MANROPE-OFL.txt', 'text/plain; charset=utf-8'],
});
const policy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; font-src 'self'; media-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";

export function registerLanding(app) {
  app.get('/welcome', async (_request, reply) => reply.redirect('/'));
  for (const [path, [file, type]] of Object.entries(landingFiles)) {
    app.get(path, async (_request, reply) => {
      const body = await readFile(new URL(`../public/${file}`, import.meta.url));
      return reply.header('Content-Security-Policy', path.startsWith('/caregiver') ? policy.replace("connect-src 'none'","connect-src 'self'").replace("media-src 'self'","media-src 'self' blob:") : policy)
        .header('X-Content-Type-Options', 'nosniff')
        .header('Referrer-Policy', 'no-referrer')
        .header('Cache-Control', 'public, max-age=0, must-revalidate')
        .type(type).send(body);
    });
  }
}
