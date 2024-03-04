<template>
    <el-breadcrumb separator="/" style="margin-bottom: 30px;">
        <el-breadcrumb-item :to="{ path: '/api/list' }">接口管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑接口</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
            <!-- 下面是页面表单 -->
            <el-form :model="editform" label-width="120px" ref="ruleFormRef" class="apiform">
                <el-form-item label="接口名称" prop="name" :rules="[
                    { required: true, message: '接口名称不能为空' },
                    { min: 3, max: 30, message: '长度需要为3-30个字符' },
                ]">
                    <el-input v-model="editform.name" />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="editform.status">
                        <el-option label="未开始" value="1" />
                        <el-option label="进行中" value="2" />
                        <el-option label="已完成" value="3" />
                    </el-select>
                </el-form-item>
                <el-form-item label="接口描述" prop="description" :rules="[
                    { max: 200, message: '长度不能大于200个字符' },
                ]">
                    <el-input v-model="editform.description" type="textarea" />
                </el-form-item>

                <el-form-item label="所属模块" prop="module" :rules="[
                    { required: true, message: '请选择所属模块' },
                ]">
                    <el-select v-model="editform.module" filterable placeholder="请选择">
                        <el-option v-for="item in moduleOptions" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="路径" :prop="uri" :rules="[
            { required: true, message: '路径不能为空' },
        ]">
            <el-input v-model="editform.uri" class="input-with-select">
                <template #prepend>
                    <el-select v-model="editform.method" style="width: 100px">
                        <el-option label="GET" value="GET" />
                        <el-option label="POST" value="POST" />
                    </el-select>
                </template>
            </el-input>
        </el-form-item>
        <!-- TAB -->
        <el-tabs type="border-card" style="min-width: 800px;margin-bottom:10px">
            <!-- 调试params封装子组件 -->
            <el-tab-pane label="Params">
                <request-params ref="reqparams" v-model:params="editform.params" />

            </el-tab-pane>

            <el-tab-pane label="Body">
                <request-body ref="reqbody" v-model:body="editform.body" />


            </el-tab-pane>

            <el-tab-pane label="Headers">
                <request-header ref="reqheader" v-model:headers="editform.headers" />

            </el-tab-pane>

        </el-tabs>

                <el-form-item>
                    <el-button type="primary" @click="goToSelectEnv">调试</el-button>
                    <el-button @click="drawer = true">打开调试结果</el-button>
                    <el-button type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
                    <el-button @click="cancelBtn">取消</el-button>
                </el-form-item>
            </el-form>
    <!-- 弹窗 -->
    <el-dialog v-model="Dialog" title="选择运行环境" width="40%" align-center @close="cancelDialog(formRef)">
        <el-form :model="formdata" label-width="80px" ref="formRef">
            <el-form-item label="运行环境" prop="host" :rules="[
                { required: true, message: '请选择运行环境' },
            ]">
                <el-select v-model="formdata.host" filterable placeholder="请选择" style="width: 400px;">
                    <el-option v-for="item in envOptions" :key="item.id"
                        :label="item.name + '    ' + item.protocol + '://' + item.host + ':' + item.port"
                        :value="item.protocol + '://' + item.host + ':' + item.port">

                        <span style="float: left">{{ item.name }}</span>
                        <span style="float: right;font-size: 13px;">
                            {{ item.protocol + '://' + item.host + ':' + item.port }}
                        </span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancelDialog(formRef)">取消</el-button>
                <el-button type="primary" @click="debug">
                    运行
                </el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 调试结果侧边弹窗 -->
    <el-drawer v-model="drawer" title="调试结果">
        <span>status:{{ debug_res.status }}</span><br>
        <span>status_code:{{ debug_res.status_code }}</span><br>
        <span>response:</span>
        <pre>{{ debug_res.response }}</pre>
    </el-drawer>
</template>

<style>
.apiform {
    width: 80%;
    margin: auto
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}

.input-with-select .el-select {
    width: 90px;
}
</style>

<script setup>
import { ref, reactive, onMounted,nextTick } from 'vue'
import { getAPIInfo, editAPI, getModuleList, getEnvironmentList, debugAPI } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"
import { useRoute } from 'vue-router'
import RequestParams from './RequestParams.vue';
import RequestBody from './RequestBody.vue';
import RequestHeader from './RequestHeader.vue';

const route = useRoute();
const id_params = route.params;

const moduleOptions = ref(null);

// 这里是弹窗选择环境的参数
const Dialog = ref(false);
const formRef = ref(null);
const formdata = reactive({
    host: ''
})
const envOptions = ref(null);
// 这里是调试结果弹窗
const drawer = ref(false);
const debug_res = reactive({
    status: '',
    status_code: '',
    response: ''
})

// 创建一个新的 Map 对象作映射
let status = new Map();

// 添加键值对  
status.set('未开始', '1');
status.set('进行中', '2');
status.set('已完成', '3');

const reqparams = ref(null);
const reqbody = ref(null);
const reqheader = ref(null);

const editform = reactive({
    name: '',
    status: '',
    description: '',
    module: '',
    method: '',
    uri: '',
    headers: {},
    params: {},
    body: {},
    response: '',
    updated_user: ""
});

// 获取接口信息
const getInfo = async () => {
    const res = await getAPIInfo(id_params);
    if (res.status) {
        editform.id = id_params.id;
        editform.name = res.data.name;
        editform.status = status.get(res.data.status);
        editform.description = res.data.description;
        editform.module = res.data.mod_id;
        editform.method = res.data.method;
        editform.uri = res.data.uri;
        editform.response = res.data.response;
        editform.headers = res.data.headers;
        editform.params = res.data.params;
        editform.body = res.data.body;
        await nextTick();
        // 改变prop值时，需要nextTick才能立即同步到子组件
        reqheader.value.getHeaders();
        reqparams.value.getParams();
        reqbody.value.getBody();
        
        editform.response = res.data.response;
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
        editform.params = reqparams.value.formatParams();
        editform.body = reqbody.value.formatBody();
        editform.headers = reqheader.value.formatHeaders();
        
        // 发送到后端新增用户数据
        editform.updated_user = localStorage.getItem('name');
        const res = await editAPI(editform);
        if (res.status) {
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'success',
            })
            router.push('/api/list');
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
    router.push('/api/list');
}

const goToSelectEnv = () => {

    Dialog.value = true;
    getEnvironmentFun();
}

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

const cancelDialog = (formEl) => {
    // 取消弹窗，重置
    Dialog.value = false;
    if (!formEl) return
    formEl.resetFields();
}

const debug = async () => {
    editform.host = formdata.host;
    if (editform.host === undefined) {
        ElMessage({
            showClose: true,
            center: true,
            message: '请选择运行环境',
            type: 'error',
        })
        return
    }
    const result = await assertForm();
    if (!result) return
    else {
        editform.params = reqparams.value.formatParams();
        editform.body = reqbody.value.formatBody();
        editform.headers = reqheader.value.formatHeaders();
        // 发送调试
        const res = await debugAPI(editform);
        try {
        if (res.status) {
            const response = JSON.stringify(res.response, null, 2);
            debug_res.response = response;
            debug_res.status_code = res.status_code;
            debug_res.status = res.status;

            drawer.value = true;
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'success',
            })
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
        catch {
            ElMessage({
                showClose: true,
                center: true,
                message: '请求异常',
                type: 'error',
            })
        }
        cancelDialog();
    }
}

const getModuleFun = async () => {
    // 发送到后端获取模块列表数据
    const res = await getModuleList();
    if (res.status == true) {
        moduleOptions.value = res.data;
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

onMounted(() => {
    getModuleFun();
    getInfo();
    setTimeout(() => {
    }, 1000)
})
</script>