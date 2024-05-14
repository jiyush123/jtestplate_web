<template>
    <div class="tree-title">
        <el-row>
            <el-col :span="12">
                <p>项目模块</p>
            </el-col>
            <el-col :span="12">
                <el-button class="add-tree-project" @click="AddDialog()">新增项目</el-button>
            </el-col>
        </el-row>
    </div>
    <el-tree style="width: 100%" :data="module_data" node-key="id" :current-node-key="currentNodeKey" :props="defaultProps" @node-click="nodeClick" :highlight-current="true">
        <template #default="{ node, data }">
            <span class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span class="action-buttons">
                    <el-icon color="#409EFF" @click="AddDialog(data.label, data.id)" @click.stop>
                        <CirclePlus />
                    </el-icon>
                    <el-icon color="#67C23A" @click="updateDialog(data.id, data.label, data.parent_id)" @click.stop>
                        <Edit />
                    </el-icon>
                    <el-popconfirm width="220" confirm-button-text="确定" cancel-button-text="取消"
                        title="是否确定删除?" @confirm="delModuleFun(data.id)">
                        <template #reference>
                            <el-icon color="#F56C6C" @click.stop>
                                <Delete />
                            </el-icon>
                        </template>
                    </el-popconfirm>
                </span>
            </span>
        </template>
    </el-tree>

    <el-dialog v-model="ModuleDialog" :title="dialog_title" width="30%" align-center
        @close="cancelDialog(moduleformRef)">
        <el-form :model="moduledata" label-width="100px" ref="moduleformRef">
            <el-form-item label="所属父模块" prop="parent_name">
                <el-input v-model="moduledata.parent_name" disabled='false' />
            </el-form-item>
            <el-form-item label="模块名称" prop="name" :rules="[
                { required: true, message: '模块名称不能为空' },
                { max: 20, message: '长度不能大于20个字符' }
            ]">
                <el-input v-model="moduledata.name" />
            </el-form-item>


        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancelDialog(moduleformRef)">取消</el-button>
                <el-button type="primary" @click="Submit">
                    保存
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>
<style scoped>
.tree-title{
    font-size: 18px;
}
.add-tree-project {
    margin-top: 16px;
    margin-left: 20px;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 18px;
    padding-right: 10px;
}

.action-buttons .el-icon {
    margin-left: 8px;
}
</style>
<script setup>
import { ref, reactive, onMounted,defineProps } from 'vue';
import { getModuleList, addModule, updateModule, delModule } from '../http/api'
import { ElMessage } from 'element-plus';

const params = {
    "page": 1,
    "size": 10,
}

const currentNodeKey = ref(parseInt(localStorage.getItem('api_module_id'),10));

const module_data = ref(null);

const getModuleFun = async () => {
    // 发送到后端获取列表数据
    const res = await getModuleList();
    if (res.status == true) {
        module_data.value = res.data;
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

const defaultProps = {
    children: 'children',
    label: 'label',
}
const moduledata = reactive({
    id: null,
    name: '',
    parent_id: null,
    parent_name: ''
})


// 用来判断是否是编辑弹窗
const isEdit = ref(null);
const dialog_title = ref(null);

const ModuleDialog = ref(false);
const AddDialog = (name, parent_id) => {
    // 打开弹窗
    ModuleDialog.value = true;
    dialog_title.value = '新建模块';
    isEdit.value = false;
    moduledata.parent_name = name;
    moduledata.parent_id = parent_id;
}

const updateDialog = (Did, name, parent_id) => {
    // 打开弹窗同时给表单赋值id，更新时根据id修改数据
    ModuleDialog.value = true;
    dialog_title.value = '编辑模块';
    isEdit.value = true;
    moduledata.id = Did;
    moduledata.name = name;
    moduledata.parent_id = parent_id
}

const cancelDialog = (formEl) => {
    // 取消弹窗，重置
    ModuleDialog.value = false;
    if (!formEl) return
    formEl.resetFields();
}

const Submit = () => {
    if (!isEdit.value) {
        onSubmit();
    }
    else {
        updateSubmit();
    }
}

const moduleformRef = ref(null);

const assertForm = async () => {
    try {
        await moduleformRef.value.validate();
        return true
    } catch (e) {
        return false
    }
}

const onSubmit = async () => {
    const result = await assertForm();
    // 验证表单通过后再发送
    if (!result) return
    // 发送到后端新增用户数据
    else {
        const res = await addModule(moduledata);
        if (res.status) {
            // 先重置弹窗再给提示;
            cancelDialog();
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'success',
            })
            getModuleFun();
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

const updateSubmit = async () => {
    // 发送到后端修改模块数据
    const res = await updateModule(moduledata);
    if (res.status) {
        // 先重置弹窗再给提示;
        cancelDialog();
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getModuleFun();
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

const delModuleFun = async (Did) => {
    let data = { id: Did };
    const res = await delModule(data);
    if (res.status) {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'success',
        })
        getModuleFun();
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

const props = defineProps({
    getListFun:{
        type: Function,
        default: () => {},
        required: true // 如果这个 prop 是必需的
    }
})

const nodeClick = (node) => {
    localStorage.setItem('api_module_id', node.id);
    props.getListFun(params);
}

onMounted(() => {
    getModuleFun();
    setTimeout(() => {
    }, 1000)
})
</script>