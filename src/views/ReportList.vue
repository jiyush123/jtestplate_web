<template>
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
        <el-form-item label="标题" prop="name">
            <el-input v-model="queryForm.name" clearable />
        </el-form-item>

        <el-button type="primary" @click="queryList">查询</el-button>
    </el-form>

    <!-- 列表 -->
    <el-table :data="data.table" stripe style="width: 100%" show-overflow-tooltip>
        <el-table-column prop="id" label="id" width="50"/>
        <el-table-column prop="name" label="标题" width="250"/>
        <el-table-column prop="result" label="结果">
        <template #default="scope">
            <el-tag v-if="scope.row.result === '成功'" class="ml-2" type="success">
                {{ scope.row.result }}
            </el-tag>
            <el-tag v-else-if="scope.row.result === '失败'" class="ml-2" type="danger">
                {{ scope.row.result }}
            </el-tag>
            <el-tag v-else-if="scope.row.result === '无'" class="ml-2" type="info">
                {{ scope.row.result }}
            </el-tag>
        </template>
        </el-table-column>
        <el-table-column prop="end_time" label="结束时间"/>
        <el-table-column prop="created_user" label="创建人"/>
        <el-table-column prop="created_time" label="创建时间"/>
        <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
                <el-button type="primary" size="small" @click="goToInfo(scope.row.id)">详情</el-button>
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
    <PaginationModule :total="data.total" :getListFun="getReportListFun" />
</template>
<style></style>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getReportList, delReport } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"
import PaginationModule from './PaginationModule.vue'

const hideAfter = ref(0);
const data = reactive({
    table: [],
    total: 0,
})
const queryForm = reactive({
    name: '',
})

const params = {
    "page": 1,
    "size": 10,
}


const getReportListFun = async (paramdata) => {
    // 发送到后端获取列表数据
    params.page = paramdata.page;
    params.size = paramdata.size;
    const res = await getReportList(params);
    if (res.status == true) {
        data.table = res.data;
        data.total = res.total;
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

const queryList = () => {
    if (queryForm.name == '') {
        delete params.name;
    } else {
        params.name = queryForm.name;
    }
    getReportListFun(params)
}

const delFun = async (Did) => {
    let data = { id: Did };
    const res = await delReport(data);
    if (res.status) {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getReportListFun(params);
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

const goToInfo = (id) => {
    router.push({ name: 'reportinfo', params: { id } });
}

onMounted(() => {
    getReportListFun(params);
    setTimeout(() => {
    }, 1000)
})
</script>