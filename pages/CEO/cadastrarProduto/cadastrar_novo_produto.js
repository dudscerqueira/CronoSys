const form = document.querySelector('form');
const precoInput = document.getElementById('preco');
const cancelButton = document.querySelector('button.cancel');

function formatCurrency(value) {
  // Remove todos os caracteres que não são dígitos
  let numericValue = value.replace(/\D/g, "");

  // Converte para número e divide por 100 para centavos
  let number = parseInt(numericValue, 10);
  if (isNaN(number)) {
    number = 0;
  }

  // Formata como moeda BRL
  let formatted = (number / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  return formatted;
}

precoInput.addEventListener('input', function(e) {
  const cursorPosition = precoInput.selectionStart;
  const originalLength = precoInput.value.length;

  precoInput.value = formatCurrency(precoInput.value);

  const newLength = precoInput.value.length;
  precoInput.selectionEnd = cursorPosition + (newLength - originalLength);
});

cancelButton.addEventListener('click', function() {
  form.reset();
});

form.addEventListener('submit', function(event) {
  event.preventDefault();

  // Limpa o preço para número decimal (ex: R$ 12,34 -> 12.34)
  const rawPreco = precoInput.value.replace(/[^0-9]/g, '');
  const preco = (parseInt(rawPreco, 10) / 100).toFixed(2);

  // Pega os valores do formulário
  const product = {
    codigo: document.getElementById('codigo').value.trim(),
    nome: document.getElementById('nomeProduto').value.trim(),
    categoria: document.getElementById('categoria').value,
    descricao: document.getElementById('descricao').value.trim(),
    preco: preco,
    estoque: parseInt(document.getElementById('quantidade').value.trim(), 10),
    local: document.getElementById('local').value
  };

  // Validação básica
  if (!product.codigo) {
    alert('Por favor, preencha o campo Código.');
    return;
  }
  if (!product.nome) {
    alert('Por favor, preencha o campo Nome do Produto.');
    return;
  }
  if (!product.categoria) {
    alert('Por favor, selecione uma categoria.');
    return;
  }
  if (!product.descricao) {
    alert('Por favor, preencha a descrição.');
    return;
  }
  if (isNaN(product.preco) || product.preco <= 0) {
    alert('Por favor, preencha um preço válido.');
    return;
  }
  if (isNaN(product.estoque) || product.estoque < 0) {
    alert('Por favor, preencha uma quantidade válida.');
    return;
  }
  if (!product.local) {
    alert('Por favor, selecione um local.');
    return;
  }

  // Enviar para o backend
  fetch('http://localhost:3000/api/produtos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao cadastrar produto');
    }
    return response.json();
  })
  .then(data => {
    alert('Produto cadastrado com sucesso!');
    form.reset();
  })
  .catch(error => {
    alert('Erro ao cadastrar produto: ' + error.message);
  });
});
