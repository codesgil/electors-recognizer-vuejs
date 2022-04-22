<template>
  <div class="exception-404">
    <exception
      :message="$vuetify.lang.t('$vuetify.exception.pages.404')"
      :title="404"
    ></exception>
  </div>
</template>

<script>
import Exception from "../../components/exception/Index";

export default {
  name: "NotFound",
  components: {
    exception: Exception
  }
};
</script>

<style scoped></style>
