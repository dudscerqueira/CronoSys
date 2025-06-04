async function loadPets() {
  try {
    const response = await fetch('/api/pets');
    if (!response.ok) throw new Error('Erro ao buscar pets');

    const pets = await response.json();
    const tbody = document.getElementById('petsTableBody');
    tbody.innerHTML = '';

    if (pets.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td colspan="6" style="text-align:center;">Nenhum pet disponível para adoção.</td>
      `;
      tbody.appendChild(tr);
      return;
    }

    pets.forEach((pet) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${pet.nome}</td>
        <td>${pet.raca}</td>
        <td>${pet.idade}</td>
        <td>${pet.status}</td>
        <td>${pet.descricao || ''}</td>
        <td><button class="remove-btn" data-id="${pet.id}">Remover</button></td>
      `;
      tbody.appendChild(tr);
    });

    // Remove pet event listeners
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
      button.addEventListener('click', async function () {
        const id = this.getAttribute('data-id');
        if (confirm('Tem certeza que deseja remover este pet?')) {
          try {
            const res = await fetch(`/api/pets/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Erro ao remover pet');
            loadPets();
          } catch (err) {
            alert('Erro ao remover pet');
            console.error(err);
          }
        }
      });
    });

  } catch (error) {
    console.error('Erro ao carregar pets:', error);
  }
}

window.addEventListener('DOMContentLoaded', loadPets);
