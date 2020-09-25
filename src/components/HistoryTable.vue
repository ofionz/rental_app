<template>
  <table>
    <thead>
      <tr>
        <th>Имя</th>
        <th>Тип платежа</th>
        <th>Сумма</th>
        <th>Дата</th>
        <th>Ответственный</th>
        <th>Описание</th>
        <th></th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(payment, index) of payments" :key="index">
        <td>{{ payment.name }}</td>
        <td> {{ typeToString(payment.type) }}</td>
        <td>{{ payment.amount }}</td>
        <td>{{ payment.paymentDate | date("shortDT") }}</td>
        <td>{{ gerUserName(payment.recipient) }}</td>
        <td>{{ payment.description }}</td>
        <td>
          <button
            class="btn-small btn"
            @click="
              $router.push(
                `/detail/${payment.id}/${payment.date}/${payment.paymentId}`
              )
            "
          >
            <i class="material-icons">edit</i>
          </button>
        </td>
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
    typeToString(type) {
      switch (type) {
        case "rent":
          return 'Аренда' ;
        case "electricity":
          return "Свет";
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

<style scoped></style>
