import {readFile} from 'node:fs/promises';

// Exact public paths only: no request-supplied filesystem path or wildcard.
export const landingFiles = Object.freeze({
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/caregiver': ['caregiver.html', 'text/html; charset=utf-8'],
  '/caregiver.css': ['caregiver.css', 'text/css; charset=utf-8'],
  '/caregiver.js': ['caregiver.js', 'application/javascript; charset=utf-8'],
  '/style.css': ['style.css', 'text/css; charset=utf-8'],
  '/app.js': ['app.js', 'application/javascript; charset=utf-8'],
  '/assets/suniye-walkthrough.mp4': ['assets/suniye-walkthrough.mp4', 'video/mp4'],
  '/assets/walkthrough-en.vtt': ['assets/walkthrough-en.vtt', 'text/vtt; charset=utf-8'],
  '/assets/walkthrough-poster.png': ['assets/walkthrough-poster.png', 'image/png'],
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
    app.get(path, async (request, reply) => {
      const body = await readFile(new URL(`../public/${file}`, import.meta.url));
      // Byte ranges let native browser players seek without fetching another full film.
      if(type==='video/mp4'){
        reply.header('Accept-Ranges','bytes');
        if(request.headers.range){
          const match=/^bytes=(\d*)-(\d*)$/.exec(request.headers.range);
          const size=body.length;
          let start=match?.[1]?Number(match[1]):match?.[2]?Math.max(0,size-Number(match[2])):NaN;
          let end=match?.[1]&&match?.[2]?Math.min(size-1,Number(match[2])):size-1;
          if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start)return reply.code(416).header('Content-Range',`bytes */${size}`).send();
          return reply.code(206).header('Content-Range',`bytes ${start}-${end}/${size}`).header('Cache-Control','public, max-age=0, must-revalidate').header('X-Content-Type-Options','nosniff').header('Referrer-Policy','no-referrer').type(type).send(body.subarray(start,end+1));
        }
      }
      return reply.header('Content-Security-Policy', path.startsWith('/caregiver') ? policy.replace("connect-src 'none'","connect-src 'self'").replace("media-src 'self'","media-src 'self' blob:") : policy)
        .header('X-Content-Type-Options', 'nosniff')
        .header('Referrer-Policy', 'no-referrer')
        .header('Cache-Control', 'public, max-age=0, must-revalidate')
        .type(type).send(body);
    });
  }
}
