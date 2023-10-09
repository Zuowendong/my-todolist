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
      <CloseCircleOutlined class="icon" @click="handleDelete(true)" />
    </div>

    <div v-else class="show-item">
      <span>{{ serialNum }}、</span>
      <span> {{ item.name }}</span>
      <span class="time"> Create at {{ item.time }}</span>
      <div class="icon">
        <CloseCircleOutlined @click="handleDelete(false)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue'
import { Input } from 'ant-design-vue'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'

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
const emits = defineEmits(['enterChange', 'deleteChange'])

function handleInput() {
  emits('enterChange', { isEdit: false })
}
function handleDelete(isEdit) {
  emits('deleteChange', {
    index: serialNum.value - 1,
    isEdit
  })
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
  .icon {
    margin-left: 4px;
  }
}
.show-item {
  display: grid;
  grid-template-columns: 30px auto 130px 30px;
  align-items: center;
  .time {
    font-size: 12px;
    color: #666;
  }
  .icon {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
