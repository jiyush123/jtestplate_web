<template>
    <h1>新增测试用例</h1>
    <el-form :model="addForm" label-width="120px" ref="ruleFormRef">
        <el-form-item label="测试用例名称" prop="name" :rules="[
            { required: true, message: '测试用例名称不能为空' },
            { min: 3, max: 30, message: '长度需要为3-30个字符' },
        ]">
            <el-input v-model="addForm.name" />
        </el-form-item>

        <div v-for="(step, index) in steps" :key="index" style="margin:30px">
            <el-collapse>
                <el-collapse-item :name="index">
                    <template #title>
                        {{ step.title + (index + 1) }}
                        <el-form-item label="步骤名称" prop="'steps.' + index + '.' + step.name" style="margin:auto" :rules="[
                            { required: true, message: '步骤名称不能为空' },
                            { min: 3, max: 30, message: '长度需要为3-30个字符' },
                        ]">
                            <el-input v-model="addForm.steps[index].name" @click.stop />
                        </el-form-item>
                    </template>
                    <!-- 测试步骤 -->
                    <el-form :model="steps[index]" label-width="120px" ref="ruleFormRef">

                        <el-form-item label="请求方式" prop="method" :rules="[
                            { required: true, message: '请选择请求方式' },
                        ]">
                            <el-radio-group v-model="steps[index].method">
                                <el-radio label="GET" />
                                <el-radio label="POST" />
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="路径" prop="uri" :rules="[
                            { required: true, message: '路径不能为空' },
                        ]">
                            <el-input v-model="steps[index].uri" />
                        </el-form-item>
                        <!-- 请求头 -->
                        <el-form-item label="Headers">
                            <el-table :data="headersData[index]" border style="width: 700px">
                                <el-table-column prop="headerskey" label="Keys" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="headersData[index][scope.$index].headerskey" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="headersvalue" label="Values" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="headersData[index][scope.$index].headersvalue" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="headersdecription" label="描述" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="headersData[index][scope.$index].headersdecription" />
                                    </template>
                                </el-table-column>
                                <el-table-column width='100'>
                                    <template #default="scope">
                                        <el-button type="danger" @click="delHeader(index, scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-button type="primary" @click="addHeader(index)"
                            style="margin-left: 50px;margin-bottom: 10px;">新增请求头参数</el-button>
                        <!-- 请求参数 -->
                        <el-form-item label="Params">
                            <el-table :data="paramsData[index]" border style="width: 700px">
                                <el-table-column prop="paramskey" label="Keys" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="paramsData[index][scope.$index].paramskey" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="paramsvalue" label="Values" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="paramsData[index][scope.$index].paramsvalue" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="paramsdecription" label="描述" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="paramsData[index][scope.$index].paramsdecription" />
                                    </template>
                                </el-table-column>
                                <el-table-column width='100'>
                                    <template #default="scope">
                                        <el-button type="danger" @click="delParam(index, scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-button type="primary" @click="addParams(index)"
                            style="margin-left: 50px;margin-bottom: 10px;">新增params参数</el-button>
                        <!-- 请求体 -->
                        <el-form-item label="Body">
                            <el-table :data="bodyData[index]" border style="width: 700px">
                                <el-table-column prop="bodykey" label="Keys" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="bodyData[index][scope.$index].bodykey" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="bodyvalue" label="Values" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="bodyData[index][scope.$index].bodyvalue" />
                                    </template>
                                </el-table-column>
                                <el-table-column prop="bodydecription" label="描述" width='200'>
                                    <template #default="scope">
                                        <el-input v-model="bodyData[index][scope.$index].bodydecription" />
                                    </template>
                                </el-table-column>
                                <el-table-column width='100'>
                                    <template #default="scope">
                                        <el-button type="danger" @click="delBody(index, scope.$index)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>
                        <el-button type="primary" @click="addBody(index)"
                            style="margin-left: 50px;margin-bottom: 10px;">新增body参数</el-button>
                    </el-form>

                </el-collapse-item>
            </el-collapse>
        </div>
    </el-form>
    <el-button type="primary" @click="AddStep">新增步骤</el-button>
    <el-button type="primary" @click="onSubmit(ruleFormRef)">保存</el-button>
    <el-button @click="cancelBtn">取消</el-button>
</template>

<style></style>

<script setup>
import { reactive } from 'vue';
import router from "../router/index"

const steps = reactive(
    [{
        title: "步骤",
        name: '',
        method: '',
        uri: '',
        headers: {},
        params: {},
        body: {},
    }]
);

const addForm = reactive({
    name: '',
    level: null,
    status: 1,
    steps: steps,
    created_user: localStorage.getItem('name'),
    updated_user: localStorage.getItem('name')
})

// const steps = reactive(
//     [{
//         title: "步骤",
//         name: '',
//         method: '',
//         uri: '',
//         headers: {},
//         params: {},
//         body: {},
//     }]
// );

const AddStep = () => {
    steps.push({
        title: "步骤",
        name: '',
        method: '',
        uri: '',
        headers: {},
        params: {},
        body: {},
    });
    headersData.push([]);
    paramsData.push([]);
    bodyData.push([]);
}

const headersData = reactive(
    [[]]
);

const paramsData = reactive(
    [[]]
);

const bodyData = reactive(
    // 默认为空，需要再点击添加，否则为空时保存的是空对象，有些接口需要空对象时添加一个空行即可
    [[]]
);

const addHeader = (index) => {
    headersData[index].push({
    })
}

const delHeader = (index, delindex) => {
    headersData[index].splice(delindex, 1);
}

const addParams = (index) => {
    paramsData[index].push({
    })
}

const delParam = (index, delindex) => {
    paramsData[index].splice(delindex, 1);
}

const addBody = (index) => {
    bodyData[index].push({
    })
}

const delBody = (index, delindex) => {
    bodyData[index].splice(delindex, 1);
}

const cancelBtn = () => {
    router.push('/api/list');
}

const onSubmit = async () => {
    // const result = await assertForm()
    // if (!result) return
    // else {
    for (let j = 0; j < headersData.length; j++) {
        for (let i = 0; i < headersData[j].length; i++) {
            steps[j].headers[headersData[j][i].headerskey] = { "value": headersData[j][i].headersvalue, "decription": headersData[j][i].headersdecription };
        }
    }
    for (let j = 0; j < headersData.length; j++) {
        for (let i = 0; i < paramsData[j].length; i++) {
            steps[j].params[paramsData[j][i].paramskey] = { "value": paramsData[j][i].paramsvalue, "decription": paramsData[j][i].paramsdecription };
        }
    }
    for (let j = 0; j < headersData.length; j++) {
        for (let i = 0; i < bodyData[j].length; i++) {
            steps[j].body[bodyData[j][i].bodykey] = { "value": bodyData[j][i].bodyvalue, "decription": bodyData[j][i].bodydecription };
        }
    }
    for (let i = 0; i < headersData.length; i++) {
        if (headersData[i].length === 0) {
            steps[i].headers = null;
        }
    }
    for (let i = 0; i < headersData.length; i++) {
        if (paramsData[i].length === 0) {
            steps[i].params = null;
        }
    }
    for (let i = 0; i < headersData.length; i++) {
        if (bodyData[i].length === 0) {
            steps[i].body = null;
        }
    }
    console.log(addForm);
    //     // 发送到后端新增数据
    //     addform.created_user = localStorage.getItem('name');
    //     addform.updated_user = localStorage.getItem('name');
    //     const res = await addAPI(addform);
    //     if (res.status) {
    //         ElMessage({
    //             showClose: true,
    //             center: true,
    //             message: res.msg,
    //             type: 'success',
    //         })
    //         router.push('/api/list');
    //     }
    //     else {
    //         ElMessage({
    //             showClose: true,
    //             center: true,
    //             message: res.msg,
    //             type: 'error',
    //         })
    //     }
    // }
}

</script>