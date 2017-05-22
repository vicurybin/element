<script>
  export default {
    methods: {
      open() {
        this.$toast('这是错误提示的内容', '错误标题', {
        	// duration:2000
        });
      },

      

      


      

    }
  };
</script>
## ToastBox 弹框
模拟系统的消息提示框而实现的一套模态提示组件，一般用于没有交互的错误提示。

### 消息提示

当用户进行操作时会被触发。

:::demo 调用`$toast`方法即可打开消息提示.
```html
<template>
  <el-button type="text" @click="open">点击打开 Toast Box</el-button>
</template>

<script>
  export default {
    methods: {
      open() {
        this.$toast('这是错误提示的内容', '错误标题', {
          duration:2000

        });
      }
    }
  }
</script>
```
:::



### 全局方法

Element 为 Vue.prototype 添加了如下全局方法：$toast。因此在 vue instance 中可以采用本页面中的方式调用 `ToastBox`。

### 单独引用

单独引入 `ToastBox`：

```javascript
import { ToastBox } from 'element-ui';
```


### Options

| 参数      | 说明          | 类型      | 可选值                           | 默认值  |
|---------- |-------------- |---------- |--------------------------------  |-------- |
| title | ToastBox 标题 | string | — | — |
| content | ToastBox 消息正文内容 | string / VNode | — | — |
| customClass | ToastBox 的自定义类名 | string | — | — |
| lockScroll | 是否在 ToastBox 出现时将 body 滚动锁定 | boolean | — | true |
| closeOnClickModal | 是否可通过点击遮罩关闭 ToastBox | boolean | — | false |
| duration | toast持续显示时间 | number | — | 默认2000ms，当设置为0时为持续显示
