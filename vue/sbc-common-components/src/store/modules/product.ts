import ProductService from '../../services/product.services'

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const productModule = {
  namespaced: true,
  state: {
    products: [],
    partners: []
  },
  mutations: {
    setProducts(state, products) {
      state.products = products
    }
  },
  actions: {
    async syncProducts({ commit }) {
      try {
        const response = await ProductService.getAllProducts()
        if (response && response.data) {
          commit('setProducts', response.data.sort((a, b) => a.name.localeCompare(b.name)))
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }
  }
}

export default productModule
