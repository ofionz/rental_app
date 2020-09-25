<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Информация</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select v-model="current" ref="select">
            <option
              v-for="tenant of tenants"
              :key="tenant.id"
              :value="tenant.id"
              >{{ tenant.info.name }}</option
            >
          </select>
          <label>Выберите категорию</label>
        </div>

        <div class="input-field">
          <input
            :disabled="!isButtonsVisible"
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
            :disabled="!isButtonsVisible"
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
            :disabled="!isButtonsVisible"
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
            :disabled="!isButtonsVisible"
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
            :disabled="!isButtonsVisible"
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
        <button v-if="isButtonsVisible"  class="btn waves-effect waves-light" type="submit">
          Обновить
          <i class="material-icons right">update</i>
        </button>
        <button
          class="btn waves-effect waves-light"
          v-on:click="deleteTenant()"
          v-if="isButtonsVisible"
        >
          Удалить
          <i class="material-icons right">delete</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from "vuelidate/lib/validators";
export default {
  name: "TenantsEdit",
  data: () => ({
    current: null,
    select: null,
    name: "",
    owner: "",
    rent: "",
    phone: "",
    kilowatt: ""
  }),
  watch: {
    current(tenId) {
      const { id, info } = this.tenants.find(t => t.id === tenId);
      this.current = id;
      this.name = info.name;
      this.owner = info.owner;
      this.phone = info.phone;
      this.rent = info.rent;
      this.kilowatt = info.kilowatt;
    }
  },
  created() {
    const { id, info } = this.tenants[0];
    if(this.$route.query&&this.$route.query.id) {
      this.current = this.$route.query.id;
    }
    else   this.current = id;
    this.name = info.name;
    this.owner = info.owner;
    this.phone = info.phone;
    this.rent = info.rent;
    this.kilowatt = info.kilowatt;
  },
  props: {
    tenants: {
      type: Array,
      required: true
    },
    isButtonsVisible: {
      required: true
    }
  },
  validations: {
    name: { required },
    owner: { required },
    phone: { required },
    rent: { minValue: minValue(0) },
    kilowatt: { minValue: minValue(0) }
  },
  mounted() {
    // eslint-disable-next-line no-undef
    this.select = M.FormSelect.init(this.$refs.select);
    // eslint-disable-next-line no-undef
    M.updateTextFields();
  },
  beforeDestroy() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  methods: {
    async deleteTenant() {
      try {
        const id = this.current;
        await this.$store.dispatch("deleteTenant", {id} );
        this.$message("Арендатор удален!");
        this.$emit("deleted", this.current);
      } catch (e) {
        console.log(e);
      }
    },
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      try {
        const tenantData = {
          id: this.current,
          info: {
            name: this.name,
            owner: this.owner,
            phone: this.phone,
            rent: this.rent,
            kilowatt: this.kilowatt
          }
        };
        await this.$store.dispatch("updateTenant", tenantData);
        this.$message("Информация об арендаторе изменена.");
        this.$emit("updated", tenantData);
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>

<style scoped></style>
