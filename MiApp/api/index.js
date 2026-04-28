const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// simple health check
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// example resource endpoint
app.get('/hello', (req, res) => {
  res.json({ greeting: 'Hello from MiApp API!' });
});

// store users in memory for demo
let nextId = 1;
const usuarios = [];

// register user
app.post('/usuarios', (req, res) => {
  const { nombre, apellido, email, telefono, password } = req.body;
  if (!nombre || !apellido || !email || !password) {
    return res.status(400).json({ error: 'Campos faltantes' });
  }
  const nuevo = { id: nextId++, nombre, apellido, email, telefono };
  usuarios.push(nuevo);
  res.status(201).json(nuevo);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
