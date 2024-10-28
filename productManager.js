const fs = require('fs');

class ProductManager {
  constructor() {
    this.products = [];
    this.nextId = 1; // ID do produto a ser adicionado
    this.loadProducts(); // Carrega os produtos ao iniciar
  }

  loadProducts() {
    try {
      const data = fs.readFileSync('./data/products.json', 'utf-8');
      this.products = JSON.parse(data);
      this.nextId = this.products.length > 0 ? Math.max(this.products.map(p => p.id)) + 1 : 1;
      console.log("Produtos carregados:", this.products);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Arquivo não encontrado, inicializa com produtos vazios
        this.products = [];
        this.nextId = 1; // Reinicia o ID
        console.log("Nenhum produto encontrado, inicializando lista vazia.");
      } else {
        console.error("Erro ao carregar produtos:", error);
      }
    }
  }

  saveProducts() {
    try {
      // Verifica se o diretório 'data' existe, se não, cria
      if (!fs.existsSync('./data')) {
        fs.mkdirSync('./data');
      }
      
      // Salva os produtos no arquivo
      fs.writeFileSync('./data/products.json', JSON.stringify(this.products, null, 2));
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
      id: this.nextId++, // adiciona  ID para o próximo produto
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

const productManager = new ProductManager();

// busca por produtos
productManager.getProductById(1); // com ID 1
productManager.getProductById(2); // com ID 2

// novo produto
productManager.addProduct({ code: "05", name: "Fone de Ouvido", price: 150.0 });

// Deletando um produto
productManager.deleteProduct(2); // Remove o produto com ID 2
