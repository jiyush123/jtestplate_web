<template>
    <el-table :data="bodyData" border style="width: 100%">
        <el-table-column prop="bodykey" label="Keys">
            <template #default="scope">
                <el-input v-model="bodyData[scope.$index].bodykey" />
            </template>
        </el-table-column>
        <el-table-column prop="bodyvalue" label="Values">
            <template #default="scope">
                <el-input v-model="bodyData[scope.$index].bodyvalue" class="input-with-select">
                    <template #prepend>
                        <el-select v-model="bodyData[scope.$index].bodyDataType">
                            <el-option label="string" value="string" />
                            <el-option label="int" value="int" />
                            <el-option label="bool" value="bool" />
                        </el-select>
                    </template>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="bodydecription" label="描述">
            <template #default="scope">
                <el-input v-model="bodyData[scope.$index].bodydecription" />
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
import { reactive, defineProps, defineExpose, onMounted } from 'vue';
// 接收父组件传过来的数据结构addForm.steps[i].body  {key:{value:xxx,des:xxx},key:{value:xxx,des:xxx}}

const props = defineProps({
    body: Object,
})
// const emit = defineEmits(['update:body'])

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
}

const delbody = (delindex) => {
    bodyData.splice(delindex, 1);
}

const getbody = () => {
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

const formatBody = () => {
    let body = {};
    if (bodyData.length === 0) {
        body = null
    }
    else if (bodyData.length === 1 && bodyData[0].bodykey === undefined) {
        body = {}
    }
    else {
        for (let i = 0; i < bodyData.length; i++) {
            if (bodyData[i].bodyDataType === 'int') {
                bodyData[i].bodyvalue = Number(bodyData[i].bodyvalue);
            }
            else if (bodyData[i].bodyDataType === 'bool') {
                if (bodyData[i].bodyvalue === 'false') {
                    bodyData[i].bodyvalue = false;
                }
                else {
                    bodyData[i].bodyvalue = true;
                }
            }
            body[bodyData[i].bodykey] = { "value": bodyData[i].bodyvalue, "decription": bodyData[i].bodydecription };
        }
    }
    return body
}

defineExpose({ getbody, formatBody })

onMounted(() => {
    getbody();
    setTimeout(() => {
    }, 1000)
})
</script>