<template>
  <div>
    <home></home>
  </div>
</template>

<script>
  import Home from "./../components/home/Index";

  export default {
    data: () => ({}),
    metaInfo() {
      return {
        title: this.$vuetify.lang.t("$vuetify.home.title")
      };
    },
    components: {
      Home
    }
  };
</script>

<style scoped></style>
