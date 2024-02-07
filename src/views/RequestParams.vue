<template>
    <!-- <el-form :model="params" label-width="120px">
    <el-form-item> -->
    <el-table :data="paramsData" border style="width: 100%">
        <el-table-column prop="paramskey" label="Keys">
            <template #default="scope">
                <el-input v-model="paramsData[scope.$index].paramskey" />
            </template>
        </el-table-column>
        <el-table-column prop="paramsvalue" label="Values">
            <template #default="scope">
                <el-input v-model="paramsData[scope.$index].paramsvalue" class="input-with-select">
                    <template #prepend>
                        <el-select v-model="paramsData[scope.$index].paramDataType">
                            <el-option label="string" value="string" />
                            <el-option label="int" value="int" />
                            <el-option label="bool" value="bool" />
                        </el-select>
                    </template>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="paramsdecription" label="描述">
            <template #default="scope">
                <el-input v-model="paramsData[scope.$index].paramsdecription" />
            </template>
        </el-table-column>
        <el-table-column width='100'>
            <template #default="scope">
                <el-button type="danger" @click="delParam(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <!-- </el-form-item>
</el-form> -->
    <el-button type="primary" @click="addParams()" style="margin-left: 50px;margin-bottom: 10px;">新增params参数</el-button>
</template>
<style>
.input-with-select .el-input-group__prepend {
    background-color: var(--el-fill-color-blank);
}

.input-with-select .el-select {
    width: 80px;
}
</style>
<script setup>
import { reactive, watch, defineEmits, defineProps,onMounted } from 'vue';
// 接收父组件传过来的数据结构addForm.steps[i].params  {key:{value:xxx,des:xxx},key:{value:xxx,des:xxx}}

const props = defineProps({
    params: Object,
})
const emit = defineEmits(['update:params'])

const paramsData = reactive(
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
}

const getParams = () => {
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

const formatParams = (paramsData) => {
    let params = {};
    for (let i = 0; i < paramsData.length; i++) {
        if (paramsData[i].paramDataType === 'int') {
            paramsData[i].paramsvalue = Number(paramsData[i].paramsvalue);
        }
        else if (paramsData[i].paramDataType === 'bool') {
            if (paramsData[i].paramsvalue === 'false') {
                paramsData[i].paramsvalue = false;
            }
            else {
                paramsData[i].paramsvalue = true;
            }
        }
        params[paramsData[i].paramskey] = { "value": paramsData[i].paramsvalue,"decription":paramsData[i].paramsdecription };
    }
    return params
}

// defineExpose({get:()=>formatParams(paramsData)})

watch(() => paramsData, (paramsData) => {
    emit('update:params', formatParams(paramsData))
},
    { deep: true } // 开启深度监听
)

onMounted(() => {
    getParams();
    setTimeout(() => {
    }, 1000)
})
</script>