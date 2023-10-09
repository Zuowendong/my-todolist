<template>
  <div>
    <div v-if="item.isEdit">
      <Input
        ref="inputRef"
        v-model:value="item.name"
        maxlength="50"
        placeholder="请输入待办项"
        @keydown.enter="handleInput"
      />
    </div>

    <div v-else class="show-item">
      <span>{{ serialNum }}、</span>
      <span> {{ item.name }}</span>
      <span class="time"> Create at {{ item.time }}</span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue'
import { Input } from 'ant-design-vue'

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
const emits = defineEmits(['enterChange'])

function handleInput() {
  emits('enterChange', { isEdit: false })
}

const inputRef = ref()
onMounted(() => {
  inputRef.value?.focus()
})
</script>

<style lang="less" scoped>
.show-item {
  display: grid;
  grid-template-columns: 30px auto 130px;
  align-items: center;
  .time {
    font-size: 12px;
    color: #666;
  }
}
</style>
