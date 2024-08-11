const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Rota de teste
app.get('/teste', (req, res) => {
  res.send('O servidor está funcionando!');
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
