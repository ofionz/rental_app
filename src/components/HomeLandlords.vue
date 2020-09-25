<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title">Арендодатели</span>
        <p
          v-for="landlord in landlords"
          :key="landlord.info.name"
          class="currency-line"
        >
          <span
            ><a class="refs" :href="'record/?type=landlords&'+'id='+landlord.id">{{ landlord.info.name }} :
            {{ calcDebtToTheLandlord(landlord, date) }}</a>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeLandlords",
  props: {
    landlords: {
      required: true
    },
    date:{
      required: true
    }
  },
  methods: {
    calcDebtToTheLandlord(landlord, date) {
      return (
        this.$calcLandlordRentAmount(landlord) -
        this.$calcPaidAmount(landlord, date)

      );
    }
  }
};
</script>

<style scoped>
  .refs{
    color: inherit;
  }
</style>
