<template>
  <transition name="modal-fade">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"></slot>
          </div>
          <div class="modal-body">
            <slot name="body"></slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button class="modal-default-button" @click="close">Закрыть</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalWindow',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close() {
      this.$emit('close');
    }
  }
}
</script>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  transition: all 0.3s ease;
}

.modal-container {
  width: 50%;
  max-width: 600px;
  min-width: 320px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 30px;
  overflow: hidden;
}

.modal-header,
.modal-body,
.modal-footer {
  padding: 20px;
  text-align: center;
}

.modal-header {
  font-size: 28px;
  color: #333;
  margin-bottom: 30px;
}

.modal-body {
  text-align: left;
  color: #666;
  font-size: 18px;
}

.modal-default-button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
}

.modal-default-button:hover {
  background-color: #0056b3;
}

.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.5s;
}

.modal-fade-enter, .modal-fade-leave-to {
  opacity: 0;
}
</style>
