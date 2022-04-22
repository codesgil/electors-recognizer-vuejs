<template>
  <v-dialog max-width="300" v-model="dialog.shows.showDelete">
    <v-card>
      <v-card-text>
        <div class="body-1 font-weight-bold">
          <br />
          <h4>
            {{ $vuetify.lang.t(dialog.title) }}
          </h4>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog.shows.showDelete = false" text>{{
          $vuetify.lang.t("$vuetify.btn.close")
        }}</v-btn>
        <v-btn :loading="loadingBtn" @click="sendForm" color="secondary" text
          >{{ $vuetify.lang.t(dialog.saveBtnTitle) }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import URLPath from "../../helpers/URL";
import FormMixin from "../../mixins/Common/Forms";

export default {
  mixins: [FormMixin],
  props: {
    dialog: {
      type: Object,
      default: function() {
        return {};
      }
    },
    form: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data: () => ({
    loadingBtn: false
  }),
  methods: {
    sendForm() {
      let self = this;
      this.loadingBtn = true;
      this.save(this.getFormParam())
        .then(() => {
          this.$emit("getItems");
          let message = self.$vuetify.lang.t("$vuetify.delete_form");
          self.$store.dispatch("setNotification", {
            status: true,
            message: message
          });
        })
        .catch(() => {})
        .finally(() => {
          self.loadingBtn = false;
          self.dialog.shows.showDelete = false;
        });
    },
    setForm(item) {
      this.form["id"] = item.id;
    },
    getFormParam() {
      return {
        url: URLPath.VOTE_OFFICE.DELETE.URI.replace(
          "{VOTE_OFFICE_ID}",
          this.form["id"]
        ),
        method: URLPath.VOTE_OFFICE.DELETE.METHOD
      };
    }
  }
};
</script>
