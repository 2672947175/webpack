module.exports = {
  devServer: {
    before(app) {
      app.get('/s');
    },
  },
};
