<template>
  <v-dialog max-width="550" v-model="dialog.shows.showInfo">
    <v-card>
      <v-card-title>
        <div class="title">{{ $vuetify.lang.t(dialog.title) }}</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list two-line>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary"
              >mdi-account-card-details-outline
              </v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.first_name }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.user.cols.first_name.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-account-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1"
              >{{ form.username }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.user.cols.username.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-phone-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.phone }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.user.cols.phone.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-at</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.email }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.user.cols.email.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-account-group-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                <template v-if="form.role"
                >{{ $vuetify.lang.t("$vuetify.roles." + form.role) }}
                </template>
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.user.cols.role.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-checkbox-blank-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                <template v-if="form.is_active">
                  <v-icon class="pointer" color="teal accent-4" dark
                  >mdi-check-circle-outline
                  </v-icon>
                </template>
                <template v-else>
                  <v-icon class="pointer" color="red accent-4" dark
                  >mdi-close-circle-outline
                  </v-icon>
                </template>
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.user.cols.enabled.title") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-bank</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                <template v-if="form.voteOffice">
                  {{ form.voteOffice.name }}
                </template>
                <template v-else> -</template>
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.voteOffice.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog.shows.showInfo = false" text
        >{{ $vuetify.lang.t("$vuetify.btn.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import CONSTANTS from "../../helpers/Constants";

  export default {
    props: {
      dialog: {
        type: Object,
        default: function () {
          return {
            title: "$vuetify.user.view.title",
            show: {
              showInfo: false
            },
            saveBtnTitle: "$vuetify.btn.save",
            action: "detail"
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
    data: () => ({
      isLoading: false
    }),
    methods: {
      setForm(item) {
        this.form["id"] = item.id;
        this.form.username = item.username;
        this.form.role = item.role;
        this.form.is_active = item.is_active;
        this.form.first_name = item.profile.first_name;
        this.form.phone = item.profile.phone;
        this.form.email = item.profile.email;
        this.form.voteOffice = item.voteOffice;
      }
    }
  };
</script>

<style scoped></style>
