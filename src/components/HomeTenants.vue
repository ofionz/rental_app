<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <router-link tag="span" to="/tenants">
            <span style="cursor: pointer" class="card-title card-title-white"
              >Арендаторы</span
            >
          </router-link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>За аренду</th>
              <th>За свет</th>
              <th>Всего долг</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="tenant in tenantsWithDebt" :key="tenant.id">
              <td>
                <a class="refs" :href="'tenants/?id=' + tenant.id">{{
                  tenant.info.name
                }}</a>
              </td>
              <td>
                <a class="refs" :href="'record/?type=rent&id=' + tenant.id">{{
                  calcDebtTenant(tenant)
                }}</a>
              </td>
              <td>
                <a
                  class="refs"
                  :href="'record/?type=electricity&id=' + tenant.id"
                  >{{ calcElectrDebtAmount(tenant) }}</a
                >
              </td>
              <td>
                {{ calcDebtTenant(tenant) + calcElectrDebtAmount(tenant) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeTenants",

  props: {
    tenants: {
      required: true
    },
    date: {
      required: true
    },
    lastMonthDate: {
      required: true
    }
  },
  computed: {
    tenantsWithDebt: function() {
      let result = [];
      for (let tenant in this.tenants) {
        if (
          this.calcElectrDebtAmount(this.tenants[tenant]) !== 0 ||
          this.calcDebtTenant(this.tenants[tenant]) !== 0
        ) {
          result.push(this.tenants[tenant]);
        }
      }
      return result;
    }
  },
  methods: {
    calcElectrDebtAmount(tenant) {
      let debtAmount = this.calcElectrAmount(tenant);
      if (tenant.payments && tenant.payments[this.date]) {
        for (const key of Object.keys(tenant.payments[this.date])) {
          if (tenant.payments[this.date][key].type === "electricity")
            debtAmount -= tenant.payments[this.date][key].amount;
        }
      }
      return debtAmount;
    },
    calcElectrAmount(tenant) {
      let amount = 0;
      if (tenant.meters && tenant.meters[this.date]) {
        for (const key of Object.keys(tenant.meters[this.date])) {
          amount +=
            (tenant.meters[this.date][key].readings -
              tenant.meters[this.lastMonthDate][key].readings) *
            tenant.info.kilowatt;
        }
      }
      return amount;
    },
    calcDebtTenant(tenant) {
      return tenant.info.rent - this.$calcPaidAmount(tenant, this.date);
    }
  }
};
</script>

<style scoped>
.refs {
  color: inherit;
}
</style>
