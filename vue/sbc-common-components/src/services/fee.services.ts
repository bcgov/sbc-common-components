import Axios from 'axios'
import { Fee } from '../models/fee'

// const API_URL = 'https://mock-lear-tools.pathfinder.gov.bc.ca/rest/SBC+Pay+API+Reference/1.0.1'
// sample Microcks URLs =
//   https://mock-lear-tools.pathfinder.gov.bc.ca/rest/SBC+Pay+API+Reference/1.0.1/api/v1/fees/CP/OTANN
//   https://mock-lear-tools.pathfinder.gov.bc.ca/rest/SBC+Pay+API+Reference/1.0.1/api/v1/fees/CP/OTADD
const API_URL = 'https://pay-api-dev.pathfinder.gov.bc.ca/api/v1/fees'
export default {

  getFee (filingData: { filingDescription: string, filingTypeCode: string, waiveFees: boolean, entityType: string }[], payApiUrl: string)
  : Promise<Fee[]> {
    const token = sessionStorage.getItem('KEYCLOAK_TOKEN')
    if (filingData.length < 1) {
      Promise.resolve()
    }
    let promises = []
    for (const filing of filingData) {
      if (!filing.filingTypeCode) {
        Promise.resolve()
      }
      var url = `${payApiUrl}fees/${filing.entityType}/${filing.filingTypeCode}?waiveFees=${filing.waiveFees ? filing.waiveFees : false}`

      promises.push(Axios.get(url, { headers: { Authorization: `Bearer ${token}` } }))
    }

    return Axios.all(promises)
      .then(Axios.spread((...args) => {
        // customise the response here
        return args
          .map(response => response.data)
          .map(data => {
            let clientPassedDesc = filingData.find(fee => fee.filingTypeCode === data.filingTypeCode).filingDescription
            // default the title if client has'nt passed this on
            data.filingType = !clientPassedDesc ? data.filingType : clientPassedDesc
            // total fees is a sum of filingFees,serviceFees,processingFees , gst , pst
            data.fee = data.filingFees + data.serviceFees + data.processingFees + data.tax.gst + data.tax.pst
            return data
          })
      }))
      .catch(error => {
        switch (error.response.status) {
          case 400:
            console.log('%c FeeModule-ERROR: Probably fee code mismatch %s', 'color: red; font-size: 13px',
              JSON.stringify(this.filingData))
            break
          case 500:
            console.log('%c FeeModule-ERROR: Probably invalid Token %s', 'color: red; font-size: 13px',
              JSON.stringify(this.filingData))
            break
          default:
            console.log('%c FeeModule-ERROR: Probably unknown Error %s', 'color: red; font-size: 13px',
              JSON.stringify(this.filingData))
        }
        return []
      })
  }
}
