let URLPath = {
  SECURITY: {
    LOGIN: {
      URI: "/api/v1/login",
      METHOD: "POST"
    },
    LOGOUT: {
      URI: "/api/v1/logout",
      METHOD: "POST"
    },
    ME: {
      URI: "/api/v1/users/me",
      METHOD: "GET"
    },
    REFRESH: {
      URI: "/api/v1/refresh-token",
      METHOD: "POST"
    }
  },
  USER: {
    LIST: "/api/v1/users",
    CREATE: {
      URI: "/api/v1/users",
      METHOD: "POST"
    },
    EDIT: {
      URI: "/api/v1/users/{USER_ID}",
      METHOD: "PUT"
    },
    UNIQUE_USERNAME: {
      URI: "/api/v1/users/username/exists",
      METHOD: "POST"
    },
    DELETE: {
      URI: "/api/v1/users/{USER_ID}",
      METHOD: "DELETE"
    },
    VOTE_OFFICE: {
      URI: "/api/v1/users/{USER_ID}/vote-office",
      METHOD: "PUT",
    }
  },
  ELECTORS: {
    LIST: "/api/v1/electors",
    UPLOAD: {
      URI: "/api/v1/electors/upload",
      URI2: "/api/v1/electors/{ELECTORS_ID}/picture",
      METHOD: "POST"
    },
    MATRICULE: {
      URI: "/api/v1/electors/matricule",
      METHOD: "GET"
    },
    CREATE: {
      URI: "/api/v1/electors",
      METHOD: "POST"
    },
    EDIT: {
      URI: "/api/v1/electors/{ELECTORS_ID}",
      METHOD: "PUT"
    },
    DELETE: {
      URI: "/api/v1/electors/{ELECTORS_ID}",
      METHOD: "DELETE"
    },
    DOWNLOAD: {
      URI: "/api/v1/electors/export",
      METHOD: "GET"
    },
    PICTURE: {
      URI: "/api/v1/electors/{ELECTORS_ID}/pictures",
      METHOD: "GET",
      METHOD2: "DELETE",
    },
    VOTE_OFFICE: {
      URI: "/api/v1/electors/{ELECTORS_ID}/vote-office",
      METHOD: "PUT",
    }
  },
  CAMPAIGN: {
    LIST: "/api/v1/campaigns",
    CREATE: {
      URI: "/api/v1/campaigns",
      METHOD: "POST"
    },
    EDIT: {
      URI: "/api/v1/campaigns/{CAMPAIGN_ID}",
      METHOD: "PUT"
    },
    DELETE: {
      URI: "/api/v1/campaigns/{CAMPAIGN_ID}",
      METHOD: "DELETE"
    }
  },
  VOTE: {
    LIST: "/api/v1/votes",
    DOWNLOAD: {
      URI: "/api/v1/votes/export",
      METHOD: "GET"
    },

    HAS: {
      URI: "/api/v1/votes/has-vote",
      METHOD: "POST"
    },
    MARK: {
      URI: "/api/v1/votes/mark-vote",
      METHOD: "POST"
    }
  },
  VOTE_OFFICE: {
    LIST: "/api/v1/votes-offices",
    CREATE: {
      URI: "/api/v1/votes-offices",
      METHOD: "POST"
    },
    EDIT: {
      URI: "/api/v1/votes-offices/{VOTE_OFFICE_ID}",
      METHOD: "PUT"
    },
    DELETE: {
      URI: "/api/v1/votes-offices/{VOTE_OFFICE_ID}",
      METHOD: "DELETE"
    }
  }
};

export default URLPath;
