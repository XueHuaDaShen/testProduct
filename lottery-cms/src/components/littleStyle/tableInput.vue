<template>
    <div style="display:inline">
        <el-input :style="{width: inputWidth}" v-model="inputModel" clearable></el-input>
    </div>
</template>
<script>
export default {
    name: 'tableInput',
    props: {
        inputModel: {
            default: '',
        }
    },
    data() {
        return {
            inputWidth: '150px',
        }
    }
}
</script>

