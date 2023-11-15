const express = require('express');
const bodyParser = require('body-parser');
const multipart = require('connect-multiparty');
const cors = require('cors');

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const app = express();

app.use(cors());

const multiPartMiddelware = multipart({
    uploadDir: path.join(__dirname, './archivos'),
});

// Configuración de mongoose
mongoose.connect('mongodb://localhost:27017/lab12', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

// Manejar errores de conexión
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

// Definir un modelo para la base de datos
const ArchivoModel = mongoose.model('Archivo', {
    nombre: String,
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.post('/api/subir', multiPartMiddelware, async (req, res) => {

    try {
        // Obtener el archivo subido
        const archivo = req.files.uploads[0];
        
        // Guardar en la base de datos
        const nuevoArchivo = new ArchivoModel({
          nombre: archivo.name,
        });
    
        await nuevoArchivo.save();
    
        // Responder con un mensaje
        res.json({
          message: 'Archivo y datos guardados correctamente',
        });
      } catch (error) {
        console.error('Error al subir archivo:', error);
        res.status(500).json({
          error: 'Error al subir archivo',
        });
      } finally {
        // Limpiar el archivo temporal
        if (req.files) {
          fs.unlink(req.files.uploads[0].path, (err) => {
            if (err) {
              console.error('Error al eliminar archivo temporal:', err);
            }
          });
        }
      }
});


app.get('/', (req, res) => {
    res.send('Hola Mundo....!!!');
});

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));