<template>
    <div class="Home">
        <el-container>
            <el-header class="top-menu" style="padding: 0;">
                <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false">
                    <el-menu-item index="0">LOGO</el-menu-item>
                    <div class="flex-grow"></div>
                    <el-sub-menu index="1">
                        <template #title>{{ name }}</template>
                        <el-menu-item index="1-1">个人信息</el-menu-item>
                        <el-menu-item @click="out">退出</el-menu-item>
                    </el-sub-menu>
                </el-menu>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-col>
                        <el-menu :router="true" default-active="1" class="el-menu-vertical-demo">

                            <el-menu-item :route="i.path" v-for="i in tablist" :key="i.name" :index="i.name" :visible="i.meta.isShow">
                                <template #title>{{ i.meta.title }}</template>
                            </el-menu-item>
                        </el-menu>
                    </el-col>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<style>
.flex-grow {
    flex-grow: 1;
}

.top-menu .el-menu {
    background: #f2f1f1;
}

.el-aside .el-menu-item {
    font-size: 18px !important;
}

.el-aside .el-sub-menu__title {
    font-size: 18px !important;
}
/* 下面是其他页面通用的样式 */

.queryForm {
    margin: 0;
}

.queryForm .el-form-item {
    margin-bottom: 0;
    margin-right: 10px;
}

.demo-pagination-block {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.addBtn {
    margin-top: 20px;
    margin-bottom: 10px;
    display: flex;
}

.listquery .el-input {
    width: 200px;
}
</style>
<script setup>
import { ref } from "vue";
import router from "../router/index";
import { logout } from '../http/api';
import { ElMessage } from 'element-plus';

const activeIndex = ref('1');

let tablist = router.options.routes[0].children;
let showmenus=() =>{
    tablist = tablist.filter(tablist => tablist.meta.isShow);
}
showmenus();
const name = ref(localStorage.getItem('name'));
const user_id = ref(localStorage.getItem('user_id'));

const out=async() =>{
    // 获取用户信息
    const res = await logout({'id':user_id.value});
        if (res.status) {
        // 清除登录信息
        localStorage.removeItem('user_id');
        localStorage.removeItem('name');
        localStorage.removeItem('token');
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        router.push('/login');
        }
        else {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'error',
        })
        }
}
</script>