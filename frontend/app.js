// Base URL of the backend API (the server.js file you're running on port 3000)
const API_URL = 'http://localhost:3000/api/products';

const productsEl = document.getElementById('products');
const formEl = document.getElementById('product-form');

// ---- Load and render all products ----
async function loadProducts() {
  try {
    const res = await fetch(API_URL);
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    productsEl.innerHTML = `<p style="color:red">Could not reach the server. Is server.js running?</p>`;
  }
}

function renderProducts(products) {
  if (products.length === 0) {
    productsEl.innerHTML = '<p>No products yet. Add one above!</p>';
    return;
  }

  productsEl.innerHTML = products
    .map(
      (p) => `
      <div class="product-card">
        <div class="product-info">
          <h3>${escapeHTML(p.name)}</h3>
          <span>Sold by ${escapeHTML(p.seller)} · Stock: ${p.stock}</span>
        </div>
        <div>
          <span class="price">₹${p.price}</span>
          <button class="delete-btn" data-id="${p.id}">Delete</button>
        </div>
      </div>`
    )
    .join('');

  // wire up delete buttons
  document.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
  });
}

// Basic escaping so a product name can't break the page layout
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ---- Add a new product ----
formEl.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newProduct = {
    name: document.getElementById('name').value,
    price: document.getElementById('price').value,
    stock: document.getElementById('stock').value,
    seller: document.getElementById('seller').value,
  };

  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProduct),
  });

  formEl.reset();
  loadProducts();
});

// ---- Delete a product ----
async function deleteProduct(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  loadProducts();
}

// Initial load
loadProducts();
