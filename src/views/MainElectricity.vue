<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>
    <Loader v-if="loading"></Loader>
    <p class="center" v-else-if="!mainMeters.length">Арендаторов нет</p>
    <form v-else class="form" @submit.prevent="submitHandler">
      <MonthChooser ref="monthChooser" @changedMonth="changeMonth"></MonthChooser>
      <div class="checkBoxContainer">
        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="info"
              v-model="type"
            />
            <span>Показания</span>
          </label>
        </p>
        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="radio"
              value="readings"
              v-model="type"
              @click="addMonth"
            />
            <span>Новая запись</span>
          </label>
        </p>
      </div>

      <div class="input-field">
        <select v-model="current" ref="select">
          <option
            v-for="meter of mainMeters"
            :key="meter.id"
            :value="meter.id"
            >{{ meter.info.name }}</option
          >
        </select>
        <label>Выберите помещение</label>
      </div>
      <div v-if="type === 'info' && lastMonthReadings && readings">
        <p>
          <label>
            <input
              class="with-gap"
              name="type"
              type="checkbox"
              v-model="show_real"
            />
            <span>Отобразить реальные показания</span>
          </label>
        </p>
        <div class="meters-info" :class="[show_real ? 'column_5' : 'column_4']">
          <span v-if="show_real" class="meters-info-title"
            >Реальные показ.</span
          >
          <span class="meters-info-title">Показ. за пр.месяц</span>
          <span class="meters-info-title">Текущие показ.</span>
          <span class="meters-info-title">Разница показ.</span>
          <span class="meters-info-title">Разница показ. с коэф.</span>
          <span v-if="show_real"> {{ readings.real_readings }}</span>
          <span> {{ lastMonthReadings.readings }}</span>
          <span> {{ readings.readings }}</span>
          <span> {{ readings.readings - lastMonthReadings.readings }}</span>
          <span>
            {{
              Math.floor(
                (readings.readings -
                  lastMonthReadings.readings +
                  (readings.readings - lastMonthReadings.readings) *
                    coefficient) *
                  100
              ) / 100
            }}</span
          >
        </div>
      </div>
      <div v-else-if="type === 'readings' && lastMonthReadings">
        <div class="info-section">
          <label
            >Прошлые сданные показания: {{ lastMonthReadings.readings }}</label
          >
          <label
            >Разность:
            {{ readings.readings - lastMonthReadings.readings }} кВт</label
          >
        </div>
        <div class="input-field">
          <input
            id="readings"
            type="number"
            @keyup="$forceUpdate()"
            v-model="readings.readings"
            :class="{
              invalid:
                $v.readings['readings'].$dirty &&
                (!$v.readings['readings'].minValue ||
                  !$v.readings['readings'].required)
            }"
          />
          <label for="readings">Текущие показания для сдачи</label>
          <span
            v-if="
              $v.readings['readings'].$dirty &&
                (!$v.readings['readings'].minValue ||
                  !$v.readings['readings'].required)
            "
            class="helper-text invalid"
            >Значение отсутствует или меньше нуля</span
          >
        </div>
        <div class="input-field">
          <input
            id="real_readings"
            v-model="readings.real_readings"
            type="text"
            :class="{
              invalid:
                $v.readings['readings'].$dirty &&
                (!$v.readings['real_readings'].minValue ||
                  !$v.readings['real_readings'].required)
            }"
          />
          <label for="real_readings">Реальные показания</label>
          <span
            v-if="
              $v.readings['readings'].$dirty &&
                (!$v.readings['real_readings'].minValue ||
                  !$v.readings['real_readings'].required)
            "
            class="helper-text invalid"
            >Значение отсутствует или меньше нуля</span
          >
        </div>

        <button v-if="type" class="btn waves-effect waves-light" type="submit">
          Записать
          <i class="material-icons right">send</i>
        </button>
      </div>
    </form>
  </div>
</template>
<script>
import MonthChooser from "../components/app/MonthChooser";
import { minValue, required } from "vuelidate/lib/validators";

export default {
  name: "MainElectricity",
  data: () => ({
    date: "",
    current: null,
    show_real: false,
    coefficient: 0,
    loading: true,
    mainMeters: {},
    select: null,
    type: "info",
    rawDate: new Date(),
    allReadings: "",
    readings: { readings: 0, real_readings: 0 },
    lastMonthReadings: {},
    allMeters: null
  }),
  validations: {
    readings: {
      readings: {
        required,
        minValue: minValue(0)
      },
      real_readings: {
        required,
        minValue: minValue(0)
      }
    }
  },
  components: { MonthChooser },
  watch: {
    current(tenId) {
      const { id, info, readings } = this.mainMeters.find(t => t.id === tenId);
      this.current = id;
      this.name = info.name;
      this.coefficient = info.coefficient;
      this.allReadings = readings;
      this.readings = readings[
        this.$options.filters.date(this.rawDate, "string")
      ]
        ? readings[this.$options.filters.date(this.rawDate, "string")]
        : { readings: 0, real_readings: 0 };
      this.lastMonthReadings = readings[this.subtractMonth(this.rawDate)];
    }
  },
  methods: {
    addMonth() {
      const date = new Date();
      const { readings } = this.mainMeters.find(t => t.id === this.current);
      if (
        date.getDate() >= 21 &&
        date.getMonth() === this.rawDate.getMonth() &&
        readings[this.date]
      ) {
        const newDate = new Date(date.setMonth(date.getMonth() + 1));
        this.$refs.monthChooser.setDate(newDate);
        this.$message(
          "Показания за текущий месяц уже есть.<br> Месяц изменен на следующий."
        );
      }
    },
    subtractMonth(rawDate) {
      const date = new Date(rawDate);
      const newDate = new Date(date.setMonth(date.getMonth() - 1));
      return this.$options.filters.date(newDate, "string");
    },
    changeMonth(newDate) {
      this.date = this.$options.filters.date(newDate, "string");
      if (this.rawDate.getMonth() !== newDate.getMonth()) {
        this.lastMonthReadings = this.allReadings[this.subtractMonth(newDate)];

        this.readings = this.allReadings[
          this.$options.filters.date(newDate, "string")
        ];
        if(!this.readings) this.readings = { readings: 0, real_readings: 0 };
        this.rawDate = newDate;
      }
    },
    async submitHandler() {
      if (this.type === "readings" && this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const date = this.date;
        const id = this.current;
        const readings = this.readings;
        await this.$store.dispatch("setMainMeters", {
          id,
          date,
          readings
        });
      } catch (e) {
        this.$error("Запись не добавлена!.");
      }
      this.$v.$reset();
      this.$message("Запись добавлена.");
    }
  },
  updated() {
    // eslint-disable-next-line no-undef
    M.updateTextFields();
  },

  async mounted() {
    this.mainMeters = await this.$store.dispatch("getMainMeters");
    this.loading = false;
    if (this.mainMeters.length) {
      this.current = this.mainMeters[0].id;
    }

    setTimeout(() => {
      // eslint-disable-next-line no-undef
      this.select = M.FormSelect.init(this.$refs.select);
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
.column_5 {
  display: grid;
  grid-template-columns: repeat(5, auto);
}
.column_4 {
  display: grid;
  grid-template-columns: repeat(4, auto);
}

.meters-info {
  background: #ffa726;
  color: #fff;
  font-weight: bold;
}
.meters-info span {
  padding: 10px;
  font-size: 10px;
}
.meters-info span:nth-child(2n) {
  background: #f69200;
}
span.meters-info-title {
  background: #1fb6b6;
  letter-spacing: 0.1em;
}
span.meters-info-title:nth-child(2n) {
  background-color: #4edf44b5;
}
</style>