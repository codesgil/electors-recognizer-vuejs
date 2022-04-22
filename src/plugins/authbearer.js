export default {
  request: function(req, token) {
    if (typeof token !== "undefined") {
      let tokens = JSON.parse(token);
      this.options.http.setHeaders.call(this, req, {
        Authorization: "Bearer " + tokens.access
      });
    }
  },

  response: function(res) {
    if (res.data) {
      // return token and refresh token
      if (res.data.access && res.data.refresh) return JSON.stringify(res.data);
    }
  }
};
