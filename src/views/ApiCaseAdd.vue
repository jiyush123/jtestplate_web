<template>
    <el-breadcrumb separator="\" style="margin-bottom: 30px;">
        <el-breadcrumb-item :to="{ path: '/apicase/list' }">接口管理</el-breadcrumb-item>
        <el-breadcrumb-item>新增接口测试用例</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
    <el-form :model="addForm" label-width="120px" ref="ruleFormRef" class="api_case_form">
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
            <el-col :span="6">
                <el-button type="primary" @click="AddStep">新增步骤</el-button>
            </el-col>
            <el-col :span="6">
                <el-text class="mx-4">耗时：</el-text>
            </el-col>
            <el-col :span="6">
                <el-text class="mx-4">结果：</el-text>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" @click="AddStep">调试</el-button>
            </el-col>
        </el-row>
        <!-- 测试步骤 -->
        <draggable v-model="addForm.steps">
            <transition-group>
                <div v-for="(step, index) in addForm.steps" :key="index" style="margin:10px">
                    <el-collapse>
                        <el-collapse-item :name="index">
                            <template #title>
                                {{ step.title + (index + 1) }}
                                <el-button type="primary" @click="APIDialog(index)" style="margin:auto;"
                                    @click.stop>选择接口</el-button>
                                <el-form-item label="步骤名称" :prop="'steps.' + index + '.name'"
                                    style="margin:auto;width: 500px;" :rules="[
                                        { required: true, message: '步骤名称不能为空' },
                                        { min: 3, max: 30, message: '长度需要为3-30个字符' },
                                    ]">
                                    <el-input v-model="step.name" @click.stop />
                                </el-form-item>
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
                                    <el-table-column width="100">
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
.handle_info{
    height: 40px;
}
.handle_info .el-col{
    display:flex;
    height: 100%;
}
.handle_info .el-col .el-text{
    align-items: center;
}
.el-collapse-item__header{
    height: 60px;
}
</style>

<script setup>
import { ref, reactive } from 'vue';
import router from "../router/index";
import { getAPIList, getAPIInfo, addAPICase } from '../http/api';
import { ElMessage } from 'element-plus';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';

const Dialog = ref(false);

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

const addForm = reactive({
    name: '',
    level: '',
    status: 1,
    steps: [{
        id: null,
        title: "步骤",
        sort: null,
        name: '',
        method: '',
        uri: '',
        headers: {},
        params: {},
        body: {},
    }],
    created_user: localStorage.getItem('name'),
    updated_user: localStorage.getItem('name')
})


const AddStep = () => {
    addForm.steps.push({
        title: "步骤",
        sort: null,
        name: '',
        method: '',
        uri: '',
        headers: {},
        params: {},
        body: {},
    });
    headersData.push([]);
    paramsData.push([]);
    bodyData.push([]);
}

const removeDomain = (step) => {
    const index = addForm.steps.indexOf(step)
    if (index !== -1) {
        addForm.steps.splice(index, 1);
        headersData.splice(index, 1);
        paramsData.splice(index, 1);
        bodyData.splice(index, 1);
    }
}

let headersData = reactive(
    [[]]
);

const paramsData = reactive(
    [[]]
);

const bodyData = reactive(
    // 默认为空，需要再点击添加，否则为空时保存的是空对象，有些接口需要空对象时添加一个空行即可
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

const cancelBtn = () => {
    router.push('/apicase/list');
}

const SelectApi = async (id) => {
    const APIid = { 'id': id };
    const res = await getAPIInfo(APIid);
    if (res.status) {
        // 测试步骤赋值
        addForm.steps[APIDialog_id.value].name = res.data.name;
        addForm.steps[APIDialog_id.value].method = res.data.method;
        addForm.steps[APIDialog_id.value].uri = res.data.uri;
        // 请求头
        for (let key in res.data.headers) {
            let value = res.data.headers[key];
            headersData[APIDialog_id.value].push({
                headerskey: key,
                headersvalue: value.value,
                headersdecription: value.decription
            });
        }
        // 请求参数
        for (let key in res.data.params) {
            let value = res.data.params[key];
            paramsData[APIDialog_id.value].push({
                paramskey: key,
                paramsvalue: value.value,
                paramsdecription: value.decription
            });
        }
        // 请求体
        for (let key in res.data.body) {
            let value = res.data.body[key];
            bodyData[APIDialog_id.value].push({
                bodykey: key,
                bodyvalue: value.value,
                bodydecription: value.decription
            });
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

const onSubmit = async () => {
    console.log(addForm);
    const result = await assertForm()
    if (!result) return
    else {
        for (let j = 0; j < headersData.length; j++) {
            for (let i = 0; i < headersData[j].length; i++) {
                addForm.steps[j].headers[headersData[j][i].headerskey] = { "value": headersData[j][i].headersvalue, "decription": headersData[j][i].headersdecription };
            }
        }
        for (let j = 0; j < headersData.length; j++) {
            for (let i = 0; i < paramsData[j].length; i++) {
                addForm.steps[j].params[paramsData[j][i].paramskey] = { "value": paramsData[j][i].paramsvalue, "decription": paramsData[j][i].paramsdecription };
            }
        }
        for (let j = 0; j < headersData.length; j++) {
            for (let i = 0; i < bodyData[j].length; i++) {
                addForm.steps[j].body[bodyData[j][i].bodykey] = { "value": bodyData[j][i].bodyvalue, "decription": bodyData[j][i].bodydecription };
            }
        }
        for (let i = 0; i < headersData.length; i++) {
            if (headersData[i].length === 0) {
                addForm.steps[i].headers = null;
            }
        }
        for (let i = 0; i < headersData.length; i++) {
            if (paramsData[i].length === 0) {
                addForm.steps[i].params = null;
            }
        }
        for (let i = 0; i < headersData.length; i++) {
            if (bodyData[i].length === 0) {
                addForm.steps[i].body = null;
            }
        }

        for (let i = 0; i < addForm.steps.length; i++) {
            addForm.steps[i].sort = i;
        }
        // 发送到后端新增数据
        addForm.created_user = localStorage.getItem('name');
        addForm.updated_user = localStorage.getItem('name');
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
        }
    }
}

</script>