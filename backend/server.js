/**
 * Mini Marketplace API
 * ---------------------
 * A tiny REST API for a marketplace-style app: sellers can list products,
 * buyers can browse and view them.
 *
 * Built with only Node.js core modules (http, fs) — no npm install needed.
 * Data is stored in products.json, acting as a simple flat-file database.
 *
 * Endpoints:
 *   GET    /api/products         -> list all products
 *   GET    /api/products/:id     -> get one product
 *   POST   /api/products         -> add a new product
 *   PUT    /api/products/:id     -> update a product (e.g. change stock/price)
 *   DELETE /api/products/:id     -> remove a product
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const DB_FILE = path.join(__dirname, 'products.json');

// ---- tiny "database" helpers ----

function readProducts() {
  if (!fs.existsSync(DB_FILE)) return [];
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return raw ? JSON.parse(raw) : [];
}

function writeProducts(products) {
  fs.writeFileSync(DB_FILE, JSON.stringify(products, null, 2));
}

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // lets the frontend call this from a different port
  });
  res.end(JSON.stringify(data));
}

function getBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
  });
}

// ---- request router ----

const server = http.createServer(async (req, res) => {
  const url = req.url.split('?')[0];
  const parts = url.split('/').filter(Boolean); // e.g. ['api','products','3']

  // CORS preflight support
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  if (parts[0] !== 'api' || parts[1] !== 'products') {
    return sendJSON(res, 404, { error: 'Not found' });
  }

  const products = readProducts();
  const id = parts[2] ? Number(parts[2]) : null;

  try {
    // GET /api/products
    if (req.method === 'GET' && !id) {
      return sendJSON(res, 200, products);
    }

    // GET /api/products/:id
    if (req.method === 'GET' && id) {
      const product = products.find((p) => p.id === id);
      if (!product) return sendJSON(res, 404, { error: 'Product not found' });
      return sendJSON(res, 200, product);
    }

    // POST /api/products
    if (req.method === 'POST' && !id) {
      const body = await getBody(req);
      if (!body.name || !body.price) {
        return sendJSON(res, 400, { error: 'name and price are required' });
      }
      const newProduct = {
        id: products.length ? Math.max(...products.map((p) => p.id)) + 1 : 1,
        name: body.name,
        price: Number(body.price),
        stock: Number(body.stock) || 0,
        seller: body.seller || 'unknown',
      };
      products.push(newProduct);
      writeProducts(products);
      return sendJSON(res, 201, newProduct);
    }

    // PUT /api/products/:id
    if (req.method === 'PUT' && id) {
      const body = await getBody(req);
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return sendJSON(res, 404, { error: 'Product not found' });
      products[index] = { ...products[index], ...body, id };
      writeProducts(products);
      return sendJSON(res, 200, products[index]);
    }

    // DELETE /api/products/:id
    if (req.method === 'DELETE' && id) {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return sendJSON(res, 404, { error: 'Product not found' });
      const [removed] = products.splice(index, 1);
      writeProducts(products);
      return sendJSON(res, 200, removed);
    }

    return sendJSON(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    return sendJSON(res, 500, { error: 'Server error', details: err.message });
  }
});

server.listen(PORT, () => {
  console.log(`Mini Marketplace API running at http://localhost:${PORT}`);
});
