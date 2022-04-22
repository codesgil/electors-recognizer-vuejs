module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "static/" : "/",
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true,
    // host: "192.168.100.241",
    port: 8085
  },
  transpileDependencies: ["vuetify"]
};
