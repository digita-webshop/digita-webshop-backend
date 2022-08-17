const controller = require("./controller");
const _ = require("lodash");

module.exports = new (class extends controller {
  async updateUser(req, res, next) {
    this.checkParamsId(req.params.id);
    const updatedUser = await this.User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userName: req.body.userName,
          email: req.body.email,
          password: req.body.password,
          phone: req.body.phone,
          image: req.body.image,
        },
      },
      { new: true }
    );
    if (!updatedUser) {
      return this.response({
        res,
        code: 404,
        message: "User not found!",
      });
    }
    this.response({
      res,
      message: "User updated successfully",
      data: _.pick(updatedUser, ["_id", "userName", "email"]),
    });
  }
})();
