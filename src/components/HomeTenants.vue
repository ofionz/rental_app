<template>
  <div class="col s12 m6 l8">
    <div class="card orange darken-3 bill-card">
      <div class="card-content white-text">
        <div class="card-header">
          <router-link tag="span" to="/tenants">
            <span style="cursor: pointer" class="card-title card-title-white">Арендаторы</span>
          </router-link>
        </div>
        <table>
          <thead>
            <tr>
              <th>Имя</th>
              <th>Долг</th>
              <th>Всего</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="tenant in tenants" :key="tenant.id">
              <td ><a class="refs" :href="'tenants/?id='+tenant.id">{{ tenant.info.name }}</a></td>
              <td>{{ calcDebtTenant(tenant, date) }}</td>
              <td>{{ tenant.info.rent }}</td>
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
    }
  },
  methods: {
    calcDebtTenant(tenant, date) {
      return tenant.info.rent - this.$calcPaidAmount(tenant, date);
    }
  }
};
</script>

<style scoped>
  .refs{
       color: inherit;
     }
</style>
