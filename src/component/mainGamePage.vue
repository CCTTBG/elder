<template>
  <div>
    <h1>보스 상세</h1>
    <p>bossId: {{ bossId }}</p>
  </div>
</template>

<script>
export default {
  props: {
    bossId: { type: String, required: true },
  },
}
</script>
