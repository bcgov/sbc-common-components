import { reactive, toRefs } from '@vue/composition-api'
import { Products } from '../models/product'
import ProductService from '../services/product.services'
import { ProductsStateIF } from '../interfaces/product-state-interface'
import { defineStore } from 'pinia'

export const useProductsStore = defineStore('product', () => {
  const state = reactive<ProductsStateIF>({
    products: []
  })

  const syncProducts = async (): Promise<Products> => {
    const response = await ProductService.getAllProducts()
    if (response?.data) {
      state.products = response.data?.sort((a, b) => a.name.localeCompare(b.name))
      return state.products
    }
  }

  return {
    ...toRefs(state),
    syncProducts
  }
})
