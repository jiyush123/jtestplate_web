<template>
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
        <el-form-item label="用例名称" prop="name">
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
            新增测试用例
        </el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="data.table" stripe style="width: 100%">
        <el-table-column prop="id" label="id"/>
        <el-table-column prop="name" label="用例名称"/>
        <el-table-column prop="level" label="优先级">
            <template #default="scope">
                <el-tag v-if="scope.row.level === '1'" class="ml-2" type="danger">
                    {{ scope.row.level }}
                </el-tag>
                <el-tag v-else-if="scope.row.level === '2'" class="ml-2" type="warning">
                    {{ scope.row.level }}
                </el-tag>
                <el-tag v-else-if="scope.row.level === '3'" class="ml-2" type="primary">
                    {{ scope.row.level }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态"/>
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
        <el-table-column prop="last_time" label="最后一次执行时间"/>
        <el-table-column prop="updated_time" label="修改时间"/>

        <el-table-column fixed="right" label="操作">
            <template #default="scope">
                <el-button type="primary" size="small" @click="goToEdit(scope.row.id)">编辑</el-button>
                <el-popconfirm width="220" hide-after="0" confirm-button-text="确定" cancel-button-text="取消"
                    :icon="InfoFilled" icon-color="#626AEF" title="是否确定删除?" @confirm="delFun(scope.row.id)">
                    <template #reference>
                        <el-button ref="delBtn" type="danger" size="small">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <div class="demo-pagination-block">
        <div class="demonstration"></div>
        <el-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize1" :page-sizes="[10, 20, 50, 100]"
            :background="true" layout="total, prev, pager, next, sizes, jumper" :total="data.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<style>
</style>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getAPICaseList, delAPICase } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"


const currentPage1 = ref(1);
const pageSize1 = ref(10);
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

let queryForm = reactive({
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
    getAPICaseListFun()
}

const getAPICaseListFun = async () => {

    // 发送到后端获取列表数据
    const res = await getAPICaseList(params);
    console.log(data.table);
    data.table = res.data;
    data.total = res.total

}

const goToAdd = () => {
    router.push('/apicase/add');
}

const goToEdit = (id) => {
    router.push({ name: 'apicaseedit', params: { id } });
}

const delFun = async (Did) => {
    let data = { id: Did };
    const res = await delAPICase(data);
    if (res.status) {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getAPICaseListFun();
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
    getAPICaseListFun();
    setTimeout(() => {
    }, 1000)
})
</script>