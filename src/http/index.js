import router from '@/router';
import axios from 'axios';
import { ElMessage } from 'element-plus'


// 创建了一个axios实例,给这个实例编写配置，后续所有通过实例发送的请求，都受当前配置约束
const $http = axios.create({
    baseURL: "http://127.0.0.1:8000",
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});
// 请求拦截器
$http.interceptors.request.use(function (config) {
    // 在发请求前做什么
    // 如果是登录退出，不需要添加token
    if (config.url.includes('login') || config.url.includes('logout')) {
        return config
    }
    else {
        // 其它页面添加请求头访问
        config.headers['Authorization'] = localStorage.getItem('token');
        return config;
    }
}, function (error) {
    // 对请求错误做什么
    return Promise.reject(error);
});

// 添加响应拦截器
$http.interceptors.response.use(function (response) {
    // 对响应数据做什么
    let data = response.data;

    // 如果请求返回401，则未登录
    if (data.code == 401) {
        ElMessage({
            showClose: true,
            center: true,
            message: data.msg,
            type: 'error',
        });
        localStorage.removeItem('user_id');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        router.push('/login');
        return data;
    }
    return data;
}, function (error) {
    // 对响应报错做什么
    if (error.response) {
        switch (error.response.status) {
            case 404:
                // 页面未找到
                ElMessage({
                    showClose: true,
                    center: true,
                    message: '请求路径异常',
                    type: 'error',
                })
                break;
            case 500:
                // 服务器内部错误
                ElMessage({
                    showClose: true,
                    center: true,
                    message: '服务器异常',
                    type: 'error',
                })
                break;
            default:
                // 其他状态码
                ElMessage({
                    showClose: true,
                    center: true,
                    message: '未知异常',
                    type: 'error',
                })
        }
    } else if (error.code == 'ERR_NETWORK') {
        // 处理连接问题或网络中断等
        ElMessage({
            showClose: true,
            center: true,
            message: '服务器异常',
            type: 'error',
        })
    }
    else {
        // 处理连接问题或网络中断等
        ElMessage({
            showClose: true,
            center: true,
            message: '未知异常',
            type: 'error',
        })
        return Promise.reject(error);
    }
    return false;
});

export default $http