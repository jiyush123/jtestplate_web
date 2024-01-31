<template>
<div class="demo-pagination-block">
    <div class="demonstration"></div>
    <el-pagination v-model:current-page="currentPage1" v-model:page-size="pageSize1" :page-sizes="[10, 20, 50, 100]"
        :background="true" layout="total, prev, pager, next, sizes, jumper" :total="props.total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
</div>
</template>
<style>
.demo-pagination-block {
    width: 100%;
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}
</style>
<script setup>
import { ref,defineProps } from 'vue'

const currentPage1 = ref(1);
const pageSize1 = ref(10);

const params = {
    "page": 1,
    "size": 10,
}

const handleSizeChange = (val) => {
    params.size = val;
    props.getListFun(params);
}
const handleCurrentChange = (val) => {
    params.page = val;
    props.getListFun(params);
}

const props = defineProps({
    total: Number,
    getListFun:{
        type: Function,
        default: () => {},
        // required: true // 如果这个 prop 是必需的
    }
})
</script>