import { Module, VuexModule, Action, Mutation } from 'vuex-module-decorators'
import AccountService from '../../services/account.services'
import { Account } from '../../models/account'
import { Member } from '../../models/member'

@Module({
  name: 'account',
  namespaced: true
})
export default class AccountModule extends VuexModule {
  accounts: Account[] = []
  currentAccount: Account | null = null
  currentAccountMembership: Member | null = null
  pendingApprovalCount = 0

  get accountName () {
    return this.currentAccount?.name
  }

  @Mutation
  public setAccounts (accounts: Account[]): void {
    this.accounts = accounts
  }

  @Mutation
  public setCurrentAccount (account: Account): void {
    this.currentAccount = account
  }

  @Mutation
  public setPendingApprovalCount (count: number): void {
    this.pendingApprovalCount = count
  }

  @Mutation
  public setCurrentAccountMembership (membership: Member): void {
    this.currentAccountMembership = membership
  }

  @Action({ rawError: true, commit: 'setAccounts' })
  public async syncAccounts (): Promise<Account[]> {
    const response = await AccountService.getAccounts()
    if (response?.data?.orgs?.length > 0) {
      this.context.commit('setCurrentAccount', response.data.orgs[0])
      const membership: Member = await this.context.dispatch('fetchCurrentAccountMembership')
      if (membership?.membershipStatus === 'ACTIVE' && membership?.membershipType !== 'MEMBER') {
        await this.context.dispatch('fetchPendingApprovalCount')
      }
    }
    return response?.data?.orgs || []
  }

  @Action({ rawError: true, commit: 'setPendingApprovalCount' })
  public async fetchPendingApprovalCount (): Promise<number> {
    const response = await AccountService.getPendingMembers(this.context.rootState.account.currentAccount?.id)
    return response?.data?.members?.length || 0
  }

  @Action({ rawError: true, commit: 'setCurrentAccountMembership' })
  public async fetchCurrentAccountMembership (): Promise<Member> {
    const response = await AccountService.getMembership(this.context.rootState.account.currentAccount?.id)
    return response?.data
  }
}
