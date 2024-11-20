// src/ProductManager.js
class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1; // Variável para gerenciar o ID dos novos produtos
  }

  // Carrega produtos (exemplo: de um banco de dados ou arquivo)
  async loadProducts() {
    this.products = [
      { id: 1, code: '01', name: 'Notebook', price: 3500 },
      { id: 3, code: '03', name: 'Smart TV OLED 50', price: 4750 },
      { id: 4, code: '04', name: 'Smart Watch', price: 850 },
    ];
    this.nextId = Math.max(...this.products.map(p => p.id)) + 1; // Garante o próximo ID correto
  }

  // Retorna todos os produtos
  async getAllProducts() {
    return this.products;
  }

  // Retorna um produto pelo ID
  async getProductById(id) {
    return this.products.find(product => product.id === id);
  }

  // Método para adicionar um novo produto
  async addProduct(productData) {
    const newProduct = {
      id: this.nextId++,  // Gera um novo ID único
      ...productData,
      status: productData.status ?? true,  // Status é true por padrão
    };

    this.products.push(newProduct); // Adiciona o novo produto
    return newProduct; // Retorna o produto recém-adicionado
  }

  // Método para atualizar um produto existente
  async updateProduct(id, updatedProductData) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        ...updatedProductData,
      };
      return this.products[productIndex];
    }
    return null; // Caso o produto não seja encontrado
  }

  // Método para deletar um produto
  async deleteProduct(id) {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      return deletedProduct;
    }
    return null; // Caso o produto não seja encontrado
  }
}

module.exports = ProductManager;
