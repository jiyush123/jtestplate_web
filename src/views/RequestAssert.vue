<template>
    <el-table :data="assertData" border style="width: 100%">
        <el-table-column prop="assertkey" label="响应值(JsonPath)" width='250'>
            <template #default="scope">
                <el-input v-model="assertData[scope.$index].assertkey" @input="emit('update:assert', changeAssert())" />
            </template>
        </el-table-column>
        <el-table-column prop="assertvalue" label="期望值">
            <template #default="scope">
                <el-input v-model="assertData[scope.$index].assertvalue" class="input-with-select"
                    @input="emit('update:assert', changeAssert())">
                    <template #prepend>
                        <el-select v-model="assertData[scope.$index].assertDataType">
                            <el-option label="string" value="string" @click="emit('update:assert', changeAssert())" />
                            <el-option label="int" value="int" @click="emit('update:assert', changeAssert())" />
                            <el-option label="bool" value="bool" @click="emit('update:assert', changeAssert())" />
                        </el-select>
                    </template>
                </el-input>
            </template>
        </el-table-column>
        <el-table-column prop="assertdecription" label="描述">
            <template #default="scope">
                <el-input v-model="assertData[scope.$index].assertdecription"
                    @input="emit('update:assert', changeAssert())" />
            </template>
        </el-table-column>
        <el-table-column prop="assertresult" label="结果" width="100">
            <template #default="scope">
                <el-input v-model="assertData[scope.$index].assertresult" disabled />
            </template>
        </el-table-column>
        <el-table-column width='100'>
            <template #default="scope">
                <el-button type="danger" @click="delAssert(scope.$index)">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-button type="primary" @click="addAssert" style="margin-top: 10px;">新增assert参数</el-button>
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
// 接收父组件传过来的数据结构addForm.steps[i].assert  {key:{value:xxx,des:xxx},key:{value:xxx,des:xxx}}

const props = defineProps({
    assert: Object,
})
const emit = defineEmits(['update:assert'])

const assertData = reactive(
    []
);

// 创建一个数据类型作映射
let data_type = new Map();

// 添加键值对，让获取的数据类型匹配列表选项
data_type.set('number', 'int');
data_type.set('string', 'string');
data_type.set('boolean', 'bool');


const addAssert = () => {
    assertData.push({
        assertDataType: 'string'
    })
    emit('update:assert', changeAssert())
}

const delAssert = (delindex) => {
    assertData.splice(delindex, 1);
    emit('update:assert', changeAssert())
}

const getAssert = () => {
    assertData.length = 0;
    for (let key in props.assert) {
        let value = props.assert[key];
        assertData.push({
            assertkey: key,
            assertDataType: value.datatype,
            assertvalue: value.value,
            assertdecription: value.decription,
        });
    }
}

const assertResult = () => {
    for (let key in props.assert) {
        for (let i = 0; i < assertData.length; i++) {
            if (assertData[i].assertkey === key) {
                assertData[i].assertresult = props.assert[key].result;
                break; // 找到一项匹配就退出循环
            }
        }
    }
}

const changeAssert = () => {
    let assert = {};

    // 如果需要一个{}，则添加一个不输入key的参数
    if (assertData.length === 1 && assertData[0].assertkey === undefined) {
        assert = {}
    }
    else {
        for (let i = 0; i < assertData.length; i++) {
            assert[assertData[i].assertkey] = { "datatype": assertData[i].assertDataType, "value": assertData[i].assertvalue, "decription": assertData[i].assertdecription };
        }
    }
    return assert
}

defineExpose({ getAssert, assertResult })

onMounted(() => {
    setTimeout(() => {
    }, 1000)
})
</script>