const productList = document.getElementById('productList');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

function displayProducts(products) {
  if (!products || (Array.isArray(products) && products.length === 0)) {
    productList.innerHTML = '<p>Nenhum produto encontrado.</p>';
    return;
  }

  // Se veio só um produto, transforma em array para padronizar o loop
  if (!Array.isArray(products)) {
    products = [products];
  }

  let html = '<ul style="list-style-type:none; padding:0;">';
  products.forEach((p) => {
    html += `<li style="background:#f9f9f9; margin-bottom:10px; padding:10px; border-radius:6px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
      <div><strong>Código:</strong> ${p.codigo}</div>
      <div><strong>Nome do produto:</strong> ${p.nome}</div>
      <div><strong>Categoria:</strong> ${p.categoria || '-'}</div>
      <div><strong>Descrição:</strong> ${p.descricao || '-'}</div>
      <div><strong>Preço:</strong> R$ ${parseFloat(p.preco).toFixed(2)}</div>
      <div><strong>Estoque:</strong> <em>${p.estoque}</em></div>
      <div><strong>Local:</strong> ${p.local || '-'}</div>
    </li>`;
  });
  html += '</ul>';
  productList.innerHTML = html;
}

searchForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const codigo = searchInput.value.trim();

  if (!codigo) {
    productList.innerHTML = '<p>Por favor, digite o código do produto.</p>';
    return;
  }

  try {
    const response = await fetch(`/api/produtos/codigo/${encodeURIComponent(codigo)}`);

    if (response.status === 404) {
      productList.innerHTML = '<p>Produto não encontrado.</p>';
      return;
    }

    if (!response.ok) {
      productList.innerHTML = `<p>Erro ao buscar produto: ${response.statusText}</p>`;
      return;
    }

    const produto = await response.json();

    // Aqui, se quiser forçar atualização do estoque, certifique-se que o backend já atualizou,
    // e só depois dessa busca a tela reflete o estoque atualizado.
    displayProducts(produto);

  } catch (error) {
    productList.innerHTML = '<p>Erro ao buscar produto. Tente novamente.</p>';
    console.error('Erro na busca do produto:', error);
  }
});
