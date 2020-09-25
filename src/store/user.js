/* eslint-disable */
import firebase from "firebase/app";
export default {
  state: {
    tempUser: {},
  },
  mutations: {
    setTempUser(state, tempUser) {
      state.tempUser = tempUser;
    },
    clearTempUser(state) {
      state.tempUser = {};
    }
  },
  actions: {
    async fetchTempUser({ dispatch, commit }, UId) {
      try {
        const tempUser =
          (
            await firebase
              .database()
              .ref("/users/")
              .child(UId)
              .once("value")
          ).val() || {};

        commit("setTempUser", tempUser);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
  },
  getters: {
    tempUser: s => s.tempUser
  }
};
