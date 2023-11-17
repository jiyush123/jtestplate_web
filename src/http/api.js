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


// // API
// export const getAPIList = (params) => {
//     return $http({
//         method: "get",
//         url: "http://127.0.0.1:8000/api/list/",
//         params: params,
//         data: {},
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
// }

// export const getAPIInfo = (params) => {
//     return $http({
//         method: "get",
//         url: "http://127.0.0.1:8000/api/detail/",
//         params: params,
//         data: {},
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
// }

// export const addAPI = (data) => {
//     return $http({
//         method: "post",
//         url: "http://127.0.0.1:8000/api/addsave/",
//         params: {},
//         data: data,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
// }

// export const editAPI = (data) => {
//     return $http({
//         method: "post",
//         url: "http://127.0.0.1:8000/api/update/",
//         params: {},
//         data: data,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
// }

// export const delAPI = (data) => {
//     return $http({
//         method: "post",
//         url: "http://127.0.0.1:8000/api/del/",
//         params: {},
//         data: data,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
// }

// export const debugAPI = (data) => {
//     return $http({
//         method: "post",
//         url: "http://127.0.0.1:8000/api/test/",
//         params: {},
//         data: data,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });
// }