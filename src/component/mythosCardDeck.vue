<template>
  <div>
    <h2>신화 단계</h2>
    <p>현재 보스 ID: {{ bossId }}</p>
    <p>난이도: {{ difficulty }}</p>

    <button @click="drawMythosTurn">카드 뽑기</button>

  <ul>
<li v-for="card in drawnCards" :key="card.cardId">
  <b>{{ card.cardId }}</b> ({{ card.color }})
    <div>효과: {{ card.effect }}</div>
    <div v-if="card.Ongoing">지속: {{ card.OngoingEffect }}</div>
  </li>
</ul>
  </div>
</template>
<script>
import stageData from '@/assets/bossStage.json'
import mythosDB from '@/assets/MythosCards.json'

export default {
  props: {
    bossId: { type: String, required: true },
    difficulty: { type: String, required: true } // 'easy' | 'normal' | 'hard'
  },

  data() {
    return {
      stageData,
      mythosDB,     // { easy: [...], normal: [...], hard: [...] }
      drawnCards: [] // 이번 턴 뽑힌 카드(표시용)
    }
  },

  computed: {
    selectedStage() {
      return this.stageData.find(s => String(s.id) === String(this.bossId)) || null
    },

    requirements() {
      if (!this.selectedStage) return { g: 0, y: 0, b: 0 }
      return this.selectedStage[this.difficulty] || { g: 0, y: 0, b: 0 }
    },

    // 난이도별 카드 풀
    poolByDifficulty() {
      return this.mythosDB?.[this.difficulty] || []
    }
  },

  mounted() {
    // 자동 셋팅만: 초기화
    this.drawnCards = []
    // 진입 즉시 자동으로 뽑고 싶으면 아래 주석 해제
    // this.drawMythosTurn()
  },

  methods: {
    shuffle(list) {
      const copy = [...list]
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[copy[i], copy[j]] = [copy[j], copy[i]]
      }
      return copy
    },

    pickRandomN(list, n) {
      return this.shuffle(list).slice(0, n)
    },

drawMythosTurn() {

  // 1) bossStage에서 요구량(=difficulty + bossId로 조회)
  const req = this.requirements  // { g:1, y:2, b:1 } 같은 형태

  // 2) mythosDB에서 해당 난이도의 카드풀 가져오기
  const pool = this.poolByDifficulty // mythosDB[difficulty]
  // 3) 색상별 후보군
  const pools = {
    g: pool.filter(c => c.color === 'g'),
    y: pool.filter(c => c.color === 'y'),
    b: pool.filter(c => c.color === 'b')
  }

  // 4) 요구량만큼 랜덤 추출
  const picked = [
    ...this.pickRandomN(pools.g, Math.min(req.g, pools.g.length)),
    ...this.pickRandomN(pools.y, Math.min(req.y, pools.y.length)),
    ...this.pickRandomN(pools.b, Math.min(req.b, pools.b.length))
  ]

  // 5) 섞어서 출력(이번 턴 공개 카드)
  this.drawnCards = this.shuffle(picked)
}

  }
}
</script>
