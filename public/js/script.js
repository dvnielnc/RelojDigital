// Actualizar el reloj
function actualizarReloj() {
  const ahora = new Date();
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');

  const reloj = document.getElementById('reloj');
  reloj.textContent = `${horas}:${minutos}:${segundos}`;
}

setInterval(actualizarReloj, 1000);
actualizarReloj(); // inicializar el reloj

// Mostrar/Ocultar el formulario
const mostrarFormularioBoton = document.getElementById('mostrar-formulario-boton');
const formularioAlarma = document.getElementById('formulario-alarma');

mostrarFormularioBoton.addEventListener('click', () => {
  if (formularioAlarma.style.display === 'none' || formularioAlarma.style.display === '') {
    formularioAlarma.style.display = 'flex';
  } else {
    formularioAlarma.style.display = 'none';
  }
});

// Gestionar alarmas
document.getElementById('formulario-alarma').addEventListener('submit', function(e) {
  e.preventDefault();
  const hora = document.getElementById('hora-alarma').value;
  const etiqueta = document.getElementById('etiqueta-alarma').value;

  fetch('/api/alarms', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ time: hora, label: etiqueta })
  })
  .then(response => response.json())
  .then(alarma => {
    añadirAlarmaALista(alarma);
    formularioAlarma.style.display = 'none';
  });
});

function añadirAlarmaALista(alarma) {
  const listaAlarmas = document.getElementById('lista-alarmas');
  const li = document.createElement('li');
  li.textContent = `${alarma.time} - ${alarma.label}`;
  li.dataset.id = alarma.id;

  const botonEliminar = document.createElement('button');
  botonEliminar.textContent = 'Eliminar';
  botonEliminar.addEventListener('click', function() {
    fetch(`/api/alarms/${alarma.id}`, {
      method: 'DELETE'
    })
    .then(() => {
      listaAlarmas.removeChild(li);
    });
  });

  li.appendChild(botonEliminar);
  listaAlarmas.appendChild(li);
}

// Función para cargar las alarmas y verificar si mostrar notificación
function cargarAlarmas() {
  fetch('/api/alarms')
    .then(response => response.json())
    .then(alarmas => {
      alarmas.forEach(alarma => añadirAlarmaALista(alarma));
      // Verificar cada segundo si hay alguna alarma que haya llegado a la hora
      setInterval(verificarAlarmas, 1000);
    });
}

// Función para verificar si alguna alarma ha llegado a la hora
function verificarAlarmas() {
  const ahora = new Date();
  const listaAlarmas = document.getElementById('lista-alarmas');

  Array.from(listaAlarmas.children).forEach(li => {
    const hora = li.textContent.split(' ')[0]; // Obtener la hora de la alarma
    const [horas, minutos] = hora.split(':');
    const horaAlarma = new Date();
    horaAlarma.setHours(parseInt(horas), parseInt(minutos), 0);

    if (horaAlarma.getHours() === ahora.getHours() &&
        horaAlarma.getMinutes() === ahora.getMinutes() &&
        ahora.getSeconds() === 0) {
      const etiqueta = li.textContent.split(' - ')[1]; // Obtener la etiqueta de la alarma
      mostrarNotificacion(etiqueta); // Mostrar solo la descripción de la alarma
    }
  });
}

// Función para mostrar notificación tipo alert con la descripción de la alarma
function mostrarNotificacion(etiqueta) {
  // Mostrar alerta con la descripción de la alarma
  console.log(`¡Alarma!\nEs hora de "${etiqueta}"`);
}

// Iniciar la carga de alarmas al cargar la página
cargarAlarmas();
