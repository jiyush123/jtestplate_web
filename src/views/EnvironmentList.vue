<template>
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
        <el-form-item label="环境名称" prop="name">
            <el-input v-model="queryForm.name" clearable />
        </el-form-item>

        <el-button type="primary" @click="queryList">查询</el-button>
    </el-form>
    <!-- 新增按钮 -->
    <div class="addBtn">
        <el-button type="primary" @click="AddDialog">
            新增环境
        </el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="data.table" stripe style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="环境名称" />
        <el-table-column prop="protocol" label="协议" />
        <el-table-column prop="host" label="地址" />
        <el-table-column prop="port" label="端口" />
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" size="small" @click="updateDialog(scope.row.id)">编辑</el-button>
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
    <PaginationModule :total="data.total" :getListFun="getEnvironmentListFun" />
    <!-- 弹窗 -->
    <el-dialog v-model="Dialog" :title="dialog_title" width="40%" align-center @close="cancelDialog(formRef)">
        <el-form :model="formdata" label-width="80px" ref="formRef">
            <el-form-item label="环境名称" prop="name" :rules="[
                { required: true, message: '环境名称不能为空' },
            ]">
                <el-input v-model="formdata.name" />
            </el-form-item>

            <el-form-item label="协议" prop="protocol" :rules="[
                { required: true, message: '协议不能为空' },
            ]">
                <el-select v-model="formdata.protocol" class="m-2" placeholder="请选择协议">
                    <el-option label="http" value=1 />
                    <el-option label="https" value=2 />
                </el-select>
            </el-form-item>

            <el-form-item label="地址" prop="host" :rules="[
                { required: true, message: '地址不能为空' },
                { min: 1, max: 50, message: '地址长度在1-50位' }
            ]">
                <el-input v-model="formdata.host" />
            </el-form-item>

            <el-form-item label="端口" prop="port" :rules="[
                { type: 'number', message: '必须是数字' }
            ]">
                <el-input v-model.number="formdata.port" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancelDialog(formRef)">取消</el-button>
                <el-button type="primary" @click="Submit" :loading="is_loading">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style>

</style>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getEnvironmentList, getEnvironmentInfo, addEnvironment, delEnvironment, updateEnvironment } from '../http/api'
import { ElMessage } from 'element-plus'
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

const formdata = reactive({
    name: '',
    protocol: '',
    host: '',
    port: null,
    id: null
})

const Dialog = ref(false);
// 用来判断是否是编辑弹窗
const isEdit = ref(null);
const dialog_title = ref(null);

const formRef = ref(null);

// 这个方法是等待表单验证结果，因为返回的是promise.reject,所以要用try去捕捉异常再返回布尔值
const assertForm = async () => {
    try {
        await formRef.value.validate();
        return true
    } catch (e) {
        return false
    }
}

// 创建一个新的 Map 对象  
let protocol = new Map();

// 添加键值对  
protocol.set('http', "1");
protocol.set('https', "2");

const AddDialog=()=>{
    // 打开弹窗
    is_loading.value = false;
    Dialog.value = true;
    dialog_title.value = '新建环境';
    isEdit.value = false
}

const cancelDialog = (formEl) =>{
    // 取消弹窗，重置
    Dialog.value = false;
    if (!formEl) return
    formEl.resetFields();
}

const getEnvironmentListFun = async (paramdata) => {
    // 发送到后端获取列表数据
    params.page = paramdata.page;
    params.size = paramdata.size;
    const res = await getEnvironmentList(params);
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
    getEnvironmentListFun(params)
}

const is_loading=ref(false);

const Submit = () =>{
    if(!isEdit.value){
        onSubmit();
    }
    else{
        updateSubmit();
    }
}

const onSubmit = async () => {
    const result = await assertForm();
    // 验证表单通过后再发送
    if (!result) return
    // 发送到后端新增用户数据
    else {
        is_loading.value=true;
        const res = await addEnvironment(formdata);
        if (res.status) {
            // 先重置弹窗再给提示;
            cancelDialog();
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'success',
            })
            getEnvironmentListFun(params);
        }
        else {
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'error',
            });
            is_loading.value=false;
        }
    }
}

const delFun = async (Did) => {
    let data = { id: Did };
    const res = await delEnvironment(data);
    if (res.status) {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getEnvironmentListFun(params);
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

const updateDialog = async (Did) => {
    // 打开弹窗同时给表单赋值id，更新时根据id修改数据
    is_loading.value = false;
    Dialog.value = true;
    dialog_title.value = '编辑环境';
    isEdit.value = true;
    let params = { id: Did };
    const res = await getEnvironmentInfo(params);
    formdata.name = res.data.name;
    formdata.protocol = protocol.get(res.data.protocol);
    formdata.host = res.data.host;
    formdata.port = res.data.port;
    formdata.id = Did
}

const updateSubmit = async () => {
    // 发送到后端新增用户数据
    is_loading.value=true;
    const res = await updateEnvironment(formdata);
    if (res.status) {
        // 先重置弹窗再给提示;
        cancelDialog();
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getEnvironmentListFun(params);
    }
    else {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'error',
        });
        is_loading.value=false;
    }
}

onMounted(() => {
    getEnvironmentListFun(params);
    setTimeout(() => {
    }, 1000)
})
</script>