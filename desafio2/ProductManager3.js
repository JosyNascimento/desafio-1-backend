const fs = require("fs").promises; // Usando fs com promessas
const path = require("path");

class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1; // ID do produto a ser adicionado
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
}

module.exports = ProductManager;
