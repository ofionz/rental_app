<template>
  <div>
    <div class="page-title">
      <h3>Арендаторы</h3>
      <button v-if="isButtonsVisible" class="btn waves-effect waves-light" v-on:click="toggleTab()">
        {{ flagEditCreate.text }}
        <i class="material-icons right">{{this.flagEditCreate.icon }}</i>
      </button>
    </div>

    <section>
      <loader v-if="loading"></loader>
      <div v-else class="row">
        <TenantsCreate
          v-if="this.flagEditCreate.state"
          @created="addNewTenant"
          :isButtonsVisible="isButtonsVisible"
        ></TenantsCreate>
        <div v-else>
          <TenantsEdit
            v-if="tenants.length"
            :key="tenants.length + updateCount"
            @updated="updateTenant"
            @deleted="deleteTenant"
            :isButtonsVisible="isButtonsVisible"
            :tenants="tenants"
          ></TenantsEdit>
          <p v-else class="center">Арендаторов пока нет</p>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import TenantsCreate from "../components/TenantsCreate";
import TenantsEdit from "../components/TenantsEdit";
export default {
  name: "tenants",
  data: () => ({
    isButtonsVisible: false,
    flagEditCreate: {
      text: "Создать",
      state: false,
      icon: "create"
    },
    tenants: [],
    loading: true,
    updateCount: 0
  }),
  components: { TenantsEdit, TenantsCreate },
  async mounted() {
    this.tenants = await this.$store.dispatch("fetchTenants");
    if (this.$store.getters.user.admin) this.isButtonsVisible= true;
    this.loading = false;
  },
  methods: {
    toggleTab() {
      this.flagEditCreate.state = !this.flagEditCreate.state;
      if (this.flagEditCreate.state) {
        this.flagEditCreate.text = "Редактировать";
        this.flagEditCreate.icon = "update";
      } else {
        this.flagEditCreate.text = "Создать";
        this.flagEditCreate.icon = "create";
      }
    },
    deleteTenant(id) {
      const idx = this.tenants.findIndex(t => t.id === id);
      Object.keys(this.tenants[idx].info).forEach(
        key => (this.tenants[idx].info[key] = "")
      );
      this.updateCount++;
    },
    updateTenant(tenant) {
      const idx = this.tenants.findIndex(t => t.id === tenant.id);
      this.tenants[idx].info = tenant.info;
      this.updateCount++;
    },
    addNewTenant(tenant) {
      this.tenants.push(tenant);
    }
  }
};
</script>
