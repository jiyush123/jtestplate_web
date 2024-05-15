<template>
    <div class="Login">
        <h1 class="login_title">测试平台</h1>
        <el-form :model="logindata">
            <el-form-item label="账号">
                <el-input v-model="logindata.username" placeholder="请输入账号" />
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="logindata.password" type="password" placeholder="请输入密码" show-password />
            </el-form-item>
            <el-form-item>
                <el-button @click="subFun" class="sub-btn" type="primary" :is-loading="isLoading">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<style scoped>
.Login {
    width: 500px;
    margin: 150px auto;
    border: 1px solid #efefef;
    border-radius: 10px;
    padding: 20px;
}

.login_title {
    margin-top: 0px;
    margin-bottom: 10px;
    text-align: center;
}

.sub-btn {
    width: 100%;
}
</style>
<script setup>
import { ref,reactive } from "vue";
import { ElMessage } from 'element-plus';
import { login } from '../http/api';
import router from "../router/index.js";


const logindata = reactive({
    username: '',
    password: '',
})

const isLoading = ref(false);

const subFun = async () => {
    // 判断账号密码是否为空
    if (!logindata.username || !logindata.password) {
        ElMessage.error('账号密码不能为空');
        return
    }
    // 发送到后端校验账号密码
    isLoading.value = true;
    const res = await login(logindata);
    
    if (res.status) {
        //先把已有的信息删除
        localStorage.removeItem('user_id');
        localStorage.removeItem('name');
        localStorage.removeItem('token');

        //这里保存token和user_id和username
        localStorage.setItem('user_id', res.data.user_id);
        localStorage.setItem('name', res.data.name);
        localStorage.setItem('token', res.data.token);

        router.push('/home');
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
    } else {
        ElMessage.error(res.msg);
        isLoading.value = false;
        return
    }

}

</script>