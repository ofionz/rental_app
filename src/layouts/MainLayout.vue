<template>
  <div>
    <Loader v-if="loading"></Loader>
    <div v-else class="app-main-layout">
      <main class="app-content" :class="{ full: !isSidebarVisible }">
        <div class="app-page">
          <router-view />
        </div>
      </main>
      <Navbar @toogleSidebar="isSidebarVisible = !isSidebarVisible"> </Navbar>
      <Sidebar v-model="isSidebarVisible"> </Sidebar>
      <div class="fixed-action-btn">
        <router-link class="btn-floating btn-large blue" to="/record">
          <i class="large material-icons">add</i>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
import Loader from "../components/app/Loader";
import Navbar from "../components/app/Navbar";
import Sidebar from "../components/app/Sidebar";

import messages from "@/utils/messages";
export default {
  name: "main-layout",
  components: {
    Navbar,
    Sidebar,
    Loader
  },
  computed: {
    error() {
      return this.$store.getters.error;
    }
  },
  watch: {
    error(fbError) {
      console.log(fbError);
      this.$error(messages[fbError.code] || "Что то пошло не так");
    }
  },
  async mounted() {
    if (!Object.keys(this.$store.getters.landlords).length) {
      await this.$store.dispatch("fetchLandlords");
    }
    if (!Object.keys(this.$store.getters.tenants).length) {
      await this.$store.dispatch("fetchTenants");
    }
    this.loading = false;
  },
  data: () => ({
    isSidebarVisible: true,
    loading: true
  })
};
</script>
