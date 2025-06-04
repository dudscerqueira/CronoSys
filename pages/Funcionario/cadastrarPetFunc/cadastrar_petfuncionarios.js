const inputImagemPet = document.getElementById('imagemPet');
const previewImagemPet = document.getElementById('previewImagemPet');
const petForm = document.getElementById('petForm');

inputImagemPet.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImagemPet.src = e.target.result;
      previewImagemPet.style.display = 'block';
    };
    reader.readAsDataURL(file);
  } else {
    previewImagemPet.src = '';
    previewImagemPet.style.display = 'none';
  }
});

petForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const nomePet = document.getElementById('nomePet').value.trim();
  const racaPet = document.getElementById('racaPet').value.trim();
  const idadePet = document.getElementById('idadePet').value.trim();
  const descricaoPet = document.getElementById('descricaoPet').value.trim();

  if (!nomePet || !racaPet || !idadePet || !descricaoPet) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  const file = inputImagemPet.files[0];
  if (!file) {
    alert('Por favor, anexe uma imagem do pet.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const imageDataUrl = event.target.result;

    // Get existing pets from localStorage or initialize empty array
    const pets = JSON.parse(localStorage.getItem('pets')) || [];

    // Add new pet
    pets.push({
      nome: nomePet,
      raca: racaPet,
      idade: idadePet,
      descricao: descricaoPet,
      imagem: imageDataUrl,
      status: 'Disponível'
    });

    // Save back to localStorage
    localStorage.setItem('pets', JSON.stringify(pets));

    alert('Pet cadastrado com sucesso!');

    // Optionally reset form
    petForm.reset();
    previewImagemPet.src = '';
    previewImagemPet.style.display = 'none';

    // Redirect to pets disponiveis page
    window.location.href = 'pets_disponiveisfuncionarios.html';
  };
  reader.readAsDataURL(file);
});
