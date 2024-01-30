<template>
    <el-row>
        <el-col :span="6">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <span>接口数量统计</span>
                        <el-divider direction="vertical" />
                        <el-button type="primary" class="button" @click="goToAPIList" plain>查看更多</el-button>
                    </div>
                </template>
                <div style="text-align: center;margin-bottom: 30px;">
                    <el-text class="mx-1 total" type="success">{{ api_acount.total }}个</el-text>
                    <div>
                        <el-text class="mx-1 total" type="success">完成率:{{ api_completed_percent }}%</el-text>
                    </div>
                </div>
                <el-divider />
                <div style="text-align: center">
                    <div>
                        <el-text class="mx-1 classification" type="info">未开始:{{ api_acount.not_started_total }}个</el-text>
                    </div>
                    <div>
                        <el-text class="mx-1 classification" type="primary">进行中:{{ api_acount.in_progress_total
                        }}个</el-text>
                    </div>
                    <div>
                        <el-text class="mx-1 classification" type="success">已完成:{{ api_acount.completed_total }}个</el-text>
                    </div>
                </div>
            </el-card>
        </el-col>
        <!-- 接口用例统计 -->
        <el-col :span="6">
            <el-card class="box-card">
                <template #header>
                    <div class="card-header">
                        <span>接口用例统计</span>
                        <el-divider direction="vertical" />
                        <el-button type="primary" class="button" @click="goToAPICaseList" plain>查看更多</el-button>
                    </div>
                </template>
                <div style="text-align: center;margin-bottom: 30px;">
                    <el-text class="mx-1 total" type="success">{{ apicase_acount.total }}个</el-text>
                    <div>
                        <el-text class="mx-1 total" type="success">完成率:{{ apicase_completed_percent }}%</el-text>
                    </div>
                </div>
                <el-divider />
                <el-row>
                    <el-col :span="10">

                        <div style="text-align: left">
                            <div>
                                <el-text class="mx-1 classification" type="info">未开始:{{ apicase_acount.not_started_total
                                }}个</el-text>
                            </div>
                            <div>
                                <el-text class="mx-1 classification" type="primary">进行中:{{ apicase_acount.in_progress_total
                                }}个</el-text>
                            </div>
                            <div>
                                <el-text class="mx-1 classification" type="success">已完成:{{ apicase_acount.completed_total
                                }}个</el-text>
                            </div>
                        </div>
                    </el-col>
                    <el-divider direction="vertical" style="height: 60px;" />
                    <el-col :span="12">
                        <div style="text-align: center">
                            <div>
                                <el-text class="mx-1 classification" type="info">通过率:
                                    <el-tooltip class="box-item" effect="light" content="最后一次执行成功的用例/用例总数*100%"
                                        placement="top-start" show-arrow="false">
                                        <el-icon>
                                            <InfoFilled />
                                        </el-icon>
                                    </el-tooltip>
                                </el-text>
                                <div>
                                    <el-text class="mx-1 classification" type="info">{{ apicase_acount.pass_percent
                                    }}%</el-text>
                                </div>

                            </div>
                        </div>
                    </el-col>


                </el-row>
            </el-card>
        </el-col>
    </el-row>
</template>
  
<style>
.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.text {
    font-size: 14px;
}

.item {
    margin-bottom: 18px;
}

.box-card {
    width: 280px;
}

.total {
    font-size: 30px;
}

.classification {
    margin: 10px;
}
</style>
<script setup>
import { onMounted, reactive, computed } from 'vue'
import { getAPIAcount, getAPICaseAcount } from '../http/api'
import { ElMessage } from 'element-plus'
import router from "../router/index"


const api_acount = reactive({
    not_started_total: '',
    in_progress_total: '',
    completed_total: '',
    total: ''
})

const api_completed_percent = computed(() => {
    return (api_acount.completed_total / api_acount.total * 100).toFixed(1)
})

const goToAPIList = () => {
    router.push({ name: 'apilist' });
}

const getAPIAcountFun = async () => {
    // 发送到后端获取列表数据
    const res = await getAPIAcount();
    if (res.status == true) {
        api_acount.not_started_total = res.data.not_started_total;
        api_acount.in_progress_total = res.data.in_progress_total;
        api_acount.completed_total = res.data.completed_total;
        api_acount.total = res.data.total;
    }
    else {
        ElMessage({
            showClose: true,
            center: true,
            message: '请求失败',
            type: 'error',
        })
    }
}

const goToAPICaseList = () => {
    router.push({ name: 'apicaselist' });
}

const apicase_acount = reactive({
    not_started_total: '',
    in_progress_total: '',
    completed_total: '',
    total: '',
    pass_percent: '',
})

const apicase_completed_percent = computed(() => {
    return (apicase_acount.completed_total / apicase_acount.total * 100).toFixed(1)
})

const getAPICaseAcountFun = async () => {
    // 发送到后端获取列表数据
    const res = await getAPICaseAcount();
    if (res.status == true) {
        apicase_acount.not_started_total = res.data.not_started_total;
        apicase_acount.in_progress_total = res.data.in_progress_total;
        apicase_acount.completed_total = res.data.completed_total;
        apicase_acount.total = res.data.total;
        apicase_acount.pass_percent = res.data.pass_percent;
    }
    else {
        ElMessage({
            showClose: true,
            center: true,
            message: '请求失败',
            type: 'error',
        })
    }
}

onMounted(() => {
    getAPIAcountFun();
    getAPICaseAcountFun();
    setTimeout(() => {
    }, 1000)
})
</script>