<template>
  <div class="list">
    <ShortcutKey v-if="isEmpty" class="shortcutBox"></ShortcutKey>
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
          @enterChange="(raw) => handleEnterChange(item, raw)"
        ></TodoItem>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import dayjs from 'dayjs'
import TodoItem from './todo-item.vue'
import ShortcutKey from './shortcut-key.vue'

const list = ref([])

const isEmpty = computed(() => !list.value.length)

function handleAdd() {
  if (list.value.length >= 9) return
  list.value.push({
    id: Math.random() * 100,
    name: '',
    time: dayjs().format('MM-DD HH:mm:ss'),
    isEdit: true
  })
  activeRow.value = 0
}
function handleEmpty() {
  list.value.length = 0
}

function handleDelete(index) {
  if (list.value[index].isFinish) return
  list.value.splice(index, 1)
}

function handleEnterChange(item, raw) {
  if (!item.name) return
  item.isEdit = raw.isEdit
  handleAdd()
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

onMounted(() => {
  document.onkeydown = (e) => {
    if (e.key == 'Escape') {
      activeRow.value = 0
      removeLastAdd()
    }

    if (e.ctrlKey && e.key == 'i') {
      handleAdd()
    }

    if (e.ctrlKey && e.key == 'Delete') {
      handleEmpty()
    }

    activedNumKey(e)

    if (activeRow.value) {
      if (activeRow.value !== 1 && e.key == 'ArrowUp') {
        activeRow.value--
      }
      if (activeRow.value !== list.value.length && e.key == 'ArrowDown') {
        activeRow.value++
      }

      if (e.key == 'Delete') {
        handleDelete(activeRow.value - 1)
      }

      if (e.key == 'Enter') {
        const target = list.value.find((item, index) => index + 1 == activeRow.value)
        target.isFinish = true
      }
    }
  }
})
</script>

<style lang="less" scoped>
.list {
  width: 100%;
  height: 100%;
  position: relative;
  user-select: none;
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
  .item-row {
    line-height: 34px;
    border: 1px solid transparent;
    border-radius: 4px;
    margin-bottom: 4px;
  }
  .active-row {
    border-color: #1677ff;
  }
  .finish-row {
    color: #999;
    text-decoration: line-through;
  }
}
</style>
