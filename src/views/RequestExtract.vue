<template>
    <el-table :data="extractData" border style="width: 100%">
        <el-table-column prop="extractkey" label="Keys">
            <template #default="scope">
                <el-input v-model="extractData[scope.$index].extractkey" @input="emit('update:extract', changeExtract())"/>
            </template>
        </el-table-column>
        <el-table-column prop="extractvalue" label="Values(JsonPath)" width='250'>
            <template #default="scope">
                <el-input v-model="extractData[scope.$index].extractvalue" @input="emit('update:extract', changeExtract())">
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="extractdecription" label="描述">
            <template #default="scope">
                <el-input v-model="extractData[scope.$index].extractdecription" @input="emit('update:extract', changeExtract())"/>
            </template>
        </el-table-column>
        <el-table-column width='100'>
            <template #default="scope">
                <el-button type="danger" @click="delExtract(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button type="primary" @click="addExtract" style="margin-top: 10px;">新增extract参数</el-button>
</template>
<style>

</style>
<script setup>
import { reactive, defineProps, defineEmits, defineExpose, onMounted } from 'vue';
// 接收父组件传过来的数据结构addForm.steps[i].extract  {key:{value:xxx,des:xxx},key:{value:xxx,des:xxx}}

const props = defineProps({
    extract: Object,
})
const emit = defineEmits(['update:extract'])

const extractData = reactive(
    []
);


const addExtract = () => {
    extractData.push({})
}

const delExtract = (delindex) => {
    extractData.splice(delindex, 1);
    emit('update:extract', changeExtract())
}

const getExtract = () => {
    extractData.length = 0;
    for (let key in props.extract) {
        let value = props.extract[key];
        extractData.push({
            extractkey: key,
            extractvalue: value.value,
            extractdecription: value.decription
        });
    }
}

const changeExtract = () => {
    let extract = {};
    
    if (extractData.length === 0) {
        extract = null
    }
    // 如果需要一个{}，则添加一个不输入key的参数
    else if (extractData.length === 1 && extractData[0].extractkey === undefined) {
        extract = {}
    }
    else {
        for (let i = 0; i < extractData.length; i++) {
            extract[extractData[i].extractkey] = { "datatype": extractData[i].extractDataType, "value": extractData[i].extractvalue, "decription": extractData[i].extractdecription };
        }
    }
    return extract
}

defineExpose({ getExtract })

onMounted(() => {
    getExtract();
    setTimeout(() => {
    }, 1000)
})
</script>