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
        <el-button @click="goToSelectCase">选择关联用例</el-button>
        <el-text style="margin-left: 10px;">已选：{{ case_nums }} 条用例</el-text>
        <el-form-item label="启用" prop="is_active">
            <el-switch v-model="editForm.is_active" />
        </el-form-item>

        <cron-module ref="cron" v-model:schedule="editForm.schedule"></cron-module>

        <el-form-item>
            <el-button type="primary" @click="onSubmit(ruleFormRef)" :loading="is_loading">保存</el-button>
            <el-button @click="cancelBtn">取消</el-button>
        </el-form-item>
    </el-form>
    <!-- 选择用例弹窗 -->
    <el-dialog v-model="Dialog" title="选择用例" width="60%" align-center @close="cancelDialog(formRef)">
        <!-- 搜索栏 -->
        <el-form ref="formRef" :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
            <el-form-item label="用例名称" prop="name">
                <el-input v-model="queryForm.name" clearable />
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="queryForm.status" clearable placeholder="请选择">
                    <el-option v-for="item in status_options" :key="item.value" :label="item.label"
                        :value="item.value" />
                </el-select>
            </el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
        </el-form>
        <!-- 列表 -->
        <el-table ref="caseTable" :data="case_data.table" stripe style="width: 100%" show-overflow-tooltip
            :row-key="getRowKey" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :reserve-selection="true" width="50" fixed />
            <el-table-column prop="id" label="id" width="50" fixed />
            <el-table-column prop="name" label="用例名称" width="200" fixed />
            <el-table-column prop="level" label="优先级">
                <template #default="scope">
                    <el-tag v-if="scope.row.level === '1'" class="ml-2" type="danger">
                        {{ scope.row.level }}
                    </el-tag>
                    <el-tag v-else-if="scope.row.level === '2'" class="ml-2" type="warning">
                        {{ scope.row.level }}
                    </el-tag>
                    <el-tag v-else-if="scope.row.level === '3'" class="ml-2" type="primary">
                        {{ scope.row.level }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" />
            <el-table-column prop="result" label="结果">
                <template #default="scope">
                    <el-tag v-if="scope.row.result === '成功'" class="ml-2" type="success">
                        {{ scope.row.result }}
                    </el-tag>
                    <el-tag v-else-if="scope.row.result === '失败'" class="ml-2" type="danger">
                        {{ scope.row.result }}
                    </el-tag>
                    <el-tag v-else-if="scope.row.result === '无'" class="ml-2" type="info">
                        {{ scope.row.result }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="last_time" label="最后一次执行时间" width="200" />
            <el-table-column prop="updated_time" label="修改时间" width="200" />
        </el-table>
        <!-- 分页模板 -->
        <el-row>
            <el-col :span="8">
                <el-button type="primary" @click="sureCases">确定</el-button>
            </el-col>
            <el-col :span="16">
                <PaginationModule ref="pagemodule" :total="case_data.total" :getListFun="getAPICaseListFun" />
            </el-col>
        </el-row>
    </el-dialog>
</template>

<style>
.cronjob_form {
    width: 80%;
    margin: auto
}
</style>

<script setup>
import { reactive, ref, onMounted, computed } from 'vue';
import router from "../router/index";
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getCronJobInfo, editCronJob, getEnvironmentList, getAPICaseList } from '../http/api';

import CronModule from './CronModule.vue';
import PaginationModule from './PaginationModule.vue'

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
    case_ids: [],
    schedule: ''
});

// 选择用例弹窗参数
const caseTable = ref('')
const Dialog = ref(false);
const formRef = ref('');
const case_info = ref([]);
let case_data = reactive({
    table: [],
    total: 0,
})
let params = {
    "page": 1,
    "size": 10,
}
// 分页组件实例，用来调用里面重置页码的方法
const pagemodule = ref('')
// 枚举映射
const status_options = [{
    value: '1',
    label: '未开始',
},
{
    value: '2',
    label: '进行中',
},
{
    value: '3',
    label: '已完成',
},]

let queryForm = reactive({
    name: '',
    status: '',
})
const queryList = () => {
    if (queryForm.name == '') {
        delete params.name;
    } else {
        params.name = queryForm.name;
    }
    if (queryForm.status == '') {
        delete params.status;
    } else {
        params.status = queryForm.status;
    }
    getAPICaseListFun(params)
}

const getAPICaseListFun = async (paramdata) => {
    params.page = paramdata.page;
    params.size = paramdata.size;
    // 发送到后端获取列表数据
    const res = await getAPICaseList(params);
    case_data.table = res.data;
    case_data.total = res.total;
    // 切换页码后回显选项
    echoSelect()
}

const goToSelectCase = async () => {
    Dialog.value = true;
    await getAPICaseListFun(params);
    echoSelect()
}

// 回显
const echoSelect = () => {
    case_data.table.forEach(row => {
        if (editForm.case_ids.includes(row.id)) {
            caseTable.value.toggleRowSelection(row, true)
        }
        else {
            caseTable.value.toggleRowSelection(row, false)
        }
    })
}

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
        editForm.case_ids = res.data.case_ids;
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

const getRowKey = (row) => {
    return row.id;
}

const handleSelectionChange = (selection) => {
    case_info.value = selection
}

const cancelDialog = (formEl) => {
    params = {
        "page": 1,
        "size": 10,
    }
    // 取消弹窗，重置搜索条件，重置未确定选项在echoSelect方法处理，重置分页组件
    pagemodule.value.resetParams();
    Dialog.value = false;
    if (!formEl) return
    formEl.resetFields();
}

const sureCases = () => {
    editForm.case_ids.length = 0;
    for (let i = 0; i < case_info.value.length; i++) {
        editForm.case_ids.push(case_info.value[i].id)
    }
    cancelDialog();
}

const case_nums = computed(() => {
    return editForm.case_ids.length
})

// cron组件
const cron = ref(null);

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

const is_loading = ref(false);

const onSubmit = async () => {

    const result = await assertForm()
    if (!result) return
    else {
        is_loading.value = true;
        // 发送到后端新增接口数据
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
            });
            is_loading.value = false;
        }
    }
}

const cancelBtn = () => {
    router.push('/task/list');
}

const getInfoFun = async () => {
    await getInfo();
    // 等待详情返回后再进行cron转换回显
    cron.value.getStrCron()
}

onMounted(() => {
    getEnvironmentFun();
    getInfoFun();
    setTimeout(() => {
    }, 1000)
})
</script>