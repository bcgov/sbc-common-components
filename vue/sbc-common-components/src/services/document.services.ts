import { AxiosResponse } from 'axios'
import ConfigHelper from '@/util/config-helper'
import { TermsOfUseDocument } from '@/models/TermsOfUseDocument'
import { axios } from '../../src/util/http-util'

export default class DocumentService {
  static async getTermsOfService (identifier: string): Promise<AxiosResponse<TermsOfUseDocument>> {
    return axios.get(`${ConfigHelper.getAuthAPIUrl()}/documents/${identifier}`)
  }
}
