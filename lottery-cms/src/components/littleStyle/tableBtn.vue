<template>
    <div style="display:inline">
        <el-button style="margin-left:.5rem" :plain="plain" :size="size" @click="func" round :type="btnType">{{text}}</el-button>
    </div>
</template>
<script>
export default {
    name: 'tableBtn',
    props: {
        text: { //按钮文字
            type: String,
            required: true
        },
        func: { // 回调
            type: Function,
            required: true
        },
        btnType: { // 按钮样式
            type: String,
            default: 'info'
        },
        plain: { // 是否填充 true 为不填充
            type: Boolean,
            default: true
        },
        size: { // 按钮大小
            type: String,
            default: 'small'
        },
    }
}
</script>

