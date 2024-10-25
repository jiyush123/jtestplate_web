<template>
    <el-breadcrumb separator="\" style="margin-bottom: 30px;">
        <el-breadcrumb-item :to="{ path: '/apicase/list' }">接口管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增接口测试用例</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
    <el-form :model="addForm" label-width="auto" ref="ruleFormRef" class="api_case_form">
        <el-form-item label="测试用例名称" prop="name" :rules="[
            { required: true, message: '测试用例名称不能为空' },
            { min: 3, max: 30, message: '长度需要为3-30个字符' },
        ]">
            <el-input v-model="addForm.name" />
        </el-form-item>

        <el-form-item label="优先级" prop="level" :rules="[
            { required: true, message: '请选择优先级' }
        ]">
            <el-select v-model="addForm.level" filterable placeholder="请选择">
                <el-option label="1" value="1" />
                <el-option label="2" value="2" />
                <el-option label="3" value="3" />
            </el-select>
        </el-form-item>
        <el-row class="handle_info" :gutter="20">
            <el-col :span="4">
                <el-button type="primary" @click="AddStep">新增步骤</el-button>
            </el-col>
            <el-col :span="4">
                <el-text class="mx-1">耗时：</el-text>
                <el-text class="mx-1" type="primary">{{ addForm.time }}</el-text>
                <el-text class="mx-1">ms</el-text>
            </el-col>
            <el-col :span="4">
                <el-text class="mx-1" style="margin-left: 5px;">结果：</el-text>
                <el-text class="mx-1" v-if="addForm.result === 'success'" type="success" style="margin-right: 5px;">{{
                    addForm.result
                }}</el-text>
                <el-text class="mx-1" v-else type="danger" style="margin-right: 5px;">{{ addForm.result
                }}</el-text>
            </el-col>
            <el-col :span="8">
                <el-button type="primary" @click="goToSelectEnv">运行环境</el-button>
                <span style="margin-left: 10px;">
                    {{ env.host }}
                </span>
            </el-col>
            <el-col :span="4" class="debugBtn">
                <el-button type="primary" @click="debug">调试</el-button>
            </el-col>
        </el-row>
        <!-- 选择运行环境弹窗 -->
        <el-dialog v-model="envDialog" title="选择运行环境" width="40%" align-center @close="cancelDialog(envformRef)">
            <el-form :model="envdata" label-width="80px" ref="envformRef">
                <el-form-item label="运行环境" prop="host">
                    <el-select v-model="envdata.host" filterable placeholder="请选择" style="width: 400px;">
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
                    <el-button type="primary" @click="sureEnv(envformRef)">
                        确定
                    </el-button>
                    <el-button @click="cancelDialog(envformRef)">取消</el-button>
                </span>
            </template>
        </el-dialog>

        <!-- 测试步骤 -->
        <draggable v-model="addForm.steps" @end="onDragEnd" handle=".el-collapse-item__header">
            <transition-group>
                <div v-for="(step, index) in addForm.steps" :key="`step_${index}`" style="margin:10px">
                    <el-collapse>
                        <el-collapse-item :name="index">

                            <template #title>
                                {{ step.title + (index + 1) }}
                                <el-button type="primary" @click="APIDialog(index)" style="margin:auto;"
                                    @click.stop>选择接口</el-button>
                                <el-form-item label="步骤名称" :prop="'steps.' + index + '.name'"
                                    style="margin:auto; width: 300px;" :rules="[
                                        { required: true, message: '步骤名称不能为空' },
                                        { min: 3, max: 30, message: '长度需要为3-30个字符' },
                                    ]">
                                    <el-input v-model="step.name" @click.stop/>
                                </el-form-item>

                                <el-text class="mx-1">耗时：</el-text>
                                <el-text class="mx-1" type="primary">{{ step.time }}</el-text>
                                <el-text class="mx-1">ms</el-text>


                                <el-text class="mx-1" style="margin-left: 5px;">结果：</el-text>
                                <el-text class="mx-1" v-if="step.result === 'success'" type="success"
                                    style="margin-right: 5px;">{{ step.result }}</el-text>
                                <el-text class="mx-1" v-else type="danger" style="margin-right: 5px;">{{ step.result
                                }}</el-text>


                                <el-button class="mt-2" type="danger" @click.prevent="removeDomain(step)"
                                    @click.stop>删除步骤</el-button>
                            </template>

                            <!-- 请求方式，路径 -->

                            <el-form-item label="路径" :prop="'steps.' + index + '.uri'" :rules="[
                                { required: true, message: '路径不能为空' },
                            ]">
                                <el-input v-model="step.uri" class="input-with-select">
                                    <template #prepend>
                                        <el-select v-model="step.method" style="width: 100px">
                                            <el-option label="GET" value="GET" />
                                            <el-option label="POST" value="POST" />
                                        </el-select>
                                    </template>
                                </el-input>
                            </el-form-item>

                            <!-- TAB -->
                            <el-tabs type="border-card" style="min-width: 800px">
                                <!-- 调试params封装子组件 -->
                                <el-tab-pane label="Params">
                                    <request-params :ref=paramsRef(index) v-model:params="step.params" />

                                </el-tab-pane>

                                <el-tab-pane label="Body">
                                    <request-body :ref=bodyRef(index) v-model:body="step.body" />

                                </el-tab-pane>

                                <el-tab-pane label="Headers">
                                    <request-header :ref=headersRef(index) v-model:headers="step.headers" />

                                </el-tab-pane>

                                <el-tab-pane label="断言">
                                    <request-assert :ref=assertRef(index) v-model:assert="step.assert_result" />

                                </el-tab-pane>

                                <el-tab-pane label="提取参数">
                                    <request-extract :ref=extractRef(index) v-model:extract="step.extract" />

                                </el-tab-pane>

                                <el-tab-pane label="前置处理">
                                    <el-form-item>

                                        <monaco-edit :ref=beforecodeRef(index) v-model:code="step.before_code" />

                                    </el-form-item>
                                </el-tab-pane>
                                <el-tab-pane label="后置处理">
                                    <el-form-item>

                                        <monaco-edit :ref=aftercodeRef(index) v-model:code="step.after_code" />

                                    </el-form-item>
                                </el-tab-pane>
                            </el-tabs>
                            <!-- 返回响应 -->
                            <el-form-item label="返回响应" :prop="'steps.' + index + '.response'">
                                <el-input v-model="step.response" type="textarea" autosize disabled />
                            </el-form-item>

                        </el-collapse-item>
                    </el-collapse>
                </div>
            </transition-group>
        </draggable>
    </el-form>

    <el-button type="primary" class="api_case_save_btn" @click="onSubmit(ruleFormRef)" :loading="is_loading">保存</el-button>
    <el-button class="api_case_cancel_btn" @click="cancelBtn">取消</el-button>

    <!-- 弹窗 -->
    <el-dialog v-model="Dialog" title="选择接口" width="60%" align-center @close="cancelDialog(formRef)">
        <!-- 搜索栏 -->
        <el-form :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
            <el-form-item label="接口名称" prop="name">
                <el-input v-model="queryForm.name" clearable />
            </el-form-item>
            <el-form-item label="所属模块" prop="module">
                <el-input v-model="queryForm.module" clearable />
            </el-form-item>
            <el-button type="primary" @click="queryList">查询</el-button>
        </el-form>
        <!-- 列表 -->
        <el-table :data="data.table" stripe style="width: 100%" show-overflow-tooltip>
            <el-table-column prop="id" label="id" width="50px" fixed />
            <el-table-column prop="name" label="接口名称" width="200px" fixed />
            <el-table-column prop="description" label="描述" width="100px" />
            <el-table-column prop="module" label="所属模块" width="100px" />
            <el-table-column prop="method" label="请求方式" width="100px">
                <template #default="scope">
                    <el-tag v-if="scope.row.method === 'GET'" class="ml-2" type="success">
                        {{ scope.row.method }}
                    </el-tag>
                    <el-tag v-else-if="scope.row.method === 'POST'" class="ml-2" type="primary">
                        {{ scope.row.method }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="uri" label="路径" width="300px" />
            <el-table-column label="操作" fixed="right">
                <template #default="scope">
                    <el-button type="primary" size="small" @click="SelectApi(scope.row.id)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
        <PaginationModule ref="pagemodule" :total="data.total" :getListFun="getApiListFun" />
    </el-dialog>
</template>

<style>
.api_case_form {
    width: 70%;
    margin: auto
}

.api_case_save_btn {
    margin-left: 40%;
}

.api_case_cancel_btn {
    margin-left: 40%;
}

.handle_info {
    height: 40px;
}

.handle_info .el-col {
    display: flex;
    height: 100%;
    align-items: center;
}

.el-collapse-item__header {
    height: 60px;
}

.debugBtn {
    justify-content: flex-end;
}
</style>

<script setup>
import { ref, reactive, nextTick } from 'vue';
import router from "../router/index";
import { getAPIList, getAPIInfo, addAPICase, getEnvironmentList, debugAPICase } from '../http/api';
import { ElMessage } from 'element-plus';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';
import PaginationModule from './PaginationModule.vue';
import MonacoEdit from './MonacoEdit.vue';
import RequestParams from './RequestParams.vue';
import RequestBody from './RequestBody.vue';
import RequestHeader from './RequestHeader.vue';
import RequestExtract from './RequestExtract.vue';
import RequestAssert from './RequestAssert.vue';

const Dialog = ref(false);
const envDialog = ref(false);
const envOptions = ref(null);

const envdata = reactive({
    host: ''
})

const env = reactive({})

const goToSelectEnv = () => {
    envDialog.value = true;
    getEnvironmentFun();
}

const sureEnv = (formEl) => {
    env.host = envdata.host;
    cancelDialog(formEl);
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

let params = {
    "page": 1,
    "size": 10,
};
// 分页组件实例，用来调用里面重置页码的方法
const pagemodule = ref('')

let data = reactive({
    table: [],
    total: 0,
})
const queryForm = reactive({
    name: '',
    module: '',
})

const APIDialog_id = ref(null);
const APIDialog = async (index) => {
    // 打开弹窗，请求接口
    queryForm.name = '';
    queryForm.module = '';
    Dialog.value = true;
    APIDialog_id.value = index;
    getApiListFun(params)
}

const cancelDialog = (formEl) => {
    // 取消弹窗，重置
    params = {
        "page": 1,
        "size": 10,
    }
    if (pagemodule.value !== ''){
        pagemodule.value.resetParams();
    }
    Dialog.value = false;
    envDialog.value = false;
    if (!formEl) return
    formEl.resetFields();
}

const queryList = () => {
    if (queryForm.name == '') {
        delete params.name;
    } else {
        params.name = queryForm.name;
    }
    if (queryForm.module == '') {
        delete params.module;
    } else {
        params.module = queryForm.module;
    }
    getApiListFun(params)
}

const getApiListFun = async (params) => {
    // 发送到后端获取列表数据
    const res = await getAPIList(params);
    data.table = res.data;
    data.total = res.total
}

const addForm = reactive({
    name: '',
    level: '',
    status: 1,
    steps: [{
        id: null,
        title: "步骤",
        sort: null,
        name: '',
        method: 'GET',
        uri: '',
        headers: {},
        params: {},
        body: {},
        time: '',
        result: '',
        response: '',
        assert_result: {},
        extract: {},
        before_code: ref(''),
        after_code: ref(''),
    }],
    time: '',
    result: '',
})


const AddStep = () => {
    addForm.steps.push({
        title: "步骤",
        sort: null,
        name: '',
        method: 'GET',
        uri: '',
        headers: {},
        params: {},
        body: {},
        time: '',
        result: '',
        response: '',
        assert_result: {},
        extract: {},
        before_code: ref(''),
        after_code: ref(''),
    });
}

const removeDomain = (step) => {
    const index = addForm.steps.indexOf(step)
    if (index !== -1) {
        addForm.steps.splice(index, 1);
    }
}

const cancelBtn = () => {
    router.push('/apicase/list');
}

const paramschildRefs = ref({});
const paramsRef = (index) => {
    return (el) => {
        paramschildRefs.value[index] = el;
    }
}

const bodychildRefs = ref({});
const bodyRef = (index) => {
    return (el) => {
        bodychildRefs.value[index] = el;
    }
}

const headerschildRefs = ref({});
const headersRef = (index) => {
    return (el) => {
        headerschildRefs.value[index] = el;
    }
}

const extractchildRefs = ref({});
const extractRef = (index) => {
    return (el) => {
        extractchildRefs.value[index] = el;
    }
}

const assertchildRefs = ref({});
const assertRef = (index) => {
    return (el) => {
        assertchildRefs.value[index] = el;
    }
}

const beforecodechildRefs = ref({});
const beforecodeRef = (index) => {
    return (el) => {
        beforecodechildRefs.value[index] = el;
    }
}

const aftercodechildRefs = ref({});
const aftercodeRef = (index) => {
    return (el) => {
        aftercodechildRefs.value[index] = el;
    }
}

const SelectApi = async (id) => {
    const APIid = { 'id': id };
    const res = await getAPIInfo(APIid);
    if (res.status) {
        // 测试步骤赋值
        addForm.steps[APIDialog_id.value].name = res.data.name;
        addForm.steps[APIDialog_id.value].method = res.data.method;
        addForm.steps[APIDialog_id.value].uri = res.data.uri;
        const headers = {};
        const params = {};
        const body = {};
        // 请求头
        for (let key in res.data.headers) {
            let value = res.data.headers[key];
            headers[key] = { 'value': value.value, 'datatype':value.datatype, 'decription': value.decription }
        }
        addForm.steps[APIDialog_id.value].headers = headers;
        // 请求参数
        for (let key in res.data.params) {
            let value = res.data.params[key];
            params[key] = { 'value': value.value, 'datatype':value.datatype, 'decription': value.decription }
        }
        addForm.steps[APIDialog_id.value].params = params;
        // 请求体
        for (let key in res.data.body) {
            let value = res.data.body[key];
            body[key] = { 'value': value.value, 'datatype':value.datatype, 'decription': value.decription }
        }
        addForm.steps[APIDialog_id.value].body = body;
        await nextTick();
        headerschildRefs.value[APIDialog_id.value].getHeaders();
        paramschildRefs.value[APIDialog_id.value].getParams();
        bodychildRefs.value[APIDialog_id.value].getBody();
        // 重置耗时，结果，响应
        addForm.steps[APIDialog_id.value].time = '';
        addForm.steps[APIDialog_id.value].result = '';
        addForm.steps[APIDialog_id.value].response = '';
    }
    else {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'error',
        })
    }
    cancelDialog();
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

const is_loading = ref(false);
const onSubmit = async () => {
    const result = await assertForm()
    if (!result) return
    else {
        is_loading.value = true

        for (let i = 0; i < addForm.steps.length; i++) {
            addForm.steps[i].sort = i;
            delete addForm.steps[i].response;
            delete addForm.steps[i].time;
            delete addForm.steps[i].result;
            // 保存时删除调试的断言结果
            if (addForm.steps[i].assert_result) {
                for (const key in addForm.steps[i].assert_result) {
                    if (addForm.steps[i].assert_result[key] && addForm.steps[i].assert_result[key].result !== undefined) {
                        delete addForm.steps[i].assert_result[key].result;
                    }
                }
            }
        }
        // 发送到后端新增数据
        delete addForm.result;
        delete addForm.time;
        delete addForm.env;
        const res = await addAPICase(addForm);
        if (res.status) {
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'success',
            })
            router.push('/apicase/list');
        }
        else {
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'error',
            })
            is_loading.value = false;
        }
    }
}

const debug = async () => {
    delete addForm.result;
    delete addForm.time;
    for (let i = 0; i < addForm.steps.length; i++) {
        delete addForm.steps[i].response;
        delete addForm.steps[i].result;
        delete addForm.steps[i].time;
    }
    addForm.env = env.host;
    if (addForm.env === undefined) {
        ElMessage({
            showClose: true,
            center: true,
            message: '请选择运行环境',
            type: 'error',
        })
        return
    }
    const result = await assertForm()
    if (!result) return
    else {

        for (let i = 0; i < addForm.steps.length; i++) {
            addForm.steps[i].sort = i;
        }
        // 发送到后端调试
        const res = await debugAPICase(addForm);
        // 重置调试结果
        addForm.result = '';
        if (res.status) {
            addForm.time = 0
            for (let i = 0; i < addForm.steps.length; i++) {
                // 断言结果赋值
                // 先检查 addForm.steps[i] 是否存在，接着确认 .assert_result 是否存在且是一个对象，最后才检查其键的数量。
                // 这有助于防止因 undefined 或 null 值引发的错误。
                if (addForm.steps[i] && addForm.steps[i].assert_result && typeof addForm.steps[i].assert_result === 'object'
                    && Object.keys(addForm.steps[i].assert_result).length === 0) {
                    addForm.steps[i].result = 'success';
                }
                else {
                    //{key:{value:xxx,result:xxx}}
                    for (let key in addForm.steps[i].assert_result) {
                        addForm.steps[i].assert_result[key].result = res.data.res[i].assert_info[key].result;
                        // 步骤断言结果是否包含error，包含将步骤结果设置为error，并用例变成error
                        if (addForm.steps[i].assert_result[key].result === 'error') {
                            addForm.steps[i].result = 'error';
                            addForm.result = 'error';
                        }
                    }
                    if (addForm.steps[i].result !== 'error') {
                        addForm.steps[i].result = 'success';
                    }
                    assertchildRefs.value[i].assertResult()
                }

                addForm.steps[i].time = res.data.res[i].run_time;
                const response = JSON.stringify(res.data.res[i].response, null, 2);
                addForm.steps[i].response = 'status:' + res.data.res[i].status + '\n'
                    + 'status_code:' + res.data.res[i].status_code + '\n'
                    + 'response:' + response;
                //将步骤时间合计到总时间
                addForm.time = addForm.steps[i].time + addForm.time;
            }
            
            // 如果用例没有设置成error，则将结果设置为success
            if (addForm.result !== 'error') {
                addForm.result = 'success';
            }

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
}

const onDragEnd = () => {
    // 拖动结束重新对子组件赋值回显
    for (let i = 0; i < addForm.steps.length; i++) {
        paramschildRefs.value[i].getParams();
        bodychildRefs.value[i].getBody();
        headerschildRefs.value[i].getHeaders();
        extractchildRefs.value[i].getExtract();
        assertchildRefs.value[i].getAssert();
    }
}

</script>