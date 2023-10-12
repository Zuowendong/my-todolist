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
      <span style="line-height: 18px"> {{ item.name }}</span>
      <span v-show="item.time" class="time"> Create at {{ item.time }}</span>
      <div v-if="!item.isFinish" class="icon">
        <EditOutlined @click="handleEdit" />
        <SettingOutlined v-if="isSettingBtn" @click="setNotification(item)" />
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
            placeholder="请选择通知时间"
          />
          <template v-if="formState.time">
            <div v-if="countDown >= 0" style="margin-top: 10px">
              将于
              <Tag :bordered="false" color="processing">{{ countDown == 0 ? 1 : countDown }}</Tag>
              分钟后进行系统提醒:
              <Tag :bordered="false" color="gold">{{ item.name }}</Tag>
            </div>
            <Tag v-else style="margin-top: 10px" :bordered="false" color="red">
              通知时间已过期，如需提醒可再次设置
            </Tag>
          </template>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, toRefs, toRaw } from 'vue'
import { Input, Modal, Button, Form, FormItem, TimePicker, Tag } from 'ant-design-vue'
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
const emits = defineEmits([
  'enterChange',
  'deleteChange',
  'finishChange',
  'editChange',
  'notifyChange'
])

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

const formRef = ref()
const formState = reactive({ time: '' })

let open = ref(false)
let intervalId = ref()
function setNotification(item) {
  formState.time = item.notify || ''
  open.value = true
  updateCountdown(dayjs(`${fileTime.value} ${formState.time}`))
  intervalId.value = setInterval(
    () => updateCountdown(dayjs(`${fileTime.value} ${formState.time}`)),
    60000
  )
}

let countDown = ref('')
function updateCountdown(targetTime) {
  const currentTime = dayjs()
  const duration = targetTime.diff(currentTime)
  const hours = Math.floor(duration / (1000 * 60 * 60))
  const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
  console.log(`Countdown: ${hours} hours ${minutes} minutes`)
  countDown.value = hours * 60 + minutes
  if (currentTime.isAfter(targetTime)) {
    clearInterval(intervalId.value)
  }
}

function handleCancel() {
  open.value = false
  intervalId.value && clearInterval(intervalId.value)
}

function handleOk() {
  formRef.value &&
    formRef.value
      .validate()
      .then(() => {
        emits('notifyChange', {
          notify: toRaw(formState).time
        })
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
