const fs = require('fs');
const path = require('path');

class CartManager {
  constructor() {
    this.cartsFilePath = path.join(__dirname, 'carts.json');
    this.carts = [];
  }

  // Carregar carrinhos a partir do arquivo
  async loadCarts() {
    try {
      const data = await fs.promises.readFile(this.cartsFilePath, 'utf-8');
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  // Salvar carrinhos no arquivo
  async saveCarts() {
    try {
      await fs.promises.writeFile(this.cartsFilePath, JSON.stringify(this.carts, null, 2));
    } catch (error) {
      console.error("Erro ao salvar carrinhos:", error);
    }
  }

  async createCart() {
    const newCart = { id: this.carts.length + 1, products: [] };
    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(id) {
    return this.carts.find((cart) => cart.id === id);
  }

  async addProductToCart(cartId, productId) {
    const cart = this.carts.find((cart) => cart.id === cartId);
    if (!cart) return null;
    if (!cart.products.find((p) => p.id === productId)) {
      cart.products.push({ id: productId });
      await this.saveCarts();
    }
    return cart;
  }
}

module.exports = CartManager;
