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
                            <el-option label="string" value="string" @input="emit('update:body', changeBody())" />
                            <el-option label="int" value="int" @input="emit('update:body', changeBody())" />
                            <el-option label="bool" value="bool" @input="emit('update:body', changeBody())" />
                        </el-select>
                    </template>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="bodydecription" label="描述">
            <template #default="scope">
                <el-input v-model="bodyData[scope.$index].bodydecription" @input="emit('update:body', changeBody())" />
            </template>
        </el-table-column>
        <el-table-column width='100'>
            <template #default="scope">
                <el-button type="danger" @click="delbody(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button type="primary" @click="addbody" style="margin-top: 10px;">新增body参数</el-button>
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

const bodyData = reactive(
    []
);

// 创建一个数据类型作映射
let data_type = new Map();

// 添加键值对，让获取的数据类型匹配列表选项
data_type.set('number', 'int');
data_type.set('string', 'string');
data_type.set('boolean', 'bool');


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
            bodyDataType: data_type.get(typeof (value.value)),
            bodyvalue: value.value,
            bodydecription: value.decription
        });
    }
}

const changeBody = () => {
    let body = {};

    // 如果需要一个{}，则添加一个不输入key的参数
    if (bodyData.length === 1 && bodyData[0].bodykey === undefined) {
        body = {}
    }
    else {
        for (let i = 0; i < bodyData.length; i++) {
            body[bodyData[i].bodykey] = { "datatype": bodyData[i].bodyDataType, "value": bodyData[i].bodyvalue, "decription": bodyData[i].bodydecription };
        }
    }
    return body
}

const formatBody = () => {
    let body = {};
    if (bodyData.length === 0) {
        body = null
    }
    else {
        body = props.body;
        if (Object.keys(body).length > 0) {
            for (let key in body) {
                if (body[key].datatype === 'int') {
                    body[key].value = Number(body[key].value);
                }
                else if (body[key].datatype === 'bool') {
                    if (body[key].value === 'false') {
                        body[key].value = false;
                    }
                    else {
                        body[key].value = true;
                    }
                }
                body[key] = { "value": body[key].value, "decription": body[key].decription };
            }
        }
    }
    return body
}

defineExpose({ getBody, formatBody })

onMounted(() => {
    setTimeout(() => {
    }, 1000)
})
</script>