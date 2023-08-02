import { Products } from '@/models/product'
import ProductService from '@/services/product.services'
import { ProductsStateIF } from '@/interfaces/product-state-interface'
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('product', {
  state: (): ProductsStateIF => {
    return {
      products: []
    }
  },
  actions: {
    async syncProducts (): Promise<Products> {
      const response = await ProductService.getAllProducts()
      if (response && response.data) {
        this.state.products = response.data?.sort((a, b) => a.name.localeCompare(b.name))
        return this.state.products
      }
    }
  }
})
