<template>
  <div class="list">
    <template v-if="isEmpty">
      <ShortcutKey class="shortcutBox"></ShortcutKey>
      <div class="addBox">
        <Button type="primary" @click="handleAdd">创建待办项</Button>
      </div>
    </template>
    <template v-else>
      <div
        v-for="(item, index) in list"
        :key="item.id"
        :class="{
          'item-row': !item.isEdit,
          'active-row': index + 1 == activeRow,
          'finish-row': item.isFinish
        }"
      >
        <TodoItem
          :item="item"
          :serialNum="index + 1"
          :fileTime="fileTime"
          @enterChange="(raw) => handleEnterChange(item, raw)"
          @deleteChange="(raw) => handleDeleteChange(item, raw)"
          @finishChange="(raw) => handleFinishChange(item, raw)"
          @editChange="(raw) => handleEditChange(item, raw)"
        ></TodoItem>
      </div>
    </template>
    <div class="addBox-list">
      <PlusCircleOutlined v-if="isAdd" @click="handleAdd" />
      <UploadOutlined v-if="isExport" @click="handleExport" />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, createVNode, toRefs, watch } from 'vue'
import { Button, Modal, message } from 'ant-design-vue'
import {
  ExclamationCircleOutlined,
  PlusCircleOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import TodoItem from './todo-item.vue'
import ShortcutKey from './shortcut-key.vue'

const props = defineProps({
  fileUrl: {
    type: String,
    default: ''
  },
  originList: {
    type: Array,
    default: () => []
  },
  fileTime: {
    type: String,
    default: ''
  }
})
const { fileUrl, fileTime } = toRefs(props)
const emits = defineEmits(['exportFile'])

let list = ref([])
watch(
  () => props.originList,
  (_list) => {
    if (_list && _list.length) {
      list.value = _list
        .filter((item) => item)
        .map((item) => {
          const isFinish = item.split('')[0] == '√'
          const name = item.substring(1).split('->')[0].trim().substring(2)
          const time = item.split('->')[1]

          return {
            id: Math.random() * 100,
            name,
            time: time ? `${fileTime.value.substring(5)} ${time}` : '',
            isEdit: false,
            isFinish
          }
        })
    } else {
      list.value = []
    }
  },
  { immediate: true }
)

const isEmpty = computed(() => !list.value.length)
const isAdd = computed(() => {
  return !list.value[list.value.length - 1]?.isEdit
})
const isExport = computed(() => {
  return !!list.value.filter((item) => !item.isEdit).length
})

function handleAdd() {
  if (list.value.length >= 9) {
    message.warning('最多只能新建9项')
    return
  }
  list.value.push({
    id: Math.random() * 100,
    name: '',
    time: dayjs().format('MM-DD HH:mm:ss'),
    isEdit: true
  })
  activeRow.value = 0
  handleExport()
}

function handleEmpty() {
  list.value.length = 0
  handleExport()
}

function handleDelete(index) {
  if (list.value[index].isFinish) return
  list.value.splice(index, 1)
}

function handleEnterChange(item, raw) {
  if (!item.name) {
    message.warning('请输入待办内容')
    return
  }
  item.isEdit = raw.isEdit
  handleAdd()
}
function handleDeleteChange(item, raw) {
  if (item.isFinish) return
  if (raw.isEdit) {
    handleDelete(raw.index)
  } else {
    Modal.confirm({
      title: '你确认要删除当前待办项吗？',
      icon: createVNode(ExclamationCircleOutlined),
      content: createVNode('div', { style: 'color:red;' }, item.name),
      onOk() {
        handleDelete(raw.index)
        handleExport()
      },
      onCancel() {
        console.log('Cancel')
      }
    })
  }
}
function handleFinishChange(item, raw) {
  item.isFinish = raw.isFinish
  handleExport()
}
function handleEditChange(item, raw) {
  if (item.isFinish) return
  const nameIndex = list.value.findIndex((item) => !item.name)
  if (nameIndex !== -1) {
    message.warning('请输入待办事项')
    return
  }

  const editIndex = list.value.findIndex((item) => item.isEdit)
  if (editIndex !== -1) list.value[editIndex].isEdit = false

  item.isEdit = raw.isEdit
}

let activeRow = ref(0)
function activedNumKey(e) {
  if (!list.value.length) return
  const index = [1, 2, 3, 4, 5, 6, 7, 8, 9].findIndex((num) => num == e.key)
  if (e.ctrlKey && index !== -1) {
    activeRow.value = e.key
    removeLastAdd()
  }
}
function removeLastAdd() {
  if (list.value[list.value.length - 1].isEdit) {
    list.value.splice(list.value.length - 1, 1)
  }
}

function handleExport() {
  const content = list.value
    .filter((item) => !item.isEdit)
    .map((item, index) => {
      const time = item.time.split(' ')[1]
      return `${item.isFinish ? '√' : '×'} ${index + 1}.${item.name} ->${time}\n`
    })

  const time = fileTime.value || dayjs().format('YYYY-MM-DD')
  window.electronFile.exportFile({
    path: fileUrl.value,
    time,
    content: `${time}待办事项\n${content.join('')}`
  })

  emits('exportFile')
}

function shortcutEvent() {
  document.onkeydown = (e) => {
    if (e.key == 'Escape') {
      activeRow.value = 0
      removeLastAdd()
    }

    if (e.ctrlKey && e.key == 'i') handleAdd()
    if (e.ctrlKey && e.key == 'Delete') handleEmpty()
    activedNumKey(e)

    if (activeRow.value) {
      if (activeRow.value !== 1 && e.key == 'ArrowUp') activeRow.value--
      if (activeRow.value !== list.value.length && e.key == 'ArrowDown') activeRow.value++

      if (e.key == 'Delete') {
        handleDelete(activeRow.value - 1)
        handleExport()
      }

      if (e.key == 'Enter') {
        const target = list.value.find((_, index) => index + 1 == activeRow.value)
        target.isFinish = true
      }
    }
  }
}

onMounted(() => shortcutEvent())
</script>

<style lang="less" scoped>
.list {
  width: 100%;
  position: relative;
  user-select: none;
  overflow-y: auto;
  .shortcutBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .addBox {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-row {
    line-height: 34px;
    border-radius: 4px;
    margin-bottom: 4px;
    box-sizing: border-box;
    padding: 0 6px;
  }
  .active-row {
    background: linear-gradient(70deg, rgba(77, 162, 203, 0.5), rgba(103, 178, 111, 0.8));
  }
  .finish-row {
    color: #999;
    text-decoration: line-through;
  }

  .addBox-list {
    position: fixed;
    top: 25px;
    right: 6px;
    display: grid;
    grid-template-columns: repeat(2, 20px);
    column-gap: 4px;
  }
}
</style>
