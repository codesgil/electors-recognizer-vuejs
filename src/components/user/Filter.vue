<template>
  <v-dialog max-width="650" v-model="dialog.shows.showFilter">
    <v-card>
      <v-card-title>
        <div class="title">{{ $vuetify.lang.t(dialog.title) }}</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-form @submit.prevent="performFilter()">
        <v-card-text>
          <v-container>
            <v-row wrap>
              <v-col class="mb-0 py-0" cols="12" sm="12">
                <v-text-field
                  :label="$vuetify.lang.t('$vuetify.user.cols.username.title2')"
                  prepend-icon="mdi-account-outline"
                  v-model="filter.username"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-text-field
                  :label="
                    $vuetify.lang.t('$vuetify.user.cols.first_name.title2')
                  "
                  prepend-icon="mdi-account-card-details-outline"
                  v-model="filter.first_name"
                ></v-text-field>
              </v-col>
              <v-col class="mb-0 py-0" cols="12" sm="6">
                <v-select
                  :items="itemsRoles"
                  :label="$vuetify.lang.t('$vuetify.user.cols.role.title2')"
                  autocomplete="off"
                  prepend-icon="mdi-account-group-outline"
                  v-model="filter.role"
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
            }}
          </v-btn>
          <v-btn @click="resetForm" text>{{
            $vuetify.lang.t("$vuetify.btn.reset")
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
  import {mapGetters} from "vuex";
  import FilterMixin from "../../mixins/Common/Filters";
  import CONSTANTS from "../../helpers/Constants";

  export default {
    mixins: [FilterMixin],
    props: {
      dialog: {
        type: Object,
        default: function () {
          return {
            title: "$vuetify.users.new.title",
            shows: {
              showFilter: false
            },
            saveBtnTitle: "$vuetify.btn.save",
            action: "create"
          };
        }
      },
      filter: {
        type: Object,
        default: function () {
          return CONSTANTS.defaultUserForm();
        }
      }
    },
    created() {
      this.setItemRoles();
    },
    data: () => ({
      itemsRoles: [],
      loadingBtn: false
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
      resetForm() {
        this.form.username = null;
        this.form.role = null;
        this.form.first_name = null;
      }
    },
    computed: {
      ...mapGetters({roles: "user/roles"})
    }
  };
</script>
