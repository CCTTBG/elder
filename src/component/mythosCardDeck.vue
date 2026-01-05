<template>
  <div style="display:none;"></div>
</template>

<script>
import mythosDB from '@/assets/MythosCards.json'

export default {
  name: 'mythosCardDeck',

  methods: {
    // ✅ 내부 표준화: 너의 기준(실제 식별자)은 id
    normalize(card) {
      return {
        ...card,
        id: card.id ?? card.cardId, // MythosCards.json이 cardId만 갖고 있으므로 id로 통일
      }
    },

    getPool(stage, color) {
      const stagePool = mythosDB?.[stage] || []
      return stagePool
        .filter(c => String(c.color) === String(color))
        .map(this.normalize)
    },

    drawOne({ stage, color, usedIds }) {
      const pool = this.getPool(stage, color)
      const candidates = pool.filter(c => !usedIds.has(c.id))

      if (candidates.length === 0) return null

      const idx = Math.floor(Math.random() * candidates.length)
      return candidates[idx]
    },
  },
}
</script>
