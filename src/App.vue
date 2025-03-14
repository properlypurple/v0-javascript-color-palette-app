<template>
  <div class="app-container" :class="{ 'dark': isDarkMode }">
    <AppHeader :isDarkMode="isDarkMode" @toggle-theme="toggleTheme" />
    
    <div class="main-content">
      <ImageDropzone 
        :imageUrl="imageUrl" 
        :isDragging="isDragging"
        @file-selected="processImage"
        @drag-enter="isDragging = true"
        @drag-leave="isDragging = false"
        @drop="onDrop"
      />
      
      <ResultsPanel 
        :palettes="palettes" 
        :isProcessing="isProcessing"
        @show-tooltip="showTooltip"
        @hide-tooltip="hideTooltip"
        @copy-color="copyToClipboard"
      />
    </div>
    
    <ColorTooltip 
      v-if="tooltip.show" 
      :color="tooltip.color" 
      :x="tooltip.x" 
      :y="tooltip.y" 
    />
    
    <CopyNotification 
      v-if="copyNotification.show" 
      :color="copyNotification.color" 
    />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import ImageDropzone from './components/ImageDropzone.vue';
import ResultsPanel from './components/ResultsPanel.vue';
import ColorTooltip from './components/ColorTooltip.vue';
import CopyNotification from './components/CopyNotification.vue';
import { extractColorsFromImage, generatePalettes } from './utils/colorUtils';

export default {
  name: 'App',
  components: {
    AppHeader,
    ImageDropzone,
    ResultsPanel,
    ColorTooltip,
    CopyNotification
  },
  
  data() {
    return {
      isDarkMode: false,
      isDragging: false,
      imageUrl: null,
      palettes: [],
      isProcessing: false,
      tooltip: { show: false, color: '', x: 0, y: 0 },
      copyNotification: { show: false, color: '' }
    };
  },
  
  mounted() {
    this.initTheme();
  },
  
  methods: {
    // Theme handling
    initTheme() {
      const savedTheme = localStorage.getItem('color-palette-theme');
      
      if (savedTheme) {
        this.isDarkMode = savedTheme === 'dark';
      } else {
        // Check system preference
        this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    },
    
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('color-palette-theme', this.isDarkMode ? 'dark' : 'light');
    },
    
    // File handling
    onDrop(file) {
      this.isDragging = false;
      if (file) {
        this.processImage(file);
      }
    },
    
    processImage(file) {
      this.isProcessing = true;
      this.palettes = [];
      
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imageUrl = e.target.result;
        
        // Create an image element to extract colors
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          setTimeout(() => {
            const extractedColors = extractColorsFromImage(img);
            this.palettes = generatePalettes(extractedColors);
            this.isProcessing = false;
          }, 300); // Small delay for better UX
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    
    // UI interactions
    showTooltip(color, event) {
      this.tooltip = {
        show: true,
        color: color,
        x: event.clientX + 10,
        y: event.clientY + 10
      };
    },
    
    hideTooltip() {
      this.tooltip.show = false;
    },
    
    copyToClipboard(color) {
      navigator.clipboard.writeText(color).then(() => {
        this.copyNotification = {
          show: true,
          color: color
        };
        
        setTimeout(() => {
          this.copyNotification.show = false;
        }, 2000);
      });
    }
  }
}
</script>

<style>
.app-container {
  min-height: 100vh;
}

.main-content {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

@media (max-width: 768px) {
  .main-content {
    flex-direction: column;
    height: auto;
  }
}
</style>