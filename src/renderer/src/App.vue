<script setup>
import { computed, ref } from 'vue'
import { Modal, Tag, Tabs, TabPane, Button } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import TodoList from './components/todo-list.vue'
import ShortcutKey from './components/shortcut-key.vue'

const today = computed(() => dayjs().format('YYYY-MM-DD'))

let open = ref(false)
let activeKey = ref('1')
function showModal() {
  open.value = true
  activeKey.value = '1'
}

let fileUrl = ref('')
function changeFileStorage() {
  console.log('🔥🔥🔥🔥🔥🔥', window.electron)

  const { ipcRenderer } = window.electron
  ipcRenderer.invoke('dialog:changeFile').then((res) => {
    console.log('file', res)
    fileUrl.value = res
  })
}

function openFile() {
  console.log('🔥🔥🔥🔥🔥🔥', window.electronFile)
  if (!fileUrl.value) return
  window.electronFile.setFileUrl(fileUrl.value)
}
</script>

<template>
  <div class="main">
    <header @click="handle">
      <Tag :bordered="false">{{ today }}</Tag>
      待办事项
    </header>
    <TodoList class="listBox"></TodoList>

    <div class="tipBox" title="快捷键提示" @click="showModal">
      <QuestionCircleOutlined style="font-size: 20px" />
    </div>
    <Modal v-model:open="open" title="帮助" :footer="null">
      <Tabs v-model:activeKey="activeKey">
        <TabPane key="1" tab="快捷键">
          <ShortcutKey></ShortcutKey>
        </TabPane>
        <TabPane key="2" tab="文件管理">
          <div class="file-manage">
            <div class="row-url">{{ fileUrl }}</div>
            <div class="row-tip">待办日志文件的默认保存位置</div>
            <div class="row-btns">
              <Button @click="changeFileStorage">更改</Button>
              <Button @click="openFile">打开文件夹</Button>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<style lang="less">
@import './assets/css/app.less';

.file-manage {
  height: 192px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  user-select: none;
  .row-url {
    box-sizing: border-box;
    min-width: 184px;
    height: 32px;
    border: 1px solid #ccc;
    padding: 4px 10px 4px 2px;
  }
  .row-tip {
    font-size: 12px;
    color: #666;
    padding-bottom: 24px;
  }
  .row-btns {
    width: 184px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    column-gap: 12px;
  }
}
</style>
