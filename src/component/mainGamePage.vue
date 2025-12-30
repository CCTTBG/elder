<template>
  <div>
    <h1>메인 게임판</h1>
    <p>신화 단계 진행 횟수: {{ mythosTurns }}</p>

    <mythosCardDeck
      :bossId="bossId"
      :difficulty="difficulty"
      @draw="onDraw"
    />

  </div>
</template>

<script>
import mythosCardDeck from './mythosCardDeck.vue'
import bossStages from '@/assets/bossStage.json';
export default {
  components: { mythosCardDeck },
  props: { bossId: { type: String, required: true } },

  data() {
    return {
      mythosTurns: 1,      // 신화 단계 진행 횟수
      drawnTotal: 0,        // 총 뽑은 카드 수(원하면 사용)
    }
  },

  computed: {
    selectedStage() {
      return bossStages.find(s => String(s.id) === String(this.bossId)) || null
    },

    bossEasyTotal() {
      const e = this.selectedStage?.easy
      return e ? (e.g + e.y + e.b) : 0
    },

    bossNormalTotal() {
      const n = this.selectedStage?.normal
      return n ? (n.g + n.y + n.b) : 0
    },

    bossHardTotal() {
      const h = this.selectedStage?.hard
      return h ? (h.g + h.y + h.b) : 0
    },

    difficulty() {
      // 누적 소모량 기준으로 승격 (예: easy 구간 → normal 구간 → hard 구간)
      if (this.drawnTotal < this.bossEasyTotal) return 'easy'
      if (this.drawnTotal < this.bossEasyTotal + this.bossNormalTotal) return 'normal'
      return 'hard'
    }
  },

  methods: {
    onDraw(drawnCards) {
      this.mythosTurns += 1
      this.drawnTotal += drawnCards.length
    }
  }
}
</script>
