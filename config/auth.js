module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "로그인 해주세요");
    res.redirect("/users/login");
  },
};
//로그인 했는지 인증