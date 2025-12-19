<template>
  <section>
    <div v-if="!bossId">
      보스를 선택해 주세요.
    </div>

    <div v-else-if="!selectedStage">
      해당 보스의 스테이지 데이터가 없습니다. (id: {{ bossId }})
    </div>

    <div v-else>
      <img :src="selectedStage.bossImage" alt="" style="max-width: 100%;"  class="bossImg"/>

      <div>
        <b>Easy :</b> 녹색: {{ selectedStage.easy.g }}, 황색: {{ selectedStage.easy.y }}, 청색: {{ selectedStage.easy.b }}
      </div>

      <div>
        <b>Normal :</b>
        녹색: {{ selectedStage.nomal.g }}, 황색: {{ selectedStage.nomal.y }}, 청색: {{ selectedStage.nomal.b }}
      </div>

      <div>
        <b>Hard :</b>
        녹색: {{ selectedStage.hard.g }}, 황색: {{ selectedStage.hard.y }}, 청색: {{ selectedStage.hard.b }}
      </div>
    </div>
  </section>
</template>

<script>
import stageData from '@/assets/bossStage.json'

export default {
  props: {
    bossId: { type: [String, Number], default: null }
  },
  data() {
    return { stageData }
  },
  computed: {
    selectedStage() {
      if (!this.bossId) return null
      // 타입 섞임 방지: 문자열로 통일 비교
      const id = String(this.bossId)
      return this.stageData.find(s => String(s.id) === id) || null
    }
  }
}
</script>
