/**
 * @Author: Resynz
 * @Date: 2022/1/17 15:06
 */
import ApiConfig from './config'
import enums from './enums'
import config from '../config'
const baseUrl = config.apiBaseUrl;
ApiConfig.apis.forEach(v=>v.url=`${baseUrl}${v.url}`);
export const ApiEnums = enums;
export default ApiConfig
