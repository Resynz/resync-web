/**
 * @Author: Resynz
 * @Date: 2022/1/17 15:03
 */
import Vue from 'vue'
import {NetworkConfig} from 'resynz-vue-network-handler'
import {EventEnums} from "../event";
import enums from "./enums";
NetworkConfig.log = process.env.VUE_APP_ENV !== 'production';
NetworkConfig.timeout = 30000;
NetworkConfig.beforeFunc = (param,headers,loading,vue)=>{
    if (loading && vue) {
        vue[loading] = true
    }
    if (localStorage.getItem('token')) {
        headers = Object.assign({},headers,{token:localStorage.getItem('token')})
    }

    if (param instanceof FormData) {
        return {param,headers}
    }
    return {param,headers}
};
NetworkConfig.afterFunc = (res,err,loading,vue) => {
    if (loading && vue) {
        vue[loading] = false
    }
    if (err) {
        Vue.prototype.$message.error(`请求失败[${err.message || '未知'}]`);
        return null;
    }
    if (res && res.headers && res.headers['X-Refresh-Token']) {
        Vue.prototype.$listener.$emit(EventEnums.DoLogin,res.token)
    }
    const { code,message,data} = res.data;
    if (code !== 0){
        // token 过期
        if (code === 401) {
            Vue.prototype.$listener.$emit(EventEnums.AuthExpire);
            return
        }
        // 账号被禁用
        if (code === 4006) {
            Vue.prototype.$message.error(message);
            Vue.prototype.$listener.$emit(EventEnums.AuthExpire);
            return
        }
        Vue.prototype.$message.error(`${message||'请求失败，请稍后再试'}`);
        return null;
    }
    return data;
};

NetworkConfig.apis = [

];

export default NetworkConfig;
