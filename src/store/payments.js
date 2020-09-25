/* eslint-disable */
import firebase from "firebase/app";
import info from "./info";
export default {
  actions: {
    async updatePayment({ commit }, { id, date, paymentId, payment }) {

      try {
        await firebase
          .database()
          .ref(`/tenants/`)
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

    async deletePayment({ commit }, { id, date, paymentId }) {
      try {
        firebase
          .database()
          .ref(`/tenants/`)
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

    async addPayment({ commit }, { id, date, paymentInfo }) {
      try {
        await firebase
          .database()
          .ref(`/tenants/`)
          .child(id)
          .child("payments")
          .child(date)
          .push(paymentInfo);
      } catch (e) {
        commit("setError", e);
        throw e;
      }
    },

    async fetchPaymentById({ commit }, { id, date, paymentId }) {
      try {
       const payment = (await firebase
          .database()
          .ref(`/tenants/`)
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
