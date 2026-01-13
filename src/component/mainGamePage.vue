<template>
  <div>
    <h1>메인 게임판</h1>

    <div v-if="!selectedStage">
      <p>보스 스테이지 데이터를 찾을 수 없습니다. (bossId: {{ bossId }})</p>
    </div>

    <div v-else>
  <div class="gameBoard">
    <!-- 좌측: 상태/남은 카드/턴 정보 -->
    <section class="leftZone">
      <p>신화 단계 진행 횟수: {{ mythosTurns }}</p>
      <p>현재 스테이지: <b>{{ currentStage }}</b></p>

      <div>
        <b>남은 카드 수</b>
        <div>
          G: {{ remaining[currentStage].g }},
          Y: {{ remaining[currentStage].y }},
          B: {{ remaining[currentStage].b }}
        </div>
      </div>
    </section>

    <!-- 중앙: 카드 뽑기 + (일반/지속 2열 보드) -->
    <section class="centerZone">
      <button @click="drawMythos" :disabled="isGameOver">
        카드 뽑기
      </button>

      <div v-if="isGameOver" style="margin-top:12px;">
        <b>더 이상 뽑을 카드가 없습니다. (Hard까지 소진)</b>
      </div>

      <div class=" mythosCardScroll" style="margin-top:16px;">
      <div class="head">일반</div>

      <div v-for="card in normalCards" :key="card.id" class="row">
        <div class="cell">
          <span>{{ card.drawTurn }} 턴</span>
          <b>{{ card.id }}</b> ({{ card.color }})
          <div>효과: {{ card.effect }}</div>
          <button @click="goTomb(card)">해결</button>
        </div>
      </div>
    </div>
    </section>

    <section class="rightZone">
      <div class="zoneTitle">지속 카드 zone</div>

      <div v-if="ongoingCards.length === 0" class="empty">
        현재 지속 카드 없음
      </div>

      <div v-else class="mythosCardScroll">
        <div v-for="card in ongoingCards" :key="card.id" class="ongoingCard">
          <span>{{ card.drawTurn }} 턴</span>
          <b>{{ card.id }}</b> ({{ card.color }})
          <div>효과: {{ card.effect }}</div>
          <div class="ongoingText">지속: {{ card.OngoingEffect }}</div>
          <button @click="goTomb(card)">해결</button>
        </div>
      </div>
    </section>

    <section class="tombZone">
      <div class="zoneTitle">버린 신화더미</div>

      <div v-if="tombCards.length === 0">아직 없음</div>

      <div v-else>
        <div v-for="card in tombCards" :key="card.id + '-' + card.drawTurn" class="cell">
          <span>{{ card.drawTurn }} 턴</span>
          <b>{{ card.id }}</b> ({{ card.color }})
          <div>효과: {{ card.effect }}</div>
          <div v-if="card.Ongoing" class="ongoingText">지속: {{ card.OngoingEffect }}</div>
        </div>
      </div>
    </section>

  </div>

  <mythosCardDeck ref="deck" />
</div>

  </div>
</template>

<script>
import mythosCardDeck from './mythosCardDeck.vue'
import bossStages from '@/assets/bossStage.json'

export default {
  components: { mythosCardDeck },
  props: { bossId: { type: String, required: true } },

  data() {
    return {
      mythosTurns: 0,
      stageOrder: ['easy', 'normal', 'hard'],
      stageIdx: 0,
      mythosTurnsHistory:[],
      // stage별 남은 카운트 (bossStage에서 복제해서 씀)
      remaining: {
        easy: { g: 0, y: 0, b: 0 },
        normal: { g: 0, y: 0, b: 0 },
        hard: { g: 0, y: 0, b: 0 },
      },

      drawnCards: [],
      tombCards:[],

      usedIds: new Set(),

      isGameOver: false,
    }
  },

  computed: {
    selectedStage() {
      return bossStages.find(s => String(s.id) === String(this.bossId)) || null
    },

    currentStage() {
      return this.stageOrder[this.stageIdx]
    },

    normalCards() {
      return this.drawnCards.filter(c => !c.Ongoing)
    },
    ongoingCards() {
      return this.drawnCards.filter(c => c.Ongoing)
    },
  },

  watch: {
    bossId: {
      immediate: true,
      handler() {
        this.resetGameState()
      },
    },
  },

  methods: {
    goTomb(card){
      this.tombCards.push({...card})
      this.drawnCards = this.drawnCards.filter(c => c.id !== card.id)
    },
    resetGameState() {
      this.mythosTurns = 0
      this.stageIdx = 0
      this.drawnCards = []
      this.usedIds = new Set()
      this.isGameOver = false

      if (!this.selectedStage) return

      // bossStage.json 기준으로 remaining 초기화
      const e = this.selectedStage.easy
      const n = this.selectedStage.normal // bossStage.json은 normal로 정상
      const h = this.selectedStage.hard

      this.remaining = {
        easy: { g: e.g, y: e.y, b: e.b },
        normal: { g: n.g, y: n.y, b: n.b },
        hard: { g: h.g, y: h.y, b: h.b },
      }
    },

    stageIsEmpty(stageKey) {
      const r = this.remaining[stageKey]
      return r.g + r.y + r.b <= 0
    },

    // 현재 stage가 소진되면 다음 stage로 자동 승격
    ensureValidStage() {
        while (this.stageIdx < this.stageOrder.length && this.stageIsEmpty(this.currentStage)) {
          this.stageIdx += 1
        }

        if (this.stageIdx >= this.stageOrder.length) {
          this.isGameOver = true
          // ✅ currentStage가 undefined가 되지 않게 마지막 스테이지로 고정
          this.stageIdx = this.stageOrder.length - 1
          return false
        }
        return true
      },

    // 남은 g/y/b를 “가중치 랜덤”으로 1개 선택
    pickColorWeighted(stageKey) {
      const r = this.remaining[stageKey]
      const bag = []
      for (let i = 0; i < r.g; i++) bag.push('g')
      for (let i = 0; i < r.y; i++) bag.push('y')
      for (let i = 0; i < r.b; i++) bag.push('b')

      if (bag.length === 0) return null
      return bag[Math.floor(Math.random() * bag.length)]
    },

    drawMythos() {
      if (this.isGameOver) return
      if (!this.ensureValidStage()) return

      const stage = this.currentStage
      const color = this.pickColorWeighted(stage)
      if (!color) {
        // 이 경우는 stageEmpty 처리로 보통 안 옴. 방어 코드.
        if (!this.ensureValidStage()) return
      }

      const card = this.$refs.deck.drawOne({
        stage,
        color,
        usedIds: this.usedIds,
      })

      if (!card) {
        // 여기서는 게임오버 처리 대신, 우선 멈추게 함.
        // 필요하면 "다른 색을 다시 뽑기" 같은 보정 로직도 가능.
        console.warn(`No available card for stage=${stage}, color=${color}`)
        this.isGameOver = true
        return
      }
          // 이번에 뽑힌 “턴 번호”
      const turn = this.mythosTurns + 1

      //  원본 객체 공유 방지 + 카드에 턴 정보 부여
      const cardWithTurn = { ...card, drawTurn: turn }
      //  메인이 상태를 업데이트 (단일 원천)

      this.drawnCards.push(cardWithTurn)
      this.usedIds.add(card.id)
      this.remaining[stage][color] -= 1
      this.mythosTurns += 1


      // 혹시 이번 드로우로 stage가 0이 되었으면 다음 턴에 자동 승격되도록 유지
      this.ensureValidStage()
    },
  },
}
</script>

<style src="../assets/css/maingame.css">

</style>
