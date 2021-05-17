import '@mdi/font/css/materialdesignicons.css';
import { Edit, Toolbar } from '../src/index';
import App from './App.vue';
import Radio from './plugins/radio';
import Vue from 'vue';
import vuetify from './plugins/vuetify';

Vue.use(Radio);
Vue.config.productionTip = false;
Vue.component(Edit.name, Edit);
Vue.component(Toolbar.name, Toolbar);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app');
