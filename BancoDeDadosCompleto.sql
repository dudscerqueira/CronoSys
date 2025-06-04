-- SQL script to create a comprehensive database schema for all pages/screens in the project

-- Tabela para funcionários
CREATE TABLE funcionarios (
    funcionario_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    cargo VARCHAR(50),
    data_contratacao DATE,
    status VARCHAR(20)
);

-- Tabela para categorias
CREATE TABLE categorias (
    categoria_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

-- Tabela para produtos
CREATE TABLE produtos (
    produto_id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(50),
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    quantidade_estoque INT DEFAULT 0,
    status VARCHAR(20),
    local VARCHAR(100),
    categoria_id INT,
    CONSTRAINT fk_categoria FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id)
);

-- Tabela para serviços
CREATE TABLE servicos (
    servico_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    preco DECIMAL(10, 2) NOT NULL,
    duracao_minutos INT
);

-- Tabela para pets
CREATE TABLE pets (
    pet_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL,
    especie VARCHAR(50),
    raca VARCHAR(50),
    idade INT,
    disponivel_para_adocao BOOLEAN DEFAULT TRUE
);

-- Tabela para vendas
CREATE TABLE vendas (
    venda_id INT PRIMARY KEY AUTO_INCREMENT,
    funcionario_id INT,
    data_venda DATETIME DEFAULT CURRENT_TIMESTAMP,
    valor_total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(funcionario_id)
);

-- Tabela para itens de venda (produtos vendidos em cada venda)
CREATE TABLE itens_venda (
    item_venda_id INT PRIMARY KEY AUTO_INCREMENT,
    venda_id INT,
    produto_id INT,
    quantidade INT NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venda_id) REFERENCES vendas(venda_id),
    FOREIGN KEY (produto_id) REFERENCES produtos(produto_id)
);

-- Tabela para agendamentos de serviços
CREATE TABLE agendamentos_servicos (
    agendamento_id INT PRIMARY KEY AUTO_INCREMENT,
    funcionario_id INT,
    pet_id INT,
    servico_id INT,
    data_agendamento DATETIME NOT NULL,
    status VARCHAR(20),
    FOREIGN KEY (funcionario_id) REFERENCES funcionarios(funcionario_id),
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id),
    FOREIGN KEY (servico_id) REFERENCES servicos(servico_id)
);

-- Tabela para agendamentos de serviços detalhes (para a página Agendar Serviços)
CREATE TABLE agendamentos_servicos_detalhes (
    agendamento_id INT PRIMARY KEY AUTO_INCREMENT,
    nome_pet VARCHAR(100) NOT NULL,
    nome_dono VARCHAR(100) NOT NULL,
    telefone_contato VARCHAR(20) NOT NULL,
    servico VARCHAR(50) NOT NULL,
    data DATE NOT NULL,
    hora TIME NOT NULL,
    status VARCHAR(20)
);

-- Inserts de dados de exemplo

INSERT INTO funcionarios (nome, email, telefone, cargo, data_contratacao, status) VALUES
('João Silva', 'joao.silva@example.com', '123456789', 'Vendedor', '2020-01-15', 'Ativo'),
('Maria Oliveira', 'maria.oliveira@example.com', '987654321', 'Gerente', '2018-07-22', 'Ativo');

INSERT INTO categorias (nome) VALUES
('Alimentos'),
('Brinquedos'),
('Acessórios');

INSERT INTO produtos (codigo, nome, descricao, preco, quantidade_estoque, status, local, categoria_id) VALUES
('COD001', 'Ração para Cães', 'Ração premium para cães adultos', 120.50, 50, 'Disponível', 'Prateleira A', 1),
('COD002', 'Brinquedo para Gatos', 'Brinquedo interativo para gatos', 35.00, 100, 'Disponível', 'Prateleira B', 2);

INSERT INTO servicos (nome, descricao, preco, duracao_minutos) VALUES
('Banho', 'Banho completo para pets', 80.00, 60),
('Tosa', 'Tosa higiênica e estética', 100.00, 90);

INSERT INTO pets (nome, especie, raca, idade, disponivel_para_adocao) VALUES
('Rex', 'Cão', 'Labrador', 3, TRUE),
('Mimi', 'Gato', 'Siamês', 2, FALSE);

INSERT INTO vendas (funcionario_id, data_venda, valor_total) VALUES
(1, '2023-06-01 10:00:00', 155.50),
(2, '2023-06-02 15:30:00', 80.00);

INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco) VALUES
(1, 1, 1, 120.50),
(1, 2, 1, 35.00),
(2, 1, 1, 80.00);

INSERT INTO agendamentos_servicos (funcionario_id, pet_id, servico_id, data_agendamento, status) VALUES
(1, 1, 1, '2023-06-10 09:00:00', 'Agendado'),
(2, 2, 2, '2023-06-11 14:00:00', 'Confirmado');

INSERT INTO agendamentos_servicos_detalhes (nome_pet, nome_dono, telefone_contato, servico, data, hora, status) VALUES
('Rex', 'João Silva', '123456789', 'Banho', '2023-06-10', '09:00:00', 'Agendado'),
('Mimi', 'Maria Oliveira', '987654321', 'Tosa', '2023-06-11', '14:00:00', 'Confirmado');
