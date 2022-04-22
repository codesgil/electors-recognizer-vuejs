<template>
  <login></login>
</template>

<script>
import Login from "./../../components/security/Login.vue";

export default {
  data: () => ({}),
  metaInfo() {
    return {
      title: this.$vuetify.lang.t("$vuetify.security.title")
    };
  },
  components: {
    Login
  }
};
</script>
