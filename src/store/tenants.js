/* eslint-disable */
import firebase from "firebase/app";
import info from "./info";
export default {
  state: {
    tenants: {}
  },
  mutations: {
    setTenants(state, tenants) {
      state.tenants = tenants;
    },
    clearTenants(state) {
      state.tenants = {};
    }
  },
  actions: {
    async updateTenant({ commit }, { id, info }) {
      try {
        await firebase
          .database()
          .ref(`/tenants/`)
          .child(id)
          .child("info")
          .update(info);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async deleteTenant({ commit }, {id}) {
      try {
        firebase
          .database()
          .ref(`/tenants/`)
          .child(id)
          .remove();
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createTenant({ commit }, {info}) {
      try {
        const id = await firebase
          .database()
          .ref(`/tenants/`)
          .push()
          .getKey();
        firebase
          .database()
          .ref(`/tenants/`)
          .child(id)
          .child("info")
          .set(info);
        return { id, info };
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async fetchTenants({ dispatch, commit }) {
      try {
        const tenants =
          (
            await firebase
              .database()
              .ref(`/tenants`)
              .once("value")
          ).val() || {};
        commit("setTenants", tenants);
        return Object.keys(tenants).map(key => ({ ...tenants[key], id: key }));
      } catch (e) {
        console.log(e);
      }
    },
  },
  getters: {
    tenants: s => s.tenants
  }
};
