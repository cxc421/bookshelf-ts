function proxy(app) {
  // add the redirect handler here
  app.get(/\/$/, (_req, res) => {
    res.redirect("/discover");
  });
}

module.exports = proxy;
