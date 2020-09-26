<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
      <MonthChooser @changedMonth="changeMonth"></MonthChooser>
    </div>
    <section class="history-list">
      <Loader v-if="loading"></Loader>
      <HistoryTable
        v-if="!loading && paymentsList.length"
        :payments="paymentsList"
      ></HistoryTable>
      <p class="center" v-else>Записи за текущий месяц отсутствуют</p>
    </section>
  </div>
</template>
<script>
  import HistoryTable from "../components/HistoryTable";
  import MonthChooser from "../components/app/MonthChooser";

  export default {
  name: "history",
  data: () => ({
    loading: true,
    paymentsList: [],
    tenants: [],
    date: ""
  }),
  async mounted() {
    await this.$store.dispatch("fetchTenants");
    await this.$store.dispatch("fetchLandlords");
    this.setPaymentData(this.date);
    this.loading = false;
  },
  methods: {
    changeMonth(newDate) {
      this.date = this.$options.filters.date(newDate, "string");
      this.setPaymentData(this.date);
    },
    addData(date, essence, list) {
      Object.entries(essence).map(function(arr) {
        if (
          arr[1] &&
          arr[1].payments &&
          arr[1].payments[date] &&
          Object.keys(arr[1].payments[date]).length
        ) {
          for (let payment in arr[1].payments[date]) {
            const elem = {
              id: arr[0],
              date: date,
              paymentId: payment,
              name: arr[1].info.name,
              amount: arr[1].payments[date][payment].amount,
              type: arr[1].payments[date][payment].type,
              paymentDate: new Date(arr[1].payments[date][payment].date),
              description: arr[1].payments[date][payment].description,
              recipient: arr[1].payments[date][payment].recipient
            };
            list.push(elem);
          }
        }
      });
      return list;
    },
    setPaymentData(date) {
      let list = this.addData(date, this.$store.getters.tenants, []);
      this.addData(date, this.$store.getters.landlords, list);
      list.sort(function(a, b) {
        return b.paymentDate - a.paymentDate;
      });
      this.paymentsList = list;
    }
  },
  components: {
    HistoryTable,
    MonthChooser
  }
};
</script>
<style>
  .history-list{
    overflow: hidden;
  }
</style>
