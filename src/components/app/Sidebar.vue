<template>
  <ul class="sidenav app-sidenav" :class="{ open: value }">
    <router-link
      v-for="link in links"
      :key="link.url"
      tag="li"
      active-class="active"
      :to="link.url"
      :exact="link.exact == 'true'"

    >
      <a @click="hideSidebar()" href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
    </router-link>
  </ul>
</template>

<script>
export default {
  name: "Sidebar",
  props: ["value"],
  data: () => ({
    links: [
      {
        title: "Счет",
        url: "/",
        exact: "true"
      },
      {
        title: "История",
        url: "/history"
      },
      {
        title: "Новая запись",
        url: "/record"
      },
      {
        title: "Счетчики арендаторов",
        url: "/electricity"
      },
      {
        title: "Главные счетчики",
        url: "/mainelectricity"
      },
      {
        title: "Арендаторы",
        url: "/tenants"
      }
    ]
  }),
  methods: {
    hideSidebar (){
      this.$emit("hideSidebar");
    }
  },
  mounted() {
    if (this.$store.getters.user.admin) {
      this.links.push({
        title: "Добавить пользователя",
        url: "/register"
      });
    }
  }
};
</script>

<style scoped></style>
