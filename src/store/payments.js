/* eslint-disable */
import firebase from "firebase/app";
import info from "./info";
export default {
  actions: {
    async updatePayment({ commit }, {type = 'tenants', id, date, paymentId, payment }) {

      try {
        await firebase
          .database()
          .ref(`/${type}/`)
          .child(id)
          .child("payments")
          .child(date)
          .child(paymentId)
          .update(payment);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },

    async deletePayment({ commit }, {type = 'tenants', id, date, paymentId }) {
      try {
        firebase
          .database()
          .ref(`/${type}/`)
          .child(id)
          .child("payments")
          .child(date)
          .child(paymentId)
          .remove();
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },



    async addPayment({ commit }, {type = 'tenants', id, date, paymentInfo }) {
      try {
        await firebase
          .database()
          .ref(`/${type}/`)
          .child(id)
          .child("payments")
          .child(date)
          .push(paymentInfo);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },

    async fetchPaymentById({ commit }, {type = 'tenants', id, date, paymentId }) {
      try {
       const payment = (await firebase
          .database()
          .ref(`/${type}/`)
          .child(id)
          .child("payments")
          .child(date)
          .child(paymentId).once('value')).val();
       return {...payment};
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    }
  }
};
