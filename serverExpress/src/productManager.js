const fs = require("fs").promises; // Usando fs com promessas
const path = require("path");

class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1; // ID do produto a ser adicionado
    this.loadProducts(); // Carrega os produtos ao iniciar
  }

  async loadProducts() {
    const dataPath = path.join(__dirname, '../data/products.json');
    try {
      const data = await fs.readFile(dataPath, "utf-8");
      this.products = JSON.parse(data).map(p => ({
        ...p,
        id: Number(p.id) // Garante que o ID é um número
      }));
      this.nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
      console.log("Produtos carregados:", this.products);
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("Nenhum produto encontrado, mantendo lista vazia.");
      } else {
        console.error("Erro ao carregar produtos:", error);
      }
    }
  }

  async getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      throw new Error("Produto não encontrado");
    }
    return product;
  }

  async addProduct(product) {
    // Validação dos campos
    if (!product.code || !product.name || !product.price) {
      throw new Error("Todos os campos são obrigatórios: código, nome e preço.");
    }

    const codeExists = this.products.some(p => p.code === product.code);
    if (codeExists) {
      throw new Error(`O código ${product.code} já está em uso.`);
    }

    const newProduct = {
      id: this.nextId++, // Adiciona ID para o próximo produto
      ...product,
    };
    this.products.push(newProduct);
    await this.saveProducts(); // Salva os produtos após adicionar
    console.log("Produto adicionado:", newProduct);
  }

  async saveProducts() {
    const dataPath = path.join(__dirname, '../data/products.json');
    try {
      // Verifica se o diretório 'data' existe, se não, cria
      await fs.mkdir(path.dirname(dataPath), { recursive: true });
      // Salva os produtos no arquivo
      await fs.writeFile(dataPath, JSON.stringify(this.products, null, 2));
      console.log("Produtos salvos com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar produtos:", error);
    }
  }
}

module.exports = ProductManager;
