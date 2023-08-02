
export interface UserTerms {
    isTermsOfUseAccepted: boolean
}

export interface UserProfile {
    lastname: string
    firstname: string
    userTerms?: UserTerms
}
