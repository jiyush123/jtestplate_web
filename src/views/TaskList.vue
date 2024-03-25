<template>
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
        <el-form-item label="任务名称" prop="name">
            <el-input v-model="queryForm.name" clearable />
        </el-form-item>
        <el-form-item label="任务类型" prop="type">
            <el-select v-model="queryForm.type" clearable placeholder="请选择">
                <el-option v-for="item in type_options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
        </el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
    </el-form>
    <!-- 新增按钮 -->
    <div class="addBtn">
        <el-button type="primary" @click="goToAdd">
            新增任务
        </el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="data.table" stripe style="width: 100%" show-overflow-tooltip>
        <el-table-column prop="id" label="id" width="50px" fixed/>
        <el-table-column prop="name" label="任务名称" width="150px" fixed/>
        <el-table-column prop="env" label="执行环境"/>
        <el-table-column prop="type" label="任务类型"/>
        <el-table-column prop="is_active" label="启用">
            <template #default="scope">
                <el-switch v-model="scope.row.is_active" @change=changeIsactive(scope.row.id,scope.row.is_active) />
            </template>
        </el-table-column>
        <el-table-column prop="last_run_time" label="上次执行时间" width="180px"/>
        <el-table-column prop="next_run_time" label="下次执行时间" width="180px"/>

        <el-table-column prop="created_user" label="创建人"/>
        <el-table-column prop="updated_time" label="修改时间" width="180px"/>
        <el-table-column fixed="right" label="操作" width="150px">
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
    <PaginationModule :total="data.total" :getListFun="getCronJobListFun" />
</template>

<style>

</style>

<script setup>
import { reactive, ref,onMounted } from 'vue'
import { getCronJobList,delCronJob,editCronJobIsActive } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"
import PaginationModule from './PaginationModule.vue'

const hideAfter = ref(0);
let data = reactive({
    table: [],
    total: 0,
})

const changeIsactive = async (id,is_active)=>{
    const res = await editCronJobIsActive({id:id,is_active:is_active});
    if (res.status) {
        let msg = '禁用成功';
        if(is_active === true){
            msg = '启用成功'
        }
        ElMessage({
            showClose: true,
            center: true,
            message: msg,
            type: 'success',
        })
        getCronJobListFun(params);
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
let params = {
    "page": 1,
    "size": 10,
}
// 枚举映射
const type_options = [{
    value: '1',
    label: '定时执行',
},
{
    value: '2',
    label: '只执行一次',
},]

const queryForm = reactive({
    name: '',
    type: '',
})


const queryList = () => {
    if (queryForm.name == '') {
        delete params.name;
    } else {
        params.name = queryForm.name;
    }
    if (queryForm.type == '') {
        delete params.type;
    } else {
        params.type = queryForm.type;
    }
    getCronJobListFun(params)
}

const getCronJobListFun = async (paramdata) => {
    params.page = paramdata.page;
    params.size = paramdata.size;
    // 发送到后端获取列表数据
    const res = await getCronJobList(params);
    data.table = res.data;
    data.total = res.total

}

const goToAdd = () => {
    router.push('/task/add');
}

const goToEdit = (id) => {
    router.push({ name: 'taskedit', params: { id } });
}

const delFun = async (Did) => {
    let data = { id: Did };
    const res = await delCronJob(data);
    if (res.status) {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getCronJobListFun(params);
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
    getCronJobListFun(params);
    setTimeout(() => {
    }, 1000)
})
</script>