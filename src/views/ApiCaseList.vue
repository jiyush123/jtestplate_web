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
        <el-button type="primary" @click="goToSelectEnv(null)">
            批量执行
        </el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="data.table" stripe @select="handleSelect" style="width: 100%" show-overflow-tooltip>
        <el-table-column type="selection" width="50" fixed />
        <el-table-column prop="id" label="id" width="50" fixed />
        <el-table-column prop="name" label="用例名称" width="200" fixed />
        <el-table-column prop="level" label="优先级">
            <template #default="scope">
                <el-tag v-if="scope.row.level === '1'" class="ml-2" type="danger">
                    {{ scope.row.level }}
                </el-tag>
                <el-tag v-else-if="scope.row.level === '2'" class="ml-2" type="warning">
                    {{ scope.row.level }}
                </el-tag>
                <el-tag v-else-if="scope.row.level === '3'" class="ml-2" type="">
                    {{ scope.row.level }}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" />
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
        <el-table-column prop="last_time" label="最后一次执行时间" width="200"/>
        <el-table-column prop="updated_time" label="修改时间" width="200"/>

        <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
                <el-button type="primary" size="small" @click="goToSelectEnv(scope.row.id)">运行</el-button>
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
    <div class="demo-pagination-block">
        <div class="demonstration"></div>
        <el-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize1" :page-sizes="[10, 20, 50, 100]"
            :background="true" layout="total, prev, pager, next, sizes, jumper" :total="data.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 弹窗 -->
    <el-dialog v-model="Dialog" title="选择运行环境" width="40%" align-center @close="cancelDialog(formRef)">
        <el-form :model="formdata" label-width="80px" ref="formRef">
            <el-form-item label="运行环境" prop="host" :rules="[
                { required: true, message: '请选择运行环境' },
            ]">
                <el-select v-model="formdata.host" filterable placeholder="请选择" style="width: 400px;">
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
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancelDialog(formRef)">取消</el-button>
                <el-button v-if="batch_run" type="primary" @click="runTest(case_ids)">
                    运行
                </el-button>
                <el-button v-else type="primary" @click="runTest([case_id])">
                    运行
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style></style>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getAPICaseList, delAPICase, runAPICase, getEnvironmentList } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"

const Dialog = ref(false);
const case_info = ref([]);
const case_ids = ref([]);
const batch_run = ref(false);
const case_id = ref(null);
const envOptions = ref(null);

const currentPage1 = ref(1);
const pageSize1 = ref(10);
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

let queryForm = reactive({
    name: '',
    status: '',
})

const formdata = reactive({
    host: ''
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
    data.table = res.data;
    data.total = res.total

}

const handleSizeChange = (val) => {
    params.size = val;
    getAPICaseListFun()
}
const handleCurrentChange = (val) => {
    params.page = val;
    getAPICaseListFun()
}

const goToAdd = () => {
    router.push('/apicase/add');
}

const goToEdit = (id) => {
    router.push({ name: 'apicaseedit', params: { id } });
}

const goToSelectEnv = (id) => {

    Dialog.value = true;
    getEnvironmentFun();
    if (id) {
        case_id.value = id;
    }
    else {
        batch_run.value = true;
        for(let i=0;i<case_info.value.length;i++){
            case_ids.value.push(case_info.value[i].id);
        }
    }
}

const cancelDialog = (formEl) => {
    // 取消弹窗，重置
    Dialog.value = false;
    if (!formEl) return
    formEl.resetFields();
}

const formRef = ref(null);
const assertForm = async () => {
    try {
        await formRef.value.validate();
        return true
    } catch (e) {
        return false
    }
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

const runTest = async (case_ids) => {
    const result = await assertForm();
    if (!result) return
    else {
        let data = {
            'ids': case_ids,
            'created_user': localStorage.getItem('name'),
            'host': formdata.host
        };
        cancelDialog();
        ElMessage({
            showClose: true,
            center: true,
            message: '开始执行',
            type: 'success',
        })
        try {
            const res = await runAPICase(data);
            if (res.status) {
                ElMessage({
                    showClose: true,
                    center: true,
                    message: res.msg,
                    type: 'success',
                })
            }
            else {
                ElMessage({
                    showClose: true,
                    center: true,
                    message: '请求异常',
                    type: 'error',
                })
            }
        }
        catch (e) {
            ElMessage({
                showClose: true,
                center: true,
                message: '请求异常',
                type: 'error',
            })
        }
    }
}

const handleSelect = (selection) => {
    case_info.value = selection;
}


onMounted(() => {
    getAPICaseListFun();
    setTimeout(() => {
    }, 1000)
})
</script>