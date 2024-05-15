<template>
    <el-breadcrumb separator="\" style="margin-bottom: 30px;">
        <el-breadcrumb-item :to="{ path: '/api/list' }">接口管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增接口</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
    <el-form :model="addform" label-width="120px" ref="ruleFormRef" class="apiform">
        <el-form-item label="接口名称" prop="name" :rules="[
            { required: true, message: '接口名称不能为空' },
            { min: 3, max: 30, message: '长度需要为3-30个字符' },
        ]">
            <el-input v-model="addform.name" />
        </el-form-item>
        <el-form-item label="描述" prop="description" :rules="[
            { max: 200, message: '长度不能大于200个字符' },
        ]">
            <el-input v-model="addform.description" type="textarea" />
        </el-form-item>

        <el-form-item label="所属模块" prop="module" :rules="[
            { required: true, message: '请选择所属模块' },
        ]">
            <el-tree-select v-model="addform.module" :data="moduleOptions" check-strictly :render-after-expand="false"
                style="width: 240px" />
        </el-form-item>

        <el-form-item label="路径" prop="uri" :rules="[
            { required: true, message: '路径不能为空' },
        ]">
            <el-input v-model="addform.uri" class="input-with-select">
                <template #prepend>
                    <el-select v-model="addform.method" style="width: 100px">
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
                <request-params ref="reqparams" v-model:params="addform.params" />

            </el-tab-pane>

            <el-tab-pane label="Body">
                <request-body ref="reqbody" v-model:body="addform.body" />


            </el-tab-pane>

            <el-tab-pane label="Headers">
                <request-header ref="reqheader" v-model:headers="addform.headers" />

            </el-tab-pane>

        </el-tabs>

        <el-form-item>
            <el-button type="primary" @click="goToSelectEnv">调试</el-button>
            <el-button @click="drawer = true">打开调试结果</el-button>
            <el-button type="primary" @click="onSubmit(ruleFormRef)" :loading="is_loading">保存</el-button>
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
import { ref, reactive, onMounted } from 'vue'
import { addAPI, getModuleList, debugAPI, getEnvironmentList } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"
import RequestParams from './RequestParams.vue';
import RequestBody from './RequestBody.vue';
import RequestHeader from './RequestHeader.vue';

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

const addform = reactive({
    name: '',
    description: '',
    module: parseInt(localStorage.getItem('api_module_id'),10),
    method: 'GET',
    uri: '',
    headers: {},
    params: {},
    body: {},
    response: {},
});

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

const is_loading= ref(false);

const onSubmit = async () => {

    const result = await assertForm()
    if (!result) return
    else {
        is_loading.value = true;
        // 发送到后端新增接口数据
        const res = await addAPI(addform);
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
            });
            is_loading.value = false;
        }
    }
}

const cancelBtn = () => {
    router.push('/api/list')
}

const reqparams = ref(null);
const reqbody = ref(null);
const reqheader = ref(null);

const getModuleFun = async () => {
    // 发送到后端获取列表数据
    const res = await getModuleList();
    if (res.status == true) {
        // 调用函数转换数据结构
        moduleOptions.value = renameKeyInTree(res.data, 'id', 'value');
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

const renameKeyInTree = (data, oldKey, newKey) => {
    const hasOwn = Object.prototype.hasOwnProperty;
    return data.map(item => {
        const newItem = {};
        for (const key in item) {
            if (hasOwn.call(item, key)) { // 使用hasOwnProperty的call方法并传递目标对象为第一个参数
                const newKeyToUse = key === oldKey ? newKey : key;
                newItem[newKeyToUse] = Array.isArray(item[key]) && item[key].some(child => child.children)
                    ? renameKeyInTree(item[key], oldKey, newKey)
                    : item[key];
            }
        }
        return newItem;
    });
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
    addform.host = formdata.host;
    if (addform.host === undefined) {
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
        // 发送调试
        const res = await debugAPI(addform);
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


onMounted(() => {
    getModuleFun();
    setTimeout(() => {
    }, 1000)
})
</script>