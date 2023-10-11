<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { Modal, Tag, Tabs, TabPane, Button, Row, Col } from 'ant-design-vue'
import { QuestionCircleOutlined, SnippetsOutlined, PlusCircleOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import TodoList from './components/todo-list.vue'
import ShortcutKey from './components/shortcut-key.vue'

let open = ref(false)
let activeKey = ref('1')
function showModal() {
  open.value = true
  activeKey.value = '1'
}

let fileUrl = ref('')
let fileNames = ref([])
let activeFileId = ref(0)
let fileContent = ref([])

onMounted(() => {
  fileUrl.value = window.localStorage.getItem('fileUrl') || ''

  getFileNames()
  getFileContent()

  window.electronFile.readFile(`${fileUrl.value}\\${dayjs().format('YYYY-MM-DD')}.txt`)
})

function getFileContent() {
  window.electron.ipcRenderer.on('fileContent', (_, data) => {
    fileContent.value = data.split('\n')
    fileContent.value.splice(0, 1)
  })
}

function getFileNames() {
  window.electronFile.readFileNames(fileUrl.value)
  window.electron.ipcRenderer.on('fileNames', (_, names) => {
    fileNames.value = names.map((item, index) => {
      return {
        id: index + 1,
        name: item
      }
    })
  })
}

function changeFileStorage() {
  const { ipcRenderer } = window.electron
  ipcRenderer.invoke('dialog:changeFile').then((res) => {
    fileUrl.value = res
    window.localStorage.setItem('fileUrl', fileUrl.value)
  })
}

function openFile() {
  if (!fileUrl.value) return
  window.electronFile.setFileUrl(fileUrl.value)
}

let isFileCatalog = ref(false)
function showFileCatalog() {
  isFileCatalog.value = !isFileCatalog.value
}

let fileTime = ref('')
function switchFile(item) {
  activeFileId.value = item.id
  fileTime.value = item.name.split('.')[0]
  window.electronFile.readFile(`${fileUrl.value}\\${item.name}`)
}

const today = computed(() => {
  return fileTime.value || dayjs().format('YYYY-MM-DD')
})

let isAddTodayBtn = ref(false)
watch(today, (val) => {
  if (val != dayjs().format('YYYY-MM-DD')) isAddTodayBtn.value = true
  hiddenTodayBtn()
})
function hiddenTodayBtn() {
  const index = fileNames.value.findIndex((item) =>
    item.name.includes(dayjs().format('YYYY-MM-DD'))
  )
  if (index != -1) isAddTodayBtn.value = false
}

async function handleAdd() {
  hiddenTodayBtn()
  await window.electronFile.createFile({
    path: fileUrl.value,
    time: dayjs().format('YYYY-MM-DD')
  })

  getFileNames()
}
</script>

<template>
  <div class="main">
    <Row style="height: 100%">
      <Col flex="30px" class="centerCol">
        <SnippetsOutlined
          :class="['icon', isFileCatalog ? 'activeIcon' : '']"
          @click="showFileCatalog"
        />
        <QuestionCircleOutlined :class="['icon', open ? 'activeIcon' : '']" @click="showModal" />
        <PlusCircleOutlined v-if="isAddTodayBtn" class="icon activeIcon" @click="handleAdd" />
      </Col>
      <Col v-if="isFileCatalog" flex="100px" class="centerCol">
        <div
          v-for="item in fileNames"
          :key="item.id"
          :class="['fileName', item.id === activeFileId ? 'activeFile' : '']"
          @click="switchFile(item)"
        >
          {{ item.name }}
        </div>
      </Col>
      <Col flex="auto" class="contentCol">
        <header>
          <Tag :bordered="false">{{ today }}</Tag>
          待办事项
        </header>
        <TodoList
          class="listBox"
          :fileUrl="fileUrl"
          :originList="fileContent"
          :fileTime="fileTime"
          @exportFile="getFileNames"
        ></TodoList>
      </Col>
    </Row>

    <Modal v-model:open="open" title="帮助" :footer="null">
      <Tabs v-model:activeKey="activeKey">
        <TabPane key="1" tab="文件管理">
          <div class="file-manage">
            <div class="row-url">{{ fileUrl }}</div>
            <div class="row-tip">待办日志文件的默认保存位置</div>
            <div class="row-btns">
              <Button @click="changeFileStorage">更改</Button>
              <Button @click="openFile">打开文件夹</Button>
            </div>
          </div>
        </TabPane>
        <TabPane key="2" tab="快捷键">
          <ShortcutKey></ShortcutKey>
        </TabPane>
      </Tabs>
    </Modal>
  </div>
</template>

<style lang="less">
@import './assets/css/app.less';

.main {
  height: 100%;
  position: relative;
  overflow: auto;
  box-sizing: border-box;
  user-select: none;
  header {
    height: 60px;
    line-height: 60px;
  }
  .listBox {
    height: calc(100% - 60px);
  }
}

.centerCol {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  box-shadow: 1px 0px 2px 0px #ccc;
  .icon {
    font-size: 22px;
    margin-bottom: 20px;
    color: #aaa;
  }
  .activeIcon {
    color: #333;
  }
  .addBtn {
    margin-bottom: 10px;
  }
  .fileName {
    padding: 0 2px;
    font-size: 12px;
    line-height: 30px;
    border-radius: 4px;
    cursor: pointer;
  }
  .activeFile {
    color: #003eb3;
    background-color: #e6f4ff;
  }
}
.contentCol {
  box-sizing: border-box;
  padding-left: 10px;
}
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
