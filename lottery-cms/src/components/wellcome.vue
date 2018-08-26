<template>
  <div>
    {{username}}, {{msg}}
  </div>
</template>
<script>
export default {
  name: 'wellcome',
  data() {
    return {
      username: '',
      msg: '欢迎来到 Lottery CMS！'
    }
  },
  created() {
    this.username = localStorage.getItem('cms-loginname');
  }
}
</script>
