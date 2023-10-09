<script setup>
import { Modal } from 'ant-design-vue'
import TodoList from './components/todo-list.vue'
import ShortcutKey from './components/shortcut-key.vue'

import { ref } from 'vue'
const open = ref(false)

const showModal = () => {
  open.value = true
}

const handleOk = (e) => {
  console.log(e)
  open.value = false
}
</script>

<template>
  <div class="main">
    <header>Todo List</header>
    <TodoList class="listBox"></TodoList>

    <div class="tipBox" @click="showModal">操作提示</div>
    <Modal v-model:open="open" title="操作按键">
      <ShortcutKey></ShortcutKey>
    </Modal>
  </div>
</template>

<style lang="less">
@import './assets/css/app.less';
</style>
