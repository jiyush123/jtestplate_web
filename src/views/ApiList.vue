<template>
    <!-- 项目模块菜单 -->
    <el-container>
        <el-aside width="230px">
            <project-module :getListFun="getApiListFun"/>
        </el-aside>
        <el-main>

            <!-- 搜索栏 -->
            <el-form :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
                <el-form-item label="接口名称" prop="name">
                    <el-input v-model="queryForm.name" clearable />
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryForm.status" clearable placeholder="请选择">
                        <el-option v-for="item in status_options" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-button type="primary" @click="queryList">查询</el-button>
            </el-form>
            <!-- 新增按钮 -->
            <div class="addBtn">
                <el-button type="primary" @click="goToAdd">
                    新增接口
                </el-button>
                <el-button type="success" @click="goToImport">导入接口</el-button>
            </div>
            <!-- 导入弹窗 -->
            <el-dialog v-model="importDialog" title="导入接口" width="40%" align-center @close="cancelDialog(formRef)">
                <el-form label-width="100px" ref="formRef" label-position="top">
                    <el-form-item label="文件方式导入" prop="url">
                        <el-upload ref="upload_file" class="upload-demo" drag :action="uploadUrl"
                            :headers="headers_token" :on-success="ImportFile" :accept="'.json'">
                            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                            <div class="el-upload__text">
                                将文件拖到此处，或 <em>点击导入</em>
                            </div>
                            <template #tip>
                                <div class="el-upload__tip">
                                    <div>
                                        <el-text type="info" size="small">只支持json文件</el-text>
                                    </div>
                                </div>
                            </template>
                        </el-upload>
                    </el-form-item>
                </el-form>
                <el-form :model="formdata" label-width="100px" ref="formRef" label-position="top">
                    <el-form-item label="URL 方式导入" prop="url">
                        <div class="import_url">
                            <el-input v-model="formdata.url" placeholder="请输入Swagger数据 URL"></el-input>
                            <el-button style="justify-content: flex-end;" type="primary"
                                @click="() => { ImportApiFun(); importDialog = false; }">
                                继续
                            </el-button>
                        </div>
                    </el-form-item>
                </el-form>
            </el-dialog>
            <!-- 导入预览弹窗 -->
            <el-dialog v-model="importPreviewDialog" title="导入预览" width="50%" align-center
                @close="cancelDialog(formRef)">
                <el-tree ref="api_tree" style="max-width: 800px" show-checkbox :data="apiinfo_tree" node-key="id"
                    @check-change="handleCheckChange" :default-expanded-keys="default_expanded"
                    :default-checked-keys="default_key">
                    <!-- 使用插槽让多出的部分显示省略号，并鼠标悬浮显示全部数据 -->
                    <template v-slot:default="{ data }">
                        <span :title="data.label"
                            :style="{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }">
                            {{ data.label }}
                        </span>
                    </template>
                </el-tree>
                <template #footer>
                    <el-button @click="() => { importPreviewDialog = flase }">取消</el-button>
                    <el-button type="primary" @click="sureImport">确定</el-button>
                </template>
            </el-dialog>
            <!-- 列表 -->
            <el-table :data="data.table" stripe style="width: 100%" show-overflow-tooltip>
                <el-table-column prop="id" label="id" width="50px" fixed />
                <el-table-column prop="name" label="接口名称" fixed />
                <el-table-column prop="description" label="描述" />
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
                <el-table-column prop="status" label="状态" width="100px" />
                <el-table-column prop="created_user" label="创建人" width="100px" />
                <el-table-column prop="updated_time" label="修改时间" width="180px" />
                <el-table-column fixed="right" label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" size="small" @click="goToEdit(scope.row.id)">编辑</el-button>
                        <el-popconfirm width="220" :hide-after="hideAfter" confirm-button-text="确定"
                            cancel-button-text="取消" title="是否确定删除?" @confirm="delFun(scope.row.id)">
                            <template #reference>
                                <el-button ref="delBtn" type="danger" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页模板 -->
            <PaginationModule :total="data.total" :getListFun="getApiListFun" />

        </el-main>
    </el-container>
</template>

<style>
.addBtn {
    display: flex;
}

.upload-demo {
    width: 100%;
}

.el-dialog__body {
    max-height: 500px;
    overflow-y: auto;
}

.import_url {
    display: flex;
    width: 100%
}
</style>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue'
import { getAPIList, delAPI, getImportAPI, importAPI } from '../http/api'
import $http from '../http'
import { ElMessage } from 'element-plus'
import router from "../router/index"
import PaginationModule from './PaginationModule.vue'
import ProjectModule from './ProjectModule.vue'

// 导入弹窗
const importDialog = ref(false);
// 导入预览弹窗
const importPreviewDialog = ref(false);
// 导入文件接口需要的请求头
const headers_token = ref({ Authorization: localStorage.getItem('token') });
// 导入文件接口
const uploadUrl = ref($http.defaults.baseURL + "/api/get_import_list/");
// 导入文件组件
const upload_file = ref('');
const clearFiles = () => {
    upload_file.value.clearFiles()
}
const formdata = reactive({
    url: ''
})
const apiinfo_list = ref([]);

// 通过监听apiinfo_list变化，重新对apiingfo_tree赋值
const apiinfo_tree = ref([{ id: 1, label: '全选', children: [] }])

const goToImport = () => {
    importDialog.value = true
}
// api_tree组件的实例对象
const api_tree = ref('');
const default_expanded = ref([1]);
const default_key = ref([1]);

const formRef = ref(null);
const cancelDialog = (formEl) => {
    // 取消弹窗，重置
    importDialog.value = false;
    clearFiles();
    if (!formEl) return
    formEl.resetFields();
}
const ImportFile = (response) => {
    // 回调函数自动接收请求体数据，从文件导入列表
    if (response.status) {
        apiinfo_list.value = response.data;
        openImportPreviewDialog();
    }
    else {
        ElMessage({
            showClose: true,
            center: true,
            message: response.msg,
            type: 'error',
        })
        clearFiles();
    }
}

const ImportApiFun = async () => {
    // 从URL导入列表
    const res = await getImportAPI(formdata);
    if (res.status) {
        apiinfo_list.value = res.data;
        openImportPreviewDialog();
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

const openImportPreviewDialog = () => {
    importPreviewDialog.value = true;
    default_expanded.value = [1];
    default_key.value = [1]
}

const handleCheckChange = (selection, is_select) => {
    if (selection.id === 1) {
        return
    }
    else if (is_select === true) {
        selection.is_select = true
    }
    else {
        selection.is_select = false
    }
}
// 确认导入的列表
const import_apis = ref([])
const import_data = reactive({
    apis_list: []
})
const sureImport = async () => {
    import_apis.value.length = 0;
    apiinfo_tree.value[0].children.forEach((item) => {
        if (item.is_select === true) {
            import_apis.value.push(item.value);
        }
    });
    import_data.apis_list = import_apis.value
    import_data.module_id = parseInt(localStorage.getItem('api_module_id'),10);
    const res = await importAPI(import_data);
    importPreviewDialog.value = false;
    if (res.status) {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getApiListFun({ page: 1, size: 10 })
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
    "module_id": null,
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
    if (localStorage.getItem('api_module_id') !== null){
        params.module_id = parseInt(localStorage.getItem('api_module_id'),10);
    }
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

// 监听apiinfo_list的变化
watch(apiinfo_list, () => {
    // 清空原有的children数组
    apiinfo_tree.value[0].children.length = 0;

    // 将处理后的apiinfo_list添加到children数组中
    apiinfo_list.value.forEach((item, index) => {
        let api_method = item.method;
        let name = item.name;
        let uri = item.uri;
        apiinfo_tree.value[0].children.push({ id: index + 2, label: api_method + ' ' + name + ' ' + uri, value: item, is_select: true });
    });
});
</script>