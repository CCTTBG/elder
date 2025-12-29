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

export default {
  components: { mythosCardDeck },
  props: { bossId: { type: String, required: true } },

  data() {
    return {
      mythosTurns: 0,      // 신화 단계 진행 횟수
      drawnTotal: 0        // 총 뽑은 카드 수(원하면 사용)
    }
  },

  computed: {
    difficulty() {
      // 예시 규칙: 1~3턴 easy, 4~6턴 normal, 7턴부터 hard
      if (this.mythosTurns < 3) return 'easy'
      if (this.mythosTurns < 6) return 'normal'
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
