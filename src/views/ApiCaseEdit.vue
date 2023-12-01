<template>
    <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 30px;">
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
        <el-button type="primary" @click="AddStep">新增步骤</el-button>
        <!-- 测试步骤 -->
        <draggable v-model="editform.steps">
            <transition-group>
                <div v-for="(step, index) in editform.steps" :key="index" style="margin:10px">
                    <el-collapse>
                        <el-collapse-item :name="index">
                            <template #title>
                                {{ step.title + (index + 1) }}
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
                                <el-table :data="headersData[index]" border style="width: 700px">
                                    <el-table-column prop="headerskey" label="Keys" width='200'>
                                        <template #default="scope">
                                            <el-input v-model="headersData[index][scope.$index].headerskey" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="headersvalue" label="Values" width='200'>
                                        <template #default="scope">
                                            <el-input v-model="headersData[index][scope.$index].headersvalue" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="headersdecription" label="描述" width='200'>
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
                                <el-table :data="paramsData[index]" border style="width: 700px">
                                    <el-table-column prop="paramskey" label="Keys" width='200'>
                                        <template #default="scope">
                                            <el-input v-model="paramsData[index][scope.$index].paramskey" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="paramsvalue" label="Values" width='200'>
                                        <template #default="scope">
                                            <el-input v-model="paramsData[index][scope.$index].paramsvalue" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="paramsdecription" label="描述" width='200'>
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
                                <el-table :data="bodyData[index]" border style="width: 700px">
                                    <el-table-column prop="bodykey" label="Keys" width='200'>
                                        <template #default="scope">
                                            <el-input v-model="bodyData[index][scope.$index].bodykey" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="bodyvalue" label="Values" width='200'>
                                        <template #default="scope">
                                            <el-input v-model="bodyData[index][scope.$index].bodyvalue" />
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="bodydecription" label="描述" width='200'>
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
</template>

<style></style>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import router from "../router/index";
import { useRoute } from 'vue-router'
import { getAPICaseInfo,editAPICase } from '../http/api';
import { ElMessage } from 'element-plus';
import { VueDraggableNext as Draggable } from 'vue-draggable-next';

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
    }],
    updated_user: localStorage.getItem('name')
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
    });
    headersData.push([]);
    paramsData.push([]);
    bodyData.push([]);
}

const removeDomain = (step) => {
    const index = editform.steps.indexOf(step)
    if (index !== -1) {
        editform.steps.splice(index, 1);
        headersData.splice(index, 1);
        paramsData.splice(index, 1);
        bodyData.splice(index, 1);
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

const getCaseInfo = async () => {
    const route = useRoute();
    const params = route.params;
    const res = await getAPICaseInfo(params);
    if (res.status) {
        editform.id = res.data.case.id;
        editform.name = res.data.case.name;
        editform.status = status.get(res.data.case.status);
        editform.level = res.data.case.level;
        
        // 调试字段
        // debugform.method = res.data.method;
        // debugform.uri = res.data.uri;

        editform.steps.pop();
        // 测试步骤赋值
        for (let i=0; i<res.data.steps.length;i++) {
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
        }
        // editform.response = res.data.response;
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
        for (let j = 0; j < headersData.length; j++) {
            for (let i = 0; i < paramsData[j].length; i++) {
                editform.steps[j].params[paramsData[j][i].paramskey] = { "value": paramsData[j][i].paramsvalue, "decription": paramsData[j][i].paramsdecription };
            }
        }
        for (let j = 0; j < headersData.length; j++) {
            for (let i = 0; i < bodyData[j].length; i++) {
                editform.steps[j].body[bodyData[j][i].bodykey] = { "value": bodyData[j][i].bodyvalue, "decription": bodyData[j][i].bodydecription };
            }
        }

        for (let i = 0; i < editform.steps.length; i++) {
            editform.steps[i].sort = i;
        }
        console.log(editform);
        // 发送到后端新增数据
        editform.updated_user = localStorage.getItem('name');
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

onMounted(() => {
    getCaseInfo();
    setTimeout(() => {
    }, 1000)
})
</script>