<template>
  <div>
    <div class="title mb-5">
      {{ $vuetify.lang.t("$vuetify.voteOffice.title") }}
    </div>
    <vote-office></vote-office>
  </div>
</template>

<script>
  import VoteOffice from "./../../components/vote-office/Index";

  export default {
    metaInfo() {
      return {
        title: this.$vuetify.lang.t("$vuetify.voteOffice.title")
      };
    },
    components: {
      VoteOffice
    }
  };
</script>

<style scoped></style>
