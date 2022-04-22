<template>
  <v-dialog max-width="500" v-model="dialog.shows.showUpload">
    <v-card>
      <v-card-title class="headline font-weight-bold">{{ $vuetify.lang.t("$vuetify.elector.upload.title", [form.name]) }}
      </v-card-title>
      <template v-if="img">
        <img class="mx-2" :src="img" alt="" style="height:360px"/>
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
        <v-select class="ma-2" :label="$vuetify.lang.t('$vuetify.home.webcam.device')" :items="devices"
                  v-model="device" item-value="deviceId" item-text="label"></v-select>
      </template>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" text @click="onCapture" v-if="!img">{{
          $vuetify.lang.t("$vuetify.home.btn.capture") }}
        </v-btn>
        <template v-else>
          <v-btn color="primary" @click="onSubmit" :loading="loadingBtn" :disabled="loadingBtn" text>{{
            $vuetify.lang.t("$vuetify.home.btn.confirm.title2") }}
          </v-btn>
          <v-btn color="primary" text @click="retryRecord">{{ $vuetify.lang.t("$vuetify.home.btn.retry") }}
          </v-btn>
        </template>
        <v-btn color="red" text @click="cancelRecord">{{ $vuetify.lang.t("$vuetify.home.btn.cancel") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import URLPath from "../../helpers/URL";
  import FormMixin from "../../mixins/Common/Forms";
  import {WebCam} from "vue-web-cam";

  export default {
    mixins: [FormMixin],
    components: {
      VueWebcam: WebCam,
    },
    props: {
      dialog: {
        type: Object,
        default: function () {
          return {
            shows: {
              showUpload: false
            },
          };
        }
      },
      form: {
        type: Object,
        default: function () {
          return {
            name: null
          };
        }
      }
    },
    data: () => ({
      loadingBtn: false,
      operation: null,
      img: null,
      camera: null,
      deviceId: null,
      devices: []
    }),
    computed: {
      device: function () {
        return this.devices.find(n => n.deviceId === this.deviceId);
      }
    },
    watch: {
      camera: function (id) {
        this.deviceId = id;
      },
      devices: function () {
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
      onStarted(stream) {
        console.log("On Started Event", stream);
      },
      onStopped(stream) {
        console.log("On Stopped Event", stream);
      },
      onStop() {
        this.$refs.webcam.stop();
      },
      onStart() {
        this.$refs.webcam.start();
      },
      onError(error) {
        console.log("On Error Event", error);
      },
      onCameras(cameras) {
        this.devices = cameras;
        console.log("On Cameras Event", cameras);
      },
      onCameraChange(deviceId) {
        this.deviceId = deviceId;
        this.camera = deviceId;
        console.log("On Camera Change Event", deviceId);
      },
      startCamera(operation = "ACCESS") {
        this.dialog.shows.showUpload = true;
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
        this.dialog.shows.showUpload = false;
      },
      onSubmit() {
        let self = this;
        this.loadingBtn = true;
        this.save(this.getFormParam())
          .then(() => {
            this.$emit("getItems");
            let message = self.$vuetify.lang.t("$vuetify.success_form");
            self.$store.dispatch("setNotification", {
              status: true,
              message: message
            });
            this.resetForm();
          })
          .catch(() => {
          })
          .finally(() => {
            self.loadingBtn = false;
            self.dialog.shows.showUpload = false;
          });
      },
      setForm(item) {
        console.log("item :", item);
        this.form["id"] = item.id;
        this.form["name"] = item.name;
        this.startCamera();
      },
      resetForm() {
        this.img = null;
      },
      getFormParam() {
        const picture = this.img.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
        return {
          url: URLPath.ELECTORS.UPLOAD.URI2.replace("{ELECTORS_ID}", this.form["id"]),
          method: URLPath.ELECTORS.UPLOAD.METHOD,
          data: {
            picture: picture
          }
        };
      }
    }
  };
</script>
