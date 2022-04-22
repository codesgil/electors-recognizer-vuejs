<template>
  <v-dialog max-width="700" v-model="dialog.shows.showForm" persistent>
    <v-card>
      <v-card-title>
        <div class="title">{{ $vuetify.lang.t(dialog.title) }}</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-form @submit.prevent="sendForm">
        <v-card-text>
          <v-container>
            <v-row wrap>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.name.title')"
                  prepend-icon="mdi-account-box-outline"
                  v-model="form.name"
                  autocomplete="off"
                  :error="!_.isNull(apiFormErrors['name'])"
                  :error-messages="
                    !_.isEmpty(errorsName) ? errorsName : apiFormErrors['name']
                  "
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.elector.cols.surname.title')"
                  prepend-icon="mdi-account-box-outline"
                  v-model="form.surname"
                  autocomplete="off"
                  :error="!_.isNull(apiFormErrors['surname'])"
                  :error-messages="
                    !_.isEmpty(errorsSurname) ? errorsSurname : apiFormErrors['surname']
                  "
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['phone'])"
                  :error-messages="
                    !_.isEmpty(errorsPhone)
                      ? errorsPhone
                      : apiFormErrors['phone']
                  "
                  :label="$vuetify.lang.t('$vuetify.elector.cols.phone.title')"
                  @blur="$v.form.phone.$touch()"
                  @input="$v.form.phone.$touch()"
                  prepend-icon="mdi-phone-outline"
                  v-model="form.phone"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-select
                  :error="!_.isNull(apiFormErrors['gender'])"
                  :error-messages="
                    !_.isEmpty(errorsGender)
                      ? errorsGender
                      : apiFormErrors['gender']
                  "
                  @blur="$v.form.gender.$touch()"
                  @input="$v.form.gender.$touch()"
                  :items="itemsGenders"
                  :label="$vuetify.lang.t('$vuetify.elector.cols.gender.title')"
                  autocomplete="off"
                  prepend-icon="mdi-gender-male-female"
                  v-model="form.gender"
                ></v-select>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['birthDate'])"
                  :error-messages="
                    !_.isEmpty(errorsBirthDate)
                      ? errorsBirthDate
                      : apiFormErrors['birthDate']
                  "
                  :label="$vuetify.lang.t('$vuetify.elector.cols.birthDate.title')"
                  @blur="$v.form.birthDate.$touch()"
                  @input="$v.form.birthDate.$touch()"
                  prepend-icon="mdi-calendar"
                  v-model="form.birthDate"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['birthPlace'])"
                  :error-messages="
                    !_.isEmpty(errorsBirthPlace)
                      ? errorsBirthPlace
                      : apiFormErrors['birthPlace']
                  "
                  :label="$vuetify.lang.t('$vuetify.elector.cols.birthPlace.title')"
                  @blur="$v.form.birthPlace.$touch()"
                  @input="$v.form.birthPlace.$touch()"
                  prepend-icon="mdi-google-maps"
                  v-model="form.birthPlace"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="12">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['localisation'])"
                  :error-messages="
                    !_.isEmpty(errorsLocalisation)
                      ? errorsLocalisation
                      : apiFormErrors['localisation']
                  "
                  :label="$vuetify.lang.t('$vuetify.elector.cols.localisation.title')"
                  @blur="$v.form.localisation.$touch()"
                  @input="$v.form.localisation.$touch()"
                  prepend-icon="mdi-google-maps"
                  v-model="form.localisation"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog.shows.showForm = false" text>{{
            $vuetify.lang.t("$vuetify.btn.close")
            }}
          </v-btn>
          <v-btn :loading="loadingBtn" color="secondary" text type="submit"
          >{{ $vuetify.lang.t(dialog.saveBtnTitle) }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
  import FormMixin from "../../mixins/Common/Forms";
  import {required} from "vuelidate/lib/validators";
  import URLPath from "../../helpers/URL";
  import CONSTANTS from "../../helpers/Constants";
  import {mapGetters} from "vuex";

  export default {
    mixins: [FormMixin],
    props: {
      dialog: {
        type: Object,
        default: function () {
          return {
            title: "$vuetify.elector.new.title",
            shows: {
              showForm: false
            },
            saveBtnTitle: "$vuetify.btn.save",
            action: "create"
          };
        }
      },
      form: {
        type: Object,
        default: function () {
          return CONSTANTS.defaultElectorForm();
        }
      },
    },
    validations() {
      let validators = {
        form: {
          name: {required},
          phone: {required},
          gender: {required},
          birthDate: {required},
          birthPlace: {required},
          localisation: {required},
        }
      };
      return validators;
    },
    data: () => ({
      loadingBtn: false,
      itemsGenders: [],
    }),
    created() {
      this.setItemGenders();
    },
    methods: {
      setItemGenders() {
        let self = this;
        this.genders.forEach(r => {
          self.itemsGenders.push({
            text: self.$vuetify.lang.t("$vuetify.gender." + r),
            value: r
          });
        });
      },
      sendForm() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          let self = this;
          this.loadingBtn = true;
          this.save(this.getFormParam())
            .then(() => {
              let message = self.$vuetify.lang.t("$vuetify.success_form");
              if (self.dialog.action === "edit")
                message = self.$vuetify.lang.t("$vuetify.success_update_form");
              this.$emit("getItems");
              self.$store.dispatch("setNotification", {
                status: true,
                message: message
              });
              if (this.dialog.action === "create") {
                this.resetForm();
              }
            })
            .catch(() => {
              this.$forceUpdate();
            })
            .finally(() => {
              self.loadingBtn = false;
            });
        }
      },
      getFormParam() {
        let params = {};
        switch (this.dialog.action) {
          case "edit":
            params["url"] = URLPath.ELECTORS.EDIT.URI.replace(
              "{ELECTORS_ID}",
              this.form["id"]
            );
            var data = this._.omit(this.form, ["id", "created"]);
            params["data"] = data;
            params["method"] = URLPath.ELECTORS.EDIT.METHOD;
            break;
          case "create":
            params["url"] = URLPath.ELECTORS.CREATE.URI;
            params["method"] = URLPath.ELECTORS.CREATE.METHOD;
            params["data"] = this._.omit(this.form, ["id", "created"]);
            break;
        }
        return params;
      },
      setForm(item) {
        this.form["id"] = item.id;
        this.form.name = item.name;
        this.form.phone = item.phone;
        this.form.gender = item.gender;
        this.form.birthDate = item.birthDate;
        this.form.birthPlace = item.birthPlace;
        this.form.localisation = item.localisation;
      },
      resetForm() {
        this.form.name = null;
        this.form.phone = null;
        this.form.gender = null;
        this.form.birthDate = null;
        this.form.birthPlace = null;
        this.form.localisation = null;
        this.$v.$reset();
      }
    },
    computed: {
      ...mapGetters({
        genders: "elector/gender"
      }),
      errorsPhone() {
        let errors = [];
        if (!this.$v.form.phone.$dirty) return errors;

        !this.$v.form.phone.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.elector.cols.phone.required"));

        return errors;
      },
      errorsGender() {
        let errors = [];
        if (!this.$v.form.gender.$dirty) return errors;

        !this.$v.form.gender.required &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.elector.cols.gender.required")
        );

        return errors;
      },
      errorsName() {
        let errors = [];
        if (!this.$v.form.name.$dirty) return errors;

        !this.$v.form.name.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.elector.cols.name.required"));

        return errors;
      },
      errorsLocalisation() {
        let errors = [];
        if (!this.$v.form.localisation.$dirty) return errors;

        !this.$v.form.localisation.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.elector.cols.localisation.required"));

        return errors;
      },
      errorsBirthDate() {
        let errors = [];
        if (!this.$v.form.birthDate.$dirty) return errors;

        !this.$v.form.birthDate.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.elector.cols.birthDate.required"));

        return errors;
      },
      errorsBirthPlace() {
        let errors = [];
        if (!this.$v.form.birthPlace.$dirty) return errors;

        !this.$v.form.birthPlace.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.elector.cols.birthPlace.required"));

        return errors;
      },
      errorsSurname() {
        return [];
      }
    }
  };
</script>
