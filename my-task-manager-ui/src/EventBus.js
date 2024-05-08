// EventBus.js
class EventBus {
    constructor() {
      this.eventTarget = new EventTarget();
    }
  
    emit(event, detail = {}) {
      this.eventTarget.dispatchEvent(new CustomEvent(event, { detail }));
    }
  
    on(event, callback) {
      this.eventTarget.addEventListener(event, (e) => callback(e.detail));
    }
  
    off(event, callback) {
      this.eventTarget.removeEventListener(event, (e) => callback(e.detail));
    }
  }
  
  export const bus = new EventBus();
  