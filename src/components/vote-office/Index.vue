<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card class="pb-4">
    <v-card-title class="subtitle-1 font-weight-bold"
    >{{ $vuetify.lang.t("$vuetify.voteOffice.list.title") }}
    </v-card-title>
    <v-divider></v-divider>
    <div class="mt-5 mx-5">
      <v-btn @click="newForm()" v-if="
              $auth.check(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'])
            " class="mr-2 my-2" depressed>
        <v-icon color="secondary" left>mdi-plus</v-icon>
        {{ $vuetify.lang.t("$vuetify.voteOffice.btn.new.title") }}
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
            {{ item.name }}
          </td>
          <td class="subtitle-2">
            <template v-if="item.enabled">
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
          <td class="subtitle-2">
            <template v-if="item === selectedItem">
              <template v-if="
              $auth.check(['ROLE_ADMIN', 'ROLE_SUPER_ADMIN'])
            ">
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      @click="editForm(item)"
                      color="secondary"
                      icon
                      small
                      text
                      v-on="on"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>{{
                    $vuetify.lang.t("$vuetify.voteOffice.btn.edit.title")
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
                    $vuetify.lang.t("$vuetify.voteOffice.btn.delete.tooltip")
                  }}</span>
                </v-tooltip>
              </template>

            </template>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
    <vote-office-form
      :dialog="dialogForm"
      :form="form"
      @getItems="getItems"
      ref="voteOfficeForm"
    ></vote-office-form>
    <delete-form
      :dialog="dialogForm"
      ref="deleteForm"
      @getItems="getItems"
    ></delete-form>
  </v-card>
</template>

<script>
  import ListMixin from "./../../mixins/Common/List.vue";
  import CONSTANTS from "../../helpers/Constants";
  import DeleteForm from "./DeleteForm";
  import voteOfficeForm from "./Form";
  import URLPath from "../../helpers/URL";

  export default {
    mixins: [ListMixin],
    data: () => ({
      sortBy: ["id"],
      loadingDownload: false,
      dialogForm: {
        title: "$vuetify.voteOffice.new.title",
        shows: {
          showForm: false,
          showDelete: false
        },
        saveBtnTitle: "$vuetify.btn.save",
        action: "create"
      },
      form: CONSTANTS.defaultVoteOfficeForm()
    }),
    created() {
      this.urlItems = URLPath.VOTE_OFFICE.LIST;
      this._search = this.buildSearchQuery();
    },
    methods: {
      setHeaders() {
        this.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.voteOffice.cols.created.title"),
            value: "created",
            align: "start",
            sortable: true,
            width: "140",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.voteOffice.cols.name.title2"),
            value: "name",
            align: "start",
            sortable: true,
            width: "250",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.voteOffice.cols.enabled.title"),
            value: "enabled",
            align: "start",
            sortable: true,
            width: "120",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.voteOffice.cols.action.title"),
            value: null,
            sortable: false,
            width: "120"
          }
        ];
      },
      newForm() {
        this.form = CONSTANTS.defaultVoteOfficeForm();
        this.dialogForm.action = "create";
        this.$refs.voteOfficeForm.resetForm();
        this.dialogForm.title = "$vuetify.voteOffice.new.title";
        this.dialogForm.saveBtnTitle = "$vuetify.btn.save";
        this.dialogForm.shows.showForm = true;
      },
      editForm(item) {
        this.$refs.voteOfficeForm.setForm(item);
        this.dialogForm.action = "edit";
        this.dialogForm.title = "$vuetify.voteOffice.edit.title";
        this.dialogForm.saveBtnTitle = "$vuetify.btn.edit";
        this.dialogForm.shows.showForm = true;
      },
      showDelete(item) {
        this.$refs.deleteForm.setForm(item);
        this.dialogForm.title = this.$vuetify.lang.t(
          "$vuetify.voteOffice.btn.delete.message"
        );
        this.dialogForm.saveBtnTitle = this.$vuetify.lang.t(
          "$vuetify.btn.confirm"
        );
        this.dialogForm.shows.showDelete = true;
      },
      buildSearchQuery() {
        return {};
      }
    },
    components: {
      voteOfficeForm,
      DeleteForm
    }
  };
</script>
