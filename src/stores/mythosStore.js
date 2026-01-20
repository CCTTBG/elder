import { defineStore } from 'pinia'

export const useMythosStore = defineStore('mythos', {
  state: () => ({
    mythosTurns: 0,

    stageOrder: ['easy', 'normal', 'hard'],
    stageIdx: 0,

    // ✅ 기존 메인과 동일한 구조로 유지
    remaining: {
      easy: { g: 0, y: 0, b: 0 },
      normal: { g: 0, y: 0, b: 0 },
      hard: { g: 0, y: 0, b: 0 },
    },

    drawnCards: [],
    tombCards: [],

    // Set은 직렬화/저장에 불리하니 배열로 가는 게 낫습니다
    usedIds: [],

    isGameOver: false,
  }),

  getters: {
    currentStage(state) {
      return state.stageOrder[state.stageIdx]
    },
    normalCards(state) {
      return state.drawnCards.filter(c => !c.Ongoing)
    },
    ongoingCards(state) {
      return state.drawnCards.filter(c => c.Ongoing)
    },
  },

  actions: {
    resetGameState(selectedStage) {
      this.mythosTurns = 0
      this.stageIdx = 0
      this.drawnCards = []
      this.tombCards = []
      this.usedIds = []
      this.isGameOver = false

      if (!selectedStage) return

      const e = selectedStage.easy
      const n = selectedStage.normal
      const h = selectedStage.hard

      this.remaining = {
        easy: { g: e.g, y: e.y, b: e.b },
        normal: { g: n.g, y: n.y, b: n.b },
        hard: { g: h.g, y: h.y, b: h.b },
      }
    },

    goTomb(card) {
      this.tombCards.push({ ...card })
      // ✅ drawTurn까지 포함해 정확히 제거 (id만으로 제거하면 중복/오작동 가능)
      this.drawnCards = this.drawnCards.filter(
        c => !(c.id === card.id && c.drawTurn === card.drawTurn)
      )
    },

    stageIsEmpty(stageKey) {
      const r = this.remaining[stageKey]
      return r.g + r.y + r.b <= 0
    },

    ensureValidStage() {
      while (
        this.stageIdx < this.stageOrder.length &&
        this.stageIsEmpty(this.currentStage)
      ) {
        this.stageIdx += 1
      }

      if (this.stageIdx >= this.stageOrder.length) {
        this.isGameOver = true
        this.stageIdx = this.stageOrder.length - 1
        return false
      }
      return true
    },

    pickColorWeighted(stageKey) {
      const r = this.remaining[stageKey]
      const bag = []
      for (let i = 0; i < r.g; i++) bag.push('g')
      for (let i = 0; i < r.y; i++) bag.push('y')
      for (let i = 0; i < r.b; i++) bag.push('b')
      if (bag.length === 0) return null
      return bag[Math.floor(Math.random() * bag.length)]
    },

    // ✅ 메인이 deck.drawOne()으로 뽑아온 결과만 "적용"하게 만들기
    applyDraw({ card, stage, color }) {
      const turn = this.mythosTurns + 1
      const cardWithTurn = { ...card, drawTurn: turn }

      this.drawnCards.push(cardWithTurn)
      this.usedIds.push(card.id)

      this.remaining[stage][color] -= 1
      this.mythosTurns += 1

      this.ensureValidStage()
    },
  },
})
