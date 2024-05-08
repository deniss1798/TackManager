<template>
  <transition name="modal">
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
              <button class="modal-default-button" @click="$emit('close')">Close</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ModalWindow'
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
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  padding: 20px;
}

.modal-container {
  width: 100%;
  max-width: 500px; /* Ограничиваем максимальную ширину */
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  padding: 20px;
}

.modal-header,
.modal-body,
.modal-footer {
  padding: 10px;
  text-align: center;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  padding: 20px;
  text-align: left; /* Выравниваем текст по левому краю */
}

.modal-default-button {
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-top: 10px;
  border-radius: 5px;
}

.modal-default-button:hover {
  background-color: #0056b3;
}
</style>

