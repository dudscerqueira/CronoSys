BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Produto" (
	"Codigo"	INTEGER,
	"Nome produto"	TEXT,
	"Categoria"	TEXT,
	"Descrição"	TEXT,
	"Preco"	INTEGER,
	"Quantidade"	INTEGER,
	"Local"	TEXT,
	PRIMARY KEY("Codigo")
);
COMMIT;
