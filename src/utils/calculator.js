/* eslint-disable */
import store from "../store";
export default {
  install(Vue, options) {
    Vue.prototype.$calcLandlordRentAmount = function(landlord) {
      let amountRents = 0;
      let tenants = store.getters.tenants;
      for (let tenant in tenants) {
        amountRents += tenants[tenant].info.rent;
      }
      return (landlord.info.share / 100) * amountRents;
    };
    Vue.prototype.$calcPaidAmount = function(essence, date) {
      let paidRents = 0;
      if (
        !(
          essence.payments === undefined || essence.payments[date] === undefined
        )
      ) {
        for (let payment in essence.payments[date]) {
          if (essence.payments[date][payment].type == "rent")
            paidRents += Number(essence.payments[date][payment].amount);
        }
      }
      return paidRents;
    };
  }
};
