<template>
    <el-table :data="headersData" border style="width: 100%">
        <el-table-column prop="headerskey" label="Keys">
            <template #default="scope">
                <el-input v-model="headersData[scope.$index].headerskey" @input="emit('update:headers', changeHeaders())" />
            </template>
        </el-table-column>
        <el-table-column prop="headersvalue" label="Values">
            <template #default="scope">
                <el-input v-model="headersData[scope.$index].headersvalue" class="input-with-select"
                    @input="emit('update:headers', changeHeaders())">
                    <template #prepend>
                        <el-select v-model="headersData[scope.$index].headersDataType">
                            <el-option label="string" value="string" @click="emit('update:headers', changeHeaders())" />
                            <el-option label="int" value="int" @click="emit('update:headers', changeHeaders())" />
                            <el-option label="bool" value="bool" @click="emit('update:headers', changeHeaders())" />
                        </el-select>
                    </template>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="headersdecription" label="描述">
            <template #default="scope">
                <el-input v-model="headersData[scope.$index].headersdecription"
                    @input="emit('update:headers', changeHeaders())" />
            </template>
        </el-table-column>
        <el-table-column width='100'>
            <template #default="scope">
                <el-button type="danger" @click="delheaders(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button type="primary" @click="addheaders" style="margin-top: 10px;">新增headers参数</el-button>
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
// 接收父组件传过来的数据结构addForm.steps[i].headers  {key:{value:xxx,des:xxx},key:{value:xxx,des:xxx}}

const props = defineProps({
    headers: Object,
})
const emit = defineEmits(['update:headers'])

const headersData = reactive(
    []
);

const addheaders = () => {
    headersData.push({
        headersDataType: 'string'
    })
    emit('update:headers', changeHeaders())
}

const delheaders = (delindex) => {
    headersData.splice(delindex, 1);
    emit('update:headers', changeHeaders())
}

const getHeaders = () => {
    headersData.length = 0;
    for (let key in props.headers) {
        let value = props.headers[key];
        headersData.push({
            headerskey: key,
            headersDataType: value.datatype,
            headersvalue: value.value,
            headersdecription: value.decription
        });
    }
    return headersData
}

const changeHeaders = () => {
    let headers = {};

    // 如果需要一个{}，则添加一个不输入key的参数
    if (headersData.length === 1 && headersData[0].headerskey === undefined) {
        headers = {}
    }
    else {
        for (let i = 0; i < headersData.length; i++) {
            headers[headersData[i].headerskey] = { "datatype": headersData[i].headersDataType, "value": headersData[i].headersvalue, "decription": headersData[i].headersdecription };
        }
    }
    console.log(headers)
    return headers
}

defineExpose({ getHeaders })

onMounted(() => {
    setTimeout(() => {
    }, 1000)
})
</script>