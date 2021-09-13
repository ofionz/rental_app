<template>
  <div class="col s12 m6 l4">
    <div class="card light-blue bill-card">
      <div class="card-content white-text">
        <span class="card-title card-title-white">Арендодатели</span>
        <p
          v-for="landlord in landlords"
          :key="landlord.info.name"
          class="currency-line"
        >
          <span>
            <router-link
              tag="span"
              :to="'record/?type=landlords&' + 'id=' + landlord.id"
            >
              <span style="cursor: pointer"
                >{{ landlord.info.name }} :
                {{ calcDebtToTheLandlord(landlord, date) }} </span
              >
            </router-link>
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
    date: {
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
.refs {
  color: inherit;
}
</style>
