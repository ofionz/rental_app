<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>
    <Loader v-if="loading"></Loader>
    <p class="center" v-else-if="!tenants.length">Арендаторов нет</p>
    <form v-else class="form" @submit.prevent="submitHandler">
      <MonthChooser
        ref="monthChooser"
        @changedMonth="changeMonth"
      ></MonthChooser>
      <div class="checkBoxContainer">
        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="rent"
              v-model="type"
            />
            <span>Аренда</span>
          </label>
        </p>

        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="electricity"
              @click="addMonthElectr()"
              v-model="type"
            />
            <span>Свет</span>
          </label>
        </p>
        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="readings"
              @click="addMonth()"
              v-model="type"
            />
            <span>Показания</span>
          </label>
        </p>
      </div>

      <div
        v-show="
          innertype !== 'expense' ||
            type === 'electricity' ||
            type === 'readings'
        "
        class="input-field"
      >
        <select v-model="current" ref="select">
          <option v-for="tenant of tenants" :key="tenant.id" :value="tenant.id"
            >{{ tenant.info.name }}
          </option>
        </select>
        <label>Выберите арендатора</label>
      </div>
      <div
        v-show="innertype === 'expense' && type === 'rent'"
        class="input-field"
      >
        <select v-model="currentLandlord" ref="select2">
          <option
            v-for="landlord of landlords"
            :key="landlord.id"
            :value="landlord.id"
          >
            {{ landlord.info.name }}
          </option>
        </select>
        <label
          >Свободные деньги: {{ calcFreeMoney(date) }} руб., к выплате еще:
          {{ calcDebtToTheLandlord() }} руб. <br />Выберите арендодателя
        </label>
      </div>
      <div v-if="type === 'rent'" class="checkBoxContainer">
        <p>
          <label>
            <input
              class="with-gap"
              name="innertype"
              type="radio"
              value="income"
              v-model="innertype"
            />
            <span>Приход</span>
          </label>
        </p>

        <p>
          <label>
            <input
              class="with-gap"
              name="innertype"
              type="radio"
              value="expense"
              v-model="innertype"
            />
            <span>Расход</span>
          </label>
        </p>
      </div>
      <div v-if="type === 'rent' || type === 'electricity'">
        <label
        >Долг аренды: {{ calcDebtTenant(getTenantById(current)) }} руб., Долг свет: {{calcElectrDebtAmount(getTenantById(current))}}
        </label>
        <div class="input-field">
          <input
            :class="{
              invalid:
                $v.amount.$dirty && (!$v.amount.minValue || !$v.amount.required)
            }"
            id="amount"
            type="number"
            v-model.number="amount"
          />
          <label for="amount">Сумма</label>
          <span
            v-if="
              $v.amount.$dirty && (!$v.amount.minValue || !$v.amount.required)
            "
            class="helper-text invalid"
            >Значение отсутствует или меньше нуля</span
          >
        </div>

        <div class="input-field">
          <input id="description" type="text" v-model="description" />
          <label for="description">Описание</label>
        </div>
      </div>

      <div
        v-else-if="type === 'readings'"
        v-for="(lastMeter, index) in lastMonthMeters"
        :key="index"
      >
        <div class="info-section">
          <label>Прошлые показания счетчика: {{ lastMeter.readings }}</label>
          <label
            >Разность:
            {{ meters[index].readings - lastMeter.readings }} кВт</label
          >
          <label
            >Сумма:
            {{ (meters[index].readings - lastMeter.readings) * kilowatt }}
            руб.</label
          >
        </div>
        <div class="input-field">
          <input
            id="readings"
            type="number"
            @keyup="$forceUpdate()"
            v-model="meters[index].readings"
          />
          <label for="readings">Текущие показания счетчика</label>
        </div>
        <div class="input-field">
          <input
            id="descriptionReadings"
            v-model="meters[index].descriptionReadings"
            type="text"
          />
          <label for="descriptionReadings">Описание</label>
        </div>
        <hr />
      </div>

      <button v-if="type" class="btn waves-effect waves-light" type="submit">
        Записать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>
<script>
import MonthChooser from "../components/app/MonthChooser";
import { required, minValue } from "vuelidate/lib/validators";

export default {
  name: "Record",
  data: () => ({
    date: "",
    current: null,
    currentLandlord: null,
    kilowatt: 0,
    loading: true,
    tenants: [],
    landlords: [],
    select: null,
    innertype: "income",
    type: "rent",
    amount: "",
    description: "",
    rawDate: new Date(),
    data: "",
    lastMonthMeters: null,
    allMeters: null,
    initDate: ""
  }),
  validations: {
    amount: { required, minValue: minValue(0) }
  },
  components: { MonthChooser },
  computed: {
    meters: function() {
      let thisMeters = {};
      if (Object.keys(this.allMeters).lastIndexOf(this.date) < 0) {
        for (const key of Object.keys(this.lastMonthMeters)) {
          this.$set(thisMeters, key, {});
          this.$set(thisMeters[key], "descriptionReadings", "");
          this.$set(thisMeters[key], "readings", "");
        }
      } else {
        for (const key of Object.keys(this.lastMonthMeters)) {
          this.$set(thisMeters, key, {});
          this.$set(
            thisMeters[key],
            "descriptionReadings",
            this.allMeters[this.date][key].descriptionReadings
          );
          this.$set(
            thisMeters[key],
            "readings",
            this.allMeters[this.date][key].readings
          );
        }
      }

      return thisMeters;
    }
  },
  watch: {
    current(tenId) {
      const { id, info, meters } = this.tenants.find(t => t.id === tenId);
      this.current = id;
      this.name = info.name;
      this.kilowatt = info.kilowatt;
      this.allMeters = meters;
      this.lastMonthMeters = meters
        ? this.allMeters[this.subtractMonth(this.rawDate)]
        : {};
    },
    currentLandlord(tenId) {
      const { id, info } = this.landlords.find(t => t.id === tenId);
      this.currentLandlord = id;
      this.name = info.name;
    }
  },
  methods: {
    getTenantById(id){
      let tenant = this.tenants.find(
        t => t.id === id
      );
      return tenant
    },
    calcElectrDebtAmount(tenant) {
      let debtAmount = this.calcElectrAmount(tenant);
      if (tenant.payments && tenant.payments[this.date]) {
        for (const key of Object.keys(tenant.payments[this.date])) {
          if (tenant.payments[this.date][key].type === "electricity")
            debtAmount -= tenant.payments[this.date][key].amount;
        }
      }
      return debtAmount;
    },
    calcElectrAmount(tenant) {
      let amount = 0;
      if (
        tenant.meters &&
        tenant.meters[this.date] &&
        tenant.meters[this.subtractMonth(this.rawDate)]
      ) {
        for (const key of Object.keys(tenant.meters[this.date])) {
          amount +=
            (tenant.meters[this.date][key].readings -
              tenant.meters[this.subtractMonth(this.rawDate)][key].readings) *
            tenant.info.kilowatt;
        }
      } else amount = "Показ. нет";
      return amount;
    },
    addMonthElectr() {
      const date = new Date();
      let tenant = this.tenants.find(t => t.id === this.current);
      if (
        date.getDate() >= 23 &&
        date.getMonth() === this.rawDate.getMonth() &&
        this.calcElectrDebtAmount(tenant) === 0
      ) {
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.$refs.monthChooser.setDate(newDate);
        this.$message(
          "В этом месяце свет оплачен. <br> Месяц изменен на следующий."
        );
      }
    },
    addMonth() {
      const date = new Date();
      const { meters } = this.tenants.find(t => t.id === this.current);
      if (
        date.getDate() >= 21 &&
        date.getMonth() === this.rawDate.getMonth() &&
        meters[this.date]
      ) {
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.$refs.monthChooser.setDate(newDate);
        this.$message(
          "Показания за текущий месяц уже есть.<br> Месяц изменен на следующий."
        );
      }
    },
    calcDebtToTheLandlord() {
      const landlord = this.landlords.find(t => t.id === this.currentLandlord);
      return (
        this.$calcLandlordRentAmount(landlord) -
        this.$calcPaidAmount(landlord, this.date)
      );
    },
    calcDebtTenant(tenant) {
      return tenant.info.rent - this.$calcPaidAmount(tenant, this.date);
    },
    calcFreeMoney(date) {
      let freeMoney = 0;
      for (let tenant in this.tenants) {
        freeMoney += this.$calcPaidAmount(this.tenants[tenant], date);
      }
      for (let landlord in this.landlords) {
        freeMoney -= this.$calcPaidAmount(this.landlords[landlord], date);
      }
      return freeMoney;
    },
    setRentDate(string) {
      let arr = string.split("_");
      let date = new Date();
      date.setMonth(Number(arr[1]) - 1);
      date.setFullYear(Number(arr[2]));
      this.$nextTick(function () {this.$refs.monthChooser.setDate(date);})
    },
    subtractMonth(rawDate) {
      const date = new Date(rawDate);
      const newDate = new Date(date.setMonth(date.getMonth() - 1));
      return this.$options.filters.date(newDate, "string");
    },
    changeMonth(newDate) {
      this.date = this.$options.filters.date(newDate, "string");
      if (this.rawDate.getMonth() !== newDate.getMonth()) {
        this.lastMonthMeters = this.allMeters[this.subtractMonth(newDate)];
        this.rawDate = newDate;
      }
    },
    async submitHandler() {
      if (
        (this.type === "rent" || this.type === "electricity") &&
        this.$v.$invalid
      ) {
        this.$v.$touch();
        return;
      }
      try {
        const date = this.date;
        const id = this.current;
        if (
          (this.type === "rent" && this.innertype === "income") ||
          this.type === "electricity"
        ) {
          const paymentInfo = {
            amount: Number(this.amount),
            description: this.description,
            date: new Date().toJSON(),
            type: this.type,
            recipient: await this.$store.dispatch("getUid")
          };
          await this.$store.dispatch("addPayment", {
            id,
            date,
            paymentInfo
          });
        } else if (this.type === "readings") {
          const meters = this.meters;
          for (let meter in meters) {
            if (!meters[meter].readings || meters[meter].readings < 0) {
              this.$message("Показания не заполнены или меньше нуля");
              return;
            }
          }
          await this.$store.dispatch("createMeterRecord", {
            id,
            date,
            meters
          });
        } else if (this.type === "rent" && this.innertype === "expense") {
          if (
            Number(this.amount) > this.calcFreeMoney(this.date) ||
            Number(this.amount) > this.calcDebtToTheLandlord()
          ) {
            this.$message(
              "Остаток меньше выплаты или больше долга перед арендодателем."
            );
            return;
          }

          const type = "landlords";
          const id = this.currentLandlord;
          const paymentInfo = {
            type: type,
            amount: Number(this.amount),
            description: this.description,
            date: new Date().toJSON(),
            recipient: await this.$store.dispatch("getUid")
          };
          await this.$store.dispatch("addPayment", {
            type,
            id,
            date,
            paymentInfo
          });
        }
        this.tenants = await this.$store.dispatch("fetchTenants");
        this.landlords = await this.$store.dispatch("fetchLandlords");
      } catch (e) {
        this.$error("Запись не добавлена!.");
      }
      this.$v.$reset();
      this.amount = "";
      this.description = "";
      this.$message("Запись добавлена.");
    }
  },
  updated() {
    // eslint-disable-next-line no-undef
    M.updateTextFields();
  },
  async mounted() {
    this.tenants = await this.$store.dispatch("fetchTenants");
    this.landlords = await this.$store.dispatch("fetchLandlords");
    this.loading = false;
    if (this.tenants.length) {
      this.current = this.tenants[0].id;
    }
    if (this.landlords.length) {
      this.currentLandlord = this.landlords[0].id;
    }

    if (this.$route.query && this.$route.query.id && this.$route.query.type) {
      if (this.$route.query.type == "landlords") {
        this.type = "rent";
        this.innertype = "expense";
        const { id, info } = this.landlords.find(
          t => t.id === this.$route.query.id
        );
        this.currentLandlord = id;
        this.name = info.name;
      } else if (this.$route.query.type == "rent") {
        this.type = "rent";
        this.innertype = "income";
        this.setRentDate(this.$route.query.date);
        const { id, info } = this.tenants.find(
          t => t.id === this.$route.query.id
        );
        this.current = id;
        this.name = info.name;
      } else if (this.$route.query.type == "electricity") {
        this.type = "electricity";
        this.innertype = "income";
        const { id, info } = this.tenants.find(
          t => t.id === this.$route.query.id
        );
        this.current = id;
        this.name = info.name;
      }
    }

    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select);
    }, 0);
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select2);
    }, 0);

    // eslint-disable-next-line no-undef
    M.updateTextFields();
  },
  beforeDestroy() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  }
};
</script>
<style>
.checkBoxContainer {
  display: flex;
  justify-content: space-between;
}

.info-section {
  display: flex;
  justify-content: space-between;
}
</style>
