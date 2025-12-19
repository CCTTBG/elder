<template>
  <div class="bossGrid">
    <div class="bossGrids">
      <div v-for="boss in bossData" :key="boss.id" class="bossCard"
          :class="{ selected: selectedBossId === boss.id }"  @click="toggleSelect(boss.id)">
        <table class="bossTable">
          <thead>
            <tr>
              <th>이름</th>
              <th>파멸</th>
              <th>소환 상태</th>
              <th>응보 여부</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{boss.name}}</td>
              <td>{{boss.doom}}</td>
              <td>{{ boss.state == '0' ? '소환 전' : '소환 후' }}</td>
              <td>{{ boss.Reckoning == '0' ? '응보 없음' : '응보 존재' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
        <bossStage :bossId="selectedBossId" />
    </div>
  </div>

</template>
<script>
  import bossData from '@/assets/boss.json';
  import bossStage from './bossStage.vue';

export default {
  components:{
    bossStage
  },
  data(){
      return {
        bossData:bossData,
        selectedBossId: null
      };
    },
  methods:{
    toggleSelect(id){
      this.selectedBossId = (this.selectedBossId === id ) ? null:id
    }
  }
}

</script>
<style src="..\assets\css\bossSelected.css"></style>
