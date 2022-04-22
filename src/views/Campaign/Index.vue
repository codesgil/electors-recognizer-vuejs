<template>
  <div>
    <div class="title mb-5">
      {{ $vuetify.lang.t("$vuetify.campaign.title") }}
    </div>
    <campaign></campaign>
  </div>
</template>

<script>
  import Campaign from "./../../components/campaign/Index";

  export default {
    metaInfo() {
      return {
        title: this.$vuetify.lang.t("$vuetify.campaign.title")
      };
    },
    components: {
      Campaign
    }
  };
</script>

<style scoped></style>
