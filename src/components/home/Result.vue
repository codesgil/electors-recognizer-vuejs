<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="550"
      persistent
    >
      <v-card>
        <v-card-title class="headline grey lighten-2">
          {{ $vuetify.lang.t("$vuetify.home.result.title") }}
        </v-card-title>

        <v-card-text>
          <div>
            <v-text-field clearable v-model="matricule" :loading="loading"
                          :placeholder="$vuetify.lang.t('$vuetify.home.result.form.matricule.title2')"
                          @keypress.enter="onSubmit"></v-text-field>
          </div>
          <div class="text-center">
            <v-container class="fill-height" fluid>
              <v-row align="center" align-content="center" justify="center">
                <v-card width="350" :elevation="0" outlined v-if="response['match']">
                  <v-img
                    :src="getImg"
                    height="300px"
                    dark
                  ></v-img>
                  <v-list two-line>
                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">{{ response['elector']['matricule'] }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ $vuetify.lang.t('$vuetify.home.result.form.matricule.title') }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">{{ response['elector']['name'] }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ $vuetify.lang.t('$vuetify.home.result.form.name.title') }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">{{ response['elector']['surname'] }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ $vuetify.lang.t('$vuetify.home.result.form.surname.title') }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                          {{ $moment(response['elector']['birthDate']).format("DD MMMM YYYY") }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ $vuetify.lang.t('$vuetify.home.result.form.birth_date.title') }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>

                    <v-divider></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">{{ response['elector']['birthPlace'] }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ $vuetify.lang.t('$vuetify.home.result.form.birth_place.title') }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">{{ $vuetify.lang.t('$vuetify.gender.' + response['elector']['gender']) }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ $vuetify.lang.t('$vuetify.home.result.form.gender.title') }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>

                    <v-list-item>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                          <template v-if="response['elector']['voteOffice']">
                            {{ response['elector']['voteOffice']['name'] }}
                          </template>
                          <template v-else>-</template>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ $vuetify.lang.t('$vuetify.home.result.form.voteOffice.title') }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                </v-card>
                <template v-else>
                  <div class="red--text headline" v-if="!loading">{{ $vuetify.lang.t("$vuetify.home.result.nomatch")
                    }}
                  </div>
                </template>
              </v-row>
            </v-container>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="response['match']"
            color="primary"
            text
            @click="callCampaign"
            :loading="loading"
          >
            <template v-if="operation === 'ACCESS'">
              {{ $vuetify.lang.t("$vuetify.home.btn.confirm.title3") }}
            </template>
            <template v-else>
              {{ $vuetify.lang.t("$vuetify.home.btn.confirm.title4") }}
            </template>
          </v-btn>
          <v-btn
            text
            @click="dialog = false"
          >
            {{ $vuetify.lang.t("$vuetify.home.btn.close") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <campaign-form ref="campaignForm"></campaign-form>
  </div>
</template>

<script>
  import URLPath from "../../helpers/URL";
  import FormMixin from "../../mixins/Common/Forms";
  import CampaignForm from "./Campaign"

  export default {
    name: "Result",
    mixins: [FormMixin],
    components: {
      CampaignForm
    },
    data: () => ({
      dialog: false,
      loading: false,
      response: {
        url: null,
        match:null,
        elector: {}
      },
      operation: null,
      matricule: ""
    }),
    computed: {
      getImg() {
        return this.response['url'] ? document
          .getElementsByTagName("BODY")[0]
          .getAttribute("base-uri") + this.response['url'] : ''
      }
    },
    methods: {
      enabledDialog() {
        this.dialog = true;
      },
      disableDialog() {
        this.dialog = false;
      },
      setResponse(response, operation) {
        this.matricule = "";
        this.response = response;
        this.operation = operation;
      },
      getFormParam() {
        return {
          url: URLPath.ELECTORS.MATRICULE.URI,
          method: URLPath.ELECTORS.MATRICULE.METHOD,
          params: {
            matricule: this.matricule
          }
        };
      },
      callCampaign() {
        const matricule = this.response['elector']['matricule'];
        this.$refs.campaignForm.setMatricule(matricule, this.operation);
        this.disableDialog();
        this.$refs.campaignForm.enabledDialog();
      },
      onSubmit() {
        const self = this;
        this.loading = true;
        this.response = {};
        this.save(this.getFormParam())
          .then((response) => {
            self.response = response.data;
            // eslint-disable-next-line no-unused-vars
          }).catch((error) => {
          self.response = {
            url: null,
            match:null,
            elector: {}
          };
        }).finally(() => {
          self.loading = false;
        });
      }
    }
  }
</script>

<style scoped>

</style>
