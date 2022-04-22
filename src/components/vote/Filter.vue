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
                          '$vuetify.vote.cols.created.start.title'
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
                        $vuetify.lang.t('$vuetify.vote.cols.created.end.title')
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
                  :label="$vuetify.lang.t('$vuetify.vote.cols.elector.title2')"
                  prepend-icon="mdi-key"
                  v-model="filter.electorMatricule"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.vote.cols.elector.title')"
                  prepend-icon="mdi-account-box-outline"
                  v-model="filter.electorName"
                  autocomplete="off"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-select
                  :items="itemsCampaigns"
                  :label="$vuetify.lang.t('$vuetify.vote.cols.campaign.title')"
                  autocomplete="off"
                  prepend-icon="mdi-home"
                  v-model="filter.campaign"
                ></v-select>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-select
                  :items="itemsVoted"
                  :label="$vuetify.lang.t('$vuetify.vote.cols.voted.title')"
                  autocomplete="off"
                  prepend-icon="mdi-checkbox-blank-outline"
                  v-model="filter.voted"
                  clearable
                ></v-select>
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
import URLPath from "../../helpers/URL";

export default {
  props: {
    dialog: {
      type: Object,
      default: function() {
        return {
          title: "$vuetify.vote.filter.title",
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
        return CONSTANTS.defaultVoteForm();
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
    this.setCampaigns();
  },
  data: () => ({
    itemsCampaigns: [],
    itemsVoted: [
      {
        text: "Oui",
        value: true
      },
      {
        text: "Non",
        value: false
      }
    ],
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
    setCampaigns() {
      let params = {
        url: URLPath.CAMPAIGN.LIST,
        params: {
          size: 10000
        }
      };
      this.$store
        .dispatch("request", params)
        .then(r => {
          let self = this;
          r.data.items.forEach(app => {
            self.itemsCampaigns.push({
              text: app.name,
              value: app.id
            });
          });
        })
    },
    resetForm() {
      this.filter.electorName = null;
      this.filter.electorMatricule = null;
      this.filter.campaign = null;
      this.filter.voted = null;
      this.$v.$reset();
      this.$emit("performFilter");
    }
  },
  computed: {
    startAtErrors() {
      const errors = [];
      if (!this.$v.filter.created.start.$dirty) return errors;
      !this.$v.filter.created.start.required &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.vote.cols.created.start.required")
        );
      return errors;
    },
    endAtErrors() {
      const errors = [];
      let min = this.$vuetify.lang.t("$vuetify.vote.cols.created.start.title");
      !this.$v.filter.created.end.dateIsGreatThan &&
        errors.push(
          this.$vuetify.lang.t("$vuetify.vote.cols.created.end.isGreatThan", [
            min
          ])
        );
      return errors;
    }
  }
};
</script>

<style scoped></style>
