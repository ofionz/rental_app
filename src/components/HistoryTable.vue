<template>
  <table>
    <thead>
      <tr class="payments-table">
        <th>Имя</th>
        <th>Тип платежа</th>
        <th>Сумма</th>
        <th>Дата</th>
        <th>Ответственный</th>
        <th>Описание</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(payment, index) of payments"
        :key="index"
        class="payments-table"
        :class="payment.type"
        @click="
          $router.push(
            `/detail/${formatType(payment.type)}/${payment.id}/${
              payment.date
            }/${payment.paymentId}`
          )
        "
      >
        <td>{{ payment.name }}</td>
        <td>{{ typeToString(payment.type) }}</td>
        <td>{{ payment.amount }}</td>
        <td>{{ payment.paymentDate | date("shortDT") }}</td>
        <td>{{ gerUserName(payment.recipient) }}</td>
        <td>{{ payment.description }}</td>

      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "HistoryTable",
  userName: "",
  props: {
    payments: { type: Array, required: true }
  },
  methods: {
    formatType(type) {
      if (type === "landlords") {
        return type;
      } else return "tenants";
    },
    typeToString(type) {
      switch (type) {
        case "rent":
          return "Аренда";
        case "electricity":
          return "Свет";
        case "landlords":
          return "Отдано";
        default:
          return "Неизвестный";
      }
    },
    gerUserName(id) {
      let user = "";
      this.$store.dispatch("fetchTempUser", id);
      user = this.$store.getters.user;
      return user.name;
    }
  }
};
</script>

<style scoped>
.electricity {
  background: #ffa726b8;
}
.rent {
  background: #df5d44a8;
}
.landlords {
  background: #1fb6b682;
}
.payments-table {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}
</style>
