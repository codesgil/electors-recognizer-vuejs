<template>
  <v-dialog max-width="450" v-model="dialog.shows.showStatus">
    <v-card>
      <v-card-text>
        <div class="body-1 font-weight-bold">
          <br/>
          <h3>
            {{ $vuetify.lang.t(dialog.title) }}
          </h3>
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog.shows.showStatus = false" text>{{
          $vuetify.lang.t("$vuetify.btn.close")
          }}
        </v-btn>
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
  import CONSTANTS from "../../helpers/Constants";

  export default {
    mixins: [FormMixin],
    name: "Infos",
    props: {
      dialog: {
        type: Object,
        default: function () {
          return {
            title: "user.new.title",
            shows: {
              showStatus: false
            },
            saveBtnTitle: "$vuetify.btn.save",
            action: "create"
          };
        }
      },
      form: {
        type: Object,
        default: function () {
          return CONSTANTS.defaultUserForm();
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
            self.$store.dispatch("setNotification", {
              status: true,
              message: self.$vuetify.lang.t("$vuetify.success_form")
            });
          })
          .catch(() => {
          })
          .finally(() => {
            self.loadingBtn = false;
            self.dialog.shows.showStatus = false;
          });
      },
      setForm(item) {
        this.form["id"] = item.id;
        this.form.username = item.username;
        this.form.role = item.role;
        this.form.first_name = item.profile.first_name;
        this.form.email = item.profile.email;
        this.form.is_active = !item.is_active;
        this.form.phone = item.profile.phone;
        this.form.stat_attr_visibility = item.stat_attr_visibility;
        this.form.services_manager = item.services_manager;
        this.form.password = null;
        this.form.repeat_password = null;
      },
      getFormParam() {
        let params = {};
        params["url"] = URLPath.USER.EDIT.URI.replace(
          "{USER_ID}",
          this.form["id"]
        );
        let data = this._.omit(this.form, ["id"]);
        data = this.form.password ? data : this._.omit(data, ["password"]);
        params["data"] = data;
        params["method"] = URLPath.USER.EDIT.METHOD;
        return params;
      }
    }
  };
</script>
