import DomobAlert from './src/main';

/* istanbul ignore next */
DomobAlert.install = function(Vue) {
  Vue.component(DomobAlert.name, DomobAlert);
};

export default DomobAlert;
