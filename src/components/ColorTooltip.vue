<template>
  <div class="color-tooltip" :style="{ top: y + 'px', left: x + 'px' }">
    <div class="tooltip-color" :style="{ backgroundColor: color }"></div>
    <div class="tooltip-text">
      <div>{{ color }}</div>
      <div>Click to copy</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ColorTooltip',
  props: {
    color: {
      type: String,
      required: true
    },
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.color-tooltip {
  position: fixed;
  background-color: var(--tooltip-bg);
  color: var(--tooltip-text);
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  pointer-events: none;
}

.tooltip-color {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 4px;
  border: 1px solid var(--border-color);
}

.tooltip-text {
  font-size: 0.8rem;
}
</style>