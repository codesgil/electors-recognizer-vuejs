<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card class="pb-4">
    <v-card-title class="subtitle-1 font-weight-bold"
    >{{ $vuetify.lang.t("$vuetify.vote.list.title") }}
    </v-card-title>
    <v-divider></v-divider>
    <div class="mt-5 mx-5">
      <v-btn
        :loading="loading.refresh"
        @click="refreshItems()"
        class="mr-2 my-2"
        depressed
      >
        <v-icon color="secondary" left>mdi-refresh</v-icon>
        {{ $vuetify.lang.t("$vuetify.btn.refresh") }}
      </v-btn>
      <v-btn @click="showFilter()" class="mr-2 my-2" depressed>
        <v-icon color="secondary" left>mdi-filter-outline</v-icon>
        {{ $vuetify.lang.t("$vuetify.vote.btn.filter.title") }}
      </v-btn>
      <v-btn
        :loading="loadingDownload"
        @click="download()"
        class="mr-2 my-2"
        depressed
        v-if="
          $auth.check(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_SUPERVISOR'])
        "
        :disabled="_.isEmpty(items)"
      >
        <v-icon color="secondary" left>mdi-file-excel</v-icon>
        {{ $vuetify.lang.t("$vuetify.vote.btn.excelFile.title") }}
      </v-btn>
    </div>
    <v-data-table
      :footer-props="{
        'items-per-page-options': itemPerPageOptions
      }"
      :headers="headers"
      :items="items"
      :items-per-page="itemPerPage"
      :loading="loading.list"
      :options.sync="pagination"
      :server-items-length="meta.total"
      :sort-by="sortBy"
      :sort-desc="sortDesc"
      class="mt-5"
    >
      <template v-slot:body="{ items }">
        <tbody>
        <tr
          :key="item.id"
          @mouseleave="unSelectItem()"
          @mouseover="selectItem(item)"
          v-for="item in items"
        >
          <td class="subtitle-2">
            <template v-if="item.created">
              {{ $moment(item.created).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </td>
          <td class="subtitle-2">
            {{ item.elector.matricule }}
          </td>
          <td class="subtitle-2">
            {{ item.elector.name }}
          </td>
          <td class="subtitle-2">
            {{ item.campaign.name }}
          </td>
          <td class="subtitle-2">
            <template v-if="item.voted">
              <v-icon class="pointer" color="teal accent-4" dark
              >mdi-check-circle-outline
              </v-icon>
            </template>
            <template v-else>
              <v-icon class="pointer" color="red accent-4" dark
              >mdi-close-circle-outline
              </v-icon>
            </template>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
    <filter-form
      :dialog="dialogForm"
      :filter="filter"
      @performFilter="performFilter"
      ref="filterForm"
    ></filter-form>
  </v-card>
</template>

<script>
  import ListMixin from "./../../mixins/Common/List.vue";
  import CONSTANTS from "../../helpers/Constants";
  import URLPath from "../../helpers/URL";
  import Utils from "../../helpers/Utils";
  import FilterForm from "./Filter";

  export default {
    mixins: [ListMixin],
    data: () => ({
      sortBy: ["id"],
      loadingDownload: false,
      dialogForm: {
        title: "$vuetify.vote.filter.title",
        shows: {
          showFilter: false
        },
        saveBtnTitle: "$vuetify.btn.save",
        action: "filter"
      },
      filter: CONSTANTS.defaultVoteForm()
    }),
    created() {
      this.urlItems = URLPath.VOTE.LIST;
      this._search = this.buildSearchQuery();
    },
    methods: {
      setHeaders() {
        this.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.vote.cols.created.title"),
            value: "created",
            align: "start",
            sortable: true,
            width: "140",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.vote.cols.elector.title2"),
            value: "e_mat",
            align: "start",
            sortable: true,
            width: "150",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.vote.cols.elector.title"),
            value: "e_name",
            align: "start",
            sortable: true,
            width: "190",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.vote.cols.campaign.title"),
            value: "campaign",
            align: "start",
            sortable: true,
            width: "190",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.vote.cols.voted.title"),
            value: "voted",
            align: "start",
            sortable: true,
            width: "120",
            class: "grey--text text--darken-3"
          }
        ];
      },
      showFilter() {
        this.dialogForm.action = "filter";
        this.dialogForm.title = "$vuetify.vote.filter.title";
        this.dialogForm.saveBtnTitle = "$vuetify.vote.btn.filter.title";
        this.dialogForm.shows.showFilter = true;
      },
      buildSearchQuery() {
        let query = {};
        if (this.filter.electorName) query["e_name"] = this.filter.electorName;
        if (this.filter.electorMatricule) query["e_mat"] = this.filter.electorMatricule;
        if (this.filter.campaign) query["campaign"] = this.filter.campaign;
        if (this.filter.voted) query["voted"] = this.filter.voted;
        else if (this.filter.voted === false) query["voted"] = this.filter.voted;
        if (this.filter.created.start) {
          query["created_gte"] = this.$moment(this.filter.created.start)
            .add(0, "seconds")
            .add(0, "minutes")
            .add(0, "hours")
            .format("YYYY-MM-DD HH:mm:ss");
        }
        if (this.filter.created.end) {
          query["created_lte"] = this.$moment(this.filter.created.end)
            .add(59, "seconds")
            .add(59, "minutes")
            .add(23, "hours")
            .format("YYYY-MM-DD HH:mm:ss");
        }
        return query;
      },
      performFilter() {
        this._search = this.buildSearchQuery();
        let self = this;
        this.getItems()
          .then(() => {
            self.$refs.filterForm.closeDialog();
          })
          .finally(() => {
            self.$refs.filterForm.stopLoadingBtn();
          });
      },
      download() {
        let query = this.buildSearchQuery();
        this.loadingDownload = true;
        let data = {
          url: URLPath.VOTE.DOWNLOAD.URI,
          method: URLPath.VOTE.DOWNLOAD.METHOD,
          responseType: "blob",
          params: query
        };
        this.getFile(data);
      },
      getFile(data) {
        let self = this;
        this.$store
          .dispatch("request", data)
          .then(response => {
            let contentDisposition = response.request.getResponseHeader(
              "Content-Disposition"
            );
            let fileName = "votes";
            if (contentDisposition) {
              const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
              if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
            }
            let blob = new Blob([response.data], {type: response.data.type});
            Utils.saveAsFile(blob, fileName);
          })
          .catch(() => {
            self.$store.dispatch("setNotification", {
              status: true,
              message: this.$vuetify.lang.t("$vuetify.error_occured")
            });
          })
          .finally(() => {
            self.loadingDownload = false;
          });
      }
    },
    components: {
      FilterForm
    }
  };
</script>
