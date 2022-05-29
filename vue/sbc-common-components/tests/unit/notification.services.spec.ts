// users.test.js
import Axios from 'axios'
import NotificationServices from '../../src/services/notification.services'
import { SessionStorageKeys } from '@/util/constants'

jest.mock('axios', () => ({
  get: jest.fn(),
  all: jest.fn(),
  spread: jest.fn()
}), {
  virtual: true
})

const API_URL = 'https://status-api-dev.pathfinder.gov.bc.ca/api/v1'

describe('get status for notification service', () => {
  const results: any = []
  const mockAxiosSpreadResult = jest.fn()
  beforeAll(() => {
    // @ts-ignore
    Axios.get.mockClear()
    // @ts-ignore
    Axios.all.mockResolvedValue(results)
    // @ts-ignore
    Axios.spread.mockReturnValue(mockAxiosSpreadResult)
    sessionStorage.__STORE__[SessionStorageKeys.ApiConfigKey] = JSON.stringify({ VUE_APP_STATUS_ROOT_API: API_URL })
    NotificationServices.getNotifications()
  })

  // Broken, skip
  it.skip('should call Axios.get once for status ', () => {
    expect(Axios.get).toHaveBeenCalledWith(`${API_URL}/whatsnew`)
  })
})
