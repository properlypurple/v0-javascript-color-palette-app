<template>
  <div class="results-container">
    <div v-if="!palettes.length && !isProcessing" class="no-results">
      <p>Upload an image to generate color palettes</p>
    </div>
    
    <div v-if="isProcessing" class="processing">
      <p>Extracting colors...</p>
    </div>
    
    <div v-if="palettes.length" class="palettes">
      <div v-for="(palette, index) in palettes" :key="index" class="palette-card">
        <h3>{{ palette.name }}</h3>
        <div class="color-swatches">
          <div 
            v-for="(color, colorIndex) in palette.colors" 
            :key="colorIndex" 
            class="color-swatch"
            :style="{ backgroundColor: color }"
            @click="$emit('copy-color', color)"
            @mouseenter="$emit('show-tooltip', color, $event)"
            @mouseleave="$emit('hide-tooltip')"
          ></div>
        </div>
        <div class="palette-description">{{ palette.description }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResultsPanel',
  props: {
    palettes: {
      type: Array,
      default: () => []
    },
    isProcessing: {
      type: Boolean,
      default: false
    }
  },
  emits: ['show-tooltip', 'hide-tooltip', 'copy-color']
}
</script>

<style scoped>
.results-container {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.no-results, .processing {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--text-color);
  opacity: 0.7;
}

.palettes {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.palette-card {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.palette-card h3 {
  margin-bottom: 1rem;
  font-weight: 600;
}

.color-swatches {
  display: flex;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.color-swatch {
  flex: 1;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-swatch:hover {
  transform: translateY(-5px);
}

.palette-description {
  font-size: 0.9rem;
  opacity: 0.8;
}
</style>