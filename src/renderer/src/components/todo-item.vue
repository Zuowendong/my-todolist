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
      <span @click="sendNotification"> {{ item.name }}</span>
      <span v-show="item.time" class="time"> Create at {{ item.time }}</span>
      <div v-if="!item.isFinish" class="icon">
        <EditOutlined @click="handleEdit" />
        <SettingOutlined v-if="isSettingBtn" @click="setNotification" />
        <DeleteOutlined @click="handleDelete(false)" />
      </div>
    </div>

    <Modal v-model:open="open" title="设置">
      <template #footer>
        <Button key="back" @click="handleCancel">取消</Button>
        <Button key="submit" type="primary" @click="handleOk">确定</Button>
      </template>
      <Form ref="formRef" :model="formData" :label-col="labelCol" :wrapper-col="wrapperCol">
        <FormItem label="通知时间">
          <TimePicker v-model:value="formData.time" format="HH:mm" value-format="HH:mm" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from 'vue'
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

const isSettingBtn = computed(() => dayjs().format('YYYY-MM-DD') == fileTime.value)
let open = ref(false)
function setNotification() {
  open.value = true
}
function handleCancel() {
  open.value = false
}
function handleOk() {
  handleCancel()
}

const labelCol = { style: { width: '100px' } }
const wrapperCol = { span: 14 }
const formData = ref({ time: '' })
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
