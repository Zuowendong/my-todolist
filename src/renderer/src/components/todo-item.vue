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
      <span style="line-height: 18px" @click="sendNotification"> {{ item.name }}</span>
      <span v-show="item.time" class="time"> Create at {{ item.time }}</span>
      <div v-if="!item.isFinish" class="icon">
        <EditOutlined @click="handleEdit" />
        <SettingOutlined v-if="isSettingBtn" @click="setNotification" />
        <DeleteOutlined @click="handleDelete(false)" />
      </div>
    </div>

    <Modal v-model:open="open" title="设置" :maskClosable="false">
      <template #footer>
        <Button key="back" @click="handleCancel">取消</Button>
        <Button key="submit" type="primary" @click="handleOk">确定</Button>
      </template>
      <Form
        ref="formRef"
        :model="formState"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <FormItem label="通知时间" name="time">
          <TimePicker
            v-model:value="formState.time"
            format="HH:mm"
            value-format="HH:mm"
            :disabledHours="disabledHours"
            :disabledMinutes="disabledMinutes"
          />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRefs, toRaw } from 'vue'
import { Input, Modal, Button, Form, FormItem, TimePicker } from 'ant-design-vue'
import {
  CheckCircleOutlined,
  MehOutlined,
  SmileOutlined,
  EditOutlined,
  DeleteOutlined,
  SettingOutlined
} from '@ant-design/icons-vue'
import dayjs from 'dayjs'

const props = defineProps({
  item: {
    type: Object,
    default: () => {}
  },
  serialNum: {
    type: Number,
    default: 0
  },
  fileTime: {
    type: String,
    default: ''
  }
})

const { item, serialNum, fileTime } = toRefs(props)
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

const isSettingBtn = computed(() => {
  return dayjs().format('YYYY-MM-DD') == fileTime.value
})
let open = ref(false)
function setNotification() {
  open.value = true
}
function handleCancel() {
  open.value = false
}
const formRef = ref()
const formState = reactive({ time: '' })
function handleOk() {
  formRef.value &&
    formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState))
        handleCancel()
      })
      .catch((error) => {
        console.log('error', error)
      })
}

function disabledHours() {
  // 获取当前时间
  const now = new Date()
  const currentHour = now.getHours()
  // 禁用当前时间之前的小时
  return Array.from({ length: currentHour }, (_, index) => index)
}
function disabledMinutes(selectedHour) {
  // 获取当前时间
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  // 禁用当前时间之前的分钟
  if (selectedHour === currentHour) {
    return Array.from({ length: currentMinute }, (_, index) => index)
  }
  return []
}
const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 14 }
const rules = {
  time: [{ required: true, message: '请选择通知时间', trigger: 'change' }]
}

function sendNotification() {
  const myNotification = new Notification('标题', {
    body: '通知正文内容'
  })
  myNotification.onclick = () => {
    console.log('通知被点击')
  }
}
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
  grid-template-columns: 30px 30px auto 130px 66px;
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
    grid-template-columns: repeat(3, 20px);
    justify-items: flex-end;
  }
}
</style>
