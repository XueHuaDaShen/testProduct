<template>
  <div v-html="formData"></div>
</template>
<script>
export default {
  name: 'agGame',
  props: {
    formData: {
      type: String,
      required: true
    }
  },
  mounted() {
    document.login.submit();
  }
}
</script>

