<template>
    <div>
        <label>{{data.title}}</label>
        <div v-for="(item, index) in data.data" :key="index" style="display:inline">
            <el-switch
                style="margin-right:2.2rem"
                active-color="#13ce66"
                v-model="item.val"
                @change="handleCheckd"
                :active-text="item.text">
            </el-switch>
        </div>
        {{data.text}}
    </div>
</template>
<script>
export default {
    name: 'switchbar',
    props: {
        data: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleCheckd() {
            const vm = this;
            this.$emit('switchCheck',vm._props.data.data);
        }
    }
}
</script>

