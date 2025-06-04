function loadPets() {
  const pets = JSON.parse(localStorage.getItem('pets')) || [];
  const tbody = document.getElementById('petsTableBody');
  tbody.innerHTML = '';

  if (pets.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td class="image-cell" aria-label="imagem do pet">sem imagem</td><td colspan="5" style="text-align:center;">Nenhum pet disponível para adoção.</td>';
    tbody.appendChild(tr);
    return;
  }

  pets.forEach((pet, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td class="image-cell" aria-label="imagem do pet"><img src="' + pet.imagem + '" alt="Imagem do pet" style="max-width: 60px; max-height: 60px; border-radius: 6px; object-fit: cover;" /></td><td>' + pet.nome + '</td><td>' + pet.raca + '</td><td>' + pet.idade + '</td><td>' + pet.status + '</td><td><button class="remove-btn" data-index="' + index + '">Remover</button></td>';
    tbody.appendChild(tr);
  });

  // Add event listeners for remove buttons
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', function () {
      const index = this.getAttribute('data-index');
      removePet(index);
    });
  });
}

function removePet(index) {
  const pets = JSON.parse(localStorage.getItem('pets')) || [];
  pets.splice(index, 1);
  localStorage.setItem('pets', JSON.stringify(pets));
  loadPets();
}

window.addEventListener('DOMContentLoaded', loadPets);
