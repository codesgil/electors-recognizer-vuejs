<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app class="app">
    <v-app-bar app clipped-left color="primary accent-2" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <div class="title mx-2 my-4">
        {{ $vuetify.lang.t("$vuetify.appName") }}
      </div>
      <v-spacer></v-spacer>
      <!--      <v-menu :rounded="'b-xl'" offset-y>-->
      <!--        <template v-slot:activator="{ on }">-->
      <!--          <v-btn class="mx-2" color="white" outlined v-on="on"-->
      <!--            >{{ $vuetify.lang.current }}-->
      <!--          </v-btn>-->
      <!--        </template>-->
      <!--        <v-list>-->
      <!--          <v-list-item active-class="secondary lighten-5" link>-->
      <!--            <v-list-item-title-->
      <!--              v-if="$vuetify.lang.current.toLowerCase() === 'fr'"-->
      <!--              @click="changeLocale('en')"-->
      <!--              >EN</v-list-item-title-->
      <!--            >-->
      <!--            <v-list-item-title v-else @click="changeLocale('fr')"-->
      <!--              >FR</v-list-item-title-->
      <!--            >-->
      <!--          </v-list-item>-->
      <!--        </v-list>-->
      <!--      </v-menu>-->
    </v-app-bar>
    <v-navigation-drawer app clipped v-model="drawer">
      <v-list>
        <v-list-item>
          <v-list-item-avatar size="50">
            <img src="../assets/user.png"/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold body-1">
              <template v-if="!_.isEmpty($auth.user())">
                {{ $auth.user().profile.first_name }}
              </template>
              <template v-else> -</template>
            </v-list-item-title>
            <v-list-item-subtitle>
              <template v-if="!_.isEmpty($auth.user())">
                {{ $vuetify.lang.t("$vuetify.roles." + $auth.user().role) }}
              </template>
              <template v-else> -</template>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-menu bottom left>
              <template v-slot:activator="{ on }">
                <v-btn color="secondary" icon v-on="on">
                  <v-icon>mdi-logout</v-icon>
                </v-btn>
              </template>
              <v-list class="menu-app-bar">
                <v-list-item @click="logout()">
                  <v-list-item-title
                  >{{ $vuetify.lang.t("$vuetify.menu.logout") }}
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-list dense nav>
        <v-list-item
          :to="{ name: 'dashboard' }"
          exact
          exact-active-class="secondary lighten-5"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-view-dashboard-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold subtitle-1"
            >{{ $vuetify.lang.t("$vuetify.menu.dashboard") }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-group
          prepend-icon="mdi-account-cog-outline"
          no-action
          :value="settingGroup()"
          color="black"
          v-if="
            $auth.check([
              'ROLE_ADMIN',
              'ROLE_SUPER_ADMIN',
              'ROLE_SUPERVISOR'
            ])
          "
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold subtitle-1">{{
                $vuetify.lang.t("$vuetify.menu.settings.title")
                }}
              </v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item
            :to="{ name: 'campaigns' }"
            active-class="secondary lighten-5"
            v-if="
            $auth.check([
              'ROLE_ADMIN',
              'ROLE_SUPER_ADMIN',
            ])
          "
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold subtitle-1"
              >{{ $vuetify.lang.t("$vuetify.menu.settings.campaign") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :to="{ name: 'voteOffice' }"
            active-class="secondary lighten-5"
            v-if="
            $auth.check([
              'ROLE_ADMIN',
              'ROLE_SUPER_ADMIN',
            ])
          "
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold subtitle-1"
              >{{ $vuetify.lang.t("$vuetify.menu.settings.voteOffice") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :to="{ name: 'votes' }"
            active-class="secondary lighten-5"
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold subtitle-1"
              >{{ $vuetify.lang.t("$vuetify.menu.settings.vote") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            :to="{ name: 'users' }"
            active-class="secondary lighten-5"
            v-if="
              $auth.check(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'])
            "
          >
            <v-list-item-content>
              <v-list-item-title class="font-weight-bold subtitle-1"
              >{{ $vuetify.lang.t("$vuetify.menu.settings.user") }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
        <v-list-item
          :to="{ name: 'electors' }"
          exact
          exact-active-class="secondary lighten-5"
          link
        >
          <v-list-item-icon>
            <v-icon>mdi-account-group-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="font-weight-bold subtitle-1"
            >{{ $vuetify.lang.t("$vuetify.menu.elector") }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container class="pt-5 px-5" fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: true
    }),
    methods: {
      logout: function () {
        let self = this;
        this.$auth
          .logout()
          .then(() => {
          })
          .catch(error => {
            // eslint-disable-next-line no-prototype-builtins
            if (error.hasOwnProperty("response")) {
              if (
                !self._.has(error.response, "status") ||
                error.response.status !== 401
              ) {
                self.$store.dispatch("setNotification", {
                  status: true,
                  message: this.$vuetify.lang.t("$vuetify.error_occured")
                });
              } else {
                self.$router.push({name: "login"});
              }
            }
          });
      },
      settingGroup() {
        let regex = /^\/settings((\/users|\/campaigns|\/votes))/;
        return regex.test(this.$route.path);
      },
      changeLocale(locale) {
        this.$vuetify.lang.current = locale;
        locale = locale === "fr" ? locale : "en-gb";
        this.$moment.locale(locale);
      }
    }
  };
</script>
<style scoped>
  .v-navigation-drawer {
  }
</style>
