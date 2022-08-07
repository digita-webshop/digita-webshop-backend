const controller = require("./controller");

module.exports = new (class extends controller {
  async dashboard(req, res) {
    res.send("admin dashboard");
  }
})();
