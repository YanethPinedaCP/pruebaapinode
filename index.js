const express = require('express');  // Importa express
const mysql = require('mysql2');     // Importa mysql2 para conexión con MySQL
require('dotenv').config();          // Cargar las variables del archivo .env

const app = express();               // Inicializa la aplicación express
const port = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// Conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

app.get('/', (req, res) => {
    res.send('BIENVENIDOS A MI API :)');
});

// Definir una ruta de ejemplo para guardar un vehículo
app.post('/api/vehiculos', (req, res) => {
  const { idColor, idMarca, modelo, chasis, motor, nombre, carnet, activo } = req.body;

  const query = `CALL gestionarVehiculos(?, NULL, ?, ?, ?, ?, ?, ?, ?, ?)`;
  connection.query(query, ['guardar', idColor, idMarca, modelo, chasis, motor, nombre, carnet, activo], (err, results) => {
    if (err) {
      console.error('Error ejecutando el procedimiento:', err);
      res.status(500).send('Error al guardar el vehículo');
      return;
    }
    res.status(200).json({ message: 'Vehículo guardado correctamente' });
  });
});

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
