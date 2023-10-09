<script setup>
import { Modal, Tag } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import TodoList from './components/todo-list.vue'
import ShortcutKey from './components/shortcut-key.vue'

import { computed, onMounted, ref } from 'vue'
const open = ref(false)

const showModal = () => {
  open.value = true
}
const today = computed(() => dayjs().format('YYYY-MM-DD'))
</script>

<template>
  <div class="main">
    <header>
      <Tag :bordered="false">{{ today }}</Tag>
      待办事项
    </header>
    <TodoList class="listBox"></TodoList>

    <div class="tipBox" title="快捷键提示" @click="showModal">
      <QuestionCircleOutlined style="font-size: 20px" />
    </div>
    <Modal v-model:open="open" title="快捷键" :footer="null">
      <ShortcutKey></ShortcutKey>
    </Modal>
  </div>
</template>

<style lang="less">
@import './assets/css/app.less';
</style>
