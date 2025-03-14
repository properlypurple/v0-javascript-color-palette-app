<template>
  <div class="dropzone-container">
    <div 
      class="dropzone"
      @dragover.prevent
      @dragenter.prevent="$emit('drag-enter')"
      @dragleave.prevent="$emit('drag-leave')"
      @drop.prevent="onDrop"
      :class="{ 'dragging': isDragging }"
      @click="triggerFileInput"
    >
      <input 
        type="file" 
        ref="fileInput" 
        style="display: none" 
        accept="image/*" 
        @change="onFileSelected"
      />
      
      <div v-if="!imageUrl" class="dropzone-placeholder">
        <div class="upload-icon">📷</div>
        <p>Drop your logo here or click to upload</p>
      </div>
      
      <img v-else :src="imageUrl" class="preview-image" alt="Uploaded logo" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImageDropzone',
  props: {
    imageUrl: {
      type: String,
      default: null
    },
    isDragging: {
      type: Boolean,
      default: false
    }
  },
  emits: ['file-selected', 'drag-enter', 'drag-leave', 'drop'],
  
  methods: {
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    
    onFileSelected(event) {
      const file = event.target.files[0];
      if (file && file.type.match('image.*')) {
        this.$emit('file-selected', file);
      }
    },
    
    onDrop(event) {
      const file = event.dataTransfer.files[0];
      if (file && file.type.match('image.*')) {
        this.$emit('drop', file);
      }
    }
  }
}
</script>

<style scoped>
.dropzone-container {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.dropzone {
  height: 100%;
  border: 2px dashed var(--dropzone-border);
  border-radius: 8px;
  background-color: var(--dropzone-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.dropzone:hover, .dropzone.dragging {
  background-color: var(--dropzone-hover);
  border-color: var(--accent-color);
}

.dropzone-placeholder {
  text-align: center;
  padding: 2rem;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}
</style>