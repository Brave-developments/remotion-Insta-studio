#!/usr/bin/env node
/**
 * Live stats + preview server for the season build.
 *
 *   node scripts/stats-server.cjs            # http://localhost:3023
 *   node scripts/stats-server.cjs --port=4000
 *
 * Serves:
 *   /            SEASON-STATS.html (the dashboard)
 *   /api/stats   live counts computed from project.json + reels.json + out/*.mp4
 *                + studio-kit/season-voiceover-status.json
 *   /files/<LAB>/<relpath>   rendered mp4s, png thumbnails and wav voice-overs,
 *                with HTTP Range support so <video>/<audio> can seek.
 *
 * Everything is read fresh on every request, so the page reflects the pipeline
 * as it runs. No dependencies.
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const {spawnSync} = require('child_process');

const root = path.resolve(__dirname, '..');
const htmlPath = path.join(root, 'SEASON-STATS.html');
const statusPath = path.join(root, 'studio-kit', 'season-voiceover-status.json');
const stopFlag = path.join(root, 'studio-kit', 'season-stop.flag');
const arg = (name, fallback) => {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split('=').slice(1).join('=') : fallback;
};
const PORT = Number(arg('port', process.env.STATS_PORT || 3023));

const PROJECTS = ['RETENTION-LAB', 'UI-MOTION-LAB', 'BUILDMODE-LAB'];

const readJson = (p, fallback) => {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return fallback;
  }
};

/** Per-project stats: metadata from project.json, progress from reels/out. */
function projectStats(dir) {
  const meta = readJson(path.join(root, 'projects', dir, 'project.json'), {});
  const reels = readJson(path.join(root, 'projects', dir, 'season', 'reels.json'), {reels: []}).reels;
  const outDir = path.join(root, 'projects', dir, 'out');
  const outFiles = new Set(fs.existsSync(outDir) ? fs.readdirSync(outDir) : []);
  const list = reels.map((r) => ({
    id: r.id,
    title: r.title || r.id,
    voiced: Boolean(r.audio),
    rendered: outFiles.has(`${r.id}.mp4`),
    thumb: outFiles.has(`${r.id}.png`),
    audio: r.audio || null,
    duration: r.audioSeconds || r.durationSeconds || null,
    scenes: Array.isArray(r.scenes) ? r.scenes.length : null,
  }));
  return {
    id: dir,
    name: meta.name || dir,
    position: meta.position || '',
    bank: meta.bank || '',
    port: meta.port || null,
    accent: (meta.palette && meta.palette.accent) || '#888888',
    reels: list.length,
    voiced: list.filter((r) => r.voiced).length,
    rendered: list.filter((r) => r.rendered).length,
    scenes: list.reduce((n, r) => n + (r.scenes || 0), 0),
    items: list,
  };
}

/** Are the pipeline node processes alive? Cached 5s (the query costs ~1s). */
let pipeCache = {at: 0, running: false, pids: []};
function pipelineRunning() {
  if (Date.now() - pipeCache.at < 5000) return pipeCache;
  const result = spawnSync(
    'powershell',
    [
      '-NoProfile',
      '-Command',
      'Get-CimInstance Win32_Process | Where-Object { $_.Name -eq "node.exe" -and $_.CommandLine -match "render-waves|generate-season-voiceovers|render-bank" } | ForEach-Object { $_.ProcessId }',
    ],
    {encoding: 'utf8'},
  );
  const pids = (result.stdout || '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => /^\d+$/.test(s))
    .map(Number);
  pipeCache = {at: Date.now(), running: pids.length > 0, pids};
  return pipeCache;
}

function stats() {
  const projects = PROJECTS.map(projectStats);
  const vo = readJson(statusPath, {expected: 117, completed: 0, status: 'not started'});
  const totals = projects.reduce(
    (t, p) => ({
      reels: t.reels + p.reels,
      voiced: t.voiced + p.voiced,
      rendered: t.rendered + p.rendered,
      scenes: t.scenes + p.scenes,
    }),
    {reels: 0, voiced: 0, rendered: 0, scenes: 0},
  );
  const pipe = pipelineRunning();
  return {
    updatedAt: new Date().toISOString(),
    voiceover: {
      completed: vo.completed || 0,
      expected: vo.expected || totals.reels,
      status: vo.status || 'unknown',
      updatedAt: vo.updatedAt || null,
    },
    pipeline: {
      running: pipe.running,
      pids: pipe.pids,
      stopFlag: fs.existsSync(stopFlag),
    },
    totals,
    projects,
  };
}

const MIME = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.json': 'application/json',
};

/** Serve a project file (mp4/png/wav), range-capable, jailed to the repo root. */
function serveFile(req, res, rel) {
  const target = path.resolve(root, rel);
  if (target !== root && !target.startsWith(root + path.sep)) {
    res.writeHead(403, {'Content-Type': 'text/plain'});
    res.end('forbidden');
    return;
  }
  fs.stat(target, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end('not found');
      return;
    }
    const mime = MIME[path.extname(target).toLowerCase()] || 'application/octet-stream';
    const base = {
      'Content-Type': mime,
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'no-cache',
    };
    const range = req.headers.range;
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range);
    if (m && (m[1] || m[2])) {
      let start = m[1] ? parseInt(m[1], 10) : 0;
      let end = m[2] ? parseInt(m[2], 10) : st.size - 1;
      if (start >= st.size) {
        res.writeHead(416, {'Content-Range': `bytes */${st.size}`});
        res.end();
        return;
      }
      end = Math.min(end, st.size - 1);
      res.writeHead(206, {
        ...base,
        'Content-Range': `bytes ${start}-${end}/${st.size}`,
        'Content-Length': end - start + 1,
      });
      fs.createReadStream(target, {start, end}).pipe(res);
      return;
    }
    res.writeHead(200, {...base, 'Content-Length': st.size});
    fs.createReadStream(target).pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const url = (req.url || '/').split('?')[0];
  if (url === '/api/stats') {
    let body;
    try {
      body = JSON.stringify(stats());
    } catch (err) {
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({error: String(err)}));
      return;
    }
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
      'Access-Control-Allow-Origin': '*',
    });
    res.end(body);
    return;
  }
  if (url.startsWith('/files/')) {
    let rel;
    try {
      rel = decodeURIComponent(url.slice('/files/'.length));
    } catch {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('bad path');
      return;
    }
    serveFile(req, res, rel);
    return;
  }
  if (url === '/' || url === '/index.html') {
    try {
      const html = fs.readFileSync(htmlPath);
      res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store'});
      res.end(html);
    } catch {
      res.writeHead(404, {'Content-Type': 'text/plain'});
      res.end(`missing ${htmlPath}`);
    }
    return;
  }
  res.writeHead(404, {'Content-Type': 'text/plain'});
  res.end('not found');
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`season stats: http://localhost:${PORT}`);
});
