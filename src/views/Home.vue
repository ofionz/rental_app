<template>
  <div>
    <div class="page-title">
      <h3>Счет</h3>
      <MonthChooser @changedMonth="changeMonth"></MonthChooser>
      <span class="card-title">Не распределено: {{ calcFreeMoney(date) }}</span>
      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <Loader v-if="loading"></Loader>
    <div v-else class="row">
      <HomeLandlords :landlords="landlords" :date="date"></HomeLandlords>
      <HomeTenants :tenants="tenants" :date="date"></HomeTenants>
    </div>
  </div>
</template>

<script>
import HomeLandlords from "../components/HomeLandlords";
import HomeTenants from "../components/HomeTenants";
import MonthChooser from "../components/app/MonthChooser";
export default {
  name: "home",
  data: () => ({
    loading: false,
    date: "",
    tenants:[]
  }),
  computed: {
    //TODO поменять получение лордов
    landlords() {
      return this.$store.getters.landlords;
    }
  },
  components: {
    HomeTenants,
    HomeLandlords,
    MonthChooser
  },
  async mounted() {
    this.refresh();
  },
  methods: {
    changeMonth(newDate) {
      this.date = this.$options.filters.date(newDate, "string");
    },
    calcFreeMoney(date) {
      let freeMoney = 0;
      for (let tenant in this.tenants) {
        freeMoney += this.$calcPaidAmount(this.tenants[tenant], date);
      }
      for (let landlord in this.landlords) {
        freeMoney -= this.$calcPaidAmount(this.landlords[landlord], date);
      }
      return freeMoney;
    },
    async refresh() {
      this.loading = true;
      this.tenants = await this.$store.dispatch("fetchTenants");
      this.loading = false;
    }
  }
};
</script>
