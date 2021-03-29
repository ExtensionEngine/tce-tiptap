import '@mdi/font/css/materialdesignicons.css';
import App from './App.vue';
import { Edit } from '../src/index';
import Vue from 'vue';

Vue.config.productionTip = false;
Vue.component(Edit.name, Edit);

new Vue({
  render: h => h(App)
}).$mount('#app');
