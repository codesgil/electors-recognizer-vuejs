<template>
  <v-dialog max-width="550" v-model="dialog.shows.showInfo">
    <v-card>
      <v-card-title>
        <div class="title">{{ $vuetify.lang.t(dialog.title) }}</div>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-list two-line>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-account-box-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.name }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.name.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-account-box-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.surname }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.surname.title") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-phone-outline</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.phone }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.phone.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-gender-male-female</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                <template v-if="form.gender">
                  {{ $vuetify.lang.t("$vuetify.gender." + form.gender) }}
                </template>
                <template v-else> -</template>
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.gender.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-calendar</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.birthDate }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.birthDate.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-google-maps</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.birthPlace }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.birthPlace.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-google-maps</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                {{ form.localisation }}
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.localisation.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="secondary">mdi-bank</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title class="body-1">
                <template v-if="form.voteOffice">
                  {{ form.voteOffice.name }}
                </template>
                <template v-else> - </template>
              </v-list-item-title>
              <v-list-item-subtitle
              >{{ $vuetify.lang.t("$vuetify.elector.cols.voteOffice.title2") }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>
        <div class="body-1 my-2 ma-5 font-weight-bold">{{ $vuetify.lang.t("$vuetify.elector.cols.picture.title") }}
        </div>
        <v-carousel :height="300" v-if="!_.isEmpty(pictures)">
          <v-carousel-item
            v-for="(picture,i) in pictures"
            :key="i"
            :src="picture"
            reverse-transition="fade-transition"
            transition="fade-transition"
          >
            <div class="title">
              <v-icon color="red" dark @click.stop="removePictures(picture)">mdi-delete-forever-outline</v-icon>
            </div>
          </v-carousel-item>
        </v-carousel>
        <template v-else>
          <div class="body-1">{{ $vuetify.lang.t("$vuetify.elector.cols.picture.title2") }}</div>
        </template>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog.shows.showInfo = false" text
        >{{ $vuetify.lang.t("$vuetify.btn.close") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import CONSTANTS from "../../helpers/Constants";
  import URLPath from "../../helpers/URL";

  export default {
    props: {
      dialog: {
        type: Object,
        default: function () {
          return {
            title: "$vuetify.elector.view.title",
            show: {
              showInfo: false
            },
            saveBtnTitle: "$vuetify.btn.save",
            action: "detail"
          };
        }
      },
      form: {
        type: Object,
        default: function () {
          return CONSTANTS.defaultElectorForm();
        }
      }
    },
    data: () => ({
      isLoading: false,
      pictures: []
    }),
    methods: {
      setForm(item) {
        this.form["id"] = item.id;
        this.form.name = item.name;
        this.form.phone = item.phone;
        this.form.gender = item.gender;
        this.form.birthDate = item.birthDate;
        this.form.birthPlace = item.birthPlace;
        this.form.localisation = item.localisation;
        this.form.voteOffice = item.voteOffice;
        this.getPictures();
      },
      getPictures() {
        this.pictures = [];
        this.$store
          .dispatch("request", this.getFormParam())
          .then(r => {
            const self = this;
            r.data.forEach(pic => {
              let picture = document
                .getElementsByTagName("BODY")[0]
                .getAttribute("base-uri") + pic;
              self.pictures.push(picture);
            });
          })
      },
      removePictures(path) {
        this.$store
          .dispatch("request", this.getFormParam("delete", path))
          .then(() => {
            this.getPictures();
            let message = self.$vuetify.lang.t("$vuetify.delete_form");
            this.$store.dispatch("setNotification", {
              status: true,
              message: message
            });
          })
      },
      getFormParam(action = 'default', path = null) {
        let params = {};
        switch (action) {
          case "default":
            params["url"] = URLPath.ELECTORS.PICTURE.URI.replace(
              "{ELECTORS_ID}",
              this.form["id"]
            );
            var data = this._.omit(this.form, ["id", "created"]);
            params["data"] = data;
            params["method"] = URLPath.ELECTORS.PICTURE.METHOD;
            break;
          case "delete":
            params["url"] = URLPath.ELECTORS.PICTURE.URI.replace(
              "{ELECTORS_ID}",
              this.form["id"]
            );
            params["method"] = URLPath.ELECTORS.PICTURE.METHOD2;
            params["data"] = {path: path};
            break;
        }
        return params;
      },
    }
  };
</script>

<style scoped></style>
