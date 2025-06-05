// Formatação moeda BR
function formatCurrency(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const productCache = {};
async function getProductByCode(code) {
  if (productCache[code]) return productCache[code];
  try {
    const res = await fetch(`/api/produtos/codigo/${encodeURIComponent(code)}`);
    if (!res.ok) return null;
    const product = await res.json();
    productCache[code] = product;
    return product;
  } catch {
    return null;
  }
}

async function deleteSale(id) {
  if (!confirm('Tem certeza que deseja excluir esta venda?')) return;
  try {
    const response = await fetch(`/api/vendas/${id}`, { method: 'DELETE' });
    if (!response.ok) {
      alert('Erro ao excluir a venda.');
      return;
    }
    alert('Venda excluída com sucesso.');
    await loadSales();
  } catch (error) {
    console.error('Erro ao excluir venda:', error);
    alert('Erro ao excluir a venda.');
  }
}

async function loadSales() {
  const response = await fetch('/api/vendas');
  if (!response.ok) {
    alert('Erro ao carregar vendas');
    return;
  }
  const sales = await response.json();
  const tbody = document.getElementById('salesTableBody');
  tbody.innerHTML = '';

  for (const sale of sales) {
    const product = await getProductByCode(sale.produto);
    const productName = product ? product.nome : '(Produto não encontrado)';
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${sale.data}</td>
      <td>${sale.produto}</td>
      <td>${productName}</td>
      <td>${sale.quantidade}</td>
      <td>${formatCurrency(Number(sale.total))}</td>
      <td><button onclick="deleteSale('${sale.id}')">Excluir</button></td>
    `;
    tbody.appendChild(tr);
  }
}

async function filterSales() {
  const searchTerm = document.getElementById('productSearch').value.trim().toLowerCase();
  const dateFilter = document.getElementById('dateFilter').value;
  const response = await fetch('/api/vendas');
  if (!response.ok) {
    alert('Erro ao carregar vendas');
    return;
  }
  const sales = await response.json();
  const tbody = document.getElementById('salesTableBody');
  tbody.innerHTML = '';

  for (const sale of sales) {
    if (dateFilter && sale.data !== dateFilter) continue;

    const product = await getProductByCode(sale.produto);
    const productName = product ? product.nome : '';

    if (
      sale.produto.toString().toLowerCase().includes(searchTerm) ||
      productName.toLowerCase().includes(searchTerm)
    ) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${sale.data}</td>
        <td>${sale.produto}</td>
        <td>${productName}</td>
        <td>${sale.quantidade}</td>
        <td>${formatCurrency(Number(sale.total))}</td>
        <td><button onclick="deleteSale('${sale.id}')">Excluir</button></td>
      `;
      tbody.appendChild(tr);
    }
  }
}

document.getElementById('searchButton').addEventListener('click', filterSales);
document.getElementById('filterDateButton').addEventListener('click', filterSales);

window.onload = loadSales;
