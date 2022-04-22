<template>
  <v-app class="app">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" align-content="center" justify="center">
          <v-col cols="12" sm="12">
            <v-card
              :elevation="16"
              class="pt-3 mx-auto"
              max-width="450"
              width="450"
            >
              <v-card-title class="justify-center">
                <div class="font-weight-bold headline">
                  {{ $vuetify.lang.t("$vuetify.home.title") }}
                </div>
                <v-spacer></v-spacer>
                <v-icon
                  color="primary"
                  v-if="
                    $auth.check([
                      'ROLE_ADMIN',
                      'ROLE_SUPER_ADMIN',
                      'ROLE_SUPERVISOR'
                    ])
                  "
                  @click="routerPush"
                  class="mx-3"
                  >mdi-account-hard-hat
                </v-icon>
                <v-icon color="secondary" @click="logout">mdi-logout</v-icon>
              </v-card-title>
              <v-card-text>
                <v-btn class="ma-2" @click.prevent="startCamera('ACCESS')"
                  >{{ $vuetify.lang.t("$vuetify.home.btn.access") }}
                </v-btn>
                <v-btn class="mx-3" @click.prevent="startCamera('CONFIRM')"
                  >{{ $vuetify.lang.t("$vuetify.home.btn.confirm.title") }}
                </v-btn>
              </v-card-text>
            </v-card>
            <v-dialog v-model="dialog" width="500" persistent>
              <v-card>
                <v-card-title class="headline font-weight-bold"
                  >{{ $vuetify.lang.t("$vuetify.home.webcam.title") }}
                </v-card-title>
                <template v-if="img">
                  <img class="mx-2" :src="img" alt="" style="height:360px" />
                </template>
                <template v-else>
                  <vue-webcam
                    ref="webcam"
                    :device-id="deviceId"
                    :height="360"
                    width="100%"
                    @started="onStarted"
                    @stopped="onStopped"
                    @error="onError"
                    @cameras="onCameras"
                    @camera-change="onCameraChange"
                  >
                  </vue-webcam>
                  <v-select
                    class="ma-2"
                    :label="$vuetify.lang.t('$vuetify.home.webcam.device')"
                    :items="devices"
                    v-model="device"
                    item-value="deviceId"
                    item-text="label"
                  ></v-select>
                </template>
                <v-card-actions>
                  <v-btn color="primary" text @click="onCapture" v-if="!img"
                    >{{ $vuetify.lang.t("$vuetify.home.btn.capture") }}
                  </v-btn>
                  <template v-else>
                    <v-btn
                      color="primary"
                      @click="onSubmit"
                      :loading="loading"
                      :disabled="loading"
                      text
                      >{{ $vuetify.lang.t("$vuetify.home.btn.confirm.title2") }}
                    </v-btn>
                    <v-btn color="primary" text @click="retryRecord"
                      >{{ $vuetify.lang.t("$vuetify.home.btn.retry") }}
                    </v-btn>
                  </template>
                  <v-btn color="red" text @click="cancelRecord"
                    >{{ $vuetify.lang.t("$vuetify.home.btn.cancel") }}
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <result-form ref="resultForm"></result-form>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { WebCam } from "vue-web-cam";
import FormMixin from "../../mixins/Common/Forms";
import URLPath from "../../helpers/URL";
import ResultForm from "./Result";

export default {
  name: "Index",
  mixins: [FormMixin],
  components: {
    VueWebcam: WebCam,
    resultForm: ResultForm
  },
  data: () => ({
    dialog: false,
    loading: false,
    operation: null,
    img: null,
    camera: null,
    deviceId: null,
    devices: []
  }),
  computed: {
    device: function() {
      return this.devices.find(n => n.deviceId === this.deviceId);
    }
  },
  watch: {
    camera: function(id) {
      this.deviceId = id;
    },
    devices: function() {
      // Once we have a list select the first one
      const [first] = this.devices;
      if (first) {
        this.camera = first.deviceId;
        this.deviceId = first.deviceId;
      }
    }
  },
  methods: {
    onCapture() {
      this.img = this.$refs.webcam.capture();
    },
    // eslint-disable-next-line no-unused-vars
    onStarted(stream) {
      console.log("On Started Event");
    },
    // eslint-disable-next-line no-unused-vars
    onStopped(stream) {
      console.log("On Stopped Event");
    },
    onStop() {
      try {
        this.$refs.webcam.stop();
      }catch (e) {
        console.log(e);
      }
    },
    onStart() {
      this.img = null;
      setTimeout(() => {
        this.$refs.webcam.start();
      }, 5);
    },
    // eslint-disable-next-line no-unused-vars
    onError(error) {
      console.log("On Error Event");
    },
    onCameras(cameras) {
      this.devices = cameras;
      console.log("On Cameras Event");
    },
    onCameraChange(deviceId) {
      this.deviceId = deviceId;
      this.camera = deviceId;
    },
    startCamera(operation = "ACCESS") {
      this.dialog = true;
      this.operation = operation;
      setTimeout(this.onStart, 500);
    },
    retryRecord() {
      this.img = null;
      setTimeout(this.onStart, 600);
    },
    cancelRecord() {
      if (this.$refs.webcam) this.onStop();
      this.img = null;
      this.operation = null;
      this.dialog = false;
    },
    logout() {
      let self = this;
      this.$auth
        .logout()
        .then(() => {})
        .catch(error => {
          // eslint-disable-next-line no-prototype-builtins
          if (error.hasOwnProperty("response")) {
            if (
              !self._.has(error.response, "status") ||
              error.response.status !== 401
            ) {
              self.$store.dispatch("setNotification", {
                status: true,
                message: this.$vuetify.lang.t("$vuetify.error_occured")
              });
            } else {
              self.$router.push({ name: "login" });
            }
          }
        });
    },
    getFormParam() {
      const picture = this.img.replace(
        /^data:image\/(png|jpg|jpeg);base64,/,
        ""
      );
      return {
        url: URLPath.ELECTORS.UPLOAD.URI,
        method: URLPath.ELECTORS.UPLOAD.METHOD,
        data: {
          operation: this.operation,
          picture: picture
        }
      };
    },
    onSubmit() {
      this.loading = true;
      let self = this;
      this.save(this.getFormParam())
        .then(response => {
          this.$refs.resultForm.setResponse(response.data, this.operation);
          this.dialog = false;
          this.$refs.resultForm.enabledDialog();
        })
        .catch(error => {
          console.log(error);
          this.$refs.resultForm.setResponse({}, self.operation);
        })
        .finally(() => {
          self.loading = false;
        });
    },
    routerPush() {
      this.$router.open({ name: "users" });
    }
  }
};
</script>

<style scoped></style>
