<template>
  <div>
      <p>보스 선택</p>

    <bossCard @goGame="goGame" />
    <bossStage :bossId="selectedBossId" />
  </div>
</template>
<script>
import bossCard from './bossCard.vue';
export default {
  components:{
    bossCard
  },
  data(){

  },
  methods: {
    goGame(id) {
      if (!id) return
      this.$router.push({ name: 'mainGame', params: { bossId: String(id) } })
    },
  },
}
</script>
