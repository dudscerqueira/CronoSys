const form = document.getElementById('salesForm');
const productCodeInput = document.getElementById('productCode');
const productNameInput = document.getElementById('productName');
const priceInput = document.getElementById('price');
const quantityInput = document.getElementById('quantity');
const totalInput = document.getElementById('total');

function formatCurrency(value) {
  if (isNaN(value)) return '';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function parseCurrency(str) {
  // Converte "R$ 1.234,56" para número 1234.56
  if (!str) return 0;
  return parseFloat(str.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
}

// Atualiza o total baseado no preço e quantidade
function updateTotal() {
  const price = parseCurrency(priceInput.value);
  const quantity = parseInt(quantityInput.value, 10) || 0;
  const total = price * quantity;
  totalInput.value = formatCurrency(total);
  totalInput.dataset.raw = total.toFixed(2);
}

// Quando o usuário sai do campo código, buscar produto no backend
productCodeInput.addEventListener('blur', async () => {
  const code = productCodeInput.value.trim();
  if (!code) {
    productNameInput.value = '';
    priceInput.value = '';
    totalInput.value = '';
    return;
  }

  try {
    const response = await fetch(`/api/produtos/codigo/${encodeURIComponent(code)}`);
    if (!response.ok) {
      alert('Produto não encontrado');
      productNameInput.value = '';
      priceInput.value = '';
      totalInput.value = '';
      return;
    }
    const produto = await response.json();

    productNameInput.value = produto.nome || '';
    priceInput.value = formatCurrency(produto.preco);
    quantityInput.value = '1';  // default 1
    updateTotal();
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    alert('Erro ao buscar produto');
  }
});

// Atualiza total quando mudar quantidade
quantityInput.addEventListener('input', () => {
  updateTotal();
});

// No envio do formulário
form.addEventListener('submit', async function (event) {
  event.preventDefault();

  const saleDate = form.saleDate.value;
  const productCode = productCodeInput.value.trim();
  const quantity = parseInt(quantityInput.value, 10);
  const total = parseFloat(totalInput.dataset.raw || totalInput.value);

  if (!saleDate || !productCode || !quantity || !total) {
    alert('Por favor, preencha todos os campos corretamente.');
    return;
  }

  try {
    const response = await fetch('/api/vendas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: saleDate,
        produto: productCode,
        quantidade: quantity,
        total: total
      })
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.message || 'Erro ao salvar venda');
      return;
    }

    alert(result.message);
    form.reset();
    productNameInput.value = '';
    priceInput.value = '';
    totalInput.value = '';
  } catch (error) {
    console.error('Erro:', error);
    alert('Falha ao salvar a venda. Tente novamente.');
  }
});
