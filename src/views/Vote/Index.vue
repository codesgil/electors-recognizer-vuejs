<template>
  <div>
    <div class="title mb-5">
      {{ $vuetify.lang.t("$vuetify.vote.title") }}
    </div>
    <vote></vote>
  </div>
</template>

<script>
  import Vote from "./../../components/vote/Index";

  export default {
    metaInfo() {
      return {
        title: this.$vuetify.lang.t("$vuetify.vote.title")
      };
    },
    components: {
      Vote
    }
  };
</script>

<style scoped></style>
