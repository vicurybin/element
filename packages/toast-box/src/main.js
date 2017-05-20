

const defaults = {
  title: undefined,
  content: '',
  type: '',
};

import Vue from 'vue';
import toastboxVue from './main.vue';
import merge from 'element-ui/src/utils/merge';
import { isVNode } from 'element-ui/src/utils/vdom'; 

const ToastBoxConstructor = Vue.extend(toastboxVue);

let currentToast, instance;
let toastQueue = [];

const defaultCallback = action => {
  if (currentToast) {
    let callback = currentToast.callback;
    if (typeof callback === 'function') {
      if (instance.showInput) {
        callback(instance.inputValue, action);
      } else {
        callback(action);
      }
    }
    if (currentToast.resolve) {
      let $type = currentToast.options.$type;
      if ($type === 'confirm' || $type === 'prompt') {
        if (action === 'confirm') {
          if (instance.showInput) {
            currentToast.resolve({ value: instance.inputValue, action });
          } else {
            currentToast.resolve(action);
          }
        } else if (action === 'cancel' && currentToast.reject) {
          currentToast.reject(action);
        }
      } else {
        currentToast.resolve(action);
      }
    }
  }
};

const initInstance = () => {
  instance = new ToastBoxConstructor({
    el: document.createElement('div')
  });

  instance.callback = defaultCallback;
};

const showNextToast = () => {
  if (!instance) {
    initInstance();
  }
  instance.action = '';

  if (!instance.visible || instance.closeTimer) {
    if (toastQueue.length > 0) {
      currentToast = toastQueue.shift();

      let options = currentToast.options;
      for (let prop in options) {
        if (options.hasOwnProperty(prop)) {
          instance[prop] = options[prop];
        }
      }
      if (options.callback === undefined) {
        instance.callback = defaultCallback;
      }

      let oldCb = instance.callback;
      instance.callback = (action, instance) => {
        oldCb(action, instance);
        showNextMsg();
      };
      if (isVNode(instance.message)) {
        instance.$slots.default = [instance.message];
        instance.message = null;
      }
      ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape'].forEach(prop => {
        if (instance[prop] === undefined) {
          instance[prop] = true;
        }
      });
      document.body.appendChild(instance.$el);

      Vue.nextTick(() => {
        instance.visible = true;
      });
    }
  }
};

const ToastBox = function(options, callback) {
  if (Vue.prototype.$isServer) return;
  if (typeof options === 'string') {
    options = {
      content: options
    };
    if (arguments[1]) {
      options.title = arguments[1];
    }
    if (arguments[2]) {
      options.type = arguments[2];
    }
  } else if (options.callback && !callback) {
    callback = options.callback;
  }

  if (typeof Promise !== 'undefined') {
    return new Promise((resolve, reject) => { // eslint-disable-line
      toastQueue.push({
        options: merge({}, defaults, ToastBox.defaults, options),
        callback: callback,
        resolve: resolve,
        reject: reject
      });

      showNextToast();
    });
  } else {
    toastQueue.push({
      options: merge({}, defaults, ToastBox.defaults, options),
      callback: callback
    });

    showNextToast();
  }
};

ToastBox.setDefaults = defaults => {
  ToastBox.defaults = defaults;
};

ToastBox.toast = (content, title, options) => {
  if (typeof title === 'object') {
    options = title;
    title = '';
  }
  return ToastBox(merge({
    title: title,
    content: content,
  }, options));
};


ToastBox.close = () => {
  instance.visible = false;
  toastQueue = [];
  currentToast = null;
};

export default ToastBox;
export { ToastBox };
