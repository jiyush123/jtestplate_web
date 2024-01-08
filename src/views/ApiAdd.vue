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
            <el-select v-model="addform.module" filterable placeholder="请选择">
                <el-option v-for="item in moduleOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
        </el-form-item>


        <el-form-item label="请求方式" prop="method" :rules="[
            { required: true, message: '请选择请求方式' },
        ]">
            <el-radio-group v-model="addform.method">
                <el-radio label="GET" />
                <el-radio label="POST" />
            </el-radio-group>
        </el-form-item>
        <el-form-item label="路径" prop="uri" :rules="[
            { required: true, message: '路径不能为空' },
        ]">
            <el-input v-model="addform.uri" />
        </el-form-item>
        <!-- 请求头 -->
        <el-form-item label="Headers">
            <el-table :data="headersData" border style="width: 700px">
                <el-table-column prop="headerskey" label="Keys" width='200'>
                    <template #default="scope">
                        <el-input v-model="headersData[scope.$index].headerskey" />
                    </template>
                </el-table-column>
                <el-table-column prop="headersvalue" label="Values" width='200'>
                    <template #default="scope">
                        <el-input v-model="headersData[scope.$index].headersvalue" />
                    </template>
                </el-table-column>
                <el-table-column prop="headersdecription" label="描述" width='200'>
                    <template #default="scope">
                        <el-input v-model="headersData[scope.$index].headersdecription" />
                    </template>
                </el-table-column>
                <el-table-column width='100'>
                    <template #default="scope">
                        <el-button type="danger" @click="delHeader(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-button type="primary" @click="addHeader" style="margin-left: 50px;margin-bottom: 10px;">新增请求头参数</el-button>
        <!-- 请求参数 -->
        <el-form-item label="Params">
            <el-table :data="paramsData" border style="width: 100%">
                <el-table-column prop="paramskey" label="Keys">
                    <template #default="scope">
                        <el-input v-model="paramsData[scope.$index].paramskey" />
                    </template>
                </el-table-column>
                <el-table-column prop="paramsvalue" label="Values">
                    <template #default="scope">
                        <el-input v-model="paramsData[scope.$index].paramsvalue" class="input-with-select">
                            <template #prepend>
                                <el-select v-model="paramsData[scope.$index].paramDataType">
                                    <el-option label="string" value="string" />
                                    <el-option label="int" value="int" />
                                    <el-option label="bool" value="bool" />
                                </el-select>
                            </template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="paramsdecription" label="描述">
                    <template #default="scope">
                        <el-input v-model="paramsData[scope.$index].paramsdecription" />
                    </template>
                </el-table-column>
                <el-table-column width='100'>
                    <template #default="scope">
                        <el-button type="danger" @click="delParam(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-button type="primary" @click="addParams" style="margin-left: 50px;margin-bottom: 10px;">新增params参数</el-button>
        <!-- 请求体 -->
        <el-form-item label="Body">
            <el-table :data="bodyData" border style="width: 100%">
                <el-table-column prop="bodykey" label="Keys">
                    <template #default="scope">
                        <el-input v-model="bodyData[scope.$index].bodykey" />
                    </template>
                </el-table-column>
                <el-table-column prop="bodyvalue" label="Values">
                    <template #default="scope">
                        <el-input v-model="bodyData[scope.$index].bodyvalue" class="input-with-select">
                            <template #prepend>
                                <el-select v-model="bodyData[scope.$index].bodyDataType">
                                    <el-option label="string" value="string" />
                                    <el-option label="int" value="int" />
                                    <el-option label="bool" value="bool" />
                                </el-select>
                            </template>
                        </el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="bodydecription" label="描述">
                    <template #default="scope">
                        <el-input v-model="bodyData[scope.$index].bodydecription" />
                    </template>
                </el-table-column>
                <el-table-column width='100'>
                    <template #default="scope">
                        <el-button type="danger" @click="delBody(scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-button type="primary" @click="addBody" style="margin-left: 50px;margin-bottom: 10px;">新增body参数</el-button>
        <el-form-item label="响应">
            <el-input v-model="addform.response" type="textarea" />
        </el-form-item>

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
    width: 70%;
    margin: auto
}

.apiform .el-table .el-input {
    width: 95%;
}

.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}
.input-with-select .el-select{
    width: 90px;
}
</style>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { addAPI, getModuleList, debugAPI, getEnvironmentList } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"

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
    status_code:'',
    response:''
})

const headersData = reactive(
    []
);

const paramsData = reactive(
    []
);

const bodyData = reactive(
    // 默认为空，需要再点击添加，否则为空时保存的是空对象，有些接口需要空对象时添加一个空行即可
    []
);

const addform = reactive({
    name: '',
    description: '',
    module: '',
    method: '',
    uri: '',
    headers: {},
    params: {},
    body: {},
    response: {},
    created_user: '',
    updated_user: '',
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

const onSubmit = async () => {

    const result = await assertForm()
    if (!result) return
    else {
        for (let i = 0; i < headersData.length; i++) {
            addform.headers[headersData[i].headerskey] = { "value": headersData[i].headersvalue, "decription": headersData[i].headersdecription };
        }
        for (let i = 0; i < paramsData.length; i++) {
            if (paramsData[i].paramDataType === 'int') {
                paramsData[i].paramsvalue = Number(paramsData[i].paramsvalue);
            }
            else if (paramsData[i].paramDataType === 'bool') {
                if (paramsData[i].paramsvalue === 'false') {
                    paramsData[i].paramsvalue = false;
                }
                else {
                    paramsData[i].paramsvalue = true;
                }
            }
            addform.params[paramsData[i].paramskey] = { "value": paramsData[i].paramsvalue, "decription": paramsData[i].paramsdecription };
        }
        for (let i = 0; i < bodyData.length; i++) {
            if (bodyData[i].bodyDataType === 'int') {
                bodyData[i].bodyvalue = Number(bodyData[i].bodyvalue);
            }
            else if (bodyData[i].bodyDataType === 'bool') {
                if (bodyData[i].bodyvalue === 'false') {
                    bodyData[i].bodyvalue = false;
                }
                else {
                    bodyData[i].bodyvalue = true;
                }
            }
            addform.body[bodyData[i].bodykey] = { "value": bodyData[i].bodyvalue, "decription": bodyData[i].bodydecription };
        }
        if (headersData.length === 0) {
            addform.headers = null;
        }
        if (paramsData.length === 0) {
            addform.params = null;
        }
        if (bodyData.length === 0) {
            addform.body = null;
        }
        // 发送到后端新增接口数据
        addform.created_user = localStorage.getItem('name');
        addform.updated_user = localStorage.getItem('name');
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
            })
        }
    }
}

const cancelBtn = () => {
    router.push('/api/list');
}

const addHeader = () => {
    headersData.push({
    })
}

const delHeader = (index) => {
    headersData.splice(index, 1);
}

const addParams = () => {
    paramsData.push({
        paramDataType: 'string'
    })
}

const delParam = (index) => {
    paramsData.splice(index, 1);
}

const addBody = () => {
    bodyData.push({
        bodyDataType: 'string'
    })
}

const delBody = (index) => {
    bodyData.splice(index, 1);
}

const getModuleFun = async () => {
    // 发送到后端获取列表数据
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
        for (let i = 0; i < headersData.length; i++) {
            addform.headers[headersData[i].headerskey] = { "value": headersData[i].headersvalue };
        }
        for (let i = 0; i < paramsData.length; i++) {
            if (paramsData[i].paramDataType === 'int') {
                paramsData[i].paramsvalue = Number(paramsData[i].paramsvalue);
            }
            else if (paramsData[i].paramDataType === 'bool') {
                if (paramsData[i].paramsvalue === 'false') {
                    paramsData[i].paramsvalue = false;
                }
                else {
                    paramsData[i].paramsvalue = true;
                }
            }
            addform.params[paramsData[i].paramskey] = { "value": paramsData[i].paramsvalue };
        }
        for (let i = 0; i < bodyData.length; i++) {
            if (bodyData[i].paramDataType === 'int') {
                bodyData[i].paramsvalue = Number(bodyData[i].bodyvalue);
            }
            else if (bodyData[i].bodyDataType === 'bool') {
                if (bodyData[i].bodyvalue === 'false') {
                    bodyData[i].bodyvalue = false;
                }
                else {
                    bodyData[i].bodyvalue = true;
                }
            }
            addform.body[bodyData[i].bodykey] = { "value": bodyData[i].bodyvalue };
        }
        // 发送调试
        const res = await debugAPI(addform);
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
        addform.headers = {}; // 调试后需要重置，不然修改参数会新增多一条数据
        addform.params = {}; // 调试后需要重置，不然修改参数会新增多一条数据
        addform.body = {}; // 调试后需要重置，不然修改参数会新增多一条数据
        cancelDialog();
    }
}


onMounted(() => {
    getModuleFun();
    setTimeout(() => {
    }, 1000)
})
</script>