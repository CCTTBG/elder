<template>
  <Teleport to="body">
    <div class="modalOverlay" @click.self="$emit('close')">
      <div class="modalContent">
        <div class="modalHeader">
          <h3>버린 신화더미</h3>
          <button @click="$emit('close')">닫기</button>
        </div>

        <div v-if="tombCards.length === 0">아직 없음</div>

        <div v-else>
          <div
            v-for="card in tombCards"
            :key="card.id + '-' + card.drawTurn"
            class="cell"
          >
            <span>{{ card.drawTurn }} 턴</span>
            <b>{{ card.id }}</b> ({{ card.color }})
            <div>효과: {{ card.effect }}</div>
            <div v-if="card.Ongoing" class="ongoingText">
              지속: {{ card.OngoingEffect }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  props: {
    tombCards: { type: Array, required: true },
  },
  emits: ['close'],
}
</script>

<style scoped>
.modalOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modalContent {
  width: min(720px, 92vw);
  max-height: 82vh;
  overflow: auto;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
}

.modalHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
</style>
