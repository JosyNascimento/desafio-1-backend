class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1; //  ID para o próximo produto a ser adicionado
  }

  addProduct(product) {
    // método “addProduct”
    if (!product.code || !product.name || !product.price) {
      console.error("Todos os campos são obrigatórios: código, nome e preço.");
      return;
    }

    // Validando o campo "código" para garantir que não se repita
    const codeExists = this.products.some((p) => p.code === product.code);
    if (codeExists) {
      console.error(`O código ${product.code} já está em uso.`);
      return;
    }

    // Adicionando o produto com ID de incremento automático
    const newProduct = {
      id: this.nextId++, // Incrementa o ID para o próximo produto
      ...product,
    };
    this.products.push(newProduct);
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
}

// Exemplo de uso
const productManager = new ProductManager();

// Adicionando produtos
// Adicionando produtos com preços corretos
productManager.addProduct({ code: "01", name: "Notbook", price: 3500.0 });
productManager.addProduct({
  code: "02",
  name: "Celular Samsung A27",
  price: 1560.0,
});
productManager.addProduct({
  code: "03",
  name: "Smart TV OLED 50",
  price: 4750.0,
}); // Novo código para evitar conflito
productManager.addProduct({ name: "Smart watch", price: 850.0 }); // Falta o código

// Buscando produtos
productManager.getProductById(1); // Produto encontrado
productManager.getProductById(3); // Não encontrado
