import { AxiosInstance } from 'axios'
import ConfigHelper from './config-helper'
import { SessionStorageKeys } from './constants'

export function addAxiosInterceptors (axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(config => {
    const authGatewayApiKey = import.meta.env.VUE_APP_AUTH_API_KEY
    if (authGatewayApiKey && config.url.includes(ConfigHelper.getAuthAPIUrl())) {
      config.headers['x-apikey'] = authGatewayApiKey
    }
    const token = ConfigHelper.getFromSession(SessionStorageKeys.KeyCloakToken)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  err => {
    return Promise.reject(err)
  })
  return axiosInstance
}
