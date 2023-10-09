<template>
  <div>
    <Row v-for="(item, index) in keyItems" :key="index" class="key-item">
      <Col :span="8">{{ item.label }}</Col>
      <Col :span="16">
        <Tag>{{ item.value1 }}</Tag>
        <span v-if="item.value2" class="unit">+</span>
        <Tag v-if="item.value2"> {{ item.value2 }}</Tag>
      </Col>
    </Row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Row, Col, Tag } from 'ant-design-vue'

const keyItems = ref([
  { label: '新增', value1: 'ctrl', value2: 'i' },
  { label: '清空', value1: 'ctrl', value2: 'Delete' },
  { label: '选中', value1: 'ctrl', value2: '[1~9]' },
  { label: '完成', value1: 'Enter', value2: '' },
  { label: '删除', value1: 'Delete', value2: '' },
  { label: '退出编辑', value1: 'Esc', value2: '' }
])
</script>

<style lang="less" scoped>
.key-item {
  min-width: 220px;
  line-height: 32px;
  color: #666;
}
.unit {
  margin-right: 5px;
}
</style>
