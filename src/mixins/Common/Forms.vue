<script>
export default {
  created() {
    this.initObjectApiFormErrors();
  },
  props: {
    form: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data: () => ({
    apiFormErrors: {},
    method: "POST"
  }),
  watch: {
    form: {
      handler() {
        let self = this;
        this._.each(this.apiFormErrors, (formError, k) => {
          self.apiFormErrors[k] = null;
        });
      },
      deep: true
    }
  },
  methods: {
    save(params) {
      let self = this;
      let message = this.$vuetify.lang.t("$vuetify.error_occured");
      return new Promise((resolve, reject) => {
        self.$store
          .dispatch("request", params)
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            if (err.response) {
              if (err.response.status === 400) {
                self.setApiFormErrors(err.response.data.errors.fields);
                message = self.$vuetify.lang.t("$vuetify.error_form");
              } else if (
                err.response.status === 403 ||
                err.response.status === 401
              ) {
                message = self.$vuetify.lang.t("$vuetify.error_denied");
              }
            }
            self.$store.dispatch("setNotification", {
              status: true,
              message: message
            });
            reject(err);
          });
      });
    },
    setForm(item) {
      let keys = Object.keys(this.form);
      let self = this;
      this._.each(item, (val, key) => {
        if (self._.includes(keys, key)) {
          if (self._.isObject(val)) {
            self.form[key] = val["id"];
          } else {
            self.form[key] = val;
          }
        }
      });
    },
    initObjectApiFormErrors() {
      let self = this;
      this._.each(this.form, (val, k) => {
        self.apiFormErrors[k] = null;
      });
    },
    setApiFormErrors(errors) {
      let self = this;
      let keys = this._.keys(errors);
      this._.forEach(keys, key => {
        // eslint-disable-next-line no-prototype-builtins
        if (self.apiFormErrors.hasOwnProperty(key)) {
          self.apiFormErrors[key] = errors[key];
        }
      });
    },
    validateSpecificFields: function(vuelidateForm, fields) {
      for (let i = 0; i < fields.length; i++) {
        if (!this._.has(vuelidateForm, fields[i])) return true;
        vuelidateForm[fields[i]].$touch();
        if (vuelidateForm[fields[i]].$invalid) return true;
      }
      return false;
    }
  }
};
</script>
