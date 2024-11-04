const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1; // ID do produto a ser adicionado
    this.loadProducts(); // Carrega os produtos ao iniciar
  }

  loadProducts() {
    const dataPath = path.join(__dirname, '../data/products.json');
    try {
      const data = fs.readFileSync(dataPath, "utf-8");
      this.products = JSON.parse(data).map(p => ({
        ...p,
        id: Number(p.id) // Garante que o ID é um número
      }));
      this.nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1; // Corrigido para evitar NaN
      console.log("Produtos carregados:", this.products);
    } catch (error) {
      if (error.code === "ENOENT") {
        // Arquivo não encontrado, mantem a lista vazia
        console.log("Nenhum produto encontrado, mantendo lista vazia.");
      } else {
        console.error("Erro ao carregar produtos:", error);
      }
    }
  }

  saveProducts() {
    const dataPath = path.join(__dirname, '../data/products.json');
    try {
      // Verifica se o diretório 'data' existe, se não, cria
      if (!fs.existsSync(path.dirname(dataPath))) {
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
      }

      // Salva os produtos no arquivo
      fs.writeFileSync(
        dataPath,
        JSON.stringify(this.products, null, 2)
      );
      console.log("Produtos salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar produtos:", error);
    }
  }

  addProduct(product) {
    if (!product.code || !product.name || !product.price) {
      console.error("Todos os campos são obrigatórios: código, nome e preço.");
      return;
    }

    const codeExists = this.products.some((p) => p.code === product.code);
    if (codeExists) {
      console.error(`O código ${product.code} já está em uso.`);
      return;
    }

    const newProduct = {
      id: this.nextId++, // adiciona ID para o próximo produto
      ...product,
    };
    this.products.push(newProduct);
    this.saveProducts(); // Salva os produtos após adicionar
    console.log("Produto adicionado:", newProduct);
  }

  getProductById(id) {
    const product = this.products.find((p) => p.id === id);
    if (!product) {
      console.error("Não encontrado");
      return;
    }
    console.log("Produto encontrado:", product);
  }

  deleteProduct(id) {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) {
      console.error("Produto não encontrado");
      return;
    }

    const removedProduct = this.products.splice(index, 1);
    this.saveProducts(); // Salva os produtos após a remoção
    console.log("Produto removido:", removedProduct[0]);
  }
}

// Exemplo de uso
const productManager = new ProductManager();

// Busca por produtos
productManager.getProductById(1); // com ID 1
productManager.getProductById(2); // com ID 2

// Novo produto
productManager.addProduct({ code: "05", name: "Fone de Ouvido", price: 150.0 });

// Deletando um produto
productManager.deleteProduct(2); // Remove o produto com ID 2
