/* eslint-disable */
import firebase from "firebase/app";
export default {
  state: {
    landlords: {}
  },
  mutations: {
    setLandlords(state, landlords) {
      state.landlords = landlords;
    },
    clearLandlords(state) {
      state.landlords = {};
    }
  },
  actions: {
    async fetchLandlords({ dispatch, commit }) {
      try {
        const landlords = (
          await firebase
            .database()
            .ref(`/landlords/`)
            .once("value")
        ).val()|| {};
        commit("setLandlords", landlords);
        return Object.keys(landlords).map(key => ({...landlords[key], id: key}));
      } catch (e) {
        console.log(e);
      }
    }
  },
  getters: {
    landlords: s => s.landlords
  }
};
