import express from 'express';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve arquivos estáticos
app.use('/components', express.static(path.join(__dirname, 'components')));
app.use('/src', express.static(path.join(__dirname, 'src')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

app.get('/', (req, res) => {
  res.redirect('/pages/CEO/login/index.html');
});

// Usuário fixo
const USER = {
  username: 'Lovin',
  password: '1234'
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username !== USER.username) {
    return res.status(401).json({ success: false, message: 'Usuário não encontrado' });
  }

  if (password !== USER.password) {
    return res.status(401).json({ success: false, message: 'Senha incorreta' });
  }

  return res.status(200).json({ success: true, message: 'Login bem-sucedido', redirect: '/pages/menuPrincipal/menu_principal.html' });
});

// Banco de dados
let db;

async function initDB() {
  db = await open({
    filename: path.join(__dirname, 'banco.db'),
    driver: sqlite3.Database
  });

  // Tabelas
 await db.exec(`
  CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT,
    produto TEXT,
    quantidade INTEGER,
    total REAL
  );

  CREATE TABLE IF NOT EXISTS produtos (
    codigo INTEGER PRIMARY KEY,
    nome TEXT,
    categoria TEXT,
    descricao TEXT,
    preco REAL,
    estoque INTEGER,
    local TEXT
  );

  CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nomePet TEXT,
    nomeDono TEXT,
    telefoneContato TEXT,
    servico TEXT,
    data TEXT,
    hora TEXT
  );

  CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    raca TEXT,
    idade INTEGER,
    status TEXT,
    descricao TEXT,
    imagem TEXT NULL
  );
`);
}

// ===== Rotas API =====

// Vendas
app.post('/api/vendas', async (req, res) => {
  const { data, produto, quantidade, total } = req.body;
  await db.run('INSERT INTO vendas (data, produto, quantidade, total) VALUES (?, ?, ?, ?)', [data, produto, quantidade, total]);
  res.json({ message: 'Venda registrada com sucesso!' });
});

app.get('/api/vendas', async (req, res) => {
  const vendas = await db.all('SELECT * FROM vendas');
  res.json(vendas);
});

// Produtos
app.post('/api/produtos', async (req, res) => {
  const { codigo, nome, categoria, descricao, preco, estoque, local } = req.body;
  try {
    await db.run(
      `INSERT INTO produtos (codigo, nome, categoria, descricao, preco, estoque, local) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nome, categoria, descricao, preco, estoque, local]
    );
    res.json({ message: 'Produto cadastrado!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cadastrar produto' });
  }
});

app.get('/api/produtos/codigo/:codigo', async (req, res) => {
  const { codigo } = req.params;
  const produto = await db.get('SELECT * FROM produtos WHERE codigo = ?', [codigo]);
  if (!produto) {
    return res.status(404).json(null);  // ou { message: "Produto não encontrado" }
  }
  res.json(produto);
});

// Serviços
app.post('/api/servicos', async (req, res) => {
  const { nomePet, nomeDono, telefoneContato, servico, data, hora } = req.body;
  await db.run('INSERT INTO servicos (nomePet, nomeDono, telefoneContato, servico, data, hora) VALUES (?, ?, ?, ?, ?, ?)', 
    [nomePet, nomeDono, telefoneContato, servico, data, hora]);
  res.json({ message: 'Serviço agendado!' });
});

app.get('/api/servicos', async (req, res) => {
  const servicos = await db.all('SELECT * FROM servicos');
  res.json(servicos);
});

// Pets
app.post('/api/pets', async (req, res) => {
  console.log('Recebido no backend:', req.body);
  const { nome, raca, idade, imagem, status, descricao } = req.body;  // adicionado descricao
  try {
    await db.run('INSERT INTO pets (nome, raca, idade, status, imagem, descricao) VALUES (?, ?, ?, ?, ?, ?)', 
      [nome, raca, idade, status, imagem, descricao]);  // adicionado descricao
    res.json({ message: 'Pet cadastrado!' });
  } catch (error) {
    console.error('Erro no INSERT pets:', error);
    res.status(500).json({ message: 'Erro ao cadastrar pet' });
  }
});

app.get('/api/pets', async (req, res) => {
  const pets = await db.all('SELECT * FROM pets');
  res.json(pets);
});

app.delete('/api/pets/:id', async (req, res) => {
  const { id } = req.params;
  await db.run('DELETE FROM pets WHERE id = ?', [id]);
  res.json({ message: 'Pet removido!' });
});

// Inicialização
const PORT = 3000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao inicializar o banco de dados:', err);
});