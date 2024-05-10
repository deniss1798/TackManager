<template>
  <transition name="modal-fade">
    <div class="modal-mask" v-if="visible">
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
      this.$emit('update:visible', false);
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
  width: 90%; /* Увеличенная ширина до 90% */
  max-width: 1200px; /* Большая максимальная ширина */
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  padding: 30px;
  overflow: hidden; /* Убедитесь, что ничего не выходит за пределы скруглённых углов */
}

.modal-header,
.modal-body,
.modal-footer {
  padding: 20px;
  text-align: center;
}

.modal-header {
  font-size: 24px;
  color: #333;
  border-bottom: 1px solid #eaecef;
}

.modal-body {
  text-align: left; /* Выравниваем текст по левому краю */
  color: #666;
  font-size: 16px;
}

.modal-default-button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
}

.modal-default-button:hover {
  background-color: #0056b3;
}

/* Анимация для плавного появления и исчезновения модального окна */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.5s;
}
.modal-fade-enter, .modal-fade-leave-to /* .modal-fade-leave-active в <2.1.8 */ {
  opacity: 0;
}
</style>
