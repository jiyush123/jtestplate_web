<template>
    <el-table :data="bodyData" border style="width: 100%">
        <el-table-column prop="bodykey" label="Keys">
            <template #default="scope">
                <el-input v-model="bodyData[scope.$index].bodykey" @input="emit('update:body', changeBody())" />
            </template>
        </el-table-column>
        <el-table-column prop="bodyvalue" label="Values">
            <template #default="scope">
                <el-input v-model="bodyData[scope.$index].bodyvalue" class="input-with-select"
                    @input="emit('update:body', changeBody())">
                    <template #prepend>
                        <el-select v-model="bodyData[scope.$index].bodyDataType">
                            <el-option label="string" value="string" @click="emit('update:body', changeBody())" />
                            <el-option label="int" value="int" @click="emit('update:body', changeBody())" />
                            <el-option label="bool" value="bool" @click="emit('update:body', changeBody())" />
                        </el-select>
                    </template>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="bodydescription" label="描述">
            <template #default="scope">
                <el-input v-model="bodyData[scope.$index].bodydescription" @input="emit('update:body', changeBody())" />
            </template>
        </el-table-column>
        <el-table-column width='100'>
            <template #default="scope">
                <el-button type="danger" @click="delbody(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button type="primary" @click="addbody()" style="margin-top: 10px;">新增body参数</el-button>
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
// 接收父组件传过来的数据结构addForm.steps[i].body  {key:{value:xxx,des:xxx},key:{value:xxx,des:xxx}}

const props = defineProps({
    body: Object,
})
const emit = defineEmits(['update:body'])

let bodyData = reactive(
    []
);

const addbody = () => {
    bodyData.push({
        bodyDataType: 'string'
    })
    emit('update:body', changeBody())
}

const delbody = (delindex) => {
    bodyData.splice(delindex, 1);
    emit('update:body', changeBody())
}

const getBody = () => {
    bodyData.length = 0;
    for (let key in props.body) {
        let value = props.body[key];
        bodyData.push({
            bodykey: key,
            bodyDataType: value.datatype,
            bodyvalue: value.value,
            bodydescription: value.description
        });
    }
    return bodyData
}

const changeBody = () => {
    let body = {};

    // 如果需要一个{}，则添加一个不输入key的参数
    if (bodyData.length === 1 && bodyData[0].bodykey === undefined) {
        body = {}
    }
    else {
        for (let i = 0; i < bodyData.length; i++) {
            body[bodyData[i].bodykey] = { "datatype": bodyData[i].bodyDataType, "value": bodyData[i].bodyvalue, "description": bodyData[i].bodydescription };
        }
    }
    return body
}

defineExpose({ getBody })

onMounted(() => {
    setTimeout(() => {
    }, 1000)
})
</script>