<template>
  <div class="el-toast-box__wrapper" v-show="visible" @click="handleWrapperClick">
  	<div class="el-toast-box" :class="customClass">
  		<div class="el-toast-box__title" v-if="title !== undefined">
  			{{title}}
  		</div>
  		<div class="el-toast-box__content">
  			{{content}}
  		</div>
  	</div>
  </div>
</template>


<script type="text/babel">
  import Popup from 'element-ui/src/utils/popup';
  import Locale from 'element-ui/src/mixins/locale';
  import { addClass, removeClass } from 'element-ui/src/utils/dom';
  import { t } from 'element-ui/src/locale';



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
        default: false
      }
    },

    components: {

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
        
      },

      handleWrapperClick() {
        if (this.closeOnClickModal) {
          this.action = '';
          this.doClose();
        }
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
        let vm = this;
        if (val) this.uid++;
        if (val) {
          this.duration = this.duration ++;
          if(this.duration != 0){
            setTimeout(() => {
              vm.doClose()
            }, this.duration);
          }
          
        } else {
                    
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
        callback: null,
        visible:false
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
		max-width:300px;
		height: 100px;
		background:rgba(0,0,0,0.8);
		color:#fff;
		text-align: center;
    font-size: 0.8em;
    padding: 1em 3em;
    border-radius: 8px;
    user-select: none;
	}
  .el-toast-box__title{
      padding:1em;
    }
  .el-toast-box__content{
    text-align: left;
  }

</style>
