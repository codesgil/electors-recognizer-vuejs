<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card class="pb-4">
    <v-card-title class="subtitle-1 font-weight-bold"
    >{{ $vuetify.lang.t("$vuetify.user.list.title") }}
    </v-card-title>
    <v-divider></v-divider>
    <div class="mt-5 mx-5">
      <v-btn @click="newForm()" class="mr-2 my-2" depressed>
        <v-icon color="secondary" left>mdi-plus</v-icon>
        {{ $vuetify.lang.t("$vuetify.user.btn.new.title") }}
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
            <template v-if="item.last_login">
              {{ $moment(item.last_login).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </td>
          <td class="subtitle-2">
            {{ item.username }}
          </td>
          <td class="subtitle-2">
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <template v-if="item.is_active">
                  <v-icon
                    @click="multiDialog(item)"
                    class="pointer"
                    color="teal accent-4"
                    dark
                    v-on="on"
                  >mdi-check-circle-outline
                  </v-icon>
                </template>
                <template v-else>
                  <v-icon
                    @click="multiDialog(item)"
                    class="pointer"
                    color="red accent-4"
                    dark
                    v-on="on"
                  >mdi-close-circle-outline
                  </v-icon>
                </template>
              </template>
              <span v-if="item.is_active">{{
                  $vuetify.lang.t("$vuetify.user.cols.enabled.disable.title")
                }}</span>
              <span v-else>{{
                  $vuetify.lang.t("$vuetify.user.cols.enabled.enable.title")
                }}</span>
            </v-tooltip>
          </td>
          <td class="subtitle-2">
            <v-chip
              :color="getRoleColor(item.role)"
              class="chip-list"
              text-color="white"
            >{{ $vuetify.lang.t("$vuetify.roles." + item.role) }}
            </v-chip>
          </td>
          <td class="subtitle-2">
            {{ item.profile.first_name }}
          </td>
          <td class="subtitle-2">
            <template v-if="item.created_at">
              {{ $moment(item.created_at).format("YYYY-MM-DD HH:mm:ss") }}
            </template>
          </td>
          <td class="subtitle-2">
            <template v-if="item === selectedItem">
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
                    $vuetify.lang.t("$vuetify.user.btn.edit.title")
                  }}</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="secondary"
                    icon
                    small
                    @click="showDetails(item)"
                    text
                    v-on="on"
                  >
                    <v-icon>mdi-eye-outline</v-icon>
                  </v-btn>
                </template>
                <span>{{
                    $vuetify.lang.t("$vuetify.user.btn.view.title")
                  }}</span>
              </v-tooltip>
              <v-tooltip top v-if="$auth.check(['ROLE_SUPERVISOR'])">
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
                    $vuetify.lang.t("$vuetify.user.btn.voteOffice.title2")
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
                    $vuetify.lang.t("$vuetify.user.btn.delete.tooltip")
                  }}</span>
              </v-tooltip>
            </template>
          </td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
    <user-form
      :dialog="dialogForm"
      :form="form"
      @getItems="getItems"
      ref="userForm"
    ></user-form>
    <filter-form
      :dialog="dialogForm"
      :filter="filter"
      @performFilter="performFilter"
      ref="filterForm"
    ></filter-form>
    <status-form :dialog="dialogForm" @getItems="getItems" ref="statusForm">
    </status-form>
    <detail-form :dialog="dialogForm" ref="detailForm"></detail-form>
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
  import StatusForm from "./StatusForm";
  import FilterForm from "./Filter";
  import UserForm from "./Form";
  import DetailForm from "./Detail";
  import DeleteForm from "./DeleteForm";
  import VoteOfficeForm from "./VoteOfficeForm";
  import URLPath from "../../helpers/URL";

  export default {
    mixins: [ListMixin],
    data: () => ({
      sortBy: ["id"],
      dialogForm: {
        title: "$vuetify.user.new.title",
        shows: {
          showForm: false,
          showFilter: false,
          showStatus: false,
          showDelete: false,
          showInfo: false,
          voteOffice: false
        },
        saveBtnTitle: "$vuetify.btn.save",
        action: "create"
      },
      form: CONSTANTS.defaultUserForm(),
      filter: CONSTANTS.defaultUserForm()
    }),
    created() {
      this.urlItems = URLPath.USER.LIST;
      this._search = this.buildSearchQuery();
    },
    methods: {
      setHeaders() {
        this.headers = [
          {
            text: this.$vuetify.lang.t("$vuetify.user.cols.last_login.title"),
            value: "last_login",
            align: "start",
            sortable: true,
            width: "130",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.user.cols.username.title2"),
            value: "username",
            align: "start",
            sortable: true,
            width: "120",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.user.cols.enabled.title"),
            value: "is_active",
            align: "start",
            sortable: true,
            width: "70",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.user.cols.role.title2"),
            value: "role",
            align: "start",
            sortable: true,
            width: "100",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.user.cols.first_name.title2"),
            value: "first_name",
            align: "start",
            sortable: true,
            width: "120",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.user.cols.created.title"),
            value: "created_at",
            align: "start",
            sortable: true,
            width: "120",
            class: "grey--text text--darken-3"
          },
          {
            text: this.$vuetify.lang.t("$vuetify.user.cols.action.title"),
            value: null,
            sortable: false,
            width: "140"
          }
        ];
      },
      newForm() {
        this.form = CONSTANTS.defaultUserForm();
        this.$refs.userForm.resetForm();
        this.dialogForm.title = "$vuetify.user.new.title";
        this.dialogForm.saveBtnTitle = "$vuetify.btn.save";
        this.dialogForm.shows.showForm = true;
        this.dialogForm.action = "create";
      },
      editForm(item) {
        this.$refs.userForm.setForm(item);
        this.dialogForm.title = "$vuetify.user.edit.title";
        this.dialogForm.saveBtnTitle = "$vuetify.btn.edit";
        this.dialogForm.shows.showForm = true;
        this.dialogForm.action = "edit";
      },
      showDetails(item) {
        this.$refs.detailForm.setForm(item);
        this.dialogForm.title = "$vuetify.user.view.title";
        this.dialogForm.saveBtnTitle = "$vuetify.btn.save";
        this.dialogForm.shows.showInfo = true;
      },
      showFilter() {
        this.dialogForm.action = "filter";
        this.dialogForm.title = "$vuetify.user.filter.title";
        this.dialogForm.saveBtnTitle = "$vuetify.user.btn.filter.title";
        this.dialogForm.shows.showFilter = true;
      },
      showDelete(item) {
        this.$refs.deleteForm.setForm(item);
        this.dialogForm.title = this.$vuetify.lang.t(
          "$vuetify.user.btn.delete.message"
        );
        this.dialogForm.saveBtnTitle = this.$vuetify.lang.t(
          "$vuetify.btn.confirm"
        );
        this.dialogForm.shows.showDelete = true;
      },
      buildSearchQuery() {
        let query = {};
        if (this.$auth.user() && this.$auth.user().role === "ROLE_SUPERVISOR") {
          query["role"] = "ROLE_USER";
        } else {
          if (this.filter.role) query["role"] = this.filter.role;
        }
        if (this.filter.username) query["username"] = this.filter.username;
        if (!this._.isNull(this.filter.is_active))
          query["is_active"] = this.filter.is_active;
        if (this.filter.first_name) query["first_name"] = this.filter.first_name;

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
      multiDialog(item) {
        this.$refs.statusForm.setForm(item);
        if (!item.is_active) {
          this.dialogForm.title = "$vuetify.user.cols.enabled.enable.message";
          this.dialogForm.saveBtnTitle = "$vuetify.btn.edit";
        } else {
          this.dialogForm.title = "$vuetify.user.cols.enabled.disable.message";
          this.dialogForm.saveBtnTitle = "$vuetify.btn.edit";
        }
        this.dialogForm.shows.showStatus = true;
      },
      getRoleColor(role) {
        switch (role) {
          case "ROLE_SUPER_ADMIN":
            return "teal accent-4";
          case "ROLE_ADMIN":
            return "teal accent-4";
          case "ROLE_SUPERVISOR":
            return "secondary";
          default:
            return "orange accent-4";
        }
      },
      showVoteOffice(item) {
        this.$refs.voteOfficeForm.setForm(item);
        this.dialogForm.action = "voteOffice";
        this.dialogForm.title = "$vuetify.elector.voteOffice.title";
        this.dialogForm.saveBtnTitle = "$vuetify.elector.btn.voteOffice.title";
        this.dialogForm.shows.voteOffice = true;
      }
    },
    components: {
      StatusForm,
      UserForm,
      FilterForm,
      DetailForm,
      DeleteForm,
      VoteOfficeForm
    }
  };
</script>
