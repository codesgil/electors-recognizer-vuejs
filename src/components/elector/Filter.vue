<template>
  <v-dialog max-width="700" v-model="dialog.shows.showFilter">
    <v-card>
      <v-card-title>
        <div class="title">{{ $vuetify.lang.t(dialog.title) }}</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-form @submit.prevent="submit">
        <v-card-text>
          <v-container>
            <v-row wrap>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-menu
                  :close-on-content-click="false"
                  :return-value.sync="filter.created.start"
                  min-width="290px"
                  offset-y
                  ref="starts"
                  transition="scale-transition"
                  v-model="menus.start"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :errorMessages="startAtErrors"
                      :label="
                        $vuetify.lang.t(
                          '$vuetify.elector.cols.created.start.title'
                        )
                      "
                      @blur="$v.filter.created.start.$touch()"
                      @input="$v.filter.created.start.$touch()"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-model="filter.created.start"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    scrollable
                    v-model="filter.created.start"
                  >
                    <v-spacer></v-spacer>
                    <v-btn @click="menus.start = false" color="primary" text
                      >Cancel</v-btn
                    >
                    <v-btn
                      @click="$refs.starts.save(filter.created.start)"
                      color="primary"
                      text
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-menu
                  :close-on-content-click="false"
                  :return-value.sync="filter.created.end"
                  min-width="290px"
                  offset-y
                  ref="ends"
                  transition="scale-transition"
                  v-model="menus.end"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      :errorMessages="endAtErrors"
                      :label="
                        $vuetify.lang.t('$vuetify.elector.cols.created.end.title')
                      "
                      @blur="$v.filter.created.end.$touch()"
                      @input="$v.filter.created.end.$touch()"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-model="filter.created.end"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    no-title
                    scrollable
                    v-model="filter.created.end"
                  >
                    <v-spacer></v-spacer>
                    <v-btn @click="menus.end = false" color="primary" text
                      >Cancel</v-btn
                    >
                    <v-btn
                      @click="$refs.ends.save(filter.created.end)"
                      color="primary"
                      text
                      >OK</v-btn
                    >
                  </v-date-picker>
                </v-menu>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.matricule.title')"
                  prepend-icon="mdi-key"
                  v-model="filter.matricule"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.name.title2')"
                  prepend-icon="mdi-account-box-outline"
                  v-model="filter.name"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.surname.title')"
                  prepend-icon="mdi-account-box-outline"
                  v-model="filter.surname"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.phone.title2')"
                  prepend-icon="mdi-phone-outline"
                  v-model="filter.phone"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-select
                  :items="itemsGenders"
                  :label="$vuetify.lang.t('$vuetify.elector.cols.gender.title2')"
                  autocomplete="off"
                  prepend-icon="mdi-gender-female"
                  v-model="filter.gender"
                ></v-select>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.birthDate.title2')"
                  prepend-icon="mdi-calendar"
                  v-model="filter.birthDate"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.birthPlace.title2')"
                  prepend-icon="mdi-google-maps"
                  v-model="filter.birthPlace"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.localisation.title2')"
                  prepend-icon="mdi-google-maps"
                  v-model="filter.localisation"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog.shows.showFilter = false" text>{{
            $vuetify.lang.t("$vuetify.btn.close")
          }}</v-btn>
          <v-btn @click="resetForm" text
            >{{ $vuetify.lang.t("$vuetify.btn.reset") }}
          </v-btn>
          <v-btn
            :loading="dialog.loadingBtn"
            color="secondary"
            text
            type="submit"
            >{{ $vuetify.lang.t(dialog.saveBtnTitle) }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { requiredIf } from "vuelidate/lib/validators";
import { dateIsGreatThan } from "../../helpers/Validators";
import CONSTANTS from "../../helpers/Constants";
import { mapGetters } from "vuex";

export default {
  props: {
    dialog: {
      type: Object,
      default: function() {
        return {
          title: "$vuetify.elector.filter.title",
          shows: {
            showFilter: false
          },
          saveBtnTitle: "$vuetify.btn.save",
          action: "filter",
          loadingBtn: false
        };
      }
    },
    filter: {
      type: Object,
      default: function() {
        return CONSTANTS.defaultElectorForm();
      }
    }
  },
  validations() {
    let validators = {
      filter: {
        created: {
          start: {
            required: requiredIf(() => {
              return this.filter.created.start;
            })
          },
          end: {
            dateIsGreatThan
          }
        }
      }
    };
    return validators;
  },
  created() {
    this.setItemGenders();
  },
  data: () => ({
    itemsGenders: [],
    menus: {
      start: false,
      end: false
    }
  }),
  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$emit("performFilter");
      }
    },
    closeDialog() {
      this.stopLoadingBtn();
      this.dialog.shows.showFilter = false;
    },
    stopLoadingBtn() {
      this.dialog.loadingBtn = false;
    },
    setItemGenders() {
      let self = this;
      this.genders.forEach(r => {
        self.itemsGenders.push({
          text: self.$vuetify.lang.t("$vuetify.gender." + r),
          value: r
        });
      });
    },
    resetForm() {
      this.filter.name = null;
      this.filter.phone = null;
      this.filter.gender = null;
      this.filter.birthDate = null;
      this.filter.birthPlace = null;
      this.filter.localisation = null;
      this.$v.$reset();
      this.$emit("performFilter");
    }
  },
  computed: {
    ...mapGetters({
      genders: "elector/gender"
    }),
    startAtErrors() {
      const errors = [];
      if (!this.$v.filter.created.start.$dirty) return errors;
      !this.$v.filter.created.start.required &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.elector.cols.created.start.required")
        );
      return errors;
    },
    endAtErrors() {
      const errors = [];
      let min = this.$vuetify.lang.t("$vuetify.elector.cols.created.start.title");
      !this.$v.filter.created.end.dateIsGreatThan &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.elector.cols.created.end.isGreatThan", [
            min
          ])
        );
      return errors;
    }
  }
};
</script>

<style scoped></style>
