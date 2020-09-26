<template>
  <div>
    <div class="page-title">
      <h3>Показания счетчиков</h3>
      <MonthChooser @changedMonth="changeMonth"></MonthChooser>
    </div>

    <section class="info-table">
      <div
        v-for="(tenant, index) in tenants"
        :key="index"
        class="info-table-row"
      >
        <div v-if="isMetersExist(tenant)">
          <div class="tenant-name_wrap">
            <h6 class="tenant-name">
              {{ tenant.info.name }}
            </h6>
            <div class="tenant-meter tenant-meter_2-col">
              <span class="tenant-meter-title">Сумма</span>
              <span class="tenant-meter-title">Долг</span>
              <span class="tenant-meter-title-total_sum">
                {{ calcAmount(tenant) }}</span
              >
              <span class="tenant-meter-title-total_duty">
                {{ calcDebtAmount(tenant) }}</span
              >
            </div>
          </div>
          <div
            v-for="(meter, index) in tenant.meters[date]"
            :key="index"
            class="tenant-meter"
          >
            <span class="tenant-meter-title">Стар. Показ</span>
            <span class="tenant-meter-title">Нов. Показ</span>
            <span class="tenant-meter-title">Разность</span>
            <span>{{ tenant.meters[lastMonthDate][index].readings }}</span>
            <span>{{ meter.readings }}</span>
            <span
              >{{
                meter.readings - tenant.meters[lastMonthDate][index].readings
              }}
              кВт</span
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import MonthChooser from "../components/app/MonthChooser";

export default {
  name: "Electricity",
  components: { MonthChooser },
  data: () => ({
    loading: false,
    date: "",
    lastMonthDate: "",
    tenants: {}
  }),

  async mounted() {
    this.tenants = await this.$store.dispatch("fetchTenants");
    this.loading = false;
  },
  methods: {
    isMetersExist(tenant){
  return (tenant.meters!==undefined)&&(tenant.meters[this.date]!==undefined) && (tenant.meters[this.lastMonthDate]!==undefined);
},

    calcDebtAmount(tenant) {
      let debtAmount = this.calcAmount(tenant);
      if (tenant.payments && tenant.payments[this.date]) {
        for (const key of Object.keys(tenant.payments[this.date])) {
          if (tenant.payments[this.date][key].type === "electricity")
            debtAmount -= tenant.payments[this.date][key].amount;
        }
      }
      return debtAmount;
    },
    calcAmount(tenant) {
      let amount = 0;
      if (tenant.payments && tenant.payments[this.date]) {
        for (const key of Object.keys(tenant.meters[this.date])) {
          amount +=
            (tenant.meters[this.date][key].readings -
              tenant.meters[this.lastMonthDate][key].readings) *
            tenant.info.kilowatt;
        }
      }
      return amount;
    },
    subtractMonth(rawDate) {
      const date = new Date(rawDate);
      const newDate = new Date(date.setMonth(date.getMonth() - 1));
      return this.$options.filters.date(newDate, "string");
    },
    changeMonth(newDate) {
      this.lastMonthDate = this.subtractMonth(newDate);
      this.date = this.$options.filters.date(newDate, "string");
    }
  }
};
</script>
<style scoped>
.info-table-row {
  display: flex;
  flex-direction: column;
}
.info-table-row:not(:last-child) {
  margin-bottom: 20px;
}

.tenant-meter {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 5px;
}

.tenant-meter_2-col {
  grid-template-columns: 1fr 1fr;
  width: 10em;
  align-self: flex-end;
  text-align: center !important;
}

.tenant-meter span {
  background: rgb(31 182 182);
  padding: 4px;
  font-size: 12px;
  color: #ffffff;
  border-radius: 5px;
  letter-spacing: 0.025rem;
}

.tenant-meter-title {
  font-size: 11px;
  height: 15px;
  background: transparent !important;
  color: #000000 !important;
  font-style: italic;
}

.tenant-meter-title-total_sum {
  background: #4edf44b5 !important;
}

.tenant-meter-title-total_duty {
  background: #e70c04 !important;
}

.tenant-name_wrap {
  display: grid;
  grid-template-columns: repeat(2, 130px);
  gap: 5px;
  margin-bottom: 15px;
  align-items: end;
}
.tenant-name {
  margin: 0 20px 0 0;
  text-transform: uppercase;
  color: #3b3b3b;
  box-shadow: 0 0 8px 0 #e7e7e7;
  text-align: center;
  padding: 5px;
  border-radius: 5px;
  font-family: "Poiret One", cursive;
  font-weight: bold;
  letter-spacing: 0.2em;
}
</style>
