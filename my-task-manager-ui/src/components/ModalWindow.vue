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
              <button class="modal-default-button" @click="$emit('close')">Закрыть</button>
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
  width: 50%; /* Адаптация ширины модального окна под большинство экранов */
  max-width: 600px; /* Ограничение максимальной ширины для улучшенной читаемости */
  min-width: 320px; /* Минимальная ширина для поддержки мобильных устройств */
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
  font-size: 28px; /* Увеличение размера шрифта заголовка */
  color: #333;
  margin-bottom: 30px; /* Увеличение отступа под заголовком */
}

.modal-body {
  text-align: left; /* Выравнивание текста по левому краю */
  color: #666;
  font-size: 18px; /* Увеличение размера шрифта тела модального окна */
}

.modal-default-button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 15px 30px; /* Увеличение размеров кнопки */
  border-radius: 10px; /* Скругление углов кнопки */
  font-weight: bold;
  font-size: 16px; /* Увеличение шрифта кнопки */
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

