import '@/composition-api-setup' // ensure this happens before any imports trigger use of composition-api
// users.test.js
import Axios from 'axios'
import FeeServices from '../../src/services/fee.services'

// Define mock inside vitest.mock() factory
vitest.mock('axios', () => ({
  default: {
    get: vitest.fn(),
    all: vitest.fn(),
    spread: vitest.fn()
  }
}))

const API_URL = 'https://pay-api-dev.pathfinder.gov.bc.ca/api/v1/'

describe('with 1 fee in the list', () => {
  const results = []
  const mockAxiosSpreadResult = vitest.fn()
  var filingCodes = [{ filingDescription: 'Annual Filing', filingTypeCode: 'OTANN', waiveFees: false, entityType: 'CP', priority: false, futureEffective: false }]

  beforeEach(() => {
    vitest.clearAllMocks()
    Axios.all.mockResolvedValue(results)
    Axios.spread.mockReturnValue(mockAxiosSpreadResult)
    FeeServices.getFee(filingCodes, API_URL)
  })

  it('should call Axios.get once for each Fee ', () => {
    expect(Axios.get).toHaveBeenCalledWith(`${API_URL}fees/CP/OTANN`, { 'headers': { 'Account-Id': 0, 'Authorization': 'Bearer null' } })
  })
})

describe('with 2 fee in the list', () => {
  const results = []
  const mockAxiosSpreadResult = vitest.fn()
  var filingCodes = [
    { filingDescription: 'Annual Filing', filingTypeCode: 'OTANN', entityType: 'CP', waiveFees: false, priority: false, futureEffective: false },
    { filingDescription: 'Director Change', filingTypeCode: 'OTADD', entityType: 'CP', waiveFees: false, priority: false, futureEffective: false }
  ]

  beforeEach(() => {
    vitest.clearAllMocks()
    Axios.all.mockResolvedValue(results)
    Axios.spread.mockReturnValue(mockAxiosSpreadResult)
    FeeServices.getFee(filingCodes, API_URL)
  })

  it('should call Axios.get once for each filing code', () => {
    expect(Axios.get).toHaveBeenCalledWith(`${API_URL}fees/CP/OTANN`, { 'headers': { 'Account-Id': 0, 'Authorization': 'Bearer null' } })
    expect(Axios.get).toHaveBeenCalledWith(`${API_URL}fees/CP/OTADD`, { 'headers': { 'Account-Id': 0, 'Authorization': 'Bearer null' } })
  })
})

describe('with 1 fee in the list with extra fees', () => {
  const results = []
  const mockAxiosSpreadResult = vitest.fn()
  var filingCodes = [{ filingTypeCode: 'BCRSF', waiveFees: false, entityType: 'BC', priority: true, futureEffective: true }]

  beforeEach(() => {
    vitest.clearAllMocks()
    Axios.all.mockResolvedValue(results)
    Axios.spread.mockReturnValue(mockAxiosSpreadResult)
    FeeServices.getFee(filingCodes, API_URL)
  })

  it('should call Axios.get once with extra fee parameters ', () => {
    expect(Axios.get).toHaveBeenCalledWith(`${API_URL}fees/BC/BCRSF?priority=true&futureEffective=true`, { 'headers': { 'Account-Id': 0, 'Authorization': 'Bearer null' } })
  })
})
