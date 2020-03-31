import { Action, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import { Products, ProductType } from '../../models/product'
import ProductService from '../../services/product.services'

@Module({
  name: 'product',
  namespaced: true
})
export default class ProductModule extends VuexModule {
  products: Products = []
  partners: Products = []

  @Mutation
  public setProducts (products: Products) {
    this.products = products
  }

  @Mutation
  public setPartners (partners: Products) {
    this.partners = partners
  }

  @Action({ rawError: true })
  public async syncProducts () {
    const response = await ProductService.getAllProducts()
    if (response && response.data) {
      this.context.commit('setProducts', response.data.filter(p => p.type === ProductType.Internal))
      this.context.commit('setPartners', response.data.filter(p => p.type === ProductType.Partner))
    }
  }
}
