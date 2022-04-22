<template>
  <v-app class="security">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" align-content="center" justify="center">
          <v-col cols="12">
            <v-form
              @submit.prevent="login(form)"
              autocomplete="off"
              class="login"
            >
              <v-card
                class="pt-3 mx-auto"
                elevation="2"
                max-width="350"
                width="350"
                style="border-radius:6%"
              >
                <v-card-title class="headline justify-center my-3">
                  <div class="text--primary">{{ $vuetify.lang.t("$vuetify.appName")
                    }}
                  </div>
                </v-card-title>
                <v-card-text class="mx-16 mb-0">
                  <div class="title black--text mx-12">
                    {{ $vuetify.lang.t("$vuetify.security.title") }}
                  </div>
                  <div>
                    <span class="body-2 grey--text text--darken-1">{{
                      $vuetify.lang.t("$vuetify.security.description")
                    }}</span>
                  </div>
                </v-card-text>
                <v-card-text class="mb-0 px-5">
                  <v-text-field
                    :label="
                      $vuetify.lang.t('$vuetify.security.cols.username.title')
                    "
                    autocomplete="off"
                    name="login"
                    prepend-icon="mdi-account-circle-outline"
                    type="text"
                    v-model="form.username"
                  ></v-text-field>
                  <v-text-field
                    :label="
                      $vuetify.lang.t('$vuetify.security.cols.password.title')
                    "
                    autocomplete="off"
                    id="password"
                    name="password"
                    prepend-icon="mdi-lock-outline"
                    type="password"
                    v-model="form.password"
                  ></v-text-field>
                  <v-btn
                    :loading="loading"
                    block
                    class="mt-2"
                    color="secondary"
                    type="submit"
                  >{{ $vuetify.lang.t("$vuetify.security.form.submit") }}
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
  .security {
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
  }
</style>

<script>
  import URLPath from "../../helpers/URL";

  export default {
    data: () => ({
      form: {
        username: null,
        password: null
      },
      loading: false
    }),
    methods: {
      login(form) {
        let self = this;
        let redirect = this.$auth.redirect();
        let message = "$vuetify.security.form.bad_credentials";
        // hide old notification
        this.$store.dispatch("setNotification", {status: false});

        if (!this.form.username || !this.form.password) {
          this.$store.dispatch("setNotification", {
            status: true,
            message: this.$vuetify.lang.t(message),
            color: "error"
          });
          return;
        }

        this.loading = true;
        this.$store.dispatch("setNotification", {status: false});
        this.$auth
          .login({
            data: form,
            url: URLPath.SECURITY.LOGIN.URI,
            redirect: {name: redirect ? redirect.from.name : "home"},
            fetchUser: true
          })
          .then(() => {
          })
          .catch(error => {
            self.loading = false;
            // eslint-disable-next-line no-prototype-builtins
            if (error.hasOwnProperty("response")) {
              if (
                !self._.has(error.response, "status") ||
                error.response.status !== 401
              ) {
                message = "$vuetify.error_occured";
              }
            }
            self.$store.dispatch("setNotification", {
              status: true,
              message: self.$vuetify.lang.t(message),
              color: "error"
            });
          });
      }
    }
  };
</script>
<style scoped>
  .theme--light.v-application {
    background: #eceded !important;
  }
</style>
