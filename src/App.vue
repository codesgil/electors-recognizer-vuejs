<template>
  <v-app id="app">
    <v-snackbar
      :absolute="notification.absolute"
      :bottom="notification.bottom"
      :color="notification.color"
      :left="notification.left"
      :multi-line="notification.multiLine"
      :right="notification.right"
      :timeout="-1"
      :top="notification.top"
      v-model="notification.status"
      shaped
    >
      {{ notification.message }}
      <template v-slot:action="{ attrs }">
        <v-icon v-bind="attrs" @click="closeSnackbar()">mdi-close</v-icon>
      </template>
    </v-snackbar>
    <template v-if="$auth.ready()">
      <router-view></router-view>
    </template>
    <template v-else>
      <div class="text-center mt-5">
        <v-skeleton-loader
          class="mx-auto"
          max-width="300"
          type="card, paragraph"
        ></v-skeleton-loader>
      </div>
    </template>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  metaInfo() {
    return {
      title: "Elector recognizer",
      titleTemplate: "%s - " + this.$vuetify.lang.t("$vuetify.appName")
    };
  },
  data: () => ({}),
  mounted() {
    this.$moment.locale(this.$vuetify.lang.current);
  },
  methods: {
    closeSnackbar() {
      this.$store.dispatch("setNotification", {
        status: false
      });
    }
  },
  computed: {
    ...mapGetters({ notification: "notification" })
  }
};
</script>
<style scoped>
.theme--light.v-application {
}
</style>
