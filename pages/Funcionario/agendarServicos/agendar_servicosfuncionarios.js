const scheduleForm = document.getElementById('scheduleForm');
scheduleForm.addEventListener('submit', function (event) {
  event.preventDefault();

  // Get form values
  const nomePet = document.getElementById('nomePet').value;
  const nomeDono = document.getElementById('nomeDono').value;
  const telefoneContato = document.getElementById('telefoneContato').value;
  const servico = document.getElementById('servico').value;
  const data = document.getElementById('data').value;
  const hora = document.getElementById('hora').value;

  // Validate date and time not in the past
  const selectedDateTime = new Date(data + 'T' + hora);
  const now = new Date();
  if (selectedDateTime < now) {
    alert('Não é possível agendar para datas e horários que já passaram.');
    return;
  }

  // Convert 24-hour time to 12-hour format with AM/PM
  function formatAMPM(time) {
    let [hour, minute] = time.split(':');
    hour = parseInt(hour);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    return hour + ':' + minute + ' ' + ampm;
  }
  const horaFormatada = formatAMPM(hora);

  // Create service object
  const newService = {
    nomePet,
    nomeDono,
    telefoneContato,
    servico,
    data,
    hora: horaFormatada
  };

  // Get existing services from localStorage or initialize empty array
  const services = JSON.parse(localStorage.getItem('scheduledServices') || '[]');

  // Check for duplicate date and time
  const isDuplicate = services.some(service => service.data === data && service.hora === horaFormatada);
  if (isDuplicate) {
    alert('Já existe um serviço agendado para este horário. Por favor, escolha outro horário.');
    return;
  }

  // Add new service to array
  services.push(newService);

  // Save updated array back to localStorage
  localStorage.setItem('scheduledServices', JSON.stringify(services));

  alert('Serviço agendado com sucesso!');
  scheduleForm.reset();
});
