<template>
  <div>
    <div class="title mb-5">
      {{ $vuetify.lang.t("$vuetify.elector.title") }}
    </div>
    <elector></elector>
  </div>
</template>

<script>
  import Elector from "./../../components/elector/Index";

  export default {
    metaInfo() {
      return {
        title: this.$vuetify.lang.t("$vuetify.elector.title")
      };
    },
    components: {
      Elector
    }
  };
</script>

<style scoped></style>
