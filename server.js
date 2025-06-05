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

let db;

async function initDB() {
  db = await open({
    filename: path.join(__dirname, 'banco.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      data TEXT,
      produto INTEGER,
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

// Rota para cadastrar venda e atualizar estoque
app.post('/api/vendas', async (req, res) => {
  try {
    const { data, produto, quantidade, total } = req.body;

    if (!data || !produto || !quantidade || !total) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    const prod = await db.get('SELECT estoque FROM produtos WHERE codigo = ?', [produto]);

    if (!prod) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    if (prod.estoque < quantidade) {
      return res.status(400).json({ message: 'Estoque insuficiente' });
    }

    await db.run('INSERT INTO vendas (data, produto, quantidade, total) VALUES (?, ?, ?, ?)', [data, produto, quantidade, total]);

    await db.run('UPDATE produtos SET estoque = estoque - ? WHERE codigo = ?', [quantidade, produto]);

    res.json({ message: 'Venda registrada com sucesso e estoque atualizado!' });
  } catch (error) {
    console.error('Erro ao registrar venda:', error);
    res.status(500).json({ message: 'Erro ao registrar venda' });
  }
});

// Listar todas as vendas
app.get('/api/vendas', async (req, res) => {
  try {
    const vendas = await db.all('SELECT * FROM vendas');
    res.json(vendas);
  } catch (error) {
    console.error('Erro ao listar vendas:', error);
    res.status(500).json({ message: 'Erro ao listar vendas' });
  }
});

// Rota para excluir uma venda pelo id e atualizar o estoque
app.delete('/api/vendas/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const venda = await db.get('SELECT * FROM vendas WHERE id = ?', [id]);
    if (!venda) {
      return res.status(404).json({ message: 'Venda não encontrada' });
    }

    await db.run('DELETE FROM vendas WHERE id = ?', [id]);

    // Atualiza o estoque somando a quantidade da venda excluída
    await db.run(
      'UPDATE produtos SET estoque = estoque + ? WHERE codigo = ?',
      [venda.quantidade, venda.produto]
    );

    res.json({ message: 'Venda excluída com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir venda:', error);
    res.status(500).json({ message: 'Erro ao excluir venda' });
  }
});

// Produtos
app.post('/api/produtos', async (req, res) => {
  const { codigo, nome, categoria, descricao, preco, estoque, local } = req.body;
  try {
    if (!codigo || !nome || !categoria || !preco || estoque == null || !local) {
      return res.status(400).json({ message: 'Campos obrigatórios faltando' });
    }
    await db.run(
      `INSERT INTO produtos (codigo, nome, categoria, descricao, preco, estoque, local) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [codigo, nome, categoria, descricao, preco, estoque, local]
    );
    res.json({ message: 'Produto cadastrado!' });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ message: 'Erro ao cadastrar produto' });
  }
});

app.get('/api/produtos/codigo/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const produto = await db.get('SELECT * FROM produtos WHERE codigo = ?', [codigo]);
    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (error) {
    console.error('Erro ao buscar produto:', error);
    res.status(500).json({ message: 'Erro ao buscar produto' });
  }
});

// Inicialização do servidor
const PORT = 3000;

initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao inicializar o banco de dados:', err);
  });
