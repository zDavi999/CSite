const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const stringsFilePath = path.join(__dirname, 'strings.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota de teste
app.get('/teste', (req, res) => {
  res.send('O servidor está funcionando!');
});

// Inicializa o arquivo strings.json se não existir
if (!fs.existsSync(stringsFilePath)) {
  fs.writeFileSync(stringsFilePath, JSON.stringify([]));
}

// Rota para adicionar uma string
app.post('/add', (req, res) => {
  const { string } = req.body;
  if (typeof string === 'string') {
    fs.readFile(stringsFilePath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Failed to read file' });
      const strings = JSON.parse(data);
      strings.push(string);
      fs.writeFile(stringsFilePath, JSON.stringify(strings), (err) => {
        if (err) return res.status(500).json({ error: 'Failed to write file' });
        res.status(200).json({ message: 'String saved successfully' });
      });
    });
  } else {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Rota para obter todas as strings
app.get('/strings', (req, res) => {
  fs.readFile(stringsFilePath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to read file' });
    const strings = JSON.parse(data);
    res.status(200).json(strings.map(str => ({ value: str })));
  });
});

// Rota para excluir uma string
app.delete('/delete', (req, res) => {
  const { string } = req.body;
  if (typeof string === 'string') {
    fs.readFile(stringsFilePath, 'utf8', (err, data) => {
      if (err) return res.status(500).json({ error: 'Failed to read file' });
      let strings = JSON.parse(data);
      strings = strings.filter(str => str !== string);
      fs.writeFile(stringsFilePath, JSON.stringify(strings), (err) => {
        if (err) return res.status(500).json({ error: 'Failed to write file' });
        res.status(200).json({ message: 'String deleted successfully' });
      });
    });
  } else {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// Inicializa o servidor
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
