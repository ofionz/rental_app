import Vue from "vue";
import Vuex from "vuex";
import auth from "./auth";
import info from "./info";
import landlords from "./landlords";
import tenants from "./tenants";
import payments from './payments';
import user from './user';
import meters from './meters';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    error: null
  },
  mutations: {
    setError(state, error) {
      state.error = error;
    },
    clearError(state) {
      state.error = null;
    }
  },
  getters: {
    error: s => s.error
  },
  modules: { auth, info, landlords, tenants, user, payments, meters }
});
