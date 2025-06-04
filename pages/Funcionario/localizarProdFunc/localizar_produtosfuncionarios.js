const productList = document.getElementById('productList');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

let products = [];

function displayProducts(productsToDisplay) {
  if (productsToDisplay.length === 0) {
    productList.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }
  let html = '<ul style="list-style-type:none; padding:0;">';
  productsToDisplay.forEach((p, index) => {
    html += `<li style="background:#f9f9f9; margin-bottom:10px; padding:10px; border-radius:6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); display:flex; justify-content: space-between; align-items: center;">
      <div style="min-width: 70%;">
        <div><strong>Código:</strong> ${p.produto_id}</div>
        <div><strong>Nome do produto:</strong> ${p.nome}</div>
        <div><strong>Descrição:</strong> ${p.descricao}</div>
        <div><strong>Preço:</strong> R$ ${p.preco}</div>
        <div><strong>Quantidade:</strong> <em>${p.quantidade_estoque}</em></div>
      </div>
    </li>`;
  });
  html += '</ul>';
  productList.innerHTML = html;
}

function filterProducts(query) {
  if (!query) return products;
  return products.filter(p => p.nome.toLowerCase().includes(query.toLowerCase()));
}

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const query = searchInput.value.trim();
  const filtered = filterProducts(query);
  displayProducts(filtered);
});

function fetchProducts() {
  fetch('http://localhost:3000/api/produtos')
    .then(response => response.json())
    .then(data => {
      products = data;
      displayProducts(products);
    })
    .catch(error => {
      productList.innerHTML = '<p>Erro ao carregar produtos.</p>';
      console.error('Error fetching products:', error);
    });
}

// Fetch and display products on page load
fetchProducts();
