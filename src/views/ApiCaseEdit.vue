<template>
    <el-breadcrumb separator="/" style="margin-bottom: 30px;">
        <el-breadcrumb-item :to="{ path: '/apicase/list' }">接口管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑接口测试用例</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />

    <el-form :model="editform" label-width="120px" ref="ruleFormRef" class="api_case_form">
        <el-form-item label="测试用例名称" prop="name" :rules="[
            { required: true, message: '测试用例名称不能为空' },
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

        <el-form-item label="优先级" prop="level" :rules="[
            { required: true, message: '请选择优先级' }
        ]">
            <el-select v-model="editform.level" filterable placeholder="请选择">
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
                <el-text class="mx-1" type="primary">{{ editform.time }}</el-text>
                <el-text class="mx-1">ms</el-text>
            </el-col>
            <el-col :span="4">
                <el-text class="mx-1" style="margin-left: 5px;">结果：</el-text>
                <el-text class="mx-1" v-if="editform.result === 'success'" type="success" style="margin-right: 5px;">{{
                    editform.result
                }}</el-text>
                <el-text class="mx-1" v-else type="danger" style="margin-right: 5px;">{{ editform.result
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
        <draggable v-model="editform.steps">
            <transition-group>
                <div v-for="(step, index) in editform.steps" :key="index" style="margin:10px">
                    <el-collapse>
                        <el-collapse-item :name="index">
                            <template #title>
                                {{ step.title + (index + 1) }}
                                <el-button type="primary" @click="APIDialog(index)" style="margin:auto;"
                                    @click.stop>选择接口</el-button>
                                <el-form-item label="步骤名称" :prop="'steps.' + index + '.name'"
                                    style="margin:auto;width: 300px;" :rules="[
                                        { required: true, message: '步骤名称不能为空' },
                                        { min: 3, max: 30, message: '长度需要为3-30个字符' },
                                    ]">
                                    <el-input v-model="step.name" @click.stop />
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

                            <el-form-item label="请求方式" :prop="'steps.' + index + '.method'" :rules="[
                                { required: true, message: '请选择请求方式' },
                            ]">
                                <el-radio-group v-model="step.method">
                                    <el-radio label="GET" />
                                    <el-radio label="POST" />
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="路径" :prop="'steps.' + index + '.uri'" :rules="[
                                { required: true, message: '路径不能为空' },
                            ]">
                                <el-input v-model="step.uri" />
                            </el-form-item>
                            <!-- 请求头 -->
                            <el-form-item label="Headers">
                                <el-table :data="headersData[index]" border style="width: 100%">
                                    <el-table-column prop="headerskey" label="Keys">
                                        <template #default="scope">
                                            <el-input v-model="headersData[index][scope.$index].headerskey" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="headersvalue" label="Values">
                                        <template #default="scope">
                                            <el-input v-model="headersData[index][scope.$index].headersvalue" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="headersdecription" label="描述">
                                        <template #default="scope">
                                            <el-input v-model="headersData[index][scope.$index].headersdecription" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column width='100'>
                                        <template #default="scope">
                                            <el-button type="danger" @click="delHeader(index, scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                            <el-button type="primary" @click="addHeader(index)"
                                style="margin-left: 50px;margin-bottom: 10px;">新增请求头参数</el-button>
                            <!-- 请求参数 -->
                            <el-form-item label="Params">
                                <el-table :data="paramsData[index]" border style="width: 100%">
                                    <el-table-column prop="paramskey" label="Keys">
                                        <template #default="scope">
                                            <el-input v-model="paramsData[index][scope.$index].paramskey" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="paramsvalue" label="Values">
                                        <template #default="scope">
                                            <el-input v-model="paramsData[index][scope.$index].paramsvalue" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="paramsdecription" label="描述">
                                        <template #default="scope">
                                            <el-input v-model="paramsData[index][scope.$index].paramsdecription" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column width='100'>
                                        <template #default="scope">
                                            <el-button type="danger" @click="delParam(index, scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                            <el-button type="primary" @click="addParams(index)"
                                style="margin-left: 50px;margin-bottom: 10px;">新增params参数</el-button>
                            <!-- 请求体 -->
                            <el-form-item label="Body">
                                <el-table :data="bodyData[index]" border style="width: 100%">
                                    <el-table-column prop="bodykey" label="Keys">
                                        <template #default="scope">
                                            <el-input v-model="bodyData[index][scope.$index].bodykey" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="bodyvalue" label="Values">
                                        <template #default="scope">
                                            <el-input v-model="bodyData[index][scope.$index].bodyvalue" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="bodydecription" label="描述">
                                        <template #default="scope">
                                            <el-input v-model="bodyData[index][scope.$index].bodydecription" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column width='100'>
                                        <template #default="scope">
                                            <el-button type="danger" @click="delBody(index, scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                            <el-button type="primary" @click="addBody(index)"
                                style="margin-left: 50px;margin-bottom: 10px;">新增body参数</el-button>
                            <el-form-item label="响应" :prop="'steps.' + index + '.response'">
                                <el-input v-model="step.response" type="textarea" autosize disabled />
                            </el-form-item>
                            <!-- 断言 -->
                            <el-form-item label="断言">
                                <el-table :data="assertData[index]" border style="width: 100%">
                                    <el-table-column prop="assertkey" label="响应值">
                                        <template #default="scope">
                                            <el-input v-model="assertData[index][scope.$index].assertkey" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="assertvalue" label="期望值">
                                        <template #default="scope">
                                            <el-input v-model="assertData[index][scope.$index].assertvalue" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="assertdecription" label="描述">
                                        <template #default="scope">
                                            <el-input v-model="assertData[index][scope.$index].assertdecription" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="assertresult" label="结果">
                                        <template #default="scope">
                                            <el-input v-model="assertData[index][scope.$index].assertresult" disabled />
                                        </template>
                                    </el-table-column>
                                    <el-table-column width='100'>
                                        <template #default="scope">
                                            <el-button type="danger" @click="delAssert(index, scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </el-form-item>
                            <el-button type="primary" @click="addAssert(index)"
                                style="margin-left: 50px;margin-bottom: 10px;">新增断言</el-button>
                        </el-collapse-item>
                    </el-collapse>
                </div>
            </transition-group>
        </draggable>
    </el-form>

    <el-button type="primary" class="api_case_save_btn" @click="onSubmit(ruleFormRef)">保存</el-button>
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
                    <el-tag v-else-if="scope.row.method === 'POST'" class="ml-2" type="">
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
        <div class="demo-pagination-block">
            <div class="demonstration"></div>
            <el-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize1" :page-sizes="[10, 20, 50, 100]"
                :background="true" layout="total, prev, pager, next, sizes, jumper" :total="data.total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </el-dialog>
</template>

<style>
.api_case_form {
    width: 60%;
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
import { ref, reactive, onMounted } from 'vue';
import router from "../router/index";
import { useRoute } from 'vue-router'
import { getAPIList, getAPIInfo, getAPICaseInfo, editAPICase, getEnvironmentList, debugAPICase } from '../http/api';
import { ElMessage } from 'element-plus';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';

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
const currentPage1 = ref(1);
const pageSize1 = ref(10);
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
    Dialog.value = true;
    APIDialog_id.value = index;
    getApiListFun()
}

const cancelDialog = (formEl) => {
    // 取消弹窗，重置
    Dialog.value = false;
    envDialog.value = false;
    if (!formEl) return
    formEl.resetFields();
}

const handleSizeChange = (val) => {
    params.size = val;
    getApiListFun()
}
const handleCurrentChange = (val) => {
    params.page = val;
    getApiListFun()
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
    getApiListFun()
}

const getApiListFun = async () => {
    // 发送到后端获取列表数据
    const res = await getAPIList(params);
    data.table = res.data;
    data.total = res.total
}

const route = useRoute();
const id_params = route.params;

let status = new Map();

status.set('未开始', '1');
status.set('进行中', '2');
status.set('已完成', '3');

const editform = reactive({
    name: '',
    level: '',
    status: 1,
    steps: [{
        title: "步骤",
        sort: null,
        name: '',
        method: '',
        uri: '',
        headers: {},
        params: {},
        body: {},
        time: '',
        result: '',
        response: '',
        assert_result: {},
    }],
    updated_user: localStorage.getItem('name'),
    time: '',
    result: '',
})


const AddStep = () => {
    editform.steps.push({
        title: "步骤",
        sort: null,
        name: '',
        method: '',
        uri: '',
        headers: {},
        params: {},
        body: {},
        time: '',
        result: '',
        response: '',
        assert_result: {},
    });
    headersData.push([]);
    paramsData.push([]);
    bodyData.push([]);
    assertData.push([]);
}

const removeDomain = (step) => {
    const index = editform.steps.indexOf(step)
    if (index !== -1) {
        editform.steps.splice(index, 1);
        headersData.splice(index, 1);
        paramsData.splice(index, 1);
        bodyData.splice(index, 1);
        assertData.splice(index, 1);
    }
}

const headersData = reactive(
    [[]]
);

const paramsData = reactive(
    [[]]
);

const bodyData = reactive(
    // 默认为空，需要再点击添加，否则为空时保存的是空对象，有些接口需要空对象时添加一个空行即可
    [[]]
);

const assertData = reactive(
    [[]]
);

const addHeader = (index) => {
    headersData[index].push({
    })
}

const delHeader = (index, delindex) => {
    headersData[index].splice(delindex, 1);
}

const addParams = (index) => {
    paramsData[index].push({
    })
}

const delParam = (index, delindex) => {
    paramsData[index].splice(delindex, 1);
}

const addBody = (index) => {
    bodyData[index].push({
    })
}

const delBody = (index, delindex) => {
    bodyData[index].splice(delindex, 1);
}

const addAssert = (index) => {
    assertData[index].push({
    })
}

const delAssert = (index, delindex) => {
    assertData[index].splice(delindex, 1);
}

const cancelBtn = () => {
    router.push('/apicase/list');
}

const SelectApi = async (id) => {
    const APIid = { 'id': id };
    const res = await getAPIInfo(APIid);
    if (res.status) {
        // 测试步骤赋值
        editform.steps[APIDialog_id.value].name = res.data.name;
        editform.steps[APIDialog_id.value].method = res.data.method;
        editform.steps[APIDialog_id.value].uri = res.data.uri;
        const headers = [];
        const params = [];
        const bodys = [];
        // 请求头
        for (let key in res.data.headers) {
            let value = res.data.headers[key];
            headers.push({
                headerskey: key,
                headersvalue: value.value,
                headersdecription: value.decription
            });
        }
        headersData[APIDialog_id.value] = headers;
        // 请求参数
        for (let key in res.data.params) {
            let value = res.data.params[key];
            params.push({
                paramskey: key,
                paramsvalue: value.value,
                paramsdecription: value.decription
            })
        }
        paramsData[APIDialog_id.value] = params;
        // 请求体
        for (let key in res.data.body) {
            let value = res.data.body[key];
            bodys.push({
                bodykey: key,
                bodyvalue: value.value,
                bodydecription: value.decription
            })
        }
        bodyData[APIDialog_id.value] = bodys;
        // 重置耗时，结果，响应
        editform.steps[APIDialog_id.value].time = '';
        editform.steps[APIDialog_id.value].result = '';
        editform.steps[APIDialog_id.value].response = '';
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

const getCaseInfo = async () => {
    const res = await getAPICaseInfo(id_params);
    if (res.status) {
        editform.id = id_params.id;
        editform.name = res.data.case.name;
        editform.status = status.get(res.data.case.status);
        editform.level = res.data.case.level;

        editform.steps.pop();
        headersData.pop();
        paramsData.pop();
        bodyData.pop();
        assertData.pop();
        // 测试步骤赋值
        for (let i = 0; i < res.data.steps.length; i++) {
            AddStep();
            const steps = res.data.steps;
            editform.steps[i].name = steps[i].name;
            editform.steps[i].method = steps[i].method;
            editform.steps[i].uri = steps[i].uri;

            for (let key in steps[i].headers) {
                let value = steps[i].headers[key];
                headersData[i].push({
                    headerskey: key,
                    headersvalue: value.value,
                    headersdecription: value.decription
                });
            }

            for (let key in steps[i].params) {
                let value = steps[i].params[key];
                paramsData[i].push({
                    paramskey: key,
                    paramsvalue: value.value,
                    paramsdecription: value.decription
                });
            }
            for (let key in steps[i].body) {
                let value = steps[i].body[key];
                bodyData[i].push({
                    bodykey: key,
                    bodyvalue: value.value,
                    bodydecription: value.decription
                });
            }
            for (let key in steps[i].assert_result) {
                let value = steps[i].assert_result[key];
                assertData[i].push({
                    assertkey: key,
                    assertvalue: value.value,
                    assertdecription: value.decription
                });
            }
        }
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
    const result = await assertForm();
    if (!result) return
    else {
        for (let j = 0; j < headersData.length; j++) {
            for (let i = 0; i < headersData[j].length; i++) {
                editform.steps[j].headers[headersData[j][i].headerskey] = { "value": headersData[j][i].headersvalue, "decription": headersData[j][i].headersdecription };
            }
        }
        for (let j = 0; j < paramsData.length; j++) {
            for (let i = 0; i < paramsData[j].length; i++) {
                editform.steps[j].params[paramsData[j][i].paramskey] = { "value": paramsData[j][i].paramsvalue, "decription": paramsData[j][i].paramsdecription };
            }
        }
        for (let j = 0; j < bodyData.length; j++) {
            for (let i = 0; i < bodyData[j].length; i++) {
                editform.steps[j].body[bodyData[j][i].bodykey] = { "value": bodyData[j][i].bodyvalue, "decription": bodyData[j][i].bodydecription };
            }
        }
        for (let j = 0; j < assertData.length; j++) {
            for (let i = 0; i < assertData[j].length; i++) {
                editform.steps[j].assert_result[assertData[j][i].assertkey] = { "value": assertData[j][i].assertvalue, "decription": assertData[j][i].assertdecription };
            }
        }

        for (let i = 0; i < headersData.length; i++) {
            if (headersData[i].length === 0) {
                editform.steps[i].headers = null;
            }
        }
        for (let i = 0; i < paramsData.length; i++) {
            if (paramsData[i].length === 0) {
                editform.steps[i].params = null;
            }
        }
        for (let i = 0; i < bodyData.length; i++) {
            if (bodyData[i].length === 0) {
                editform.steps[i].body = null;
            }
        }
        for (let i = 0; i < assertData.length; i++) {
            if (assertData[i].length === 0) {
                editform.steps[i].assert_result = null;
            }
        }

        for (let i = 0; i < editform.steps.length; i++) {
            editform.steps[i].sort = i;
            delete editform.steps[i].response;
            delete editform.steps[i].time;
            delete editform.steps[i].result;
        }
        // 发送到后端新增数据
        editform.updated_user = localStorage.getItem('name');
        delete editform.result;
        delete editform.time;
        delete editform.env;
        const res = await editAPICase(editform);
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
        }
    }
}

const debug = async () => {
    editform.env = env.host;
    if (editform.env === undefined) {
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
        for (let j = 0; j < headersData.length; j++) {
            for (let i = 0; i < headersData[j].length; i++) {
                editform.steps[j].headers[headersData[j][i].headerskey] = { "value": headersData[j][i].headersvalue, "decription": headersData[j][i].headersdecription };
            }
        }
        for (let j = 0; j < paramsData.length; j++) {
            for (let i = 0; i < paramsData[j].length; i++) {
                editform.steps[j].params[paramsData[j][i].paramskey] = { "value": paramsData[j][i].paramsvalue, "decription": paramsData[j][i].paramsdecription };
            }
        }
        for (let j = 0; j < bodyData.length; j++) {
            for (let i = 0; i < bodyData[j].length; i++) {
                editform.steps[j].body[bodyData[j][i].bodykey] = { "value": bodyData[j][i].bodyvalue, "decription": bodyData[j][i].bodydecription };
            }
        }
        for (let j = 0; j < assertData.length; j++) {
            for (let i = 0; i < assertData[j].length; i++) {
                editform.steps[j].assert_result[assertData[j][i].assertkey] = { "value": assertData[j][i].assertvalue, "decription": assertData[j][i].assertdecription };
            }
        }
        for (let i = 0; i < headersData.length; i++) {
            if (headersData[i].length === 0) {
                editform.steps[i].headers = null;
            }
        }
        for (let i = 0; i < paramsData.length; i++) {
            if (paramsData[i].length === 0) {
                editform.steps[i].params = null;
            }
        }
        for (let i = 0; i < bodyData.length; i++) {
            if (bodyData[i].length === 0) {
                editform.steps[i].body = null;
            }
        }
        for (let i = 0; i < assertData.length; i++) {
            if (assertData[i].length === 0) {
                editform.steps[i].assertData = null;
            }
        }

        for (let i = 0; i < editform.steps.length; i++) {
            editform.steps[i].sort = i;
        }
        // 发送到后端调试
        const res = await debugAPICase(editform);
        if (res.status) {
            for (let i = 0; i < editform.steps.length; i++) {
                if (assertData[i].length === 0) {
                    editform.steps[i].result = 'success';
                }
                else {
                    for (let j = 0; j < res.data.res[i].result.length; j++) {
                        assertData[i][j].assertresult = res.data.res[i].result[j];
                    }
                }
                // 步骤断言结果是否包含error，包含将步骤结果设置为error，并用例变成error
                if (res.data.res[i].result.includes('error')) {
                    editform.steps[i].result = 'error';
                    editform.result = 'error';
                }
                else {
                    editform.steps[i].result = 'success';
                }
                editform.steps[i].time = res.data.time[i];

                const response = JSON.stringify(res.data.res[i].response, null, 2);
                editform.steps[i].response = 'status:' + res.data.res[i].status + '\n'
                    + 'status_code:' + res.data.res[i].status_code + '\n'
                    + 'response:' + response;
            }
            editform.time = parseFloat(
                res.data.time.reduce(function (accumulator, currentValue) {
                    return accumulator + currentValue;
                }, 0).toFixed(2)
            );
            if (editform.result !== 'error') {
                editform.result = 'success';
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
        for (let i = 0; i < editform.steps.length; i++) {
            editform.steps[i].headers = {}; // 调试后需要重置，不然修改参数会新增多一条数据
            editform.steps[i].params = {}; // 调试后需要重置，不然修改参数会新增多一条数据
            editform.steps[i].body = {}; // 调试后需要重置，不然修改参数会新增多一条数据
            editform.steps[i].assert_result = {}; // 调试后需要重置，不然修改参数会新增多一条数据
        }
    }
}

onMounted(() => {
    getCaseInfo();
    setTimeout(() => {
    }, 1000)
})
</script>