import Axios from 'axios';

Vue.prototype.$axios = Axios;
// 全局请求拦截器
Axios.interceptors.request.use(
    config => {
        return config;
    },
    error => {
        // 跳转error页面
        router.push({path: "/error"});
        return Promise.reject(error);
    }
);
// 全局响应拦截器
Axios.interceptors.response.use(
    res => {
        if (res.data.code === "401") {
            // 401表示没有登录
            // 提示没有登录
            Vue.prototype.notifyError(res.data.msg);
            // 修改vuex的showLogin状态,显示登录组件
            store.dispatch("setShowLogin", true);
        }
        if (res.data.code === "500") {
            // 500表示服务器异常
            // 跳转error页面
            router.push({path: "/error"});
        }
        return res;
    },
    error => {
        // 跳转error页面
        router.push({path: "/error"});
        return Promise.reject(error);
    }
);
