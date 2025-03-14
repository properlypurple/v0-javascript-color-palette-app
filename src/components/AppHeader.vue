<template>
  <div class="theme-toggle" @click="$emit('toggle-theme')">
    <div class="toggle-icon">{{ isDarkMode ? '🌙' : '☀️' }}</div>
  </div>
</template>

<script>
export default {
  name: 'AppHeader',
  props: {
    isDarkMode: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggle-theme']
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
  cursor: pointer;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.theme-toggle:hover {
  transform: scale(1.1);
}

.toggle-icon {
  font-size: 1.2rem;
}
</style>