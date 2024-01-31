<template>
    <div ref="editorContainer" style="height: 300px; width: 80%;margin:auto;border: 1px solid #a8abb2;" ></div>
    <el-button @click="clickbtn">点击</el-button>
    <el-button @click="showdata">回显json</el-button>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
import * as monaco from 'monaco-editor';

const editorContainer = ref(null);

// 假设你有一个JSON对象或字符串
const jsonData = {
  "name": "John Doe",
  "age": 30,
  "city": "New York"
};

// 将JSON对象转换为JSON字符串
const jsonStr = JSON.stringify(jsonData, null, 2); // 第二个和第三个参数用于美化输出，添加缩进和换行

// 回显数据到编辑器的方法
const showdata=()=>{
    editorInstance.setValue(jsonStr);
    // 设置只读方法
    editorInstance.updateOptions({ readOnly: true });
}

let editorInstance;

const clickbtn=()=> {
  if (editorInstance) {
    // 获取编辑器内容的方法
    let currentValue = editorInstance.getValue();
    console.log(currentValue);
    // 或者可以将这个值用于其他用途
  } else {
    console.error('Monaco Editor instance not found');
  }
}

onMounted(() => {

    if (editorContainer.value) {
        editorInstance = monaco.editor.create(editorContainer.value, {
            value: `# Write your Python code here\nprint("Hello, World!")`,
            language: 'python',
            // theme: 'vs-dark', // 可选，设置主题，黑色
            theme:'vs',
            automaticLayout: true, // 可选，自动调整编辑器大小适应容器
        });
    }
});
</script>