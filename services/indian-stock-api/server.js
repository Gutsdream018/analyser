import http from 'node:http';
import app from './src/index.js';

const PORT = parseInt(process.env.INDIAN_STOCK_API_PORT || '5001', 10);
const HOST = process.env.INDIAN_STOCK_API_HOST || '127.0.0.1';

const server = http.createServer(async (req, res) => {
  try {
    const fullUrl = `http://${req.headers.host || '127.0.0.1:' + PORT}${req.url}`;
    const request = new Request(fullUrl, {
      method: req.method,
      headers: req.headers,
    });
    const response = await app.fetch(request);
    
    const headers = {};
    for (const [key, value] of response.headers.entries()) {
      headers[key] = value;
    }
    res.writeHead(response.status, headers);
    const body = await response.text();
    res.end(body);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', message: err.message }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Indian-Stock-Market-API v3 running on http://${HOST}:${PORT}`);
});
