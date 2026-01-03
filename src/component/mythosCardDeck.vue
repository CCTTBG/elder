  <template>
    <div>
      <h2>신화 단계</h2>
      <p>현재 보스 이름: {{ bossId }}</p>
      <p>현재 단계(덱): {{ currentStage }}</p>

      <button @click="drawOneCard">카드 뽑기</button>

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
    bossId: { type: String, required: true }
    // difficulty prop은 이제 "선택"이 없으니 제거(표시용이면 남겨도 됨)
  },

  data() {
    return {
      stageData,
      mythosDB,
      drawnCards: [],

      // ✅ 고정 진행: easy → normal → hard
      stageOrder: ['easy', 'normal', 'hard'],
      stageIdx: 0,
      currentStage: 'easy',

      deckQueue: [],     // 현재 stage 덱(셔플된 큐)
      discardedIds: new Set() // 전체 중복 방지용(원하면 제거 가능)
    }
  },

  computed: {
    selectedStage() {
      return this.stageData.find(s => String(s.id) === String(this.bossId)) || null
    }
  },

  mounted() {
    this.resetDeck()
  },

  watch: {
    bossId() {
      this.resetDeck()
    }
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

    getPoolByStage(stage) {
      const root = Array.isArray(this.mythosDB) ? this.mythosDB[0] : this.mythosDB
      return root?.[stage] || []
    },

    refillDeck() {
      const pool = this.getPoolByStage(this.currentStage)

      // (선택) 이미 뽑은 카드 제외해서 전체 중복 방지
      const filtered = pool.filter(c => !this.discardedIds.has(c.cardId))

      this.deckQueue = this.shuffle(filtered)
    },

    advanceStage() {
      if (this.stageIdx >= this.stageOrder.length - 1) return false
      this.stageIdx += 1
      this.currentStage = this.stageOrder[this.stageIdx]
      this.refillDeck()
      return true
    },

    resetDeck() {
      this.drawnCards = []
      this.discardedIds = new Set()

      this.stageIdx = 0
      this.currentStage = this.stageOrder[this.stageIdx]

      this.refillDeck()
    },

    drawOneCard() {
      // 현재 stage 덱이 비었으면 다음 stage로 넘어감
      while (this.deckQueue.length === 0) {
        const moved = this.advanceStage()
        if (!moved) return // hard까지 다 소진
      }

      const card = this.deckQueue.shift()
      this.drawnCards.push(card)
      this.discardedIds.add(card.cardId)
    }
  }
}
  </script>
