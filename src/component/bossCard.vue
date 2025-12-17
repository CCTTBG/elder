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
        ws
    </div>
  </div>

</template>
<script>
  import bossData from '@/assets/boss.json';
export default {
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
<style>
/* 카드들을 2열로 배치 */
.bossGrid{
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 700px));

}
.bossGrids{
  display: grid;
  gap: 16px;
  padding: 16px;
}
/* 카드 박스 */
.bossCard{
  border: 1px solid #222;
  border-radius: 8px;
  padding: 12px;
  background: #fff;
}

.bossTable{
  width: 100%;
  border-collapse: collapse;

}
.bossCard:hover{
  background-color: #ddd;
}

.bossCard.selected {
  background-color: #ddd; /* 클릭 시 고정 */
}

.bossTable th,
.bossTable td{
  padding: 8px 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  vertical-align: top;
}

/* 라벨(th) 폭 고정 */
.bossTable th{
  width: 90px;
  font-weight: 700;
  white-space: nowrap;
}

/* 마지막 줄 border 제거 */
.bossTable tr:last-child th,
.bossTable tr:last-child td{
  border-bottom: none;
}

/* 화면 좁아지면 1열 */
@media (max-width: 700px){
  .bossGrid{
    grid-template-columns: 1fr;
  }
}

</style>
