<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card class="pb-4">
    <v-card-title class="subtitle-1 font-weight-bold"
    >{{ $vuetify.lang.t("$vuetify.elector.list.title") }}
    </v-card-title>
    <v-divider></v-divider>
    <div class="mt-5 mx-5">
      <v-btn @click="newForm()" class="mr-2 my-2" depressed>
        <v-icon color="secondary" left>mdi-plus</v-icon>
        {{ $vuetify.lang.t("$vuetify.elector.btn.new.title") }}
      </v-btn>
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
        {{ $vuetify.lang.t("$vuetify.elector.btn.filter.title") }}
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
        {{ $vuetify.lang.t("$vuetify.elector.btn.excelFile.title") }}
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
            <v-chip class="chip-list" color="primary" text-color="white"
            >{{ item.matricule }}
            </v-chip>
          </td>
          <td class="subtitle-2">
            {{ item.name }}
          </td>
          <td class="subtitle-2">
            {{ $vuetify.lang.t("$vuetify.gender." + item.gender) }}
          </td>
          <td class="subtitle-2">
            {{ item.birthDate }}
          </td>
          <td class="subtitle-2">
            {{ item.birthPlace }}
          </td>
          <td class="subtitle-2">
            <template v-if="item === selectedItem">
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="editForm(item)"
                    color="primary"
                    icon
                    small
                    text
                    v-on="on"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>{{
                      $vuetify.lang.t("$vuetify.elector.btn.edit.title")
                    }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="showDetails(item)"
                    color="primary"
                    icon
                    small
                    text
                    v-on="on"
                  >
                    <v-icon>mdi-eye-outline</v-icon>
                  </v-btn>
                </template>
                <span>{{
                    $vuetify.lang.t("$vuetify.elector.btn.view.title")
                  }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="showUpload(item)"
                    color="primary"
                    icon
                    small
                    text
                    v-on="on"
                  >
                    <v-icon>mdi-google-photos</v-icon>
                  </v-btn>
                </template>
                <span>{{
                    $vuetify.lang.t("$vuetify.elector.btn.upload.title")
                  }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="showVoteOffice(item)"
                    color="primary"
                    icon
                    small
                    text
                    v-on="on"
                  >
                    <v-icon>mdi-bank</v-icon>
                  </v-btn>
                </template>
                <span>{{
                    $vuetify.lang.t("$vuetify.elector.btn.voteOffice.title2")
                  }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="showDelete(item)"
                    color="red accent-4"
                    icon
                    small
                    text
                    v-on="on"
                  >
                    <v-icon>mdi-delete-forever-outline</v-icon>
                  </v-btn>
                </template>
                <span>{{
                    $vuetify.lang.t("$vuetify.elector.btn.delete.tooltip")
                  }}</span>
              </v-tooltip>
            </template>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
    <elector-form
      :dialog="dialogForm"
      :form="form"
      @getItems="getItems"
      ref="electorForm"
    ></elector-form>
    <filter-form
      :dialog="dialogForm"
      :filter="filter"
      @performFilter="performFilter"
      ref="filterForm"
    ></filter-form>
    <delete-form
      :dialog="dialogForm"
      ref="deleteForm"
      @getItems="getItems"
    ></delete-form>
    <vote-office-form
      :dialog="dialogForm"
      :form="form"
      @getItems="getItems"
      ref="voteOfficeForm"
    ></vote-office-form>
    <detail-form :dialog="dialogForm" ref="detailForm"></detail-form>
    <upload-form :dialog="dialogForm" ref="uploadForm"></upload-form>
  </v-card>
</template>

<script>
  import ListMixin from "./../../mixins/Common/List.vue";
  import CONSTANTS from "../../helpers/Constants";
  import DeleteForm from "./DeleteForm";
  import FilterForm from "./Filter";
  import ElectorForm from "./Form";
  import DetailForm from "./Detail";
  import UploadForm from "./UploadForm";
  import VoteOfficeForm from "./VoteOfficeForm";
  import URLPath from "../../helpers/URL";
  import Utils from "../../helpers/Utils";

  export default {
    mixins: [ListMixin],
    data: () => ({
      sortBy: ["id"],
      loadingDownload: false,
      dialogForm: {
        title: "$vuetify.elector.new.title",
        shows: {
          showForm: false,
          showFilter: false,
          showInfo: false,
          showUpload: false,
          showDelete: false,
          voteOffice: false
        },
        saveBtnTitle: "$vuetify.btn.save",
        action: "create"
      },
      form: CONSTANTS.defaultElectorForm(),
      filter: CONSTANTS.defaultElectorForm(),
      itemsCategories: []
    }),
    created() {
      this.urlItems = URLPath.ELECTORS.LIST;
      this._search = this.buildSearchQuery();
    },
    methods: {
      setHeaders() {
        this.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.elector.cols.created.title"),
            value: "created",
            align: "start",
            sortable: true,
            width: "140",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.elector.cols.matricule.title"),
            value: "matricule",
            align: "start",
            sortable: true,
            width: "150",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.elector.cols.name.title2"),
            value: "name",
            align: "start",
            sortable: true,
            width: "150",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.elector.cols.gender.title2"),
            value: "gender",
            align: "start",
            sortable: true,
            width: "90",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.elector.cols.birthDate.title2"),
            value: "birthDate",
            align: "start",
            sortable: true,
            width: "140",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.elector.cols.birthPlace.title2"),
            value: "birthPlace",
            align: "start",
            sortable: true,
            width: "120",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.elector.cols.action.title"),
            value: null,
            sortable: false,
            width: "180"
          }
        ];
      },
      newForm() {
        this.form = CONSTANTS.defaultElectorForm();
        this.dialogForm.action = "create";
        this.$refs.electorForm.resetForm();
        this.dialogForm.title = "$vuetify.elector.new.title";
        this.dialogForm.saveBtnTitle = "$vuetify.btn.save";
        this.dialogForm.shows.showForm = true;
      },
      editForm(item) {
        this.$refs.electorForm.setForm(item);
        this.dialogForm.action = "edit";
        this.dialogForm.title = "$vuetify.elector.edit.title";
        this.dialogForm.saveBtnTitle = "$vuetify.btn.edit";
        this.dialogForm.shows.showForm = true;
      },
      showDetails(item) {
        this.$refs.detailForm.setForm(item);
        this.dialogForm.title = "$vuetify.elector.view.title";
        this.dialogForm.saveBtnTitle = "$vuetify.btn.save";
        this.dialogForm.shows.showInfo = true;
      },
      showFilter() {
        this.dialogForm.action = "filter";
        this.dialogForm.title = "$vuetify.elector.filter.title";
        this.dialogForm.saveBtnTitle = "$vuetify.elector.btn.filter.title";
        this.dialogForm.shows.showFilter = true;
      },
      showUpload(item) {
        this.$refs.uploadForm.setForm(item);
        this.dialogForm.action = "upload";
        this.dialogForm.title = "$vuetify.elector.upload.title";
        this.dialogForm.saveBtnTitle = "$vuetify.elector.btn.upload.title";
        this.dialogForm.shows.showUpload = true;
      },
      showVoteOffice(item) {
        this.$refs.voteOfficeForm.setForm(item);
        this.dialogForm.action = "voteOffice";
        this.dialogForm.title = "$vuetify.elector.voteOffice.title";
        this.dialogForm.saveBtnTitle = "$vuetify.elector.btn.voteOffice.title";
        this.dialogForm.shows.voteOffice = true;
      },
      showDelete(item) {
        this.$refs.deleteForm.setForm(item);
        this.dialogForm.title = this.$vuetify.lang.t(
          "$vuetify.elector.btn.delete.message"
        );
        this.dialogForm.saveBtnTitle = this.$vuetify.lang.t(
          "$vuetify.btn.confirm"
        );
        this.dialogForm.shows.showDelete = true;
      },
      buildSearchQuery() {
        let query = {};
        if (this.filter.phone) query["phone"] = this.filter.phone;
        if (this.filter.name) query["name"] = this.filter.name;
        if (this.filter.gender) query["gender"] = this.filter.gender;
        if (this.filter.surname) query["surname"] = this.filter.surname;
        if (this.filter.birthDate) query["birthDate"] = this.filter.birthDate;
        if (this.filter.birthPlace) query["birthPlace"] = this.filter.birthPlace;
        if (this.filter.localisation) query["localisation"] = this.filter.localisation;
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
          url: URLPath.ELECTORS.DOWNLOAD.URI,
          method: URLPath.ELECTORS.DOWNLOAD.METHOD,
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
            let fileName = "Electors";
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
      ElectorForm,
      FilterForm,
      DeleteForm,
      DetailForm,
      UploadForm,
      VoteOfficeForm
    }
  };
</script>
