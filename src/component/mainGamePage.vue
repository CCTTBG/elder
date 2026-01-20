<template>
  <div>
    <h1>메인 게임판</h1>

    <div v-if="!selectedStage">
      <p>보스 스테이지 데이터를 찾을 수 없습니다. (bossId: {{ bossId }})</p>
    </div>

    <div v-else>
      <div class="gameBoard">
        <!-- 좌측 -->
        <section class="leftZone">
          <p>신화 단계 진행 횟수: {{ mythos.mythosTurns }}</p>
          <p>현재 스테이지: <b>{{ mythos.currentStage }}</b></p>

          <div>
            <b>남은 카드 수</b>
            <div>
              G: {{ mythos.remaining[mythos.currentStage].g }},
              Y: {{ mythos.remaining[mythos.currentStage].y }},
              B: {{ mythos.remaining[mythos.currentStage].b }}
            </div>
          </div>
        </section>

        <!-- 중앙 -->
        <section class="centerZone">
          <button @click="drawMythos" :disabled="mythos.isGameOver">
            카드 뽑기
          </button>

          <div v-if="mythos.isGameOver" style="margin-top:12px;">
            <b>더 이상 뽑을 카드가 없습니다. (Hard까지 소진)</b>
          </div>

          <div class="mythosCardScroll" style="margin-top:16px;">
            <div class="head">일반</div>

            <div v-for="card in mythos.normalCards" :key="card.id + '-' + card.drawTurn" class="row">
              <div class="cell">
                <span>{{ card.drawTurn }} 턴</span>
                <b>{{ card.id }}</b> ({{ card.color }})
                <div>효과: {{ card.effect }}</div>
                <button @click="mythos.goTomb(card)">해결</button>
              </div>
            </div>
          </div>
        </section>

        <!-- 우측 -->
        <section class="rightZone">
          <div class="zoneTitle">지속 카드 zone</div>

          <div v-if="mythos.ongoingCards.length === 0" class="empty">
            현재 지속 카드 없음
          </div>

          <div v-else class="mythosCardScroll">
            <div v-for="card in mythos.ongoingCards" :key="card.id + '-' + card.drawTurn" class="ongoingCard">
              <span>{{ card.drawTurn }} 턴</span>
              <b>{{ card.id }}</b> ({{ card.color }})
              <div>효과: {{ card.effect }}</div>
              <div class="ongoingText">지속: {{ card.OngoingEffect }}</div>
              <button @click="mythos.goTomb(card)">해결</button>
            </div>
          </div>
        </section>

        <!-- ✅ Tomb는 메인에서 영역 렌더링 대신: 버튼 + 모달 -->
        <button @click="ui.isTombOpen = true">
          버린 신화더미 ({{ mythos.tombCards.length }})
        </button>

        <tombZoneModal
          v-if="ui.isTombOpen"
          :tombCards="mythos.tombCards"
          @close="ui.isTombOpen = false"
        />
      </div>

      <mythosCardDeck ref="deck" />
    </div>
  </div>
</template>

<script>
import mythosCardDeck from './mythosCardDeck.vue'
import tombZoneModal from './tombZoneModal.vue'
import bossStages from '@/assets/bossStage.json'

import { useMythosStore } from '@/stores/mythosStore'
import { useUiStore } from '@/stores/uiStore'

export default {
  components: { mythosCardDeck, tombZoneModal },
  props: { bossId: { type: String, required: true } },

  computed: {
    selectedStage() {
      return bossStages.find(s => String(s.id) === String(this.bossId)) || null
    },
  },
  data() {
    return {
      mythos: null,
      ui: null,
    }
  },
  // ✅ Options API에서도 Pinia는 이렇게 붙이면 됩니다
  created() {
    this.mythos = useMythosStore()
    this.ui = useUiStore()
    this.mythos.resetGameState(this.selectedStage)
  },

  watch: {
    bossId: {
      immediate: true,
      handler() {
        if (!this.mythos) this.mythos = useMythosStore()
        this.mythos.resetGameState(this.selectedStage)
      },
    },
  },

  methods: {
    drawMythos() {
      if (this.mythos.isGameOver) return
      if (!this.mythos.ensureValidStage()) return

      const stage = this.mythos.currentStage
      const color = this.mythos.pickColorWeighted(stage)
      if (!color) {
        if (!this.mythos.ensureValidStage()) return
      }

      const usedIdsSet = new Set(this.mythos.usedIds)

      const card = this.$refs.deck.drawOne({
        stage,
        color,
        usedIds: usedIdsSet,
      })

      if (!card) {
        this.mythos.isGameOver = true
        return
      }

      // ✅ 상태 반영은 store가 책임
      this.mythos.applyDraw({ card, stage, color })
    },
  },
}
</script>

<style src="../assets/css/maingame.css"></style>
