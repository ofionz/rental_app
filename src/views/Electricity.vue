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


        <div v-if="tenant.meters[date]&&tenant.meters[lastMonthDate]">
          <h6 class="tenant-name">
            {{ tenant.info.name }}
          </h6>
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
      for (const key of Object.keys(tenant.meters[this.date])) {
        amount +=
          (tenant.meters[this.date][key].readings -
            tenant.meters[this.lastMonthDate][key].readings) *
          tenant.info.kilowatt;
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

.info-table-row h6 {
  margin: 0 0 5px;
  font-weight: bold;
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
}

.tenant-meter span {
  background: #e9e9e9;
  padding: 4px;
  font-size: 12px;
}

.tenant-meter-title {
  font-size: 11px;
  height: 20px;
  background: transparent !important;
}

.tenant-meter-title-total_sum {
  background: #97e9ed !important;
}

.tenant-meter-title-total_duty {
  background: #ff5454 !important;
}
</style>
