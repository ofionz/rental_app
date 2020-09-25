import Vue from "vue";
import Vuelidate from "vuelidate";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import dateFilter from "@/filters/date.filter";
import messagePlugin from "@/utils/message.plugin";
import calculator from './utils/calculator';
import configFirebase from "@/configFirebase";
import Loader from "@/components/app/Loader";
import "./registerServiceWorker";
import "materialize-css/dist/js/materialize.min";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

Vue.config.productionTip = false;
Vue.use(Vuelidate);
Vue.use(messagePlugin);
Vue.use(calculator);
Vue.component("Loader", Loader);
Vue.filter("date", dateFilter);
firebase.initializeApp(configFirebase);
let app;
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#app");
  }
});
