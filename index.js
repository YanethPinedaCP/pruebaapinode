const express = require('express');  
const mysql = require('mysql2');     
require('dotenv').config();         

const app = express();               
const port = process.env.PORT || 3000;

// Manejo de json
app.use(express.json());


const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

// Coneccion a la base de datos
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

// Crear un nuevo vehículo
app.post('/api/vehiculos', (req, res) => {
  const { idColor, idMarca, modelo, chasis, motor, nombre, activo } = req.body;
  const query = `CALL sp_crud_vehiculos(NULL, ?, ?, ?, ?, ?, ?, ?, 'C')`;
  connection.query(query, [idColor, idMarca, modelo, chasis, motor, nombre, activo], (err, results) => {
    if (err) {
      console.error('Error al ejecutar el procedimiento almacenado:', err);
      return res.status(500).send('Error al insertar el vehículo');
    }
    res.status(200).json({ message: 'Vehículo insertado correctamente' });
  });
});

// Actualizar un vehículo
app.put('/api/vehiculos/:id', (req, res) => {
  const { id } = req.params;
  const { idColor, idMarca, modelo, chasis, motor, nombre, activo } = req.body;
  const query = `CALL sp_crud_vehiculos(?, ?, ?, ?, ?, ?, ?, ?, 'U')`;
  connection.query(query, [id, idColor, idMarca, modelo, chasis, motor, nombre, activo], (err, results) => {
    if (err) {
      console.error('Error al ejecutar el procedimiento almacenado:', err);
      return res.status(500).send('Error al actualizar el vehículo');
    }
    res.status(200).json({ message: 'Vehículo actualizado correctamente' });
  });
});

// Procedimiento para eliminar un vehículo
app.delete('/api/vehiculos/:id', (req, res) => {
  const { id } = req.params;
  const query = `CALL sp_crud_vehiculos(?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'D')`;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar el procedimiento almacenado:', err);
      return res.status(500).send('Error al eliminar el vehículo');
    }
    res.status(200).json({ message: 'Vehículo eliminado correctamente' });
  });
});

// Procedimiento para buscar un vehículo por ID
app.get('/api/vehiculos/:id', (req, res) => {
  const { id } = req.params;
  const query = `CALL sp_crud_vehiculos(?, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'R')`;
  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error al ejecutar el procedimiento almacenado:', err);
      return res.status(500).send('Error al buscar el vehículo');
    }
    res.status(200).json(results[0]);
  });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
