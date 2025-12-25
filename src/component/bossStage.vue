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
        녹색: {{ selectedStage.normal.g }}, 황색: {{ selectedStage.normal.y }}, 청색: {{ selectedStage.normal.b }}
      </div>

      <div>
        <b>Hard :</b>
        녹색: {{ selectedStage.hard.g }}, 황색: {{ selectedStage.hard.y }}, 청색: {{ selectedStage.hard.b }}
      </div>
      <div>
        <button @click="onSelect" :disabled="!bossId">선택</button>
        <button @click="onRandom" :disabled="!stageData?.length">랜덤</button>
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
    emits: ['select', 'random'],
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
  },
  methods: {
    onSelect() {
      if (!this.bossId) return
      this.$emit('select', String(this.bossId))
    },
    onRandom() {
      // stageData 기준으로 랜덤 (현재 stageData에 존재하는 id만 뽑힘)
      if (!this.stageData?.length) return
      const idx = Math.floor(Math.random() * this.stageData.length)
      const randomId = String(this.stageData[idx].id)
      this.$emit('random', randomId)
    }
  }
}
</script>
