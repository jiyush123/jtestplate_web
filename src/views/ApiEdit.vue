<template>
    <el-breadcrumb separator="/" style="margin-bottom: 30px;">
        <el-breadcrumb-item :to="{ path: '/api/list' }">接口管理</el-breadcrumb-item>
        <el-breadcrumb-item>编辑接口</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider />
    <!-- 下面是TAB标签 -->
    <el-tabs v-model="activeName" type="card" class="demo-tabs">
        <el-tab-pane label="API信息" name="info">
            <!-- 下面是页面表单 -->
            <el-form :model="editform" label-width="120px" ref="ruleFormRef">
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

                <el-form-item label="请求方式" prop="method" :rules="[
                    { required: true, message: '请选择请求方式' },
                ]">
                    <el-radio-group v-model="editform.method">
                        <el-radio label="GET" />
                        <el-radio label="POST" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="路径" prop="uri" :rules="[
                    { required: true, message: '路径不能为空' },
                ]">
                    <el-input v-model="editform.uri" style="width: 50%;" />
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
                <el-button type="primary" @click="addHeader"
                    style="margin-left: 50px;margin-bottom: 10px;">新增请求头参数</el-button>
                <el-form-item label="Params">
                    <!-- 用表格实现Params参数定义 -->
                    <el-table :data="paramsData" border style="width: 700px">
                        <el-table-column prop="paramskey" label="Keys" width='200'>
                            <template #default="scope">
                                <el-input v-model="paramsData[scope.$index].paramskey" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="paramsvalue" label="Values" width='200'>
                            <template #default="scope">
                                <el-input v-model="paramsData[scope.$index].paramsvalue" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="paramsdecription" label="描述" width='200'>
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
                <el-button type="primary" @click="addParams"
                    style="margin-left: 50px;margin-bottom: 10px;">新增params参数</el-button>
                <el-form-item label="Body">
                    <el-table :data="bodyData" border style="width: 700px">
                        <el-table-column prop="bodykey" label="Keys" width='200'>
                            <template #default="scope">
                                <el-input v-model="bodyData[scope.$index].bodykey" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="bodyvalue" label="Values" width='200'>
                            <template #default="scope">
                                <el-input v-model="bodyData[scope.$index].bodyvalue" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="bodydecription" label="描述" width='200'>
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
                <el-button type="primary" @click="addBody"
                    style="margin-left: 50px;margin-bottom: 10px;">新增body参数</el-button>
                <el-form-item label="响应">
                    <el-input v-model="editform.api_response" type="textarea" autosize />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
                    <el-button @click="cancelBtn">取消</el-button>
                </el-form-item>
            </el-form>
            <!-- 上面是表单，下面是下一个标签页 -->
        </el-tab-pane>
        <el-tab-pane label="调试" name="debug">
            <el-form :model="debugform" label-width="120px" ref="debugFormRef">
                <el-form-item label="调试环境" prop="host" :rules="[
                    { required: true, message: '请选择调试环境' },
                ]">
                    <el-select v-model="debugform.host" filterable placeholder="请选择" style="width: 400px;">
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

                <el-form-item label="请求方式" prop="method" :rules="[
                    { required: true, message: '请选择请求方式' },
                ]">
                    <el-radio-group v-model="debugform.method">
                        <el-radio label="GET" />
                        <el-radio label="POST" />
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="路径" prop="uri" :rules="[
                    { required: true, message: '路径不能为空' },
                ]">
                    <el-input v-model="debugform.uri" style="width: 50%;" />
                </el-form-item>

                <el-form-item label="Headers">
                    <el-table :data="headersData" border style="width: 700px">
                        <el-table-column prop="headerskey" label="Keys" width='300'>
                            <template #default="scope">
                                <el-input v-model="headersData[scope.$index].headerskey" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="headersvalue" label="Values" width='300'>
                            <template #default="scope">
                                <el-input v-model="headersData[scope.$index].headersvalue" />
                            </template>
                        </el-table-column>
                        <el-table-column width='100'>
                            <template #default="scope">
                                <el-button type="danger" @click="delHeader(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-button type="primary" @click="addHeader"
                    style="margin-left: 50px;margin-bottom: 10px;">新增请求头参数</el-button>
                <el-form-item label="Params">
                    <el-table :data="paramsData" border style="width: 700px">
                        <el-table-column prop="paramskey" label="Keys" width='300'>
                            <template #default="scope">
                                <el-input v-model="paramsData[scope.$index].paramskey" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="paramsvalue" label="Values" width='300'>
                            <template #default="scope">
                                <el-input v-model="paramsData[scope.$index].paramsvalue" />
                            </template>
                        </el-table-column>

                        <el-table-column width='100'>
                            <template #default="scope">
                                <el-button type="danger" @click="delParam(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-button type="primary" @click="addParams"
                    style="margin-left: 50px;margin-bottom: 10px;">新增params参数</el-button>
                <el-form-item label="Body">
                    <el-table :data="bodyData" border style="width: 700px">
                        <el-table-column prop="bodykey" label="Keys" width='300'>
                            <template #default="scope">
                                <el-input v-model="bodyData[scope.$index].bodykey" />
                            </template>
                        </el-table-column>
                        <el-table-column prop="bodyvalue" label="Values" width='300'>
                            <template #default="scope">
                                <el-input v-model="bodyData[scope.$index].bodyvalue" />
                            </template>
                        </el-table-column>
                        <el-table-column width='100'>
                            <template #default="scope">
                                <el-button type="danger" @click="delBody(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-button type="primary" @click="addBody"
                    style="margin-left: 50px;margin-bottom: 10px;">新增body参数</el-button>
                <el-form-item label="响应结果">
                    <el-input v-model="debugform.api_response" type="textarea" autosize />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="debug(ruleFormRef)">调试</el-button>
                    <el-button @click="cancelBtn">取消</el-button>
                </el-form-item>
            </el-form>

        </el-tab-pane>
    </el-tabs>
</template>

<style></style>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getAPIInfo, editAPI, getModuleList, getEnvironmentList, debugAPI } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"
import { useRoute } from 'vue-router'

const route = useRoute();
const id_params = route.params;

const moduleOptions = ref(null);
const envOptions = ref(null);

const activeName = ref('info');

const headersData = reactive(
    []
);

const paramsData = reactive(
    []
);

const bodyData = reactive(
    []
);

// 创建一个新的 Map 对象作映射
let status = new Map();

// 添加键值对  
status.set('未开始', '1');
status.set('进行中', '2');
status.set('已完成', '3');

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

const debugform = reactive({
    host: '',
    method: '',
    uri: '',
    headers: {},
    params: {},
    body: {},
    api_response: '',
    updated_user: "admin",
    updated_time: '',
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
        // 调试字段
        debugform.method = res.data.method;
        debugform.uri = res.data.uri;
        // 请求头
        for (let key in res.data.headers) {
            let value = res.data.headers[key];
            headersData.push({
                headerskey: key,
                headersvalue: value.value,
                headersdecription: value.decription
            });
        }
        // 请求参数
        for (let key in res.data.params) {
            let value = res.data.params[key];
            paramsData.push({
                paramskey: key,
                paramsvalue: value.value,
                paramsdecription: value.decription
            });
        }
        // 请求体
        for (let key in res.data.body) {
            let value = res.data.body[key];
            bodyData.push({
                bodykey: key,
                bodyvalue: value.value,
                bodydecription: value.decription
            });
        }
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
const debugFormRef = ref(null);
// 这个方法是等待表单验证结果，因为返回的是promise.reject,所以要用try去捕捉异常再返回布尔值
const assertForm = async () => {
    try {
        await ruleFormRef.value.validate();
        return true
    } catch (e) {
        return false
    }
}

const debugFormAssert = async () => {
    try {
        await debugFormRef.value.validate();
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
            editform.headers[headersData[i].headerskey] = { "value": headersData[i].headersvalue, "decription": headersData[i].headersdecription };
        }
        for (let i = 0; i < paramsData.length; i++) {
            editform.params[paramsData[i].paramskey] = { "value": paramsData[i].paramsvalue, "decription": paramsData[i].paramsdecription };
        }
        for (let i = 0; i < bodyData.length; i++) {
            editform.body[bodyData[i].bodykey] = { "value": bodyData[i].bodyvalue, "decription": bodyData[i].bodydecription };
        }
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

const addHeader = () => {
    headersData.push({
    })
}

const delHeader = (index) => {
    headersData.splice(index, 1);
}

const addParams = () => {
    paramsData.push({
    })
}

const delParam = (index) => {
    paramsData.splice(index, 1);
}

const addBody = () => {
    bodyData.push({
    })
}

const delBody = (index) => {
    bodyData.splice(index, 1);
}

const debug = async () => {
    const result = await debugFormAssert();
    if (!result) return
    else {
        for (let i = 0; i < headersData.length; i++) {
            debugform.headers[headersData[i].headerskey] = { "value": headersData[i].headersvalue };
        }
        for (let i = 0; i < paramsData.length; i++) {
            debugform.params[paramsData[i].paramskey] = { "value": paramsData[i].paramsvalue };
        }
        for (let i = 0; i < bodyData.length; i++) {
            debugform.body[bodyData[i].bodykey] = { "value": bodyData[i].bodyvalue };
        }
        // 发送调试
        const res = await debugAPI(debugform);
        if (res.status) {
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'success',
            })
            debugform.api_response = res.status_code + '\n' + res.response;
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

onMounted(() => {
    getModuleFun();
    getInfo();
    getEnvironmentFun();
    setTimeout(() => {
    }, 1000)
})
</script>