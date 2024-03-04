<template>
    <el-breadcrumb separator="\" style="margin-bottom: 30px;">
        <el-breadcrumb-item :to="{ path: '/task/list' }">任务管理</el-breadcrumb-item>
        <el-breadcrumb-item>修改任务</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
    <el-form :model="editForm" label-width="auto" ref="ruleFormRef" class="cronjob_form">
        <el-form-item label="任务名称" prop="name" :rules="[
            { required: true, message: '任务名称不能为空' },
            { min: 3, max: 50, message: '长度需要为3-50个字符' },
        ]">
            <el-input v-model="editForm.name" />
        </el-form-item>

        <el-form-item label="执行环境" prop="env" :rules="[
            { required: true, message: '请选择执行环境' }
        ]">
            <el-select v-model="editForm.env" filterable placeholder="请选择">
                <el-option v-for="item in envOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>

        <el-form-item label="任务类型" prop="type" :rules="[
            { required: true, message: '请选择任务类型' }
        ]">
            <el-select v-model="editForm.type" filterable placeholder="请选择">
                <el-option label="定时执行" value="1" />
                <el-option label="只执行一次" value="2" />
            </el-select>
        </el-form-item>

        <el-form-item label="启用" prop="is_active">
            <el-switch v-model="editForm.is_active" />
        </el-form-item>

        <el-form-item label="执行时间Cron" prop="schedule" :rules="[
            { required: true, message: '请输入定时执行时间' }
        ]">
            <el-input v-model="editForm.schedule" />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
            <el-button @click="cancelBtn">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<style>
.cronjob_form {
    width: 80%;
    margin: auto
}
</style>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import router from "../router/index";
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getCronJobInfo, editCronJob, getEnvironmentList } from '../http/api';

const route = useRoute();
const id_params = route.params;
const envOptions = ref(null);

const getEnvironmentFun = async () => {
    // 发送到后端获取环境列表数据
    const res = await getEnvironmentList({ 'size': 100, 'page': 1 });
    if (res.status == true) {
        envOptions.value = res.data;
    }
    else {
        ElMessage({
            showClose: true,
            center: true,
            message: '请求失败',
            type: 'error',
        })
    }
}

const editForm = reactive({
    name: '',
    env: '',
    type: '',
    is_active: null,
    schedule:'',
    created_user: '',
});

// 创建一个新的 Map 对象作映射
let type = new Map();

// 添加键值对  
type.set('定时执行', '1');
type.set('只执行一次', '2');

// 获取接口信息
const getInfo = async () => {
    const res = await getCronJobInfo(id_params);
    if (res.status) {
        editForm.id = id_params.id;
        editForm.name = res.data.name;
        editForm.env = res.data.environment_id;
        editForm.type = type.get(res.data.type);
        editForm.is_active = res.data.is_active;
        editForm.schedule = res.data.schedule;
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

const ruleFormRef = ref(null);
// 这个方法是等待表单验证结果，因为返回的是promise.reject,所以要用try去捕捉异常再返回布尔值
const assertForm = async () => {
    try {
        await ruleFormRef.value.validate();
        return true
    } catch (e) {
        return false
    }
}

const onSubmit = async () => {

    const result = await assertForm()
    if (!result) return
    else {
        // 发送到后端新增接口数据
        console.log(editForm)
        const res = await editCronJob(editForm);
        if (res.status) {
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'success',
            })
            router.push('/task/list');
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
}

const cancelBtn = () => {
    router.push('/task/list');
}

onMounted(() => {
    getEnvironmentFun();
    getInfo();
    setTimeout(() => {
    }, 1000)
})
</script>