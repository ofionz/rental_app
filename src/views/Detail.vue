<template>
  <div>
    <div class="page-title">
      <h3 v-if="!isAdmin">Запись</h3>
      <h3 v-else>Редактирование записи</h3>
    </div>
    <Loader v-if="loading"></Loader>
    <div v-else class="form">
      <div class="input-field">
        <input
          :disabled="!isAdmin"
          id="amount"
          type="number"
          v-model="payment.amount"
        />
        <label class="active" for="amount">Сумма</label>
      </div>

      <div class="input-field">
        <input
          :disabled="!isAdmin"
          id="description"
          type="text"
          v-model="payment.description"
        />
        <label class="active" for="description">Описание</label>
      </div>
      <button
        class="btn waves-effect waves-light"
        @click="$router.push('/history/')"
      >
        Назад
        <i class="material-icons right">keyboard_backspace</i>
      </button>
      <button
        v-if="isAdmin"
        class="btn waves-effect waves-light"
        v-on:click="updatePayment()"
      >
        Обновить
        <i class="material-icons right">update</i>
      </button>
      <button
        v-if="isAdmin"
        class="btn waves-effect waves-light"
        v-on:click="deletePayment()"
      >
        Удалить
        <i class="material-icons right">delete</i>
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: "Detail",
  data: () => ({
    loading: true,
    payment: null,
    params: null,
    isAdmin: false
  }),
  methods: {
    async deletePayment() {
      try {
        await this.$store.dispatch("deletePayment", this.params);
      } catch (e) {
        this.$error("Запись не удалена!.");
      }
      this.$message("Запись удалена.");
      await this.$router.push("/history");
    },
    async updatePayment() {
      try {
        this.params["payment"] = this.payment;
        console.log(this.params);
        await this.$store.dispatch("updatePayment", this.params);
      } catch (e) {
        this.$error("Запись не отредактирована!.");
      }
      this.$message("Запись отредактирована.");
      await this.$router.push("/history");
    }
  },
  async mounted() {
    this.isAdmin = this.$store.getters.user.admin;
    this.params = {
      type: this.$route.params.type,
      id: this.$route.params.id,
      date: this.$route.params.date,
      paymentId: this.$route.params.paymentId
    };
    this.payment = await this.$store.dispatch("fetchPaymentById", this.params);
    this.loading = false;
  }
};
</script>
