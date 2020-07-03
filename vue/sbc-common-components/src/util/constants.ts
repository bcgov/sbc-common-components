export enum SessionStorageKeys {
  KeyCloakToken = 'KEYCLOAK_TOKEN',
  KeyCloakRefreshToken = 'KEYCLOAK_REFRESH_TOKEN',
  KeyCloakIdToken = 'KEYCLOAK_ID_TOKEN',
  ApiConfigKey = 'AUTH_API_CONFIG',
  PreventStorageSync = 'PREVENT_STORAGE_SYNC',
  LaunchDarklyFlags = 'LD_FLAGS',
  CurrentAccount = 'CURRENT_ACCOUNT',
  AuthApiUrl = 'AUTH_API_URL',
  SessionSynced = 'SESSION_SYNCED'
}

export enum Account {
  ANONYMOUS = 'ANONYMOUS',
  PREMIUM = 'PREMIUM',
  BASIC = 'BASIC',
}

export enum IdpHint {
  BCROS = 'bcros',
  IDIR = 'idir',
  BCSC = 'bcsc',
  BCEID = 'bceid'
}

export enum LoginSource {
  BCROS = 'BCROS',
  IDIR = 'IDIR',
  BCSC = 'BCSC',
  BCEID = 'BCEID'
}
