# Mini Marketplace

A small full-stack marketplace application where sellers can list products
and buyers can browse and remove them. Built as a hands-on way to learn REST
APIs, backend/frontend communication, and basic CRUD operations.

## Tech Stack
- **Backend:** Node.js (built using the core `http` module, without a
  framework, to understand request handling from the ground up)
- **Data storage:** a JSON file (`products.json`) used as a simple database
- **Frontend:** plain HTML, CSS, and JavaScript (using the `fetch` API)

## Features
- View all available products
- Add a new product with name, price, stock, and seller
- Delete a product
- Data persists in `products.json` between runs

## How to Run

1. Start the backend:
   ```
   cd backend
   node server.js
   ```
   You should see: `Mini Marketplace API running at http://localhost:3000`

2. Open `frontend/index.html` directly in your browser (double-click it, or
   use VS Code's "Live Server" extension).

3. The product list loads from the API. Try adding a product and deleting
   one — `backend/products.json` updates as you do it.

## API Endpoints

| Method | Route               | Description             |
|--------|---------------------|--------------------------|
| GET    | /api/products       | List all products        |
| GET    | /api/products/:id   | Get a single product     |
| POST   | /api/products       | Add a new product        |
| PUT    | /api/products/:id   | Update a product         |
| DELETE | /api/products/:id   | Remove a product         |

## Design Decisions

- **No backend framework:** The API is built directly on Node's `http`
  module rather than Express, to understand routing, request parsing, and
  headers at a lower level before relying on a framework to handle it.
- **JSON file as storage:** Acts as a lightweight stand-in for a real
  database. The read/write logic (`readProducts` / `writeProducts`) is
  isolated in dedicated functions, so switching to a real database later
  (e.g. SQLite or MongoDB) would only require changing those two functions.
- **Manual CORS handling:** Since the frontend runs as a local file and the
  backend runs on `localhost:3000`, they're treated as different origins by
  the browser. CORS headers are set explicitly so the frontend can call the
  API.

## Possible Improvements
- Add search/filter functionality (by seller or price range)
- Add input validation (e.g. disallow negative price or stock)
- Add product categories
- Replace the JSON file with a real database (SQLite/MongoDB)
- Rebuild the frontend using React
