<template>
  <div>
    <Datepicker
      :language="ru"
      format="MMMM yyyy"
      minimum-view="month"
      :changedMonth="changedMonth()"
      v-model="date"
    ></Datepicker>
  </div>
</template>

<script>
import Datepicker from "vuejs-datepicker";
import { ru } from "vuejs-datepicker/dist/locale";

export default {
  name: "MonthChooser",
  components: {
    Datepicker
  },
  data: function() {
    return {
      ru: ru,
      date: new Date()
    };
  },
  methods: {
    changedMonth() {
      this.$emit("changedMonth", this.date);
    },
    setDate: function (date) {
     this.date = date
    }
  }
};
</script>

<style scoped></style>
