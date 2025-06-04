const form = document.getElementById('salesForm');

function formatCurrency(input) {
    let value = input.value;

    value = value.replace(/[^\d,\.]/g, '');
    value = value.replace(/,/g, '.');

    let floatValue = parseFloat(value);

    if (isNaN(floatValue)) {
        input.value = '';
        return;
    }

    // Deixa sem formatação para enviar valor numérico
    input.dataset.raw = floatValue.toFixed(2);

    input.value = floatValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const totalInput = document.getElementById('total');
totalInput.addEventListener('blur', function () {
    formatCurrency(this);
});

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const saleDate = form.saleDate.value;
    const product = form.product.value;
    const quantity = parseInt(form.quantity.value, 10);
    const total = parseFloat(totalInput.dataset.raw || totalInput.value);

    if (!saleDate || !product || !quantity || !total) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('/api/vendas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: saleDate,
                produto: product,
                quantidade: quantity,
                total: total
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar venda');
        }

        const result = await response.json();
        alert(result.message);

        form.reset();
    } catch (error) {
        console.error('Erro:', error);
        alert('Falha ao salvar a venda. Tente novamente.');
    }
});
