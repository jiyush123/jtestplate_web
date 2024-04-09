<template>
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
        <el-form-item label="接口名称" prop="name">
            <el-input v-model="queryForm.name" clearable />
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-select v-model="queryForm.status" clearable placeholder="请选择">
                <el-option v-for="item in status_options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
    </el-form>
    <!-- 新增按钮 -->
    <div class="addBtn">
        <el-button type="primary" @click="goToAdd">
            新增接口
        </el-button>
        <el-button type="success" style="justify-content: flex-end;" @click="goToImport">导入接口</el-button>
    </div>
    <!-- 导入弹窗 -->
    <el-dialog v-model="importDialog" title="导入接口" width="40%" align-center @close="cancelDialog(formRef)">
        <el-form label-width="100px" ref="formRef" label-position="top">
        <el-form-item label="文件方式导入" prop="url">
        <el-upload class="upload-demo" drag action="http://127.0.0.1:8000/api/import/" :headers="headers_token">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                拖拽文件到此或 <em>点击导入</em>
            </div>
            <template #tip>
                <div class="el-upload__tip">
                    只支持json文件
                </div>
            </template>
        </el-upload>
    </el-form-item>
</el-form>
        <el-form :model="formdata" label-width="100px" ref="formRef" label-position="top">
            <el-form-item label="URL 方式导入" prop="url">
                <div class="import_url">
                <el-input v-model="formdata.url" placeholder="请输入Swagger数据 URL"></el-input>
                <el-button style="justify-content: flex-end;" type="primary" @click="() => { ImportApiFun(); importDialog = false; }">
                    确定
                </el-button>
            </div>
            </el-form-item>
        </el-form>
    </el-dialog>
    <!-- 列表 -->
    <el-table :data="data.table" stripe style="width: 100%" show-overflow-tooltip>
        <el-table-column prop="id" label="id" width="50px" fixed />
        <el-table-column prop="name" label="接口名称" width="200px" fixed />
        <el-table-column prop="description" label="描述" />
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
        <el-table-column prop="uri" label="路径" width="250px" />
        <el-table-column prop="status" label="状态" width="100px" />
        <el-table-column prop="created_user" label="创建人" width="100px" />
        <el-table-column prop="updated_time" label="修改时间" width="180px" />
        <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
                <el-button type="primary" size="small" @click="goToEdit(scope.row.id)">编辑</el-button>
                <el-popconfirm width="220" :hide-after="hideAfter" confirm-button-text="确定" cancel-button-text="取消"
                    title="是否确定删除?" @confirm="delFun(scope.row.id)">
                    <template #reference>
                        <el-button ref="delBtn" type="danger" size="small">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!-- 分页模板 -->
    <PaginationModule :total="data.total" :getListFun="getApiListFun" />
</template>

<style>
.addBtn {
    display: flex;
    justify-content: space-between;
}
.upload-demo{
    width: 100%;
}
.import_url{
    display: flex;
    width: 100%
}
</style>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getAPIList, delAPI, importAPI } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"
import PaginationModule from './PaginationModule.vue'

const importDialog = ref(false);
const headers_token = ref({Authorization:localStorage.getItem('token')});
const formdata = reactive({
    url: ''
})
const goToImport = () => {
    importDialog.value = true
}
const formRef = ref(null);
const cancelDialog = (formEl) => {
    // 取消弹窗，重置
    importDialog.value = false;
    if (!formEl) return
    formEl.resetFields();
}

const ImportApiFun = async () => {
    const res = await importAPI(formdata);
    if (res.status) {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getApiListFun(params);
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

const hideAfter = ref(0);
let data = reactive({
    table: [],
    total: 0,
})

let params = {
    "page": 1,
    "size": 10,
}
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

const queryForm = reactive({
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
    getApiListFun(params)
}

const getApiListFun = async (paramdata) => {
    params.page = paramdata.page;
    params.size = paramdata.size;
    // 发送到后端获取列表数据
    const res = await getAPIList(params);
    data.table = res.data;
    data.total = res.total

}

const goToAdd = () => {
    router.push('/api/add');
}

const goToEdit = (id) => {
    router.push({ name: 'apiedit', params: { id } });
}

const delFun = async (Did) => {
    let data = { id: Did };
    const res = await delAPI(data);
    if (res.status) {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getApiListFun(params);
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


onMounted(() => {
    getApiListFun(params);
    setTimeout(() => {
    }, 1000)
})
</script>