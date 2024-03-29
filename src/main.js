import Vue from 'vue'
import App from './App.vue'


import './assets/main.css'
import 'jquery';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; 


/* ---------- START: Font Awesome ----------*/
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faShoppingCart, faTextHeight, faRotate, faTrash, faLink, faStar,faStarHalfStroke,faPlus, faHourglass } from '@fortawesome/free-solid-svg-icons'
/* import specific icons */
import { faGalacticRepublic, faUniregistry } from '@fortawesome/free-brands-svg-icons'
/* add icons to the library */
library.add(faShoppingCart, faTextHeight, faUniregistry, faRotate, faTrash, faLink, faStar, faStarHalfStroke,faPlus,faHourglass)
/* add font awesome icon component */
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
/* ---------- END: Font Awesome ----------*/


new Vue({
  render: (h) => h(App)
}).$mount('#app')
