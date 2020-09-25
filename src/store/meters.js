/* eslint-disable */
import firebase from "firebase/app";
import info from "./info";
export default {
  actions: {
    async setMainMeters({ commit }, {id, date, readings} ) {
      try {

        await firebase
          .database()
          .ref(`/main_meters/`)
          .child(id)
          .child('readings')
          .child(date)
          .set(readings)

      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async getMainMeters({ commit } ) {
      try {

        const meters = (await firebase
          .database()
          .ref(`/main_meters/`)
         .once('value')).val();

   return Object.keys(meters).map(key => ({ ...meters[key], id: key }));
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createMeterRecord({ commit }, { id, date, meters }) {
      try {
        firebase
          .database()
          .ref(`/tenants/`)
          .child(id)
          .child("meters")
          .child(date)
          .set(meters)

      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },
    async createMeter({ commit }, { id, date, meter }) {
      try {
        const meterId = firebase
          .database()
          .ref(`/tenants/`)
          .child(id)
          .child("meters")
          .child(date)
          .push()
          .getKey();
        firebase
          .database()
          .ref(`/tenants/`)
          .child(id)
          .child("meters")
          .child(date)
          .child(meterId)
          .set(meter)
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    }
  }
};
