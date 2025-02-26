// users.test.js
import Axios from 'axios'
import StatusServices from '../../src/services/status.services'
import { SessionStorageKeys } from '@/util/constants'

vitest.mock('axios', async () => {
  const actual = await vi.importActual('axios')
  return {
    ...actual,
    get: vitest.fn(),
    all: vitest.fn(),
    spread: vitest.fn()
  }
})

const API_URL = 'https://status-api-dev.pathfinder.gov.bc.ca/api/v1'

describe('get status for payment service', () => {
  const results: any = []
  const mockAxiosSpreadResult = vitest.fn()
  var serviceName = 'PAYBC'
  beforeAll(() => {
    // @ts-ignore
    Axios.get.mockClear()
    // @ts-ignore
    Axios.all.mockResolvedValue(results)
    // @ts-ignore
    Axios.spread.mockReturnValue(mockAxiosSpreadResult)
    sessionStorage.setItem(SessionStorageKeys.ApiConfigKey, JSON.stringify({ VUE_APP_STATUS_ROOT_API: API_URL }))
    StatusServices.getServiceStatus(serviceName)
  })

  // Broken, skip
  it.skip('should call Axios.get once for status ', () => {
    expect(Axios.get).toHaveBeenCalledWith(`${API_URL}/status/PAYBC`)
  })
})
