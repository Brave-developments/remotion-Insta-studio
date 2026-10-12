/**
 * Prepare sourced images for the opt-in PaperReel composition.
 * Sources: Pexels Photos (PEXELS_API_KEY) or keyless Wikimedia Commons.
 * Flashcut AI can also provide previously imported local image assets.
 *
 * Never let untrusted image addresses request arbitrary network locations.
 * Real images are downloaded BEFORE render, source/rights are recorded, and
 * unavailable images fail the build instead of silently generating a fake.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content', 'paper');
const DEST = path.join(ROOT, 'public', 'paper', 'assets');
const VALID_LAYOUTS = new Set(['photo', 'collage', 'browser', 'metric', 'quote']);
const ALLOWED_HOSTS = new Set(['upload.wikimedia.org', 'images.pexels.com']);
const MAX_BYTES = 18 * 1024 * 1024;
const MAX_SCENES = 30;

export function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').slice(0, 60).replace(/^-|-$/g, '') || 'photo';
}

export function validateBrief(brief) {
  if (!brief || typeof brief !== 'object' || !Array.isArray(brief.scenes)
      || brief.scenes.length < 1 || brief.scenes.length > MAX_SCENES) {
    throw new Error('Brief must contain 1-' + MAX_SCENES + ' scenes.');
  }
  if (typeof brief.title !== 'string' || !brief.title.trim()) throw new Error('Missing brief title.');
  const ids = new Set();
  let total = 0;
  for (const [i, scene] of brief.scenes.entries()) {
    if (!scene || typeof scene !== 'object') throw new Error('Invalid scene ' + i);
    if (typeof scene.id !== 'string' || !/^[a-z0-9-]{1,60}$/.test(scene.id) || ids.has(scene.id)) {
      throw new Error('Scene IDs must be unique lowercase slugs: ' + String(scene.id));
    }
    ids.add(scene.id);
    if (!VALID_LAYOUTS.has(scene.layout)) throw new Error('Unknown layout in scene ' + scene.id);
    if (typeof scene.headline !== 'string' || !scene.headline.trim()) throw new Error('Missing headline: ' + scene.id);
    if (!Number.isInteger(scene.seconds) || scene.seconds < 3 || scene.seconds > 18) {
      throw new Error('Scene seconds must be 3-18: ' + scene.id);
    }
    if (scene.layout === 'metric' && (!Number.isFinite(scene.value) ||
        !scene.sourceUrl || !scene.attribution)) {
      throw new Error('Metrics require a real value, sourceUrl and attribution: ' + scene.id);
    }
    if (scene.layout === 'quote' && (!scene.body || !scene.sourceUrl || !scene.attribution)) {
      throw new Error('Quotes require body, sourceUrl and attribution: ' + scene.id);
    }
    const requiresImage = ['photo', 'browser', 'collage'].includes(scene.layout);
    if (requiresImage && !scene.photoQuery && !scene.flashcutAssetId) {
      throw new Error('Scene needs photoQuery or flashcutAssetId: ' + scene.id);
    }
    if (scene.layout === 'collage' && !scene.photoQuery2 && !scene.flashcutAssetId2) {
      throw new Error('Collage needs a second photo: ' + scene.id);
    }
    total += scene.seconds;
  }
  return {totalSeconds: total, scenes: brief.scenes};
}

const stripHtml = (text) => String(text || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim().slice(0, 400);

function licensedCommons(meta) {
  const license = stripHtml(meta.LicenseShortName?.value);
  const url = stripHtml(meta.LicenseUrl?.value || '');
  // Only licenses which permit adaptation; user must still review attribution
  // and share-alike requirements. Disallow NC/ND/restricted/unknown.
  const free = /^(CC0|CC BY(?:-SA)?(?: [1-4]\.0)?|Public domain|PD|PDM)/i.test(license);
  const restricted = /\bNC\b|\bND\b|NonCommercial|NoDerivatives/i.test(license);
  return free && !restricted ? {license, url} : null;
}

export function chooseCommons(data, used = new Set()) {
  const pages = Object.values(data?.query?.pages || {});
  const options = pages.flatMap((page) => {
    const info = page.imageinfo?.[0];
    if (!info || !['image/jpeg', 'image/png', 'image/webp'].includes(info.mime)) return [];
    const terms = licensedCommons(info.extmetadata || {});
    const url = info.thumburl || info.url;
    if (!terms || !url || used.has(url) || (info.width || 0) < 800 ||
        (info.height || 0) < 600) return [];
    return [{provider: 'wikimedia', url, pageUrl: info.descriptionurl || 'https://commons.wikimedia.org',
      title: page.title, attribution: stripHtml(info.extmetadata?.Artist?.value || page.title),
      license: terms.license, licenseUrl: terms.url}];
  });
  return options[0] || null;
}

export function choosePexels(data, used = new Set()) {
  const photos = Array.isArray(data?.photos) ? data.photos : [];
  for (const photo of photos) {
    const url = photo.src?.large2x || photo.src?.large;
    if (!url || used.has(url) || !photo.url || !photo.photographer) continue;
    return {provider: 'pexels', url, pageUrl: photo.url, title: photo.alt || 'Real stock photo',
      attribution: 'Photo by ' + photo.photographer + ' / Pexels',
      license: 'Pexels License', licenseUrl: 'https://www.pexels.com/license/'};
  }
  return null;
}

async function searchPhotos(query, used, fetchImpl = fetch) {
  const key = process.env.PEXELS_API_KEY?.trim();
  if (key) {
    const pexels = new URL('https://api.pexels.com/v1/search');
    pexels.searchParams.set('query', query);
    pexels.searchParams.set('per_page', '20');
    pexels.searchParams.set('orientation', 'portrait');
    const res = await fetchImpl(pexels, {headers: {Authorization: key}, signal: AbortSignal.timeout(20000)});
    if (!res.ok) throw new Error('Pexels search returned HTTP ' + res.status);
    const item = choosePexels(await res.json(), used);
    if (item) return item;
    throw new Error('No licensed Pexels photos found for: ' + query);
  }
  // MediaWiki generator search searches file pages, not fabricated URLs.
  const commons = new URL('https://commons.wikimedia.org/w/api.php');
  for (const [k, v] of Object.entries({
    action: 'query', format: 'json', generator: 'search', gsrsearch: 'filetype:bitmap ' + query,
    gsrnamespace: '6', gsrlimit: '30', prop: 'imageinfo',
    iiprop: 'url|size|mime|extmetadata', iiurlwidth: '1600'
  })) commons.searchParams.set(k, v);
  const res = await fetchImpl(commons, {
    headers: {'User-Agent': 'BravePaperReel/1.0 (https://github.com/Brave-developments/remotion-Insta-studio)',
      Accept: 'application/json'},
    signal: AbortSignal.timeout(20000)
  });
  if (!res.ok) throw new Error('Wikimedia Commons returned HTTP ' + res.status);
  const selected = chooseCommons(await res.json(), used);
  if (!selected) throw new Error('No usable freely licensed Commons photo for "' + query +
    '". Try a more specific photoQuery or use a Flashcut image.');
  return selected;
}

async function fetchTrustedImage(address, fetchImpl = fetch) {
  let url = new URL(address);
  for (let hop = 0; hop <= 3; hop++) {
    if (url.protocol !== 'https:' || !ALLOWED_HOSTS.has(url.hostname) || url.username || url.password) {
      throw new Error('Refused unsafe external photo host: ' + url.hostname);
    }
    const response = await fetchImpl(url, {redirect: 'manual', signal: AbortSignal.timeout(30000),
      headers: {'User-Agent': 'BravePaperReel/1.0 (https://github.com/Brave-developments/remotion-Insta-studio)'}});
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const next = response.headers.get('location');
      if (!next) throw new Error('Image redirect has no location.');
      url = new URL(next, url);
      continue;
    }
    if (!response.ok || !response.body) throw new Error('Photo download returned HTTP ' + response.status);
    const mime = response.headers.get('content-type')?.split(';')[0]?.trim().toLowerCase();
    const ext = mime === 'image/jpeg' ? '.jpg' : mime === 'image/png' ? '.png' :
      mime === 'image/webp' ? '.webp' : null;
    if (!ext) throw new Error('Not an accepted photograph content type: ' + mime);
    if (Number(response.headers.get('content-length') || 0) > MAX_BYTES) throw new Error('Photo larger than 18MB');
    const chunks = [];
    let size = 0;
    for await (const chunk of response.body) {
      size += chunk.byteLength;
      if (size > MAX_BYTES) throw new Error('Photo larger than 18MB');
      chunks.push(Buffer.from(chunk));
    }
    const bytes = Buffer.concat(chunks);
    const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const png = bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
    const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
    if (!(ext === '.jpg' && jpeg || ext === '.png' && png || ext === '.webp' && webp)) {
      throw new Error('Image signature does not match content type.');
    }
    return {bytes, ext};
  }
  throw new Error('Too many redirects for image.');
}

function inside(root, relative) {
  if (typeof relative !== 'string' || path.isAbsolute(relative)) throw new Error('Asset file path is unsafe');
  const file = path.resolve(root, relative);
  if (!file.startsWith(path.resolve(root) + path.sep)) throw new Error('Asset escapes public folder');
  return file;
}

async function getFlashcutAsset(id, directory) {
  if (!directory) throw new Error('flashcutAssetId needs --flashcut-dir.');
  const root = path.resolve(directory);
  const indexPath = path.join(root, 'public', 'media', 'index.json');
  const data = JSON.parse(await fs.readFile(indexPath, 'utf8'));
  const asset = (Array.isArray(data) ? data : data.assets || []).find(a => a.id === id);
  if (!asset || asset.kind !== 'image' || !asset.file) {
    throw new Error('Flashcut image ID not found: ' + id);
  }
  const filename = inside(path.join(root, 'public'), asset.file);
  const bytes = await fs.readFile(filename);
  if (bytes.length < 8 || bytes.length > MAX_BYTES) throw new Error('Invalid Flashcut image size.');
  const ext = path.extname(filename).toLowerCase();
  if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) throw new Error('Unsupported Flashcut image.');
  return {bytes, ext: ext === '.jpeg' ? '.jpg' : ext,
    provenance: {provider: 'flashcut', title: asset.name,
      pageUrl: asset.provenance?.pageUrl || '',
      attribution: asset.provenance?.attribution || 'Imported by Flashcut AI — rights review required',
      license: asset.provenance?.licence || 'unknown',
      licenseUrl: asset.provenance?.pageUrl || ''}};
}

async function prepare(brief, flashcutDir) {
  const {totalSeconds} = validateBrief(brief);
  await fs.mkdir(DEST, {recursive: true});
  const used = new Set();
  const credits = [];
  const scenes = [];
  for (const original of brief.scenes) {
    const scene = {...original};
    const needed = ['photo', 'collage', 'browser'].includes(scene.layout);
    for (const suffix of ['', '2']) {
      if (suffix === '2' && scene.layout !== 'collage') continue;
      if (!needed && !scene['photoQuery' + suffix] && !scene['flashcutAssetId' + suffix]) continue;
      let picked, data;
      if (scene['flashcutAssetId' + suffix]) {
        const local = await getFlashcutAsset(scene['flashcutAssetId' + suffix], flashcutDir);
        picked = local.provenance;
        data = {bytes: local.bytes, ext: local.ext};
      } else {
        picked = await searchPhotos(scene['photoQuery' + suffix], used);
        used.add(picked.url);
        data = await fetchTrustedImage(picked.url);
      }
      const filename = slug(scene.id) + (suffix ? '-2' : '') + data.ext;
      const target = path.join(DEST, filename);
      await fs.writeFile(target, data.bytes);
      scene['image' + suffix] = 'paper/assets/' + filename;
      if (!suffix) {
        scene.attribution ||= picked.attribution;
        scene.sourceUrl ||= picked.pageUrl;
      }
      credits.push({sceneId: scene.id, image: scene['image' + suffix], provider: picked.provider,
        title: picked.title, attribution: picked.attribution, pageUrl: picked.pageUrl,
        license: picked.license, licenseUrl: picked.licenseUrl,
        rightsStatus: 'review-required'});
    }
    // Remove planning-only selectors; rendered data is portable local JSON.
    delete scene.photoQuery;
    delete scene.photoQuery2;
    delete scene.flashcutAssetId;
    delete scene.flashcutAssetId2;
    scenes.push(scene);
  }
  const job = {title: brief.title, fps: 30, width: 1080, height: 1920, totalSeconds, scenes, credits};
  await fs.mkdir(CONTENT, {recursive: true});
  await fs.writeFile(path.join(CONTENT, 'generated.json'), JSON.stringify(job, null, 2) + '\n');
  await fs.writeFile(path.join(CONTENT, 'credits.json'), JSON.stringify(credits, null, 2) + '\n');
  console.log('Prepared ' + scenes.length + ' paper scenes (' + credits.length +
    ' real local images). Sources: content/paper/credits.json');
}

async function exportToFlashcut(directory) {
  if (!directory) throw new Error('--export-flashcut-dir requires a directory path.');
  const dest = path.join(path.resolve(directory), 'public', 'media', 'paper');
  const data = JSON.parse(await fs.readFile(path.join(CONTENT, 'generated.json'), 'utf8'));
  await fs.mkdir(dest, {recursive: true});
  for (const credit of data.credits || []) {
    const source = inside(path.join(ROOT, 'public'), credit.image);
    await fs.copyFile(source, path.join(dest, path.basename(source)));
  }
  await fs.writeFile(path.join(dest, 'paper-credits.json'), JSON.stringify(data.credits || [], null, 2) + '\n');
  console.log('Copied photos and provenance to Flashcut: ' + dest);
  console.log('In Flashcut AI, run POST /api/assets/sync (or click Sync Library) to index the files.');
}

async function main() {
  const args = process.argv.slice(2);
  const option = (flag) => {const i = args.indexOf(flag); return i < 0 ? null : args[i + 1];};
  const exportDir = option('--export-flashcut-dir');
  if (exportDir) return exportToFlashcut(exportDir);
  const briefPath = path.resolve(ROOT, option('--brief') || 'content/paper/example.json');
  const brief = JSON.parse(await fs.readFile(briefPath, 'utf8'));
  await prepare(brief, option('--flashcut-dir'));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(e => {console.error('Paper media error: ' + e.message); process.exitCode = 1;});
}
