<script>
export default {
  created() {
    this.setHeaders();
  },
  data: () => ({
    headers: [],
    items: [],
    meta: {},
    itemPerPage: 10,
    itemPerPageOptions: [5, 10, 30],
    urlItems: "",
    sortBy: "id",
    sortDesc: true,
    loading: {
      list: false,
      refresh: false
    },
    pagination: {},
    selectedItem: false,
    _search: {},
    _sorts: {}
  }),
  watch: {
    pagination: {
      handler() {
        this.getItems();
      },
      deep: true
    }
  },
  methods: {
    setHeaders() {
      this.headers = [];
    },
    refreshItems() {
      let self = this;
      this.loading.refresh = true;
      this.getItems()
        .then(() => {})
        .catch(() => {})
        .then(() => {
          self.loading.refresh = false;
        });
    },
    getItems() {
      let self = this;
      const { sortBy, sortDesc, page, itemsPerPage } = this.pagination;
      let params = {
        page: page,
        size: itemsPerPage,
        ordering: self.getSorts(sortBy, sortDesc)
      };
      if (!this._.isEmpty(this._search)) {
        params = { ...params, ...this._search };
      }
      return new Promise((resolve, reject) => {
        this.loading.list = true;
        self.$store
          .dispatch("request", {
            url: self.urlItems,
            params: params
          })
          .then(response => {
            let data = response.data;
            self.items = data.items;
            self.meta = data.meta;
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
            self.$store.dispatch("setNotification", {
              status: true,
              message: message
            });
            reject(err);
          })
          .then(() => {
            self.loading.list = false;
            resolve();
          });
      });
    },
    getSorts(sortBy, sortDesc) {
      let sorts = null;
      if (this._.has(sortBy, "length") && this._.has(sortDesc, "length")) {
        if (sortBy.length > 0 && sortDesc.length > 0) {
          sorts = "";
          if (sortDesc[0]) {
            sorts += "-" + sortBy[0];
          } else {
            sorts += sortBy[0];
          }
        }
      }
      return sorts;
    },
    selectItem(item) {
      this.selectedItem = item;
    },
    unSelectItem() {
      this.selectedItem = false;
    }
  }
};
</script>
