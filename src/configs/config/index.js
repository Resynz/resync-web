/**
 * @Author: Resynz
 * @Date: 2022/1/17 15:06
 */
import defaultConfig from './default'
import productionConfig from "./prod";
const env = process.env.VUE_APP_ENV;
const config = [defaultConfig];

if (env === 'production') {
    config.push(productionConfig)
}
export default Object.assign({}, ...config)
