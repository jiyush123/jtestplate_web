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
        <el-table-column prop="paramsdescription" label="描述">
            <template #default="scope">
                <el-input v-model="paramsData[scope.$index].paramsdescription"
                    @input="emit('update:params', changeParams())" />
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

const addParams = () => {
    paramsData.push({
        paramDataType: 'string'
    })
    emit('update:params', changeParams())
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
            paramDataType: value.datatype,
            paramsvalue: value.value,
            paramsdescription: value.description
        });
    }
    return paramsData
}

const changeParams = () => {
    let params = {};
    // 如果需要一个{}，则添加一个不输入key的参数
    if (paramsData.length === 1 && paramsData[0].paramskey === undefined) {
        params = {}
    }
    else {
        for (let i = 0; i < paramsData.length; i++) {
            params[paramsData[i].paramskey] = { "datatype": paramsData[i].paramDataType, "value": paramsData[i].paramsvalue, "description": paramsData[i].paramsdescription };
        }
    }
    return params
}

defineExpose({ getParams })

onMounted(() => {
    setTimeout(() => {
    }, 1000)
})

</script>