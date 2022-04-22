<template>
  <div>
    <div class="title mb-5">
      {{ $vuetify.lang.t("$vuetify.user.title") }}
    </div>
    <user></user>
  </div>
</template>

<script>
  import User from "./../../components/user/Index";

  export default {
    metaInfo() {
      return {
        title: this.$vuetify.lang.t("$vuetify.user.title")
      };
    },
    components: {
      User
    }
  };
</script>

<style scoped></style>
