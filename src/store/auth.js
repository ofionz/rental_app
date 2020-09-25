/* eslint-disable */
import firebase from "firebase/app";
import configFirebase from "@/configFirebase";
export default {
  state: {
    user: {},
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = {};
    }
  },
  actions: {
    async fetchUser({ dispatch, commit }, UId) {
      try {
        const user =
          (
            await firebase
              .database()
              .ref("/users/")
              .child(UId)
              .once("value")
          ).val() || {};
        commit("setUser", user);
        return user;
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async login({ dispatch, commit }, { email, password }) {
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async register({ dispatch, commit }, { email, password, name, admin }) {
      const secondaryApp = firebase.initializeApp(configFirebase, "Secondary");
      try {
        await secondaryApp
          .auth()
          .createUserWithEmailAndPassword(email, password);
        const uid = secondaryApp.auth().currentUser.uid;
        await secondaryApp.delete();
        await firebase
          .database()
          .ref(`/users/${uid}/`)
          .set({
            name: name,
            admin: admin
          });
      } catch (e) {
        await secondaryApp.delete();
        commit("setError", e);
        throw e;
      }
    },
    async logout() {
      await firebase.auth().signOut();
      this.commit("clearInfo");
    },
    getUid() {
      const user = firebase.auth().currentUser;
      return user ? user.uid : null;
    }
  },
  getters: {
    user: s => s.user
  }
};
