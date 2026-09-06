# Mini Marketplace

A small full-stack marketplace demo: sellers list products, buyers browse and
remove them. Built to practice the exact skills a marketplace/e-commerce
engineering role cares about — REST APIs, CRUD, and a frontend that talks to
a backend over HTTP.

## Tech Stack
- **Backend:** Node.js (built-in `http` module — no framework, so you fully
  understand every request/response instead of hiding behind Express magic)
- **Data storage:** a JSON file (`products.json`) acting as a simple database
- **Frontend:** plain HTML, CSS, JavaScript (`fetch` API)

## How to run it

1. Start the backend:
   ```
   cd backend
   node server.js
   ```
   You should see: `Mini Marketplace API running at http://localhost:3000`

2. Open `frontend/index.html` directly in your browser (double-click it, or
   use VS Code's "Live Server" extension).

3. You'll see the product list load from the API. Try adding a product and
   deleting one — watch `backend/products.json` change as you do it.

## API Endpoints

| Method | Route               | What it does           |
|--------|---------------------|-------------------------|
| GET    | /api/products       | List all products       |
| GET    | /api/products/:id   | Get one product         |
| POST   | /api/products       | Add a new product        |
| PUT    | /api/products/:id   | Update a product         |
| DELETE | /api/products/:id   | Remove a product         |

## Why it's built this way (for when you explain it in an interview)

- **No framework on the backend** — this was deliberate. Express hides a lot
  of what's actually happening (routing, request parsing, headers). Building
  it raw means you can explain *how* an API works, not just that you called
  a library.
- **JSON file instead of a real database** — a stand-in for a real DB. The
  read/write functions (`readProducts` / `writeProducts`) are isolated in one
  place, so swapping in a real database (SQLite/PostgreSQL) later only means
  changing those two functions — nothing else in the app needs to change.
  This separation is a basic form of the same thinking real backend systems
  use.
- **CORS headers are set manually** — because the frontend (opened as a file)
  and backend (localhost:3000) are different origins, the browser blocks
  requests unless the server explicitly allows it. This is a real thing you
  will hit in actual marketplace/vendor-portal work.

## Ideas to extend it (do at least one before your interview — it gives you
something to talk about that you built *beyond* the base version)

- Add a search/filter box on the frontend (filter by seller or price range)
- Add simple validation: don't allow negative price or stock
- Add categories to products (e.g. Electronics, Stationery)
- Swap `products.json` for SQLite using the `better-sqlite3` package
