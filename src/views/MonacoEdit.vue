<template>
  <div ref="editorContainer" style="height: 300px; width: 90%;margin:auto;border: 1px solid #a8abb2;"></div>
</template>
  
<script setup>
import { onMounted, ref, defineProps, watch,defineEmits } from 'vue';
import * as monaco from 'monaco-editor';

const editorContainer = ref(null);

const props = defineProps({
  code: String,
})


let editorInstance;
const emits = defineEmits([
  'update:code'
])


// defineExpose({
//   getData: () => editorInstance.getValue(),
//   setData: (newValue) => editorInstance.setValue(newValue)
// })


onMounted(() => {
  if (editorContainer.value) {
    editorInstance = monaco.editor.create(editorContainer.value, {
      value: props.code,
      language: 'python',
      // theme: 'vs-dark', // 可选，设置主题，黑色
      theme: 'vs',
      automaticLayout: true, // 可选，自动调整编辑器大小适应容器
    });
  }
  // 监听编辑器内容变化，触发事件，使用编辑器内容更新到code，既父组件传过来的表单数据
  editorInstance.onDidChangeModelContent(() => {
    emits('update:code', editorInstance.getValue())
  });

});
// 监听父组件的code有没有变化，如果发生了改变并且内容与当前内容不一致，更新到编辑器内容里面
watch(() => props.code , (newCode) => {
  if(!newCode || !editorInstance) return
  if(newCode === editorInstance.getValue() ) return
  editorInstance.setValue(newCode)
})


</script>