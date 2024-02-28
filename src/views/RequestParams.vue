<template>
    <el-table :data="paramsData" border style="width: 100%">
        <el-table-column prop="paramskey" label="Keys">
            <template #default="scope">
                <el-input v-model="paramsData[scope.$index].paramskey" @input="emit('update:params', changeParams())" />
            </template>
        </el-table-column>
        <el-table-column prop="paramsvalue" label="Values">
            <template #default="scope">
                <el-input class="input-with-select" v-model="paramsData[scope.$index].paramsvalue"
                    @input="emit('update:params', changeParams())">
                    <template #prepend>
                        <el-select v-model="paramsData[scope.$index].paramDataType">
                            <el-option label="string" value="string" @click="emit('update:params', changeParams())" />
                            <el-option label="int" value="int" @click="emit('update:params', changeParams())" />
                            <el-option label="bool" value="bool" @click="emit('update:params', changeParams())" />
                        </el-select>
                    </template>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="paramsdecription" label="描述">
            <template #default="scope">
                <el-input v-model="paramsData[scope.$index].paramsdecription" @input="emit('update:params', changeParams())" />
            </template>
        </el-table-column>
        <el-table-column width='100'>
            <template #default="scope">
                <el-button type="danger" @click="delParam(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button type="primary" @click="addParams()" style="margin-top: 10px;">新增params参数</el-button>
</template>
<style>
.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}

.input-with-select .el-select {
    width: 85px;
}
</style>
<script setup>
import { reactive, defineProps, defineEmits, defineExpose, onMounted } from 'vue';
// 接收父组件传过来的数据结构addForm.steps[i].params  {key:{value:xxx,des:xxx},key:{value:xxx,des:xxx}}

const props = defineProps({
    params: Object,
})
const emit = defineEmits(['update:params'])

let paramsData = reactive(
    []
);

// 创建一个数据类型作映射
let data_type = new Map();

// 添加键值对，让获取的数据类型匹配列表选项
data_type.set('number', 'int');
data_type.set('string', 'string');
data_type.set('boolean', 'bool');


const addParams = () => {
    paramsData.push({
        paramDataType: 'string'
    })
}

const delParam = (delindex) => {
    paramsData.splice(delindex, 1);
    emit('update:params', changeParams())
}

const getParams = () => {
    paramsData.length = 0;
    for (let key in props.params) {
        let value = props.params[key];
        paramsData.push({
            paramskey: key,
            paramDataType: data_type.get(typeof (value.value)),
            paramsvalue: value.value,
            paramsdecription: value.decription
        });
    }
}

const changeParams = () => {
    let params = {};
    // 首先使用 Object.keys(addform.params).length === 0 检查addform.params是否没有任何属性，
    // 接着通过addform.params.constructor === Object确认它确实是一个对象（而不是其他类型）。
    // 如果满足这两个条件，则将addform.params设置为null，数据库存null，否则存null
    if (paramsData.length === 0) {
        params = null
    }
    // 如果需要一个{}，则添加一个不输入key的参数
    else if (paramsData.length === 1 && paramsData[0].paramskey === undefined) {
        params = {}
    }
    else {
        for (let i = 0; i < paramsData.length; i++) {
            params[paramsData[i].paramskey] = { "datatype": paramsData[i].paramDataType, "value": paramsData[i].paramsvalue, "decription": paramsData[i].paramsdecription };
        }
    }
    return params
}

const formatParams = () => {// params = {key1:{datatype:xxx,value:xxx,decription:xxx},key2:{datatype:xxx,value:xxx,decription:xxx}}
    let params = props.params;
    if (Object.keys(params).length > 0) {
        for (let key in params) {
            if (params[key].datatype === 'int') {
                params[key].value = Number(params[key].value);
            }
            else if (params[key].datatype === 'bool') {
        if (params[key].value === 'false') {
            params[key].value = false;
        }
        else {
            params[key].value = true;
        }
    }
    params[key] = { "value": params[key].value, "decription": params[key].decription };
}
    }
return params
}

defineExpose({ getParams, formatParams })

// const params = toRefs(props).params;
// watch(params, () => { console.log('更新') }, { deep: true })

onMounted(() => {
    getParams();
    setTimeout(() => {
    }, 1000)
})

</script>