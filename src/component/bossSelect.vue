<template>
  <div>
      <p>보스 선택</p>
      <bossCard></bossCard>
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

  }
}
</script>
