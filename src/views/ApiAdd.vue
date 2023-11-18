<template>
    <el-breadcrumb :separator-icon="ArrowRight" style="margin-bottom: 30px;">
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
        <el-button type="primary" @click="addParams" style="margin-left: 50px;margin-bottom: 10px;">新增params参数</el-button>
        <!-- 请求体 -->
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
        <el-button type="primary" @click="addBody" style="margin-left: 50px;margin-bottom: 10px;">新增body参数</el-button>
        <el-form-item label="响应">
            <el-input v-model="addform.api_response" type="textarea" />
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
            <el-button @click="cancelBtn">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<style>
.apiform {
    margin: 50px 200px auto 200px;

}

.apiform .el-table .el-input {
    width: 95%;
}
</style>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { addAPI, getModuleList } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"

const moduleOptions = ref(null);

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
            addform.params[paramsData[i].paramskey] = { "value": paramsData[i].paramsvalue, "decription": paramsData[i].paramsdecription };
        }
        for (let i = 0; i < bodyData.length; i++) {
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
        // 发送到后端新增用户数据
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


onMounted(() => {
    getModuleFun();
    setTimeout(() => {
    }, 1000)
})
</script>