<template>
  <v-dialog max-width="500" v-model="dialog.shows.voteOffice" persistent>
    <v-card>
      <v-card-title>
        <div class="title">{{ $vuetify.lang.t(dialog.title) }}</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-form @submit.prevent="sendForm">
        <v-card-text>
          <v-container>
            <v-row wrap>
              <v-col class="mb-0 py-0" cols="12" sm="12">
                <v-select
                  :error="!_.isNull(apiFormErrors['voteOffice'])"
                  :error-messages="
                    !_.isEmpty(errorsVoteOffice)
                      ? errorsVoteOffice
                      : apiFormErrors['voteOffice']
                  "
                  @blur="$v.form.voteOffice.$touch()"
                  @input="$v.form.voteOffice.$touch()"
                  :items="itemsVoteOffices"
                  :label="$vuetify.lang.t('$vuetify.elector.cols.voteOffice.title')"
                  autocomplete="off"
                  prepend-icon="mdi-bank"
                  v-model="form.voteOffice"
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog.shows.voteOffice = false" text>{{
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

  export default {
    mixins: [FormMixin],
    props: {
      dialog: {
        type: Object,
        default: function () {
          return {
            title: "$vuetify.elector.new.title",
            shows: {
              voteOffice: false
            },
            saveBtnTitle: "$vuetify.btn.save",
            action: "create"
          };
        }
      },
      form: {
        type: Object,
        default: function () {
          return {
            voteOffice: null
          };
        }
      },
    },
    validations() {
      let validators = {
        form: {
          voteOffice: {required},
        }
      };
      return validators;
    },
    data: () => ({
      loadingBtn: false,
      itemsVoteOffices: [],
    }),
    created() {
      this.getVoteOffices();
    },
    methods: {
      getVoteOffices() {
        const self = this;
        let params = {
          url: URLPath.VOTE_OFFICE.LIST,
          params: {
            enabled: true,
            limit: 1000
          }
        };
        this.itemsVoteOffices = [];
        this.save(params)
          .then((response) => {
            response.data.items.forEach(item => {
              self.itemsVoteOffices.push({text: item.name, value: item.id});
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
              let message = self.$vuetify.lang.t("$vuetify.success_update_form");
              this.$emit("getItems");
              self.$store.dispatch("setNotification", {
                status: true,
                message: message
              });
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
        return {
          url: URLPath.ELECTORS.VOTE_OFFICE.URI.replace(
            "{ELECTORS_ID}",
            this.form["id"]
          ),
          method: URLPath.ELECTORS.VOTE_OFFICE.METHOD,
          data: {voteOffice: this.form["voteOffice"]}
        };
      },
      setForm(item) {
        this.form["id"] = item.id;
        this.form.voteOffice = item.voteOffice ? item.voteOffice.id : null;
      }
    },
    computed: {
      errorsVoteOffice() {
        let errors = [];
        if (!this.$v.form.voteOffice.$dirty) return errors;

        !this.$v.form.voteOffice.required &&
        errors.push(this.$vuetify.lang.t("$vuetify.elector.cols.voteOffice.required"));

        return errors;
      }
    }
  };
</script>
