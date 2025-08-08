// src/api/repositories/productRepository.js
import BaseRepository from './baseRepository';

class ProductRepository extends BaseRepository {
  constructor() {
    super('products');
  }

  // Optional: Add product-specific methods
  async getProductsByCategory(categoryId) {
    return this.axiosService.get(`/${this.endpoint}/category/${categoryId}`);
  }
}

export default new ProductRepository();
