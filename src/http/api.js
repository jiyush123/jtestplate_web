import $http from './index.js'

export const login = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/login/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

// export const auth = (data) => {
//     return $http({
//         method: "post",
//         url: "http://127.0.0.1:8000/auth/",
//         params: {},
//         data: data,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
// }

export const logout = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/logout/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getUserList = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/user/list/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getUserInfo = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/user/detail/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const addUser = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/user/add/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const delUser = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/user/del/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const updateUser = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/user/update/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

// 模块接口
export const getModuleList = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/module/list/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

// 环境接口
export const getEnvironmentList = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/environment/list/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getEnvironmentInfo = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/environment/detail/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const addEnvironment = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/environment/add/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const delEnvironment = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/environment/del/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const updateEnvironment = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/environment/update/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}


// API接口
export const getAPIList = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/api/list/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getAPIInfo = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/api/detail/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const addAPI = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/api/add/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}


export const editAPI = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/api/update/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const delAPI = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/api/del/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const debugAPI = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/api/debug/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}
// 测试用例接口
export const addAPICase = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/apicase/add/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getAPICaseList = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/apicase/list/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const delAPICase = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/apicase/del/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getAPICaseInfo = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/apicase/detail/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const editAPICase = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/apicase/update/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const debugAPICase = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/apicase/debug/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const runAPICase = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/apicase/run/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

// 任务接口
export const getCronJobList = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/cronjob/list/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getCronJobInfo = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/cronjob/detail/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const addCronJob = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/cronjob/add/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const delCronJob = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/cronjob/del/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const editCronJob = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/cronjob/update/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const editCronJobIsActive = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/cronjob/is_active/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

// 报告接口
export const getReportList = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/report/list/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const delReport = (data) => {
    return $http({
        method: "post",
        url: "http://127.0.0.1:8000/report/del/",
        params: {},
        data: data,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getReportInfo = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/report/detail/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getReportCaseInfo = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/report/case/detail/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}
// 首页统计接口
export const getAPIAcount = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/api/acount/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export const getAPICaseAcount = (params) => {
    return $http({
        method: "get",
        url: "http://127.0.0.1:8000/apicase/acount/",
        params: params,
        data: {},
        headers: {
            "Content-Type": "application/json"
        }
    });
}