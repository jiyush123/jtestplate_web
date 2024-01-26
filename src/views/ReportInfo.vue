<template>
    <el-breadcrumb separator="/" style="margin-bottom: 30px;">
        <el-breadcrumb-item :to="{ path: '/report/list' }">报告管理</el-breadcrumb-item>
        <el-breadcrumb-item>报告详情</el-breadcrumb-item>
    </el-breadcrumb>
    <el-descriptions :title=report_data.name border :column="3">
        <el-descriptions-item label="创建人">{{ report_data.created_user }}</el-descriptions-item>
        <el-descriptions-item label="报告时间">{{ report_data.end_time }}</el-descriptions-item>
        <el-descriptions-item label="执行时长">{{ report_data.total_time }}ms</el-descriptions-item>

        <el-descriptions-item label="结果">
            <el-tag v-if="report_data.result === '成功'" type="success">{{ report_data.result }}</el-tag>
            <el-tag v-else-if="report_data.result === '失败'" type="danger">{{ report_data.result }}</el-tag>
            <el-tag v-else type="info">{{ report_data.result }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="执行情况" span="2">
            <div ref="chartContainer" style="width: 100%; height: 300px;"></div>
        </el-descriptions-item>
    </el-descriptions>

    <!-- 用例详情 -->
    <el-descriptions title='用例详情' border :column="4">
    </el-descriptions>
    <div v-for="(case_data, index) in cases_data" :key="index" style="margin:10px">
        <el-collapse @click="getReportCaseInfoFun(index)">
            <el-collapse-item :name="index">
                <template #title>
                    <el-text class="mx-1 casetitle">用例ID:{{ case_data.case_id }}</el-text>
                    <el-text class="mx-1 casetitle" style="width: 200px;">用例名称:{{ case_data.case_name }}</el-text>
                    <el-text class="mx-1 casetitle" style="width: 200px;">执行时间:{{ case_data.run_time }} ms</el-text>
                    <el-tag v-if="case_data.case_result === true" type="success">成功</el-tag>
                    <el-tag v-else type="danger">失败</el-tag>
                </template>
                <!-- 步骤详情 -->
                <template #default>
                    <el-descriptions title='步骤详情' border :column="3">
                        <!-- 获取步骤信息 -->
                        <div v-for="(step_data, index) in cases_data[index].steps_data" :key="index">
                            <el-descriptions-item label="步骤名称">{{ step_data.step_name }}</el-descriptions-item>
                            <el-descriptions-item label="执行时长">{{ step_data.run_time }} ms</el-descriptions-item>
                            <el-descriptions-item label="结果">
                                <el-tag v-if="step_data.step_result === 1" type="success">成功</el-tag>
                                <el-tag v-else-if="step_data.step_result === 2" type="danger">失败</el-tag>
                                <el-tag v-else type="info">无</el-tag>
                            </el-descriptions-item>
                            <el-descriptions-item label="响应内容" span="3">{{ step_data.step_response }}</el-descriptions-item>
                            <el-descriptions-item label="断言结果" span="3">{{ step_data.assert_info }}</el-descriptions-item>
                        </div>
                    </el-descriptions>
                </template>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>
<style>
.casetitle {
    margin-right: 50px;
    text-align: left;
}
</style>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { getReportInfo, getReportCaseInfo } from '../http/api'
import { ElMessage } from 'element-plus'

import { useRoute } from 'vue-router'
import * as echarts from 'echarts';

const chartContainer = ref(null);

const chart = () => {
    if (chartContainer.value) {
        // 使用 echarts 初始化实例
        const chartInstance = echarts.init(chartContainer.value);

        // 设置图表配置项和数据
        const option = {
            // 这里填写你的 ECharts 配置，例如柱状图、折线图等
            tooltip: {
                trigger: 'item'
            },
            legend: {
                bottom: '10%',
                left: 'center',
                // doesn't perfectly work with our tricks, disable it
                selectedMode: true
            },
            series: [
                {
                    name: '执行用例数',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '70%'],
                    // adjust the start angle
                    startAngle: 180,
                    label: {
                        show: true,
                        formatter(param) {
                            // correct the percentage
                            return param.name + ' (' + param.percent * 2 + '%)';
                        }
                    },
                    data: [
                        { value: report_data.success_nums, name: '成功', itemStyle: { color: '#33CC33' } },
                        { value: report_data.error_nums, name: '失败', itemStyle: { color: 'red' } }, {
                            // make an record to fill the bottom 50%
                            value: report_data.success_nums + report_data.error_nums,
                            itemStyle: {
                                // stop the chart from rendering this piece
                                color: 'none',
                                decal: {
                                    symbol: 'none'
                                }
                            },
                            label: {
                                show: false
                            }
                        }
                    ]
                }
            ]
        };

        // 载入图表配置
        chartInstance.setOption(option);

        // 可以添加事件监听、更新数据等操作
    }
}

const route = useRoute();
const id_params = route.params;

const report_data = reactive({
    name: '',
    end_time: '',
    success_nums: '',
    error_nums: '',
    status: '',
    result: '',
    created_user: '',
    created_time: '',
    total_time: null,
});

const cases_data = reactive(
    []
)

// 创建一个新的 Map 对象作映射
let status = new Map();

// 添加键值对  
status.set('进行中', '1');
status.set('已完成', '2');

// 获取接口信息
const getInfo = async () => {
    const res = await getReportInfo(id_params);
    if (res.status) {
        report_data.name = res.data.name;
        report_data.end_time = res.data.end_time;
        report_data.success_nums = res.data.success_nums;
        report_data.error_nums = res.data.error_nums;
        for (let i = 0; i < res.data.cases.length; i++) {
            cases_data.push({
                case_id: res.data.cases[i].case_id,
                case_name: res.data.cases[i].case_name,
                run_time: res.data.cases[i].run_time,
                case_result: res.data.cases[i].case_result,
                steps_data: [],
            })
        }
        report_data.result = res.data.result;
        report_data.status = status.get(res.data.status);
        report_data.created_user = res.data.created_user;
        report_data.created_time = res.data.created_time;
        report_data.total_time = res.data.total_time;
    }
    else {
        ElMessage({
            showClose: true,
            center: true,
            message: res.msg,
            type: 'error',
        })
    }
}
let cases_id_click = [];
const getReportCaseInfoFun = async (index) => {
    // 如何case_id点击过，则不请求
    let case_id = cases_data[index].case_id;
    if (cases_id_click.includes(case_id)) {
        return
    }
    else {
        cases_id_click.push(case_id);
        // 记录点击了哪个面板后再请求
        const report_id = id_params.id;
        const params = {'case_id': case_id,
                        'report_id':report_id}
        const res = await getReportCaseInfo(params);
        if (res.status) {
            // 回显用例详情
            for (let i = 0; i < res.data.length; i++) {
                cases_data[index].steps_data.push({
                step_name:res.data[i].step_name,
                run_time: res.data[i].run_time,
                step_response: res.data[i].step_response,
                assert_info: res.data[i].assert_info,
                step_result: res.data[i].step_result
            })
            console.log(cases_data[index].steps_data);
        }

        }
        else {
            ElMessage({
                showClose: true,
                center: true,
                message: res.msg,
                type: 'error',
            })
        }
    }

}

onMounted(async () => {
    await getInfo();
    chart();
    setTimeout(() => {
    }, 1000)
})
</script>