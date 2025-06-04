const scheduleForm = document.getElementById('scheduleForm');

scheduleForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const nomePet = document.getElementById('nomePet').value;
  const nomeDono = document.getElementById('nomeDono').value;
  const telefoneContato = document.getElementById('telefoneContato').value;
  const servico = document.getElementById('servico').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  const selectedDateTime = new Date(`${data}T${hora}`);
  const now = new Date();
  if (selectedDateTime < now) {
    alert('Não é possível agendar para datas e horários que já passaram.');
    return;
  }

  try {
    const response = await fetch('/api/servicos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nomePet,
        nomeDono,
        telefoneContato,
        servico,
        data,
        hora
      })
    });

    if (response.ok) {
      alert('Serviço agendado com sucesso!');
      scheduleForm.reset();
    } else {
      const errorData = await response.json();
      alert(`Erro ao agendar: ${errorData.message || 'Erro desconhecido.'}`);
    }
  } catch (error) {
    console.error('Erro ao enviar agendamento:', error);
    alert('Erro de rede ou servidor ao agendar.');
  }
});
