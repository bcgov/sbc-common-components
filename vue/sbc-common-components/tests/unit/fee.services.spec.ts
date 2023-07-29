// users.test.js
import Axios from 'axios'
import FeeServices from '../../src/services/fee.services'
import { it, describe, expect, beforeAll, vi } from 'vitest'

const API_URL = 'https://pay-api-dev.pathfinder.gov.bc.ca/api/v1/'

vi.mock('axios')

const axios = Axios as any

describe('with 1 fee in the list', () => {
  const filingCodes = [{ filingDescription: 'Annual Filing',
    filingTypeCode: 'OTANN',
    waiveFees: false,
    entityType: 'CP',
    priority: false,
    futureEffective: false }]
  beforeAll(() => {
    axios.get.mockResolvedValue([])
    axios.all.mockResolvedValue([])
    axios.spread.mockResolvedValue([] as any)
    FeeServices.getFee(filingCodes, API_URL)
  })

  it('should call Axios.get once for each Fee ', () => {
    expect(Axios.get).toHaveBeenCalledWith(`${API_URL}fees/CP/OTANN`,
      { 'headers': { 'Account-Id': 0, 'Authorization': 'Bearer null' } })
  })
})

describe('with 2 fee in the list', () => {
  const filingCodes = [
    { filingDescription: 'Annual Filing',
      filingTypeCode: 'OTANN',
      entityType: 'CP',
      waiveFees: false,
      priority: false,
      futureEffective: false },
    { filingDescription: 'Director Change',
      filingTypeCode: 'OTADD',
      entityType: 'CP',
      waiveFees: false,
      priority: false,
      futureEffective: false }
  ]
  beforeAll(() => {
    axios.get.mockResolvedValue([])
    axios.all.mockResolvedValue([])
    axios.spread.mockResolvedValue([] as any)
    FeeServices.getFee(filingCodes, API_URL)
  })

  it('should call Axios.get once for each filing code', () => {
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}fees/CP/OTANN`,
      { 'headers': { 'Account-Id': 0, 'Authorization': 'Bearer null' } })
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}fees/CP/OTADD`,
      { 'headers': { 'Account-Id': 0, 'Authorization': 'Bearer null' } })
  })
})

describe('with 1 fee in the list with extra fees', () => {
  const filingCodes = [{ filingTypeCode: 'BCRSF',
    waiveFees: false,
    entityType: 'BC',
    priority: true,
    futureEffective: true }]
  beforeAll(() => {
    axios.get.mockResolvedValue([])
    axios.all.mockResolvedValue([])
    axios.spread.mockResolvedValue([] as any)
    FeeServices.getFee(filingCodes, API_URL)
  })

  it('should call Axios.get once with extra fee parameters ', () => {
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}fees/BC/BCRSF?priority=true&futureEffective=true`,
      { 'headers': { 'Account-Id': 0, 'Authorization': 'Bearer null' } })
  })
})
