<template>
    <el-row>
        <el-col :span="12">
            <el-card style="max-width: 800px">
                <template #header>
                    <div class="card-header">
                        <span>接口数据统计</span>
                    </div>
                </template>
                <el-row>
                    <el-col :span="12">
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
                                    <el-text class="mx-1 total" type="success">完成率:{{ api_completed_percent
                                    }}%</el-text>
                                </div>
                            </div>
                            <el-divider />
                            <div style="text-align: center">
                                <div>
                                    <el-text class="mx-1 classification" type="info">未开始:{{ api_acount.not_started_total
                                    }}个</el-text>
                                </div>
                                <div>
                                    <el-text class="mx-1 classification" type="primary">进行中:{{
                                        api_acount.in_progress_total
                                    }}个</el-text>
                                </div>
                                <div>
                                    <el-text class="mx-1 classification" type="success">已完成:{{
                                        api_acount.completed_total }}个</el-text>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <!-- 接口用例统计 -->
                    <el-col :span="12">
                        <el-card class="box-card">
                            <template #header>
                                <div class="card-header">
                                    <span>接口用例统计</span>
                                    <el-divider direction="vertical" />
                                    <el-button type="primary" class="button" @click="goToAPICaseList"
                                        plain>查看更多</el-button>
                                </div>
                            </template>
                            <div style="text-align: center;margin-bottom: 30px;">
                                <el-text class="mx-1 total" type="success">{{ apicase_acount.total }}个</el-text>
                                <div>
                                    <el-text class="mx-1 total" type="success">完成率:{{ apicase_completed_percent
                                    }}%</el-text>
                                </div>
                            </div>
                            <el-divider />
                            <el-row>
                                <el-col :span="10">

                                    <div style="text-align: left">
                                        <div>
                                            <el-text class="mx-1 classification" type="info">未开始:{{
                                                apicase_acount.not_started_total
                                            }}个</el-text>
                                        </div>
                                        <div>
                                            <el-text class="mx-1 classification" type="primary">进行中:{{
                                                apicase_acount.in_progress_total
                                            }}个</el-text>
                                        </div>
                                        <div>
                                            <el-text class="mx-1 classification" type="success">已完成:{{
                                                apicase_acount.completed_total
                                            }}个</el-text>
                                        </div>
                                    </div>
                                </el-col>
                                <el-divider direction="vertical" style="height: 60px;" />
                                <el-col :span="12">
                                    <div style="text-align: center">
                                        <div>
                                            <el-text class="mx-1 classification" type="info">通过率:
                                                <el-tooltip class="box-item" effect="light"
                                                    content="最后一次执行成功的用例/用例总数*100%" placement="top-start">
                                                    <el-icon>
                                                        <InfoFilled />
                                                    </el-icon>
                                                </el-tooltip>
                                            </el-text>
                                            <div>
                                                <el-text class="mx-1 classification" type="info">{{
                                                    apicase_acount.pass_percent
                                                }}%</el-text>
                                            </div>

                                        </div>
                                    </div>
                                </el-col>


                            </el-row>
                        </el-card>
                    </el-col>
                </el-row>
            </el-card>
        </el-col>
        <!-- 常用入口 -->
        <el-col :span="12">
            <el-card style="max-width: 600px">
                <template #header>
                    <div class="card-header">
                        <span>常用入口</span>
                    </div>
                </template>
                <el-row>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(1)" text>
                            <img src="../assets/云效icon.svg" alt="Icon" />
                            <span>云效平台</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(2)" text>
                            <img src="../assets/jenkins_icon.svg" alt="Icon" />
                            <span>Jenkins前端</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(3)" text>
                            <img src="../assets/jenkins_icon.svg" alt="Icon" />
                            <span>Jenkins后端</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(4)" text>
                            <img src="../assets/kubernetes.png" alt="Icon" />
                            <span>K8s</span>
                        </el-button>
                    </el-col>
                </el-row>
                <!-- 第二行 -->
                <el-row>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(5)" text>
                            <img src="../assets/gitlab.png" alt="Icon" />
                            <span>Gitlab</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(6)" text>
                            <img src="../assets/metersphere.png" alt="Icon" />
                            <span>MeterSphere</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(7)" text>
                            <img src="../assets/RocketMq.png" alt="Icon" />
                            <span>RocketMq</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(8)" text>
                            <img src="../assets/YApi.png" alt="Icon" />
                            <span>YApi</span>
                        </el-button>
                    </el-col>
                </el-row>
                <!-- 第三行 -->
                <el-row>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(9)">
                            <!-- <img src="../assets/kubernetes.png" alt="Icon" /> -->
                            <span>测试工具</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(10)" text>
                            <img src="../assets/Tapd.png" alt="Icon" />
                            <span>Tapd</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(11)" text>
                            <img src="../assets/xxl.png" alt="Icon" />
                            <span>XXL</span>
                        </el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button class="quick-jump-button" @click="openLink(12)" text>
                            <img src="../assets/jumpserver.png" alt="Icon" />
                            <span>JumpServer</span>
                        </el-button>
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

.quick-jump-button {
    width: 100px;
    height: 100px;
}

.quick-jump-button span {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.quick-jump-button img {
    width: 50px;
    height: 50px;
    margin-bottom: 5px;
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
    const completedTotal = parseFloat(api_acount.completed_total); // 转换为数字
    const total = parseFloat(api_acount.total);                    // 转换为数字

    if (isNaN(completedTotal) || isNaN(total) || total === 0) {
        return '0'; // 如果数据无效或总数为 0，返回 0
    }

    return (completedTotal / total * 100).toFixed(1);
});

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
    const completedTotal = parseFloat(apicase_acount.completed_total); // 转换为数字
    const total = parseFloat(apicase_acount.total);                    // 转换为数字

    if (isNaN(completedTotal) || isNaN(total) || total === 0) {
        return '0'; // 如果数据无效或总数为 0，返回 0
    }

    return (completedTotal / total * 100).toFixed(1);
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

const openLink = (x) => {
    if (x === 1) {
        window.open('https://devops.aliyun.com/workbench', '_blank');
    }
    else if (x === 2){
        window.open('https://jenkins.local.sinoxk.cn/', '_blank');
    }
    else if (x === 3){
        window.open('http://jenkins.sinoxk.cn/', '_blank');
    }
    else if (x === 4){
        window.open('http://192.168.16.181:3080', '_blank');
    }
    else if (x === 5){
        window.open('http://192.168.16.65/', '_blank');
    }
    else if (x === 6){
        window.open('http://192.168.16.46:8088/#/api/definition', '_blank');
    }
    else if (x === 7){
        window.open('http://192.168.16.46:8080/#/message', '_blank');
    }
    else if (x === 8){
        window.open('http://api.local.sinoxk.cn/project/338/interface/api/57201', '_blank');
    }
    else if (x === 9){
        window.open('http://192.168.16.182:30500/', '_blank');
    }
    else if (x === 10){
        window.open('https://www.tapd.cn/55619881', '_blank');
    }
    else if (x === 11){
        window.open('https://tjob.sinoxk.cn/', '_blank');
    }
    else if (x === 12){
        window.open('http://jump.sinohealth.cn/ui/#/workbench/home', '_blank');
    }
    else{
        return
    }
};

onMounted(() => {
    getAPIAcountFun();
    getAPICaseAcountFun();
    setTimeout(() => {
    }, 1000)
})
</script>