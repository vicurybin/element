<template>
  <div class="el-toast-box__wrapper" v-show="visible">
  	<div class="el-toast-box">
  		<div class="el-toast-box__title">
  			{{title}}
  		</div>
  		<div class="el-toast-box__content">
  			{{content}}拉啦
  		</div>
  	</div>
  </div>
</template>
<!-- <template>
  <transition name="msgbox-fade">
    <div class="el-message-box__wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div class="el-message-box" :class="customClass">
        <div class="el-message-box__header" v-if="title !== undefined">
          <div class="el-message-box__title">{{ title || t('el.messagebox.title') }}</div>
          <i class="el-message-box__close el-icon-close" @click="handleAction('cancel')" v-if="showClose"></i>
        </div>
        <div class="el-message-box__content" v-if="message !== ''">
          <div class="el-message-box__status" :class="[ typeClass ]"></div>
          <div class="el-message-box__message" :style="{ 'margin-left': typeClass ? '50px' : '0' }">
            <slot><p>{{ message }}</p></slot>
          </div>
          <div class="el-message-box__input" v-show="showInput">
            <el-input v-model="inputValue" @keyup.enter.native="handleAction('confirm')" :placeholder="inputPlaceholder" ref="input"></el-input>
            <div class="el-message-box__errormsg" :style="{ visibility: !!editorErrorMessage ? 'visible' : 'hidden' }">{{ editorErrorMessage }}</div>
          </div>
        </div>
        <div class="el-message-box__btns">
          <el-button
            :loading="cancelButtonLoading"
            :class="[ cancelButtonClasses ]"
            v-show="showCancelButton"
            @click.native="handleAction('cancel')">
            {{ cancelButtonText || t('el.messagebox.cancel') }}
          </el-button>
          <el-button
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[ confirmButtonClasses ]"
            v-show="showConfirmButton"
            @click.native="handleAction('confirm')">
            {{ confirmButtonText || t('el.messagebox.confirm') }}
          </el-button>
        </div>
      </div>
    </div>
  </transition>
</template> -->

<script type="text/babel">
  import Popup from 'element-ui/src/utils/popup';
  import Locale from 'element-ui/src/mixins/locale';
  // import ElInput from 'element-ui/packages/input';
  // import ElButton from 'element-ui/packages/button';
  import { addClass, removeClass } from 'element-ui/src/utils/dom';
  import { t } from 'element-ui/src/locale';

  // let typeMap = {
  //   success: 'circle-check',
  //   info: 'information',
  //   warning: 'warning',
  //   error: 'circle-cross'
  // };

  export default {
    mixins: [Popup, Locale],

    props: {
      modal: {
        default: true
      },
      lockScroll: {
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      closeOnClickModal: {
        default: true
      },
      closeOnPressEscape: {
        default: true
      }
    },

    components: {
      // ElInput,
      // ElButton
    },

    computed: {
      // typeClass() {
      //   return this.type && typeMap[this.type] ? `el-icon-${ typeMap[this.type] }` : '';
      // },

      // confirmButtonClasses() {
      //   return `el-button--primary ${ this.confirmButtonClass }`;
      // },
      // cancelButtonClasses() {
      //   return `${ this.cancelButtonClass }`;
      // }
    },

    methods: {
      getSafeClose() {
        const currentId = this.uid;
        return () => {
          this.$nextTick(() => {
            if (currentId === this.uid) this.doClose();
          });
        };
      },
      doClose() {
        if (!this.visible) return;
        this.visible = false;
        this._closing = true;

        this.onClose && this.onClose();

        if (this.lockScroll) {
          setTimeout(() => {
            if (this.modal && this.bodyOverflow !== 'hidden') {
              document.body.style.overflow = this.bodyOverflow;
              document.body.style.paddingRight = this.bodyPaddingRight;
            }
            this.bodyOverflow = null;
            this.bodyPaddingRight = null;
          }, 200);
        }
        this.opened = false;

        if (!this.transition) {
          this.doAfterClose();
        }
        if (this.action) this.callback(this.action, this);
      },

      handleWrapperClick() {
        if (this.closeOnClickModal) {
          this.action = '';
          this.doClose();
        }
      },

      handleAction(action) {
        if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
          return;
        }
        this.action = action;
        if (typeof this.beforeClose === 'function') {
          this.close = this.getSafeClose();
          this.beforeClose(action, this, this.close);
        } else {
          this.doClose();
        }
      },

      validate() {
        if (this.$type === 'prompt') {
          var inputPattern = this.inputPattern;
          if (inputPattern && !inputPattern.test(this.inputValue || '')) {
            this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
            addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
            return false;
          }
          var inputValidator = this.inputValidator;
          if (typeof inputValidator === 'function') {
            var validateResult = inputValidator(this.inputValue);
            if (validateResult === false) {
              this.editorErrorMessage = this.inputErrorMessage || t('el.messagebox.error');
              addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
              return false;
            }
            if (typeof validateResult === 'string') {
              this.editorErrorMessage = validateResult;
              return false;
            }
          }
        }
        this.editorErrorMessage = '';
        removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
        return true;
      }
    },

    watch: {
      // inputValue: {
      //   immediate: true,
      //   handler(val) {
      //     this.$nextTick(_ => {
      //       if (this.$type === 'prompt' && val !== null) {
      //         this.validate();
      //       }
      //     });
      //   }
      // },

      visible(val) {
        if (val) this.uid++;
        if (this.$type === 'alert' || this.$type === 'confirm') {
          this.$nextTick(() => {
            this.$refs.confirm.$el.focus();
          });
        }
        if (this.$type !== 'prompt') return;
        if (val) {
          setTimeout(() => {
            if (this.$refs.input && this.$refs.input.$el) {
              this.$refs.input.$el.querySelector('input').focus();
            }
          }, 500);
        } else {
          this.editorErrorMessage = '';
          removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
        }
      }
    },

    data() {
      return {
        uid: 1,
        title: undefined,
        content: '',
        type: '',
        customClass: '',
        callback: null
      };
    }
  };
</script>

<style scoped>
	.el-toast-box {
		position: fixed;
		top:50%;
		left:50%;
		transform: translate3d(-50px,-50px,0);
		width:100px;
		height: 100px;
		background:rgba(0,0,0,0.8);
		color:#fff;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
