<template>
  <div>
    <div v-if="item.isEdit" class="edit-item">
      <Input
        ref="inputRef"
        v-model:value="item.name"
        :maxlength="50"
        placeholder="请输入待办项"
        @keydown.enter="handleInput"
      />
      <CheckCircleOutlined class="icon" @click="handleInput" />
      <DeleteOutlined class="icon" @click="handleDelete(true)" />
    </div>

    <div v-else class="show-item">
      <div class="prefix">
        <SmileOutlined v-if="item.isFinish" style="color: #29aa1d" @click="handleFinished(false)" />
        <MehOutlined v-else @click="handleFinished(true)" />
      </div>
      <span>{{ serialNum }}、</span>
      <span> {{ item.name }}</span>
      <span class="time"> Create at {{ item.time }}</span>
      <div class="icon">
        <EditOutlined @click="handleEdit" />
        <DeleteOutlined @click="handleDelete(false)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue'
import { Input } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  MehOutlined,
  SmileOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue'

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  serialNum: {
    type: Number,
    default: 0
  }
})

const { item, serialNum } = toRefs(props)
const emits = defineEmits(['enterChange', 'deleteChange', 'finishChange', 'editChange'])

function handleInput() {
  emits('enterChange', { isEdit: false })
}
function handleDelete(isEdit) {
  emits('deleteChange', {
    index: serialNum.value - 1,
    isEdit
  })
}
function handleFinished(isFinish) {
  emits('finishChange', { isFinish })
}
function handleEdit() {
  emits('editChange', { isEdit: true })
}

const inputRef = ref()
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style lang="less" scoped>
.edit-item {
  display: flex;
  align-items: center;
  padding-right: 6px;
  .icon {
    margin-left: 4px;
  }
}
.show-item {
  display: grid;
  grid-template-columns: 30px 30px auto 130px 44px;
  grid-auto-rows: minmax(32px, auto);
  align-items: center;
  .time {
    font-size: 12px;
    color: #666;
  }
  .prefix {
    display: flex;
    justify-content: flex-start;
  }
  .icon {
    justify-content: flex-end;
    display: grid;
    grid-template-columns: repeat(2, 20px);
    justify-items: flex-end;
  }
}
</style>
