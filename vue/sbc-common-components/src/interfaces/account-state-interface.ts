import { Member } from '../models/member'
import { UserSettings } from '../models/userSettings'
import { KCUserProfile } from '../models/KCUserProfile'

export interface AccountStateIF {
    userSettings: UserSettings[]
    currentAccount: UserSettings
    currentAccountMembership: Member
    pendingApprovalCount: number
    currentUser: KCUserProfile
}
