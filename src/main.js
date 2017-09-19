import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuetify from 'vuetify'
import App from './js/App.vue'
import JdyTable from './js/JdyTable.vue'
import JdyHolder from './js/JdyHolder.vue'
import { testCreatePlantShopRepository} from './jdytest';
import './css/main.css';
import './stylus/main.styl';
const pathToJson = require.context('./assets', true);

Vue.use(VueRouter);
Vue.use(Vuetify);

const plantRepository = testCreatePlantShopRepository();

function dynamicPropsFn (route) {
  
  const classInfo = plantRepository.getClassInfo(route.params.classinfo);
  return {
    classinfo: classInfo
  };
}

const router = new VueRouter({
  routes : [{ path: '/foo/:classinfo', component: JdyHolder, props: dynamicPropsFn }]
});


Vue.component('jdy-table', JdyTable);
Vue.component('jdy-holder', JdyHolder);


const app = new Vue({
 router,
 data () {
      return {
        drawer: true,
        menuitems: [
          { title: 'Home', icon: 'dashboard', href: '#/foo/Plant'},
          { title: 'Foo', icon: 'question_answer', href: '#/foo/Customer' },
          { title: 'About', icon: 'question_answer', href: '#/foo/PlantOrder' }
        ],
        right: null
      };
    }
}).$mount('#example-1');

