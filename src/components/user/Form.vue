<template>
  <v-dialog max-width="650" v-model="dialog.shows.showForm">
    <v-card>
      <v-card-title>
        <div class="title">{{ $vuetify.lang.t(dialog.title) }}</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-form @submit.prevent="sendForm">
        <v-card-text>
          <v-container>
            <v-row wrap>
              <v-col class="mb-0 py-0" cols="6">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['first_name'])"
                  :error-messages="
                    !_.isEmpty(errorsFullname)
                      ? errorsFullname
                      : apiFormErrors['first_name']
                  "
                  :label="
                    $vuetify.lang.t('$vuetify.user.cols.first_name.title')
                  "
                  @blur="$v.form.first_name.$touch()"
                  @input="$v.form.first_name.$touch()"
                  prepend-icon="mdi-account-outline"
                  v-model="form.first_name"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['username'])"
                  :error-messages="
                    !_.isEmpty(errorsUsername)
                      ? errorsUsername
                      : apiFormErrors['username']
                  "
                  :label="$vuetify.lang.t('$vuetify.user.cols.username.title')"
                  @blur="$v.form.username.$touch()"
                  @input="$v.form.username.$touch()"
                  prepend-icon="mdi-account-outline"
                  v-model="form.username"
                  autocomplete="off"
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
                  :label="$vuetify.lang.t('$vuetify.user.cols.phone.title')"
                  @blur="$v.form.phone.$touch()"
                  @input="$v.form.phone.$touch()"
                  prepend-icon="mdi-phone-outline"
                  v-model="form.phone"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['email'])"
                  :error-messages="
                    !_.isEmpty(errorsEmail)
                      ? errorsEmail
                      : apiFormErrors['email']
                  "
                  :label="$vuetify.lang.t('$vuetify.user.cols.email.title')"
                  @blur="$v.form.email.$touch()"
                  @input="$v.form.email.$touch()"
                  prepend-icon="mdi-at"
                  type="email"
                  v-model="form.email"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-select
                  :items="itemsRoles"
                  :label="$vuetify.lang.t('$vuetify.user.cols.role.title')"
                  autocomplete="off"
                  prepend-icon="mdi-account-group-outline"
                  v-model="form.role"
                ></v-select>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-switch
                  v-model="form.is_active"
                  :label="$vuetify.lang.t('$vuetify.user.cols.enabled.title')"
                ></v-switch>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['password'])"
                  :error-messages="
                    !_.isEmpty(errorsPassword)
                      ? errorsPassword
                      : apiFormErrors['password']
                  "
                  :label="$vuetify.lang.t('$vuetify.user.cols.password.title')"
                  @blur="$v.form.password.$touch()"
                  @input="$v.form.password.$touch()"
                  autocomplete="off"
                  prepend-icon="mdi-shield-account-outline"
                  type="password"
                  v-model="form.password"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :error="!_.isNull(apiFormErrors['repeat_password'])"
                  :error-messages="
                    !_.isEmpty(errorsRepeatPassword)
                      ? errorsRepeatPassword
                      : apiFormErrors['repeat_password']
                  "
                  :label="
                    $vuetify.lang.t('$vuetify.user.cols.repeat_password.title')
                  "
                  @blur="$v.form.repeat_password.$touch()"
                  @input="$v.form.repeat_password.$touch()"
                  autocomplete="off"
                  prepend-icon="mdi-shield-account-outline"
                  type="password"
                  v-model="form.repeat_password"
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
  import {mapGetters} from "vuex";
  import {
    required,
    maxLength,
    sameAs,
    requiredIf,
    minLength,
    alphaNum,
    email
  } from "vuelidate/lib/validators";
  import {isPhone, isUniqueUsername} from "../../helpers/Validators";
  import URLPath from "../../helpers/URL";
  import CONSTANTS from "../../helpers/Constants";

  export default {
    mixins: [FormMixin],
    props: {
      dialog: {
        type: Object,
        default: function () {
          return {
            title: "$vuetify.user.new.title",
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
          return CONSTANTS.defaultUserForm();
        }
      }
    },
    created() {
      this.setItemRoles();
    },
    validations() {
      let validators = {
        form: {
          username: {
            required,
            maxLength: maxLength(50),
            minLength: minLength(3),
            alphaNum,
            isUnique: isUniqueUsername
          },
          first_name: {required, maxLength: maxLength(100)},
          password: {
            minLength: minLength(4),
            maxLength: maxLength(50),
            required: requiredIf(component => {
              return !component["id"];
            })
          },
          role: {required},
          email: {required, email},
          phone: {required, isPhone},
          repeat_password: {sameAs: sameAs("password")}
        }
      };
      return validators;
    },
    data: () => ({
      itemsRoles: [],
      loadingBtn: false,
      search: null,
      isLoading: false
    }),
    methods: {
      setItemRoles() {
        let self = this;
        if (this.$auth.user() && this.$auth.user().role === "ROLE_SUPERVISOR") {
          this.itemsRoles.push({
            text: this.$vuetify.lang.t("$vuetify.roles.ROLE_USER"),
            value: "ROLE_USER"
          });
        } else {
          this.roles.forEach(r => {
            self.itemsRoles.push({
              text: self.$vuetify.lang.t("$vuetify.roles." + r),
              value: r
            });
          });
        }
        if (this.$auth.user().role === "ROLE_SUPER_ADMIN")
          this.itemsRoles.push({
            text: this.$vuetify.lang.t("$vuetify.roles.ROLE_SUPER_ADMIN"),
            value: "ROLE_SUPER_ADMIN"
          });
      },
      sendForm() {
        this.$v.$touch();
        if (!this.$v.$invalid) {
          let self = this;
          this.loadingBtn = true;
          this.save(this.getFormParam())
            .then(() => {
              this.$emit("getItems");
              self.$store.dispatch("setNotification", {
                status: true,
                message: self.$vuetify.lang.t("$vuetify.success_form")
              });
              if (this.dialog.action === "create") this.resetForm();
              else if (this.dialog.action === "edit") this.resetForm("partial");
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
            params["url"] = URLPath.USER.EDIT.URI.replace(
              "{USER_ID}",
              this.form["id"]
            );
            var data = this._.omit(this.form, ["id"]);
            data = this.form.password
              ? data
              : this._.omit(data, ["password", "oldUsername"]);
            params["data"] = data;
            params["method"] = URLPath.USER.EDIT.METHOD;
            break;
          case "create":
            params["url"] = URLPath.USER.CREATE.URI;
            params["method"] = URLPath.USER.CREATE.METHOD;
            params["data"] = this._.omit(this.form, ["id", "oldUsername"]);
            break;
        }
        return params;
      },
      setForm(item) {
        this.form["id"] = item.id;
        this.form["oldUsername"] = item.username;
        this.form.username = item.username;
        this.form.role = item.role;
        this.form.view_record = item.view_record;
        this.form.is_active = item.is_active;
        this.form.first_name = item.profile.first_name;
        this.form.phone = item.profile.phone;
        this.form.email = item.profile.email;
      },
      resetForm(type = "all") {
        if (type === "all") {
          this.form.username = null;
          this.form.role = "ROLE_USER";
          this.form.first_name = null;
          this.form.phone = null;
          this.form.email = null;
          this.form.is_active = null;
        }
        this.form.password = null;
        this.form.repeat_password = null;
        this.$v.$reset();
      }
    },
    computed: {
      ...mapGetters({
        roles: "user/roles"
      }),
      errorsUsername() {
        let errors = [];
        if (!this.$v.form.username.$dirty) return errors;

        !this.$v.form.username.required &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.username.required")
        );

        !this.$v.form.username.minLength &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.username.length", [3], [50])
        );

        !this.$v.form.username.maxLength &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.username.length", [3], [50])
        );

        !this.$v.form.username.alphaNum &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.username.alphaNum")
        );

        !this.$v.form.username.isUnique &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.username.isUnique")
        );

        return errors;
      },
      errorsFullname() {
        let errors = [];
        if (!this.$v.form.first_name.$dirty) return errors;

        !this.$v.form.first_name.required &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.first_name.required")
        );

        !this.$v.form.first_name.maxLength &&
        errors.push(
          this.$vuetify.lang.t(
            "$vuetify.user.cols.first_name.length",
            [3],
            [100]
          )
        );

        return errors;
      },
      errorsPassword() {
        let errors = [];
        if (this.dialog.action === "edit") return errors;
        if (!this.$v.form.password.$dirty) return errors;

        !this.$v.form.password.required &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.password.required")
        );

        !this.$v.form.password.minLength &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.password.length", [4], [50])
        );

        !this.$v.form.password.maxLength &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.password.length", [4], [50])
        );

        return errors;
      },
      errorsPhone() {
        let errors = [];
        if (!this.$v.form.phone.$dirty) return errors;

        !this.$v.form.phone.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.user.cols.phone.required"));

        !this.$v.form.phone.isPhone &&
        errors.push(this.$vuetify.lang.t("$vuetify.user.cols.phone.phone"));

        return errors;
      },
      errorsEmail() {
        let errors = [];
        if (!this.$v.form.email.$dirty) return errors;

        !this.$v.form.email.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.user.cols.email.required"));

        !this.$v.form.email.email &&
        errors.push(this.$vuetify.lang.t("$vuetify.user.cols.email.email"));

        return errors;
      },
      errorsRole() {
        let errors = [];
        if (!this.$v.form.role.$dirty) return errors;

        !this.$v.form.role.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.user.cols.role.required"));

        return errors;
      },
      errorsRepeatPassword() {
        let errors = [];
        if (this.dialog.action === "edit") return errors;
        if (!this.$v.form.repeat_password.$dirty) return errors;

        !this.$v.form.repeat_password.sameAs &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.user.cols.repeat_password.sameAs")
        );

        return errors;
      }
    }
  };
</script>
