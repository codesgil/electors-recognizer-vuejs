<script>
export default {
  props: {
    dialog: {
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
    performFilter() {
      this.loadingBtn = true;
      this.$emit("performFilter");
    },
    closeDialog() {
      this.stopLoadingBtn();
      if (this.dialog["shows"]) {
        this.dialog["shows"]["showFilter"] = false;
      }
    },
    stopLoadingBtn() {
      this.loadingBtn = false;
    }
  }
};
</script>
