const express = require('express');
const path = require('path');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configuración de MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'reloj_digital'
});

db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Obtener alarmas
app.get('/api/alarms', (req, res) => {
  db.query('SELECT * FROM alarms', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Añadir una nueva alarma
app.post('/api/alarms', (req, res) => {
  const { time, label } = req.body;
  const query = 'INSERT INTO alarms (time, label) VALUES (?, ?)';
  db.query(query, [time, label], (err, result) => {
    if (err) throw err;
    res.json({ id: result.insertId, time, label });
  });
});

// Eliminar una alarma
app.delete('/api/alarms/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM alarms WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) throw err;
    res.json({ message: 'Alarma eliminada' });
  });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
