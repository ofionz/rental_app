<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Добавить</h4>
      </div>

      <form @submit.prevent="">
        <div class="input-field">
          <input
            id="name"
            v-model="name"
            type="text"
            :class="{ invalid: $v.name.$dirty && !$v.name.required }"
          />
          <label for="name">Название</label>
          <span
            v-if="$v.name.$dirty && !$v.name.required"
            class="helper-text invalid"
            >Введите название арендатора!
          </span>
        </div>
        <div class="input-field">
          <input
            id="owner"
            v-model="owner"
            type="text"
            :class="{ invalid: $v.owner.$dirty && !$v.owner.required }"
          />
          <label for="owner">Владелец</label>
          <span
            v-if="$v.owner.$dirty && !$v.owner.required"
            class="helper-text invalid"
            >Введите имя владельца !
          </span>
        </div>
        <div class="input-field">
          <input
            id="phone"
            v-model="phone"
            type="text"
            :class="{ invalid: $v.phone.$dirty && !$v.phone.required }"
          />
          <label for="phone">Номер телефона</label>
          <span
            v-if="$v.phone.$dirty && !$v.phone.required"
            class="helper-text invalid"
            >Введите номер телефона!
          </span>
        </div>

        <div class="input-field">
          <input
            id="rent"
            v-model.number="rent"
            type="number"
            :class="{ invalid: $v.rent.$dirty && !$v.rent.minValue }"
          />
          <label for="rent">Ежемесячный платеж</label>
          <span
            v-if="$v.rent.$dirty && !$v.rent.minValue"
            class="helper-text invalid"
            >Значение отсутствует или меньше нуля</span
          >
        </div>
        <div class="input-field">
          <input
            id="kilowatt"
            v-model.number="kilowatt"
            type="number"
            :class="{ invalid: $v.kilowatt.$dirty && !$v.kilowatt.minValue }"
          />
          <label for="kilowatt">Цена за киловатт для арендатора</label>
          <span
            v-if="$v.kilowatt.$dirty && !$v.kilowatt.minValue"
            class="helper-text invalid"
            >Значение отсутствует или меньше нуля</span
          >
        </div>
        <div
          class="input-field meter-wrap"
          v-for="(meter, index) in meters"
          :key="index"
        >
          <input
            :id="'descriptionReadings' + index"
            v-model="meter.descriptionReadings"
            type="text"
            :class="{ invalid: $v.kilowatt.$dirty && !$v.kilowatt.minValue }"
          />
          <label :for="'descriptionReadings' + index">Описание</label>
          <span
            v-if="$v.kilowatt.$dirty && !$v.kilowatt.minValue"
            class="helper-text invalid"
            >Значение отсутствует или меньше нуля</span
          >

          <input
            :id="'readings' + index"
            v-model.number="meter.readings"
            type="number"
            :class="{ invalid: $v.kilowatt.$dirty && !$v.kilowatt.minValue }"
          />
          <label class="right-meter-label" :for="'readings' + index"
            >Показания
          </label>
          <span
            v-if="$v.kilowatt.$dirty && !$v.kilowatt.minValue"
            class="helper-text invalid"
            >Значение отсутствует или меньше нуля</span
          >
          <button
            class="btn waves-effect waves-light btn-small"
            v-if="index != 0"
            @click="deleteMeterRow(index)"
          >
            <i class="material-icons right">delete</i>
          </button>
          <button
            class="btn waves-effect waves-light btn-small"
            @click="addMeterRow"
            v-if="index == 0"
          >
            <i class="material-icons right">add_box</i>
          </button>
        </div>
        <button v-if="isButtonsVisible"  class="btn waves-effect waves-light" @click="submitHandler">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
export default {
  name: "TenantsCreate",
  props: {
    isButtonsVisible: {
      required: true
    }
  },
  data: () => ({
    name: "",
    owner: "",
    rent: "",
    phone: "",
    kilowatt: "",
    meters: [{ descriptionReadings: "", readings: "" }]
  }),
  validations: {
    name: { required },
    owner: { required },
    phone: { required },
    rent: { minValue: minValue(0) },
    kilowatt: { minValue: minValue(0) }
  },
  methods: {
    addMeterRow() {
      this.meters.push({ descriptionReadings: "", readings: "" });
    },
    deleteMeterRow(indx) {
      this.meters.splice(indx, 1);
    },

    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const info = {
          name: this.name,
          owner: this.owner,
          phone: this.phone,
          rent: this.rent,
          kilowatt: this.kilowatt
        };

        const tenant = await this.$store.dispatch("createTenant", {info});
        const id = tenant.id;
        const lastMonth = new Date(
          new Date().setMonth(new Date().getMonth() - 1)
        );
        const date = this.$options.filters.date(lastMonth, "string");
        for (const meter of this.meters) {
          await this.$store.dispatch("createMeter", {
            id,
            date,
            meter
          });
        }

        this.name = "";
        this.owner = "";
        this.rent = "";
        this.phone = "";
        this.kilowatt = "";
        this.meters = [{ descriptionReadings: "", readings: "" }];
        this.$v.$reset();
        this.$message("Новый арендатор добавлен!");
        this.$emit("created", tenant);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style scoped>
.meter-wrap {
  display: flex;
  flex-direction: row;
}
.right-meter-label {
  left: 50%;
}
</style>
