<template>
  <div class="copy-notification">
    Copied {{ color }} to clipboard!
  </div>
</template>

<script>
export default {
  name: 'CopyNotification',
  props: {
    color: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.copy-notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--notification-bg);
  color: var(--notification-text);
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  font-weight: 500;
}
</style>