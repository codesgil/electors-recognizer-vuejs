<template>
  <div class="exception-403">
    <exception
      :message="$vuetify.lang.t('$vuetify.exception.pages.403')"
      :title="403"
    ></exception>
  </div>
</template>

<script>
import Exception from "../../components/exception/Index";

export default {
  name: "Forbidden",
  components: {
    exception: Exception
  }
};
</script>

<style scoped></style>
