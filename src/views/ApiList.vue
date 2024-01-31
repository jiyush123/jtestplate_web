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
    </div>
    <!-- 列表 -->
    <el-table :data="data.table" stripe style="width: 100%" show-overflow-tooltip>
        <el-table-column prop="id" label="id" width="50px" fixed/>
        <el-table-column prop="name" label="接口名称" width="200px" fixed/>
        <el-table-column prop="description" label="描述"/>
        <el-table-column prop="module" label="所属模块" width="100px"/>
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
        <el-table-column prop="uri" label="路径" width="250px"/>
        <el-table-column prop="status" label="状态" width="100px"/>
        <el-table-column prop="created_user" label="创建人" width="100px"/>
        <el-table-column prop="updated_time" label="修改时间" width="180px"/>
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

</style>

<script setup>
import { reactive, ref,onMounted } from 'vue'
import { getAPIList,delAPI } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"
import PaginationModule from './PaginationModule.vue'

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