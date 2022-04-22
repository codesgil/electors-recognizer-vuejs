<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="550" persistent>
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ $vuetify.lang.t("$vuetify.home.campaign.title3") }}
        </v-card-title>
        <v-card-text>
          <v-container class="fill-height" fluid>
            <v-row align="center" align-content="center" justify="center">
              <v-col cols="12" sm="12">
                <h2 class="green--text py-3" v-if="!_.isEmpty(campaings)">
                  {{
                    $vuetify.lang.t("$vuetify.home.campaign.title5", [
                      this.campaings[0].name
                    ])
                  }}
                </h2>
                <h2 class="red--text py-3" v-else>
                  {{ $vuetify.lang.t("$vuetify.home.campaign.title4") }}
                </h2>
                <!--                <v-autocomplete-->
                <!--                  v-model="campaign"-->
                <!--                  :items="campaings"-->
                <!--                  :loading="isLoading"-->
                <!--                  :search-input.sync="search"-->
                <!--                  hide-no-data-->
                <!--                  hide-selected-->
                <!--                  item-text="name"-->
                <!--                  item-value="id"-->
                <!--                  :label="$vuetify.lang.t('$vuetify.home.campaign.title')"-->
                <!--                  :placeholder="$vuetify.lang.t('$vuetify.home.campaign.title2')"-->
                <!--                  prepend-icon="mdi-database-search"-->
                <!--                  autocomplete="off"-->
                <!--                ></v-autocomplete>-->
              </v-col>
              <v-col cols="12" sm="12" v-if="!_.isEmpty(response)">
                <div class="red--text headline" v-if="response['voted']">
                  <template v-if="operation === 'ACCESS'"
                    >{{
                      $vuetify.lang.t("$vuetify.home.campaign.message.title2")
                    }}
                  </template>
                  <template v-else>{{
                    $vuetify.lang.t("$vuetify.home.campaign.message.title3")
                  }}</template>
                </div>
                <div class="primary--text headline" v-else>
                  {{
                    $vuetify.lang.t("$vuetify.home.campaign.message.title", [
                      response["vote"]["elector"]
                        ? response["vote"]["elector"]["name"]
                        : ""
                    ])
                  }}
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="onSubmit"
            :loading="loading"
            v-if="!confirmVote"
          >
            <template v-if="operation === 'ACCESS'">
              {{ $vuetify.lang.t("$vuetify.home.btn.confirm.title3") }}
            </template>
            <template v-else>
              {{ $vuetify.lang.t("$vuetify.home.btn.confirm.title2") }}
            </template>
          </v-btn>
          <v-btn text @click="dialog = false">
            {{ $vuetify.lang.t("$vuetify.home.btn.close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import URLPath from "../../helpers/URL";
import FormMixin from "../../mixins/Common/Forms";

export default {
  name: "Campaign",
  mixins: [FormMixin],
  data: () => ({
    dialog: false,
    // campaign: null,
    operation: null,
    matricule: null,
    campaings: [],
    // search: null,
    isLoading: false,
    loading: false,
    response: {},
    confirmVote: false
  }),
  created() {
    this.getCampaigns();
  },
  // watch: {
  //   search(val) {
  //     if (this.isLoading) return;
  //     this.getCampaigns(val);
  //   }
  // },
  methods: {
    enabledDialog() {
      this.dialog = true;
    },
    disableDialog() {
      this.dialog = false;
    },
    setMatricule(matricule, operation) {
      this.confirmVote = false;
      this.search = null;
      this.matricule = matricule;
      this.response = {};
      this.operation = operation;
      this.$forceUpdate();
    },
    getCampaigns() {
      const self = this;
      this.isLoading = true;
      let params = {
        url: URLPath.CAMPAIGN.LIST,
        params: {
          enabled: true
        }
      };
      this.save(params)
        .then(response => {
          this.campaings = response.data.items;
        })
        .catch(() => {})
        .finally(() => {
          self.isLoading = false;
          self.$forceUpdate();
        });
    },
    onSubmit() {
      this.response = {};
      const self = this;
      this.loading = true;
      this.confirmVote = false;
      let params = {
        url:
          this.operation === "ACCESS"
            ? URLPath.VOTE.HAS.URI
            : URLPath.VOTE.MARK.URI,
        method: URLPath.VOTE.HAS.METHOD,
        data: {
          campaign: this.campaings[0].id,
          matricule: this.matricule
        }
      };
      this.save(params)
        .then(response => {
          this.response = response.data;
          if (this.operation !== "ACCESS") this.confirmVote = true;
        })
        .catch(() => {
          self.confirmVote = false;
        })
        .finally(() => {
          self.loading = false;
        });
    }
  }
};
</script>

<style scoped></style>
