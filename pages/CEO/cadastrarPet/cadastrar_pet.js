console.log('Script carregado!');

const petForm = document.getElementById('petForm');

petForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const nomePet = document.getElementById('nomePet').value.trim();
  const racaPet = document.getElementById('racaPet').value.trim();
  const idadePet = document.getElementById('idadePet').value.trim();
  const descricaoPet = document.getElementById('descricaoPet').value.trim();

  if (!nomePet || !racaPet || !idadePet || !descricaoPet) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const petData = {
    nome: nomePet,
    raca: racaPet,
    idade: parseInt(idadePet, 10),
    status: 'Disponível',
    descricao: descricaoPet
  };

  try {
    const response = await fetch('/api/pets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(petData),
    });

    // Debug: veja a resposta bruta
    const text = await response.text();
    console.log('Resposta bruta do servidor:', text);

    try {
      const data = JSON.parse(text);

      if (response.ok) {
        alert(data.message || 'Pet cadastrado com sucesso!');
        petForm.reset();
        // Se tiver preview da imagem, limpar aqui também
        // Exemplo: previewImagemPet.src = ''; previewImagemPet.style.display = 'none';
      } else {
        alert('Erro ao cadastrar pet: ' + (data.message || 'Erro desconhecido'));
      }
    } catch (err) {
      alert('Resposta inesperada do servidor:\n' + text);
      console.error('Erro ao interpretar JSON:', err);
    }
  } catch (error) {
    alert('Erro na comunicação com o servidor: ' + error.message);
  }
});
