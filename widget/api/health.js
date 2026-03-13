const http = require('http');

function writeCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');
}

module.exports = (req, res) => {
  writeCorsHeaders(res);
  const parsed = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = (parsed.pathname || '/').replace(/\/+$/, '');

  if (pathname !== '' && pathname !== '/' && pathname !== '/api/health') {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: 'Not found' }));
    return;
  }

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  res.statusCode = 200;
  res.end(JSON.stringify({ status: 'ok' }));
};
