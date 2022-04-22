<script>
export default {
  data: () => ({
    response: [],
    panels: {
      loading: false,
      claim: {
        total: 0,
        climbing: 0,
        notclimbed: 0,
        treaty: 0,
        untreated: 0
      }
    },
    form: {
      createdAt: {
        start: new Date(2020, 6, 1).toISOString().substr(0, 10),
        end: new Date().toISOString().substr(0, 10)
      },
      period: "day"
    },
    groups: [],
    sums: [],
    urlItems: "",
    calls: {}
  }),
  methods: {
    getStatistic() {
      let self = this;
      let params = this.buildSearchQuery();
      if (!this._.isEmpty(this.form.period))
        params["period"] = this.form.period;
      this.panels.loading = true;
      return new Promise((resolve, reject) => {
        self.$store
          .dispatch("request", {
            url: self.urlItems,
            params: params
          })
          .then(response => {
            this.response = response.data;
            self.panels.loading = false;
            self.panels.claim.total = self._.sumBy(response.data, "total");
            let filter = self._.filter(response.data, function(o) {
              return o.transferred === true && o.status === true;
            });
            self.panels.claim.treaty = self._.sumBy(filter, "total");
            filter = self._.filter(response.data, function(o) {
              return o.transferred === true && o.status === false;
            });
            self.panels.claim.untreated = self._.sumBy(filter, "total");
            filter = self._.filter(response.data, function(o) {
              return o.transferred === false;
            });
            self.panels.claim.notclimbed = self._.sumBy(filter, "total");
            self.panels.claim.climbing =
              self.panels.claim.treaty + self.panels.claim.untreated;
            resolve(response);
          })
          .catch(err => {
            let message = this.$vuetify.lang.t("$vuetify.error_occured");
            if (err.response) {
              if (err.response.status === 400) {
                message = self.$vuetify.lang.t("$vuetify.error_form");
              } else if (
                err.response.status === 403 ||
                err.response.status === 401
              ) {
                message = self.$vuetify.lang.t("$vuetify.error_denied");
              }
            }
            self.panels.loading = false;
            self.$store.dispatch("setNotification", {
              status: true,
              message: message
            });
            reject(err);
          });
      });
    },
    buildSearchQuery() {
      let query = {
        created_gte: this.$moment(this.form.createdAt.start)
          .add(0, "seconds")
          .add(0, "minutes")
          .add(0, "hours")
          .format("YYYY-MM-DD HH:mm:ss"),
        created_lte: this.$moment(this.form.createdAt.end)
          .add(59, "seconds")
          .add(59, "minutes")
          .add(23, "hours")
          .format("YYYY-MM-DD HH:mm:ss")
      };
      query["groups"] = this.groups.toString();
      return query;
    },
    _getLabels(key, datas = null) {
      let result = [];
      datas = datas ? datas : this.response;
      this._.forEach(datas, data => {
        result.push(data[key]);
      });
      result = this._.uniq(result);
      return result;
    },
    _getDates(data) {
      let dates = [];
      this._.forEach(data, value => {
        dates.push(value.date);
      });
      dates.sort((a, b) => new Date(a) - new Date(b));
      dates = this._.uniq(dates);
      return dates;
    }
  }
};
</script>

<style scoped></style>
