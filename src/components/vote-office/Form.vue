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
              <v-col class="mb-0 py-0" cols="12" sm="8">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.voteOffice.cols.name.title')"
                  prepend-icon="mdi-sticker"
                  v-model="form.name"
                  autocomplete="off"
                  @blur="$v.form.name.$touch()"
                  @input="$v.form.name.$touch()"
                  :error="!_.isNull(apiFormErrors['name'])"
                  :error-messages="
                    !_.isEmpty(errorsName) ? errorsName : apiFormErrors['name']
                  "
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="4">
                <v-switch
                  v-model="form.enabled"
                  :error="!_.isNull(apiFormErrors['enabled'])"
                  :error-messages="
                    !_.isEmpty(errorsEnabled)
                      ? errorsEnabled
                      : apiFormErrors['enabled']
                  "
                  :label="
                    $vuetify.lang.t('$vuetify.voteOffice.cols.enabled.title')
                  "
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog.shows.showForm = false" text>{{
            $vuetify.lang.t("$vuetify.btn.close")
          }}</v-btn>
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
import { required } from "vuelidate/lib/validators";
import URLPath from "../../helpers/URL";
import CONSTANTS from "../../helpers/Constants";

export default {
  mixins: [FormMixin],
  props: {
    dialog: {
      type: Object,
      default: function() {
        return {
          title: "$vuetify.voteOffice.new.title",
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
      default: function() {
        return CONSTANTS.defaultVoteOfficeForm();
      }
    }
  },
  validations() {
    let validators = {
      form: {
        name: { required }
      }
    };
    return validators;
  },
  data: () => ({
    loadingBtn: false
  }),
  methods: {
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
            if (this.dialog.action === "create") this.resetForm();
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
          params["url"] = URLPath.VOTE_OFFICE.EDIT.URI.replace(
            "{VOTE_OFFICE_ID}",
            this.form["id"]
          );
          var data = this._.omit(this.form, ["id"]);
          params["data"] = data;
          params["method"] = URLPath.VOTE_OFFICE.EDIT.METHOD;
          break;
        case "create":
          params["url"] = URLPath.VOTE_OFFICE.CREATE.URI;
          params["method"] = URLPath.VOTE_OFFICE.CREATE.METHOD;
          params["data"] = this._.omit(this.form, ["id"]);
          break;
      }
      return params;
    },
    setForm(item) {
      this.form["id"] = item.id;
      this.form.name = item.name;
      this.form.enabled = item.enabled;
    },
    resetForm() {
      this.form.name = null;
      this.form.enabled = null;
      this.$v.$reset();
    }
  },
  computed: {
    errorsName() {
      let errors = [];
      if (!this.$v.form.name.$dirty) return errors;

      !this.$v.form.name.required &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.voteOffice.cols.name.required")
        );

      return errors;
    },
    errorsEnabled() {
      return [];
    }
  }
};
</script>
