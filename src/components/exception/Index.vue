<template>
  <v-app id="exception">
    <v-main>
      <v-container fill-height fluid>
        <v-row align="center" align-content="center" justify="center">
          <div class="text-md-center">
            <h1>{{ title }}</h1>
            <h2 class="my-3 headline">{{ message }}</h2>
            <div>
              <v-btn @click="$router.go(-1)" color="primary"
                >{{ $vuetify.lang.t("$vuetify.exception.btn.back") }}
              </v-btn>
            </div>
          </div>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "Exception",
  props: ["title", "message"]
};
</script>

<style lang="css" scoped>
h1 {
  font-size: 150px;
  line-height: 150px;
  font-weight: 700;
  color: #252932;
  text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px,
    rgba(61, 61, 61, 0.3) 3px 3px;
}
</style>
