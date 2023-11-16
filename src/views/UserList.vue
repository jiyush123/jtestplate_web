<template>
    <!-- 搜索栏 -->
    <el-form :inline="true" :model="queryForm" label-width="80px" class="queryForm listquery">
        <el-form-item label="姓名" prop="name">
            <el-input v-model="queryForm.name" clearable />
        </el-form-item>
        <el-button type="primary" @click="queryList">查询</el-button>
    </el-form>
    <!-- 新增按钮 -->
    <div class="addBtn">
        <el-button type="primary" @click="AddDialog = true">
            新增用户
        </el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="data.table" stripe style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="updated_time" label="修改时间" />
        <el-table-column fixed="login_time" label="最后一次登录时间" />
        <!-- <template #default="scope">
                <el-button type="primary" size="small" @click="updateDialog(scope.row.id)">编辑</el-button>
                <el-popconfirm width="220" hide-after="0" confirm-button-text="确定" cancel-button-text="取消" :icon="InfoFilled"
                    icon-color="#626AEF" title="是否确定删除?" @confirm="delFun(scope.row.id)">
                    <template #reference>
                    <el-button ref="delBtn" type="danger" size="small">删除</el-button>
                </template>
                </el-popconfirm>
            </template>
        </el-table-column> -->
    </el-table>
    <div class="demo-pagination-block">
        <div class="demonstration"></div>
        <el-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize1" :page-sizes="[10, 20, 50, 100]"
            :background="true" layout="total, prev, pager, next, sizes, jumper" :total="data.total"
            @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <!-- 新增弹窗 -->
    <el-dialog v-model="AddDialog" title="新增用户" width="40%" align-center>
        <el-form :model="addform" label-width="80px" ref="formRef">
            <el-form-item label="姓名" prop="name" :rules="[
                { required: true, message: '姓名不能为空' },
            ]">
                <el-input v-model="addform.name" />
            </el-form-item>
            <el-form-item label="用户名" prop="username" :rules="[
                { required: true, message: '用户名不能为空' },
            ]">
                <el-input v-model="addform.username" />
            </el-form-item>
            <el-form-item label="密码" prop="password" :rules="[
                { required: true, message: '密码不能为空' },
                { min: 6, max: 18, message: '密码长度在6-18位' }
            ]">
                <el-input v-model="addform.password" />
            </el-form-item>
            <el-form-item label="确认密码" prop="check_password" :rules="[
                { required: true, message: '密码不能为空' },
                { min: 6, max: 18, message: '密码长度在6-18位' },
                { validator: checkPassword, trigger: 'blur' }
            ]">
                <el-input v-model="addform.check_password" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="resetForm(formRef)">取消</el-button>
                <el-button type="primary" @click="onSubmit">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <!-- <el-dialog v-model="updateDialogVisible" title="编辑用户" width="40%" align-center>
        <el-form :model="formdata" label-width="80px" ref="formRef">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formdata.username" disabled />
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="formdata.password" />
            </el-form-item>
            <el-form-item label="手机号" prop="mobile" :rules="[
                { required: true, message: '手机号不能为空' },
                { type: 'number', message: '手机号必须为11位数字' },
            ]">
                <el-input v-model.number="formdata.mobile" type="text" autocomplete="off" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="resetForm(formRef)">取消</el-button>
                <el-button type="primary" @click="updateSubmit">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog> -->
</template>
<style>
.queryForm {
    margin: 0;
}

.queryForm .el-form-item {
    margin-bottom: 0;
    margin-right: 10px;
}

.demo-pagination-block {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.dialog-footer button:first-child {
    margin-right: 10px;
}

.addBtn {
    margin-top: 20px;
    margin-bottom: 10px;
    display: flex;
}

.listquery .el-input {
    width: 200px;
}
</style>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { getUserList, addUser } from '../http/api'
import { ElMessage } from 'element-plus'
// import { InfoFilled } from '@element-plus/icons-vue'

const currentPage1 = ref(1);
const pageSize1 = ref(10);
const data = reactive({
    table: [],
    total: 0,
})
// const name = ref(null);
const queryForm = reactive({
    name: '',
})

const params = {
    "page": 1,
    "size": 10,
}
const addform = reactive({
    name: '',
    username: '',
    password: '',
    check_password: '',
    id: null
})
const AddDialog = ref(false);
// let updateDialogVisible = ref(false);

// 确认密码校验规则
const checkPassword = () => {
    if (addform.password == addform.check_password) {
        return
    }
    else {
        return new Error("两次输入的密码不一致")
    }
}
const formRef = ref(null);

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

const resetForm = (formEl) => {
    AddDialog.value = false;
    // updateDialogVisible.value = false;
    if (!formEl) return
    formEl.resetFields();
}

let getUserListFun = async () => {
        // 发送到后端获取列表数据
        const res = await getUserList(params);
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

const handleSizeChange = (val) => {
    params.size = val;
    getUserListFun()
}
const handleCurrentChange = (val) => {
    params.page = val;
    getUserListFun()
}
const queryList = () => {
    if (queryForm.name == '') {
        delete params.name;
    } else {
        params.name = queryForm.name;
    }
    // if (mobile.value == '') {
    //     delete params.mobile;
    // } else {
    //     params.mobile = mobile.value;
    // }
    getUserListFun()
}

const onSubmit = async () => {
    const result = await assertForm()
    // 验证表单通过后再发送
    if (!result) return
    // 发送到后端新增用户数据
    delete addform.check_password;
    const res = await addUser(addform);
    if (res.status) {
        // 先重置弹窗再给提示;
        resetForm(formRef.value);
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        console.log(4);
        getUserListFun();
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

// const delFun=async(Did)=>{
//     let data = {id:Did};
//     const res = await delUser(data);
//     if (res.status) {
//         ElMessage({
//             showClose: true,
//             center: true,
//             message: res.msg,
//             type: 'success',
//         })
//         console.log(5);
//         getUserListFun();
//     }
//     else {
//         ElMessage({
//             showClose: true,
//             center: true,
//             message: res.msg,
//             type: 'error',
//         })
//     }
// }

// const updateDialog=async(Did)=>{
//     // 打开弹窗同时给表单赋值id，更新时根据id修改数据
//     updateDialogVisible.value = true;
//     let params = {id:Did}
//     const res = await getUserInfo(params);
//     formdata.username = res.data.username;
//     formdata.password = res.data.password;
//     formdata.mobile = res.data.mobile;
//     formdata.id = res.data.id
// }

// const updateSubmit = async () => {
//     // 发送到后端新增用户数据
//     const res = await updateUser(formdata);
//     if (res.status) {
//         // 先重置弹窗再给提示;
//         resetForm(formRef.value);
//         ElMessage({
//             showClose: true,
//             center: true,
//             message: res.msg,
//             type: 'success',
//         })
//         console.log(6);
//         getUserListFun();
//     }
//     else {
//         ElMessage({
//             showClose: true,
//             center: true,
//             message: res.msg,
//             type: 'error',
//         })
//     }
// }

// getUserListFun();
onMounted(() => {
    getUserListFun();
    setTimeout(() => {
        // console.log(222)
    }, 1000)
})
</script>