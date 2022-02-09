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
    {
        name: enums.Login,
        url: '/admin/login',
        method: 'POST'
    },
    {
        name: enums.GetUserInfo,
        url: '/admin/info',
        method: 'GET'
    },
    {
        name: enums.AddGroup,
        url: '/group/',
        method: 'POST'
    },
    {
        name: enums.GetGroupList,
        url: '/group/list',
        method: 'GET'
    },
    {
        name: enums.UpdateGroup,
        url: '/group/:id',
        method: 'PUT'
    },
    {
        name: enums.RemoveGroup,
        url: '/group/:id',
        method: 'DELETE'
    },
    {
        name: enums.GetTaskList,
        url: '/task/list',
        method: 'GET'
    },
    {
        name: enums.AddTask,
        url: '/task/',
        method: 'POST'
    },
    {
        name: enums.GetCodeAuthList,
        url: '/code_auth/list',
        method: 'GET'
    },
    {
        name: enums.AddCodeAuth,
        url: '/code_auth/',
        method: 'POST'
    },
    {
        name: enums.GetTaskInfo,
        url: '/task/info',
        method: 'GET'
    },
    {
        name: enums.UpdateTask,
        url: '/task/:id',
        method: 'PUT'
    },
    {
        name: enums.StartTask,
        url: '/task/start',
        method: 'POST'
    },
    {
        name: enums.TaskDump,
        url: '/task/dump',
        method: 'GET'
    },
    {
        name: enums.CancelTask,
        url: '/task/cancel',
        method: 'POST'
    },
    {
        name: enums.GetTaskLogInfo,
        url: '/log/info/:id',
        method: 'GET'
    },
    {
        name: enums.RemoveTask,
        url: '/task/:id',
        method: 'DELETE'
    }
];

export default NetworkConfig;
